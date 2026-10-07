import type { ActionFunctionArgs } from "react-router-dom";
import { GoogleGenAI, Modality } from "@google/genai";
import sharp from "sharp";

// Helpers
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
    return { mime_type: contentType, data: buf.toString("base64") };
  } catch {
    return null;
  }
}

// Constrói máscara a partir de ROIs normalizadas 0..1
async function buildMaskFromOps(imageSize: { width: number; height: number }, ops: any[]): Promise<{ mime_type: string; data: string } | null> {
  if (!imageSize?.width || !imageSize?.height || !ops?.length) return null;
  const W = imageSize.width;
  const H = imageSize.height;
  const base = sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).png();
  const composites: sharp.OverlayOptions[] = [];
  for (const op of ops) {
    const roi = op?.roi;
    if (!roi) continue;
    const r = roi as any;
    let x0 = typeof r.x0 === "number" ? r.x0 : (typeof r.x === "number" ? r.x : 0);
    let y0 = typeof r.y0 === "number" ? r.y0 : (typeof r.y === "number" ? r.y : 0);
    let x1 = typeof r.x1 === "number" ? r.x1 : (typeof r.width === "number" ? x0 + r.width : x0);
    let y1 = typeof r.y1 === "number" ? r.y1 : (typeof r.height === "number" ? y0 + r.height : y0);
    x0 = Math.min(Math.max(x0, 0), 1);
    y0 = Math.min(Math.max(y0, 0), 1);
    x1 = Math.min(Math.max(x1, 0), 1);
    y1 = Math.min(Math.max(y1, 0), 1);
    if (x1 <= x0 || y1 <= y0) continue;
    const left = Math.max(0, Math.floor(x0 * W));
    const top = Math.max(0, Math.floor(y0 * H));
    const width = Math.max(1, Math.floor((x1 - x0) * W));
    const height = Math.max(1, Math.floor((y1 - y0) * H));
    const rectBuf = await sharp({ create: { width, height, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 255 } } }).png().toBuffer();
    composites.push({ input: rectBuf, left, top });
  }
  if (!composites.length) return null;
  const maskBuf = await base.composite(composites).png().toBuffer();
  return { mime_type: "image/png", data: maskBuf.toString("base64") };
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
    const meta = body?.meta as any | undefined;
    const outputFormatBody = body?.outputFormat as "webp" | "jpeg" | "png" | undefined;
    const ops = Array.isArray(body?.ops) ? body.ops : [];

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

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.REACT_APP_GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-image";

    const srcBuf = Buffer.from(inline.data, "base64");
    const baseProbe = sharp(srcBuf);
    const info = await baseProbe.metadata();
    const orientation = info.orientation;
    const rotated90 = typeof orientation === "number" && [5, 6, 7, 8].includes(orientation);
    const srcW = rotated90 ? info.height || null : info.width || null;
    const srcH = rotated90 ? info.width || null : info.height || null;

    const fmt: "png" | "jpeg" | "webp" =
      outputFormatBody === "png" || outputFormatBody === "jpeg" || outputFormatBody === "webp"
        ? outputFormatBody
        : (inline.mime_type?.includes("png")
            ? "png"
            : inline.mime_type?.includes("webp")
              ? "webp"
              : "jpeg");

    let processedImage: string | null = null;
    let engine: "gemini" | "texture-overlay" | "basic-pass" | "mock-or-fallback" = "basic-pass";

    const textureUrl: string | undefined = meta?.textureUrl;
    const texInline = textureUrl ? await toInlineData(textureUrl) : null;

    // Tenta IA (Gemini) quando há API key e textura
    if (apiKey && texInline?.data && srcW && srcH) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const W = srcW as number;
        const H = srcH as number;

        // Máscara: usa ROIs das ops; fallback para ROI única ou ponto
        let maskInline = await buildMaskFromOps({ width: W, height: H }, ops);
        if (!maskInline) {
          let roi = (body?.roi as any) || null;
          if (!roi && body?.selectionCoordinates && typeof body.selectionCoordinates.x === "number" && typeof body.selectionCoordinates.y === "number") {
            const r = 0.08;
            const x0 = Math.max(0, body.selectionCoordinates.x - r);
            const y0 = Math.max(0, body.selectionCoordinates.y - r);
            const x1 = Math.min(1, body.selectionCoordinates.x + r);
            const y1 = Math.min(1, body.selectionCoordinates.y + r);
            roi = { x0, y0, x1, y1 };
          }
          if (roi) {
            const left = Math.max(0, Math.floor(roi.x0 * W));
            const top = Math.max(0, Math.floor(roi.y0 * H));
            const rectW = Math.max(1, Math.floor((roi.x1 - roi.x0) * W));
            const rectH = Math.max(1, Math.floor((roi.y1 - roi.y0) * H));
            const base = sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).png();
            const rectBuf = await sharp({ create: { width: rectW, height: rectH, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 255 } } }).png().toBuffer();
            const maskBuf = await base.composite([{ input: rectBuf, left, top }]).png().toBuffer();
            maskInline = { mime_type: "image/png", data: maskBuf.toString("base64") } as any;
          }
        }

        // Instruções para TEXTURE
        const opsText = (Array.isArray(ops) ? ops : []).slice(0, 2).map((op: any, idx: number) => {
          const surf = (op?.surface || "Superfície").toLowerCase();
          const pt = op?.point && typeof op.point.x === "number" && typeof op.point.y === "number"
            ? `Seleção por ponto (normalizado 0..1): x=${Math.min(Math.max(op.point.x, 0), 1).toFixed(3)}, y=${Math.min(Math.max(op.point.y, 0), 1).toFixed(3)}`
            : "";
          const roi = op?.roi;
          const rt = roi ? `ROI normalizada: x0=${Math.min(Math.max(roi.x0, 0), 1).toFixed(3)}, y0=${Math.min(Math.max(roi.y0, 0), 1).toFixed(3)}, x1=${Math.min(Math.max(roi.x1, 0), 1).toFixed(3)}, y1=${Math.min(Math.max(roi.y1, 0), 1).toFixed(3)}` : "";
          const loc = pt || rt || "Sem ROI/seleção explícita";
          return `Operação ${idx + 1}: Superfície alvo: ${surf}. ${loc}. Aplicar textura apenas na superfície indicada; preservar escala e perspectiva.`;
        }).join("\n");

        const systemInstruction = `You are an expert interior design AI. Your task is to apply the provided texture/material (second inline image) onto the target surface(s) in the room image. The input room image resolution is exactly ${W}x${H} pixels.

Return the final image at exactly ${W}x${H} pixels with the same framing (no crop, no zoom, no padding).

Important: A third inline image may be provided as an RGBA mask. White/opaque pixels mark the exact region that MAY be edited. Transparent pixels mark regions that MUST remain IDENTICAL to the input image. Outside the mask, do not change any pixel values (no color shift, no lighting change, no added/removed objects).

Strict constraints:
- Do not alter camera perspective, viewpoint, field of view (FOV), lens parameters, or vanishing points; keep all global geometry unchanged.
- Do not add, remove, or hallucinate furniture, windows, doors, decor, or any scene elements.
- Maintain original lighting, shadows, and base material details.
- Apply the texture ONLY to the indicated surface(s), mapping via a local perspective transform to that target surface.
- If you are uncertain or cannot comply with these constraints, return the original image unchanged.`;
        const instruction = [
          body?.prompt ?? `Aplique a textura/material da segunda imagem inline apenas na superfície indicada, respeitando bordas, perspectiva e oclusões.`,
          opsText,
          `Não altere perspectiva da câmera, enquadramento, FOV ou pontos de fuga; mantenha exatamente ${W}x${H} pixels, sem cortes, sem zoom, sem bordas.`,
          `Objetivo: preservar iluminação, sombras naturais, detalhes e composição original. Retorne somente a imagem final (sem texto).`,
        ].filter(Boolean).join("\n");

        const result = await ai.models.generateContent({
          model,
          contents: [
            {
              role: "user",
              parts: [
                { inlineData: { data: inline.data, mimeType: inline.mime_type } },
                { inlineData: { data: texInline.data, mimeType: texInline.mime_type } },
                ...(maskInline?.data ? [{ inlineData: { data: maskInline.data, mimeType: maskInline.mime_type } }] : []),
                { text: systemInstruction },
                { text: instruction },
              ],
            },
          ],
          config: { responseModalities: [Modality.IMAGE] },
        });

        const candParts = (result as any)?.candidates?.[0]?.content?.parts || [];
        const inlineParts = candParts.filter((p: any) => p?.inlineData && p.inlineData.data);
        let imagePart: any = null;
        if (inlineParts.length) {
          for (let i = inlineParts.length - 1; i >= 0; i--) {
            const p = inlineParts[i];
            const dataB64 = p?.inlineData?.data;
            if (!dataB64) continue;
            if (texInline?.data && dataB64 === texInline.data) continue; // não retornar a textura
            let isAspectOk = true;
            try {
              const metaGen = await sharp(Buffer.from(dataB64, "base64")).metadata();
              const gw = metaGen.width ?? null;
              const gh = metaGen.height ?? null;
              const gor = metaGen.orientation;
              const grot90 = typeof gor === "number" && [5, 6, 7, 8].includes(gor);
              const GW = grot90 ? gh : gw;
              const GH = grot90 ? gw : gh;
              if (GW && GH && W && H) {
                const ar1 = (GW as number) / (GH as number);
                const ar0 = W / H;
                const diff = Math.abs(ar1 - ar0) / ar0;
                isAspectOk = diff <= 0.02;
              }
            } catch {}
            if (isAspectOk) { imagePart = p; break; }
          }
          if (!imagePart) {
            const lastNonTexture = [...inlineParts].reverse().find((p: any) => !(texInline?.data && p?.inlineData?.data === texInline.data));
            imagePart = lastNonTexture || inlineParts[inlineParts.length - 1];
          }
        }

        if (imagePart?.inlineData?.data) {
          try {
            const genBuf = Buffer.from(imagePart.inlineData.data, "base64");
            const converted = await sharp(genBuf)
              .toFormat(fmt === "png" ? "png" : fmt === "webp" ? "webp" : "jpeg", fmt === "jpeg" ? { quality: 92 } : undefined as any)
              .toBuffer();
            processedImage = `data:image/${fmt};base64,${converted.toString("base64")}`;
            engine = "gemini";
          } catch {
            const outMime = imagePart.inlineData?.mimeType || inline.mime_type;
            processedImage = `data:${outMime};base64,${imagePart.inlineData.data}`;
            engine = "gemini";
          }
        }
      } catch (e) {
        console.error("upgrade-texture (gemini): falha IA", e);
      }
    }

    // Fallback local: overlay simples nas ROIs
    if (!processedImage) {
      try {
        let pipeline = sharp(srcBuf);
        const overlays: sharp.OverlayOptions[] = [];
        if (texInline?.data && srcW && srcH && ops.length) {
          const textureBuf = Buffer.from(texInline.data, "base64");
          for (const op of ops) {
            const roi = op?.roi;
            if (!roi) continue;
            const r = roi as any;
            let x0 = typeof r.x0 === "number" ? r.x0 : (typeof r.x === "number" ? r.x : 0);
            let y0 = typeof r.y0 === "number" ? r.y0 : (typeof r.y === "number" ? r.y : 0);
            let x1 = typeof r.x1 === "number" ? r.x1 : (typeof r.width === "number" ? x0 + r.width : x0);
            let y1 = typeof r.y1 === "number" ? r.y1 : (typeof r.height === "number" ? y0 + r.height : y0);
            x0 = Math.min(Math.max(x0, 0), 1);
            y0 = Math.min(Math.max(y0, 0), 1);
            x1 = Math.min(Math.max(x1, 0), 1);
            y1 = Math.min(Math.max(y1, 0), 1);
            if (x1 <= x0 || y1 <= y0) continue;
            const left = Math.max(0, Math.round(x0 * (srcW as number)));
            const top = Math.max(0, Math.round(y0 * (srcH as number)));
            const width = Math.max(1, Math.round((x1 - x0) * (srcW as number)));
            const height = Math.max(1, Math.round((y1 - y0) * (srcH as number)));
            const resizedOverlayBuf = await sharp(textureBuf).resize({ width, height, fit: "cover" }).toBuffer();
            const blendMode = meta?.preserveLighting ? "multiply" : "overlay";
            const opacity = typeof meta?.opacity === "number" ? meta.opacity : 0.85;
            overlays.push({ input: resizedOverlayBuf, left, top, blend: blendMode, opacity });
          }
        }
        if (overlays.length) {
          pipeline = pipeline.composite(overlays);
          engine = "texture-overlay";
        } else {
          engine = "basic-pass";
        }
        let outBuf: Buffer;
        if (fmt === "png") {
          outBuf = await pipeline.withMetadata().png().toBuffer();
        } else if (fmt === "webp") {
          outBuf = await pipeline.withMetadata().webp().toBuffer();
        } else {
          outBuf = await pipeline.withMetadata().jpeg({ quality: 92 }).toBuffer();
        }
        processedImage = `data:image/${fmt};base64,${outBuf.toString("base64")}`;
      } catch (e) {
        console.error("upgrade-texture: fallback overlay falhou", e);
        engine = "mock-or-fallback";
        processedImage = image; // retorna original para não quebrar fluxo
      }
    }

    const responsePayload = {
      status: "ok" as const,
      engine,
      processedImage,
      echo: {
        roi: body.roi ?? null,
        selectionCoordinates: body.selectionCoordinates ?? null,
        prompt: body.prompt ?? null,
        meta: { requested: meta ?? null, src: { width: srcW, height: srcH } },
        ops: ops || [],
      },
    };

    return new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("upgrade-texture: erro inesperado", e);
    return new Response(JSON.stringify({ error: "Falha inesperada" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
