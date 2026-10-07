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

/**
 * Aplica uma textura (imagem) sobre regiões (ROI) na imagem base, preservando dimensões e formato original.
 * - Não rotaciona nem redimensiona a imagem base
 * - Usa "overlay" como modo de blend para preservar detalhes
 */
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
    const meta = body?.meta as { textureUrl?: string } | undefined;
    const ops = Array.isArray(body?.ops) ? body.ops as Array<{ roi?: { x0: number; y0: number; x1: number; y1: number } }> : [];
    const outputFormatBody = body?.outputFormat as "webp" | "jpeg" | "png" | undefined;

    if (!image || typeof image !== "string") {
      return new Response(JSON.stringify({ error: "Imagem base obrigatória" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const textureUrl = meta?.textureUrl as string | undefined;
    if (!textureUrl || typeof textureUrl !== "string") {
      return new Response(JSON.stringify({ error: "TextureUrl obrigatória em meta" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const inlineBase = await toInlineData(image);
    const inlineTex = await toInlineData(textureUrl);
    if (!inlineBase?.data || !inlineTex?.data) {
      return new Response(JSON.stringify({ error: "Imagens inválidas" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const baseBuf = Buffer.from(inlineBase.data, "base64");
    const texBuf = Buffer.from(inlineTex.data, "base64");

    const base = sharp(baseBuf);
    const info = await base.metadata();
    const srcW = info.width || 0;
    const srcH = info.height || 0;

    // Constrói overlays compositados dentro de cada ROI
    const composites: sharp.OverlayOptions[] = [];

    // Prepara textura como imagem sharp
    const textureImage = sharp(texBuf);
    const texInfo = await textureImage.metadata();
    const texW = texInfo.width || 1;
    const texH = texInfo.height || 1;

    for (const op of ops) {
      const roi = op?.roi;
      if (!roi) continue;
      // ROI está em coordenadas normalizadas [0..1]
      const x0 = Math.max(0, Math.min(1, roi.x0));
      const y0 = Math.max(0, Math.min(1, roi.y0));
      const x1 = Math.max(0, Math.min(1, roi.x1));
      const y1 = Math.max(0, Math.min(1, roi.y1));
      const left = Math.round(x0 * srcW);
      const top = Math.round(y0 * srcH);
      const width = Math.max(1, Math.round((x1 - x0) * srcW));
      const height = Math.max(1, Math.round((y1 - y0) * srcH));

      // Redimensiona a textura para caber no ROI; opção simples (sem tiling)
      const resizedTex = await textureImage
        .resize({ width, height, fit: "cover" })
        .toBuffer();

      composites.push({
        input: resizedTex,
        left,
        top,
        blend: "overlay",
        opacity: 1,
      });
    }

    let out = base;
    if (composites.length > 0) {
      out = out.composite(composites);
    }

    const fmt: "png" | "jpeg" | "webp" =
      outputFormatBody === "png" || outputFormatBody === "jpeg" || outputFormatBody === "webp"
        ? outputFormatBody
        : (inlineBase.mime_type?.includes("png")
            ? "png"
            : inlineBase.mime_type?.includes("webp")
              ? "webp"
              : "jpeg");

    let outBuf: Buffer;
    if (fmt === "png") {
      outBuf = await out.withMetadata().png().toBuffer();
    } else if (fmt === "webp") {
      outBuf = await out.withMetadata().webp().toBuffer();
    } else {
      outBuf = await out.withMetadata().jpeg({ quality: 92 }).toBuffer();
    }

    const processedImage = `data:image/${fmt};base64,${outBuf.toString("base64")}`;

    const responsePayload = {
      status: "ok" as const,
      engine: "texture-overlay" as const,
      processedImage,
      echo: {
        opsCount: composites.length,
        meta: { src: { width: srcW, height: srcH }, texture: { width: texW, height: texH } },
      },
    };

    return new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("apply-texture error:", err);
    return new Response(JSON.stringify({ error: "Falha interna" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}