import type { ActionFunctionArgs } from "react-router-dom";
import sharp from "sharp";

function parseDataUrl(dataUrl: string): { mime: string; base64: string } | null {
  try {
    const match = dataUrl.match(/^data:(.*?);base64,(.*)$/);
    if (!match) return null;
    return { mime: match[1], base64: match[2] };
  } catch {
    return null;
  }
}

async function toInlineData(image: string): Promise<{ mime_type: string; data: string } | null> {
  if (image.startsWith("data:")) {
    const parsed = parseDataUrl(image);
    if (!parsed) return null;
    return { mime_type: parsed.mime, data: parsed.base64 };
  }
  try {
    const resp = await fetch(image);
    if (!resp.ok) return null;
    const contentType = resp.headers.get("content-type") || "image/jpeg";
    const ab = await resp.arrayBuffer();
    const buf = Buffer.from(ab);
    const base64 = buf.toString("base64");
    return { mime_type: contentType, data: base64 };
  } catch {
    return null;
  }
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não suportado" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    const image = body?.image as string;

    if (!image || typeof image !== "string") {
      return new Response(JSON.stringify({ error: "Imagem obrigatória" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const inline = await toInlineData(image);
    if (!inline?.data) {
      return new Response(JSON.stringify({ error: "Imagem inválida" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const srcBuf = Buffer.from(inline.data, "base64");
    // Básico: normaliza orientação e converte para PNG mantendo composição e dimensões
    const pngBuf = await sharp(srcBuf).rotate().png().toBuffer();
    const processedImage = `data:image/png;base64,${pngBuf.toString("base64")}`;

    const responsePayload = {
      status: "ok",
      engine: "basic-pass",
      processedImage,
      echo: {
        color: body.color ?? null,
        blendMode: body.blendMode ?? null,
        tintOpacity: body.tintOpacity ?? null,
        roi: body.roi ?? null,
        selectionCoordinates: body.selectionCoordinates ?? null,
        prompt: body.prompt ?? null,
        meta: body.meta ?? null,
      },
    };

    return new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("upgrade-color error:", err);
    return new Response(JSON.stringify({ error: "Falha interna" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}