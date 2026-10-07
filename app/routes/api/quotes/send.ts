import type { ActionFunctionArgs } from "react-router-dom";
import sharp from "sharp";
import { EmailService } from "../../../services/emailService";
import { QuoteService } from "../../../services/quoteService";

function parseDataUrl(dataUrl: string): { mime: string; base64: string } | null {
  try {
    const match = dataUrl.match(/^data:(.*?);base64,(.*)$/);
    if (!match) return null;
    return { mime: match[1], base64: match[2] };
  } catch {
    return null;
  }
}

async function getImageBuffer(image: string): Promise<{ buf: Buffer; mime: string } | null> {
  // Data URL
  if (image.startsWith("data:")) {
    const parsed = parseDataUrl(image);
    if (!parsed) return null;
    return { buf: Buffer.from(parsed.base64, "base64"), mime: parsed.mime };
  }

  // Remote URL -> fetch and base64
  try {
    const resp = await fetch(image);
    if (!resp.ok) return null;
    const contentType = resp.headers.get("content-type") || "image/jpeg";
    const ab = await resp.arrayBuffer();
    const buf = Buffer.from(ab);
    return { buf, mime: contentType };
  } catch {
    return null;
  }
}

async function ensurePngBuffer(buf: Buffer, mime: string): Promise<Buffer> {
  try {
    if ((mime || "").toLowerCase().includes("png")) return buf;
    return await sharp(buf).png().toBuffer();
  } catch {
    return buf;
  }
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json().catch(() => null as any);

    const image = body?.image;
    if (!image || typeof image !== "string") {
      return new Response(JSON.stringify({ error: "Imagem ausente ou inválida" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const ib = await getImageBuffer(image);
    if (!ib) {
      return new Response(JSON.stringify({ error: "Falha ao obter imagem" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const pngBuf = await ensurePngBuffer(ib.buf, ib.mime);
    const pngDataUrl = `data:image/png;base64,${pngBuf.toString("base64")}`;

    const projectName = typeof body?.project?.name === "string" ? body.project.name : "Projeto Sem Nome";
    const wallAColor = body?.walls?.wallAColor || body?.walls?.WALL_A || body?.wallAColor || null;
    const wallBColor = body?.walls?.wallBColor || body?.walls?.WALL_B || body?.wallBColor || null;
    const wallAName = body?.walls?.wallAName || null;
    const wallBName = body?.walls?.wallBName || null;
    const customer = body?.customer || null;

    // Tenta criar orçamento quando houver dados mínimos do cliente
    let quoteId: string | null = null;
    let quoteCreated = false;
    try {
      if (customer?.name && (customer?.email || customer?.phone)) {
        const subtotal = Number(body?.subtotal || 0);
        const discount = Number(body?.discount || 0);
        const total = typeof body?.total === "number" ? body.total : Math.max(0, subtotal - discount);
        const userId = body?.userId || "anonymous";
        const quote = await QuoteService.createQuote({
          user_id: userId,
          status: "sent",
          notes: body?.notes || `Orçamento do Studio para ${projectName}${(body?.walls?.wallAName || body?.walls?.wallBName) ? ` - Tintas: Parede 1: ${body?.walls?.wallAName || wallAColor || '—'}, Parede 2: ${body?.walls?.wallBName || wallBColor || '—'}` : ''}`,
          customer_name: customer.name,
          customer_email: customer.email || "",
          customer_phone: customer.phone || null,
          customer_company: customer.company || null,
          subtotal,
          discount,
          total,
          items: [],
        } as any);
        quoteId = quote.id;
        quoteCreated = true;

        if (Array.isArray(body?.items)) {
          for (const it of body.items) {
            try {
              await QuoteService.addQuoteItem({
                quote_id: quoteId!,
                variant_id: String(it?.variantId || it?.productId || it?.id || "unknown"),
                quantity: Number(it?.quantity || 1),
                price_at_time: Number(it?.price || 0),
              });
            } catch (e) {
              console.warn("Falha ao adicionar item de orçamento", e);
            }
          }
        }
      }
    } catch (e) {
      console.warn("Falha ao criar orçamento no banco", e);
    }

    const adminEmail = process.env.BUDGET_RECIPIENT_EMAIL || process.env.ADMIN_EMAIL || "admin@example.com";
    const subject = `Nova Solicitação de Orçamento - Studio ProRevest`;
    const content = `
      <h2>Solicitação de Orçamento - Studio ProRevest</h2>
      <p><strong>Projeto:</strong> ${projectName}</p>
      ${quoteId ? `<p><strong>Orçamento ID:</strong> ${quoteId}</p>` : ""}
      <p><strong>Parede 1:</strong> ${wallAName ? `${wallAName} (${wallAColor || '—'})` : (wallAColor || '—')}</p>
      <p><strong>Parede 2:</strong> ${wallBName ? `${wallBName} (${wallBColor || '—'})` : (wallBColor || '—')}</p>
      ${customer ? `<p><strong>Cliente:</strong> ${customer?.name || ""} - ${customer?.email || customer?.phone || ""}</p>` : `<p><em>Cliente não informado</em></p>`}
      <p>Visual da composição:</p>
      <img src="${pngDataUrl}" alt="Preview do Studio" style="max-width: 600px; border: 1px solid #eee; border-radius: 8px;" />
    `;

    const sendRes = await EmailService.sendEmail(adminEmail, subject, content, "Atendimento");

    const response = {
      status: "ok",
      sent: sendRes.success,
      messageId: sendRes.messageId || null,
      quoteId,
      quoteCreated,
    };

    return new Response(JSON.stringify(response), {
      status: sendRes.success ? 200 : 500,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("api/quotes/send error:", err);
    return new Response(JSON.stringify({ error: "Falha interna" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}