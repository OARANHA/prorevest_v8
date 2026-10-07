import type { ActionFunctionArgs } from "react-router-dom";
import { GoogleGenAI, Modality } from "@google/genai";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import dotenv from "dotenv";

// Carregar variáveis de ambiente a partir de possíveis arquivos .env (sem expor valores)
try {
  // Primeiro, tenta o padrão
  dotenv.config();
  // Em seguida, tenta arquivos comuns no ambiente de produção
  const envCandidates = [
    path.join(process.cwd(), ".env.local"),
    path.join(process.cwd(), ".env.production"),
    path.join(process.cwd(), ".env.prod"),
  ];
  for (const p of envCandidates) {
    try {
      dotenv.config({ path: p, override: false });
    } catch {}
  }
} catch {}

type ROI = { x0: number; y0: number; x1: number; y1: number } | null;

type SelectionCoordinates = { x: number; y: number; units?: string } | null;

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
  // Data URL
  if (image.startsWith("data:")) {
    const parsed = parseDataUrl(image);
    if (!parsed) return null;
    return { mime_type: parsed.mime, data: parsed.base64 };
  }

  // Remote URL -> fetch and base64
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

function roiToText(roi: ROI): string {
  if (!roi) return "(sem ROI específica)";
  const x0 = Math.min(Math.max(roi.x0, 0), 1);
  const y0 = Math.min(Math.max(roi.y0, 0), 1);
  const x1 = Math.min(Math.max(roi.x1, 0), 1);
  const y1 = Math.min(Math.max(roi.y1, 0), 1);
  return `ROI normalizada: x0=${x0.toFixed(3)}, y0=${y0.toFixed(3)}, x1=${x1.toFixed(3)}, y1=${y1.toFixed(3)}`;
}

function selectionToText(sel: SelectionCoordinates): string {
  if (!sel || typeof sel.x !== "number" || typeof sel.y !== "number") return "";
  const x = Math.min(Math.max(sel.x, 0), 1);
  const y = Math.min(Math.max(sel.y, 0), 1);
  return `Seleção por ponto (normalizado 0..1): x=${x.toFixed(3)}, y=${y.toFixed(3)}`;
}

// Suporte a múltiplas operações
type EditOp = {
  point?: { x: number; y: number; units?: string } | null;
  roi?: { x0: number; y0: number; x1: number; y1: number } | null;
  color?: string;
  blendMode?: string;
  tintOpacity?: number;
  surface?: string; // identificar superfície (ex.: Parede, Bancada)
  finishType?: FinishType; // NOVO: tipo de acabamento
  microcementStyle?: MicrocementStyle; // NOVO: estilo de microcimento
};

// NOVO: Tipos de aberturas detectadas
type SceneSurface = {
  type: "wall" | "door" | "window" | "floor" | "ceiling";
  name: string;
  box: { x0: number; y0: number; x1: number; y1: number };
};

// NOVO: Tipos de acabamento
type FinishType = "paint" | "microcement" | "epoxy" | "pebble";
type MicrocementStyle = "polido" | "rústico" | "acetinado";

// NOVO: Detecta aberturas (portas/janelas) na cena usando JSON mode com schema estruturado
async function analyzeSceneForOpenings(
  inline: { data: string; mime_type: string },
  ai: GoogleGenAI,
  model: string
): Promise<SceneSurface[]> {
  try {
    // Usa estrutura XML no prompt para melhor parsing
    const result = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { data: inline.data, mimeType: inline.mime_type } },
          {
            text: `<task>
Detect all walls, doors, windows, floor and ceiling surfaces in this interior photo.
Return a JSON array with the detected surfaces.
</task>

<schema>
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "type": { "enum": ["wall", "door", "window", "floor", "ceiling"] },
      "name": { "type": "string" },
      "box": {
        "type": "object",
        "properties": {
          "x0": { "type": "number", "minimum": 0, "maximum": 1 },
          "y0": { "type": "number", "minimum": 0, "maximum": 1 },
          "x1": { "type": "number", "minimum": 0, "maximum": 1 },
          "y1": { "type": "number", "minimum": 0, "maximum": 1 }
        },
        "required": ["x0", "y0", "x1", "y1"]
      }
    },
    "required": ["type", "name", "box"]
  }
}
</schema>

<coordinate_system>
- x=0 is left edge, x=1 is right edge
- y=0 is top edge, y=1 is bottom edge
- All coordinates are normalized to 0-1 range
</coordinate_system>

Return ONLY valid JSON array, no comments, no markdown, no extra text.`,
          },
        ],
      },
      config: { responseMimeType: "application/json" },
    });
    const raw = result.text ?? "[]";
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("upgrade-realista: analyzeSceneForOpenings falhou", e);
    return []; // Não bloqueia o fluxo principal
  }
}

// NOVO: Verifica se uma operação colide com uma abertura
function opCollidesWithOpening(op: EditOp, openings: SceneSurface[]): boolean {
  const pt = op.point;
  const roi = op.roi;
  for (const opening of openings) {
    const b = opening.box;
    if (pt && typeof pt.x === "number") {
      if (pt.x >= b.x0 && pt.x <= b.x1 && pt.y >= b.y0 && pt.y <= b.y1) return true;
    }
    if (roi) {
      // Verifica interseção de retângulos
      if (roi.x0 < b.x1 && roi.x1 > b.x0 && roi.y0 < b.y1 && roi.y1 > b.y0) return true;
    }
  }
  return false;
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

    if (!body?.image || typeof body.image !== "string") {
      return new Response(JSON.stringify({ error: "Imagem ausente ou inválida" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const envPresence = {
      GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
      VITE_GEMINI_API_KEY: !!process.env.VITE_GEMINI_API_KEY,
      REACT_APP_GEMINI_API_KEY: !!process.env.REACT_APP_GEMINI_API_KEY,
      GEMINI_MODEL: !!process.env.GEMINI_MODEL,
      VITE_GEMINI_MODEL: !!process.env.VITE_GEMINI_MODEL,
      REACT_APP_GEMINI_MODEL: !!process.env.REACT_APP_GEMINI_MODEL,
    };
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.REACT_APP_GEMINI_API_KEY;
    const modelEnv = process.env.GEMINI_MODEL || process.env.VITE_GEMINI_MODEL || process.env.REACT_APP_GEMINI_MODEL;
    const model = modelEnv && modelEnv.trim().length > 0 ? modelEnv : "gemini-2.5-flash-image";
    console.log("upgrade-realista: init", { model, apiKeyPresent: !!apiKey });
    console.log("upgrade-realista: env presence", envPresence);

    // Controle de formato de saída (melhores práticas: default WEBP)
    const requestedFormat = (body?.outputFormat || "webp").toString().toLowerCase();
    const destMime =
      requestedFormat === "png"
        ? "image/png"
        : requestedFormat === "jpeg" || requestedFormat === "jpg"
        ? "image/jpeg"
        : "image/webp"; // default

    // Suporte a mock forçado via header/body e fallback sem API key
    const useMock = request.headers.get("x-use-mock") === "1" || body?.forceMock === true;
    if (!apiKey || useMock) {
      const payload = {
        status: "ok",
        engine: "mock",
        strategy: useMock ? "mock" : "no_api_key_mock",
        processedImage: body.image,
        echo: {
          roi: body.roi ?? null,
          selectionCoordinates: body.selectionCoordinates ?? null,
          prompt: body.prompt ?? null,
          color: body.color ?? null,
          blendMode: body.blendMode ?? null,
          tintOpacity: body.tintOpacity ?? null,
          meta: body.meta ?? null,
          ops: Array.isArray(body?.ops) ? body.ops : null,
        },
      };
      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const inline = await toInlineData(body.image);
    if (!inline) {
      return new Response(JSON.stringify({ error: "Falha ao processar imagem de entrada" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Limite simples do tamanho base64 para evitar payloads excessivos (≈9MB)
    if (inline.data && inline.data.length > 12_000_000) {
      return new Response(
        JSON.stringify({ error: "Imagem muito grande. Reduza a resolução/tamanho antes de enviar." }),
        { status: 413, headers: { "Content-Type": "application/json" } }
      );
    }

    // NEW: Compute image resolution using Sharp for system prompt
    let imageSize: { width: number | null; height: number | null } = { width: null, height: null };
    try {
      const buf = Buffer.from(inline.data, "base64");
      const meta = await sharp(buf).metadata();
      imageSize.width = meta.width ?? null;
      imageSize.height = meta.height ?? null;
    } catch {}

    // NOVO: Detectar aberturas (portas/janelas) antes de processar
    const ai = new GoogleGenAI({ apiKey });
    let surfaces: SceneSurface[] = [];
    let openings: SceneSurface[] = [];
    try {
      surfaces = await analyzeSceneForOpenings(inline, ai, model);
      openings = surfaces.filter(s => s.type === "door" || s.type === "window");
      console.log("upgrade-realista: detectadas", openings.length, "aberturas");
    } catch (e) {
      console.warn("upgrade-realista: falha ao detectar aberturas", e);
    }

    // NOVO: Extrair finishType e microcementStyle do body
    const finishType: FinishType = (body.finishType as FinishType) || "paint";
    const microcementStyle: MicrocementStyle = (body.microcementStyle as MicrocementStyle) || "polido";
    const bodyColor = typeof body.color === "string" ? body.color : "#FFFFFF";

    // NOVO: Construir string de no-paint zones
    const noPaintZones = openings.length > 0
      ? `No-paint zones (do NOT apply any material here): ${openings.map(o =>
          `${o.name} [x0=${o.box.x0.toFixed(2)}, y0=${o.box.y0.toFixed(2)}, x1=${o.box.x1.toFixed(2)}, y1=${o.box.y1.toFixed(2)}]`
        ).join("; ")}.`
      : "";

    // Instrução para o modelo
    const rawOps: EditOp[] | null = Array.isArray(body?.ops) && body.ops.length > 0 ? (body.ops as EditOp[]) : null;
    // Focar somente paredes e limitar a 2 pontos
    const ops: EditOp[] | null = rawOps
      ? (() => {
          const wallOps = rawOps.filter(op => op?.surface && /parede/i.test(op.surface));
          const selected = (wallOps.length > 0 ? wallOps : rawOps).slice(0, 2);
          return selected.map(op => ({ ...op, surface: 'Parede' }));
        })()
      : null;

    // NOVO: Filtrar ops que colidem com aberturas
    const filteredOps = ops ? ops.filter(op => !opCollidesWithOpening(op, openings)) : null;
    if (filteredOps && ops && filteredOps.length < ops.length) {
      console.log("upgrade-realista: filtradas", ops.length - filteredOps.length, "ops que colidiam com aberturas");
    }

    const userPrompt = typeof body.prompt === "string" && body.prompt.trim().length > 0 ? body.prompt.trim() : null;

    // NOVO: Prompts especializados por finishType
    const finishInstructionsPT: Record<FinishType, string> = {
      paint: `Aplique uma pintura realista usando a cor ${bodyColor} na área/ponto indicado.`,
      microcement: `Aplique um revestimento de MICROCIMENTO realista na cor ${bodyColor}. Estilo: ${microcementStyle}. Mostre marcas de desempenadeira, variação tonal sutil, granulometria cimentícia e leve brilho acetinado. Evite superfície plana ou uniforme. Preserve iluminação e perspectiva.`,
      epoxy: `Aplique revestimento EPÓXI brilhante na cor ${bodyColor}. Simule reflexo especular e profundidade.`,
      pebble: `Aplique piso de SEIXO/PEDRISCO na cor ${bodyColor}. Simule textura tridimensional de pedriscos agregados.`,
    };

    // System instructions estruturadas seguindo padrão Gemini (role, instructions, constraints, output_format)
    // Usa XML tags para melhor parsing pelo modelo
    const systemInstructionsEN: Record<FinishType, string> = {
      paint: `<role>
You are an expert interior design AI specialized in realistic wall painting visualization.
You are precise, analytical, and produce photorealistic results.
</role>

<instructions>
1. Identify the target wall surface from the provided coordinates.
2. Apply the specified paint color (${bodyColor}) with realistic texture and coverage.
3. Preserve all lighting, shadows, and material details.
4. Maintain natural boundaries with adjacent surfaces.
</instructions>

<constraints>
- Do NOT paint: floors, ceilings, doors, windows, furniture, trims, or other non-wall surfaces.
- Do NOT add text, watermarks, or artificial elements.
- Maintain original perspective and depth.
${noPaintZones ? `- ${noPaintZones}` : ''}
</constraints>

<output_format>
Return ONLY the final image with the paint applied. No text or explanations.
</output_format>`,
      microcement: `<role>
You are an expert interior finishes AI specialized in microcement (béton ciré / polished concrete) floors.
You produce highly realistic cement-based surfaces with tonal depth and material texture.
</role>

<instructions>
1. Apply a realistic microcement floor finish in color ${bodyColor}, matching the specified style: ${microcementStyle}.
2. Interpret styles as:
   - "polido" = smooth microcement (microfino): very fine, almost polished concrete, minimal visible grain, clean continuous look.
   - "acetinado" = medium-texture microcement (microdeck): soft, slightly textured surface, medium grain, comfortable indoor grip.
   - "rústico" = highly textured microcement (microstone): coarse grain, strong texture, higher slip resistance for heavy-traffic or outdoor areas.
3. For all styles, simulate:
   - Subtle trowel application marks and directionality.
   - Natural tonal variation: lighter and darker patches typical of cement-based materials.
   - Depth and micro-shadows in the texture so it does NOT look like flat wall paint.
4. Preserve the room's original lighting, reflections, shadows, and perspective.
</instructions>

<constraints>
- Do NOT produce a flat, uniform color surface (that looks like a simple paint layer).
- Apply the microcement ONLY to the floor surface, not to walls, furniture, doors, windows or objects.
${noPaintZones ? `- ${noPaintZones}` : ''}
</constraints>

<output_format>
Return ONLY the final processed image. No text, captions, watermarks or overlays.
</output_format>`,
      epoxy: `<role>
You are an expert floor coating AI specialized in glossy epoxy finishes.
You produce realistic reflective surfaces with depth.
</role>

<instructions>
1. Apply a glossy epoxy finish in color ${bodyColor}.
2. Simulate specular reflection and depth.
3. Maintain floor boundaries and transitions.
</instructions>

<constraints>
- Surface must appear seamless and reflective.
${noPaintZones ? `- ${noPaintZones}` : ''}
</constraints>

<output_format>
Return ONLY the final image. No text.
</output_format>`,
      pebble: `<role>
You are an expert aggregate flooring AI specialized in exposed pebble/stone finishes.
You produce realistic 3D textured surfaces.
</role>

<instructions>
1. Apply a realistic exposed aggregate finish using ${bodyColor} natural pebbles.
2. Show individual pebble depth and cement binder.
3. Maintain realistic texture and shadow depth.
</instructions>

<constraints>
- Individual pebbles should be visible with 3D depth.
${noPaintZones ? `- ${noPaintZones}` : ''}
</constraints>

<output_format>
Return ONLY the final image. No text.
</output_format>`,
    };

    let instruction: string;
    const finalOps = filteredOps || ops;

    if (finalOps) {
      const opsText = finalOps
        .map((op, idx) => {
          const c = typeof op.color === "string" ? op.color : "#FFFFFF";
          const b = typeof op.blendMode === "string" ? op.blendMode : "multiply";
          const o = typeof op.tintOpacity === "number" ? Math.round(op.tintOpacity * 100) : 60;
          const pt = op.point ? selectionToText(op.point) : "";
          const rt = op.roi ? roiToText(op.roi) : "";
          const loc = pt || rt || "Sem ROI/seleção explícita";
          return `<operation index="${idx + 1}">
<color>${c}</color>
<location>${loc}</location>
<blend_mode>${b}</blend_mode>
<opacity>${o}%</opacity>
</operation>`;
        })
        .join("\n");
      instruction = `<user_request>
${userPrompt ?? finishInstructionsPT[finishType]}
</user_request>

<operations>
${opsText}
</operations>

<objective>
Preserve natural lighting, shadows, textures and details.
Return only the final image without text.
</objective>`;
    } else {
      const roiText = roiToText(body.roi || null);
      const selText = selectionToText(body.selectionCoordinates || null);
      const color = typeof body.color === "string" ? body.color : "#FFFFFF";
      const blend = typeof body.blendMode === "string" ? body.blendMode : "multiply";
      const opacity = typeof body.tintOpacity === "number" ? body.tintOpacity : 0.6;

      instruction = `<user_request>
${userPrompt ?? finishInstructionsPT[finishType]}
</user_request>

${finishType === 'paint' ? `<surface_constraint>
Target surface: Wall only.
Restrict mask to continuous vertical surfaces (walls).
Do NOT paint: countertops, floors, ceilings, doors, windows, or furniture.
</surface_constraint>` : ''}

<coordinates>
${selText ? `<point>${selText}</point>` : ''}
${roiText ? `<roi>${roiText}</roi>` : ''}
</coordinates>

<composition_guide>
Blend mode: ${blend}
Opacity: ~${Math.round(opacity * 100)}%
</composition_guide>

<objective>
Preserve natural lighting, shadows, textures and details.
Return only the final image without text.
</objective>`;
    }

    // NEW: Prepare structured prompts using image resolution
    const resStr = imageSize.width && imageSize.height ? `${imageSize.width}x${imageSize.height}` : 'unknown';
    const baseSystemInstruction = systemInstructionsEN[finishType];

    // System instruction estruturada para múltiplas superfícies
    const systemInstructionTwoWalls = `${baseSystemInstruction}

<task>
Repaint two different surfaces in the provided room image (resolution ${resStr} pixels) with different colors based on user-specified coordinates.
</task>

<requirements>
- Preserve all existing furniture, windows, doors, decor, and other objects.
- Maintain the natural lighting, shadows, and textures for realism.
</requirements>`;

    // System instruction estruturada para superfície única
    const systemInstructionSingleWall = `${baseSystemInstruction}

<task>
Repaint the target surface in the provided room image (resolution ${resStr} pixels) with the specified color based on user-specified coordinates.
</task>

<requirements>
- Preserve all existing furniture, windows, doors, decor, and other objects.
- Maintain the natural lighting, shadows, and textures for realism.
</requirements>`;

    // Monta a requisição via SDK oficial (replicado do protótipo)
    let genResult: any = null;
    let processedImage: string | null = null;
    let aggregateUsage: { promptTokens: number; candidatesTokens: number; totalTokens: number; modelVersion: string | null } | null = null;
    let strategy: "combined" | "sequential_fallback" | "single" = (finalOps && finalOps.length > 1) ? "combined" : "single";

    try {
      // ai já foi instanciado acima para analyzeSceneForOpenings

      if (finalOps && finalOps.length > 1) {
        // Envia as duas paredes em um único request
        // Prepara instruções combinadas em EN para clareza e assertividade
        const opsCombined = finalOps.map((op, idx) => {
          const c = op.color ?? '#FFFFFF';
          const ptNorm = op.point && typeof op.point.x === 'number' && typeof op.point.y === 'number'
            ? `x=${Math.min(Math.max(op.point.x, 0), 1).toFixed(4)}, y=${Math.min(Math.max(op.point.y, 0), 1).toFixed(4)}`
            : 'not provided';
          // ROI fallback (~8% around point)
          let roiForOp = op.roi || null;
          if (!roiForOp && op.point && typeof op.point.x === 'number' && typeof op.point.y === 'number') {
            const r = 0.08;
            const x0 = Math.max(0, op.point.x - r);
            const y0 = Math.max(0, op.point.y - r);
            const x1 = Math.min(1, op.point.x + r);
            const y1 = Math.min(1, op.point.y + r);
            roiForOp = { x0, y0, x1, y1 };
          }
          const roiTxt = roiForOp ? `x0=${roiForOp.x0.toFixed(3)}, y0=${roiForOp.y0.toFixed(3)}, x1=${roiForOp.x1.toFixed(3)}, y1=${roiForOp.y1.toFixed(3)}` : 'none';
          const surfaceLabel = finishType === 'epoxy' || finishType === 'pebble' || finishType === 'microcement' ? 'Floor' : 'Wall';
          return `<surface id="${idx + 1}" type="${surfaceLabel.toLowerCase()}">
<target>${surfaceLabel} only</target>
<reference_point normalized="true">${ptNorm}</reference_point>
<roi>${roiTxt}</roi>
<color>${c}</color>
</surface>`;
        }).join('\n');

        const surfaceLabel = finishType === 'epoxy' || finishType === 'pebble' || finishType === 'microcement' ? 'floor surfaces' : 'walls';
        const combinedInstructionEN = `<objective>
Apply finish to exactly two different ${surfaceLabel} as specified below.
Both surfaces must be visible in the final image with their respective finishes applied.
</objective>

<rules>
1. Identify the precise surface that contains each reference coordinate.
2. Apply the respective finish to that entire surface only.
3. Do NOT paint floors, ceilings, furniture, windows, doors, trims, or other surfaces.
4. Respect boundaries, perspective edges, and occlusions.
5. Preserve original lighting, shadows, texture, reflections, and material details.
</rules>

<surfaces>
${opsCombined}
</surfaces>

<output>
Return only the final image. No text or explanations.
</output>`;

        const result = await ai.models.generateContent({
          model,
          contents: {
            parts: [
              { inlineData: { data: inline.data, mimeType: inline.mime_type } },
              { text: systemInstructionTwoWalls },
              { text: combinedInstructionEN },
            ],
          },
          config: { responseModalities: [Modality.IMAGE] },
        });

        genResult = result;
        const imagePart = (result as any)?.candidates?.[0]?.content?.parts?.find((p: any) => p?.inlineData);
        if (!imagePart) {
          try {
            const cand = (result as any)?.candidates?.[0];
            const parts = cand?.content?.parts?.map((p: any) => (p?.inlineData ? 'inlineData' : p?.text ? 'text' : Object.keys(p || {})));
            console.warn('upgrade-realista: resposta sem imagem (duas paredes em único envio)', {
              candidateCount: (result as any)?.candidates?.length ?? 0,
              finishReason: cand?.finishReason,
              partKinds: parts,
            });
          } catch {}
        }
        if (imagePart?.inlineData?.data) {
          const outMime = imagePart.inlineData?.mimeType || inline.mime_type;
          processedImage = `data:${outMime};base64,${imagePart.inlineData.data}`;
        }

        aggregateUsage = (result as any)?.usageMetadata
          ? {
              promptTokens: (result as any)?.usageMetadata?.promptTokenCount ?? 0,
              candidatesTokens: (result as any)?.usageMetadata?.candidatesTokenCount ?? 0,
              totalTokens: (result as any)?.usageMetadata?.totalTokenCount ?? 0,
              modelVersion: (result as any)?.modelVersion ?? null,
            }
          : null;
      } else {
        // Caminho original para uma única operação ou instrução
        const result = await ai.models.generateContent({
          model,
          contents: {
            parts: [
              { inlineData: { data: inline.data, mimeType: inline.mime_type } },
              { text: systemInstructionSingleWall },
              { text: instruction },
            ],
          },
          config: {
            responseModalities: [Modality.IMAGE],
          },
        });

        genResult = result;
        const imagePart = (result as any)?.candidates?.[0]?.content?.parts?.find((p: any) => p?.inlineData);
        if (!imagePart) {
          try {
            const cand = (result as any)?.candidates?.[0];
            const parts = cand?.content?.parts?.map((p: any) => (p?.inlineData ? 'inlineData' : p?.text ? 'text' : Object.keys(p || {})));
            console.warn('upgrade-realista: resposta sem imagem', {
              candidateCount: (result as any)?.candidates?.length ?? 0,
              finishReason: cand?.finishReason,
              partKinds: parts,
            });
          } catch {}
        }
        if (imagePart?.inlineData?.data) {
          const outMime = imagePart.inlineData?.mimeType || inline.mime_type;
          processedImage = `data:${outMime};base64,${imagePart.inlineData.data}`;
        }
      }
    } catch (e) {
      console.error("upgrade-realista: geração falhou", e);
    }

    // Fallback sequencial: se finalOps>1 e a chamada combinada não retornou imagem
    if (!processedImage && finalOps && finalOps.length > 1) {
      try {
        // ai já foi instanciado acima

        const buildInstructionForOp = (op: EditOp) => {
          const color = typeof op.color === "string" ? op.color : "#FFFFFF";
          const blend = typeof op.blendMode === "string" ? op.blendMode : "multiply";
          const opacity = typeof op.tintOpacity === "number" ? op.tintOpacity : 0.6;
          const selText = op.point ? selectionToText(op.point) : "";
          const roiText = op.roi ? roiToText(op.roi) : "";
          return `<user_request>
${finishInstructionsPT[finishType]}
</user_request>

${finishType === 'paint' ? `<surface_constraint>
Target surface: Wall only.
Restrict mask to continuous vertical surfaces (walls).
Do NOT paint: countertops, floors, ceilings, doors, windows, or furniture.
</surface_constraint>` : ''}

<coordinates>
${selText ? `<point>${selText}</point>` : ''}
${roiText ? `<roi>${roiText}</roi>` : ''}
</coordinates>

<composition_guide>
Blend mode: ${blend}
Opacity: ~${Math.round(opacity * 100)}%
</composition_guide>

<objective>
Preserve natural lighting, shadows, textures and details.
Return only the final image without text.
</objective>`;
        };

        const addUsage = (result: any) => {
          const um = (result as any)?.usageMetadata;
          if (!um) return;
          if (!aggregateUsage) {
            aggregateUsage = {
              promptTokens: um.promptTokenCount ?? 0,
              candidatesTokens: um.candidatesTokenCount ?? 0,
              totalTokens: um.totalTokenCount ?? 0,
              modelVersion: (result as any)?.modelVersion ?? null,
            };
          } else {
            aggregateUsage.promptTokens += um.promptTokenCount ?? 0;
            aggregateUsage.candidatesTokens += um.candidatesTokenCount ?? 0;
            aggregateUsage.totalTokens += um.totalTokenCount ?? 0;
          }
        };

        // Etapa 1
        const op1 = finalOps[0];
        const instr1 = buildInstructionForOp(op1);
        const res1 = await ai.models.generateContent({
          model,
          contents: {
            parts: [
              { inlineData: { data: inline.data, mimeType: inline.mime_type } },
              { text: systemInstructionSingleWall },
              { text: instr1 },
            ],
          },
          config: { responseModalities: [Modality.IMAGE] },
        });
        addUsage(res1);
        const img1Part = (res1 as any)?.candidates?.[0]?.content?.parts?.find((p: any) => p?.inlineData);
        const img1Data = img1Part?.inlineData?.data ? `data:${img1Part.inlineData?.mimeType || inline.mime_type};base64,${img1Part.inlineData.data}` : null;

        // Se não retornou imagem na etapa 1, aborta fallback
        if (!img1Data) {
          console.warn("upgrade-realista: fallback sequencial falhou na etapa 1 (sem imagem)");
        } else {
          // Etapa 2
          const inline1 = await toInlineData(img1Data);
          if (inline1) {
            const op2 = finalOps[1];
            const instr2 = buildInstructionForOp(op2);
            const res2 = await ai.models.generateContent({
              model,
              contents: {
                parts: [
                  { inlineData: { data: inline1.data, mimeType: inline1.mime_type } },
                  { text: systemInstructionSingleWall },
                  { text: instr2 },
                ],
              },
              config: { responseModalities: [Modality.IMAGE] },
            });
            addUsage(res2);
            const img2Part = (res2 as any)?.candidates?.[0]?.content?.parts?.find((p: any) => p?.inlineData);
            if (img2Part?.inlineData?.data) {
              const outMime2 = img2Part.inlineData?.mimeType || inline1.mime_type;
              processedImage = `data:${outMime2};base64,${img2Part.inlineData.data}`;
              strategy = "sequential_fallback";
            }
          }
        }
      } catch (e) {
        console.error("upgrade-realista: erro no fallback sequencial", e);
      }
    }

    if (!processedImage) {
      return new Response(JSON.stringify({ error: "IA indisponível ou falha na geração" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    const usage = aggregateUsage ?? {
      promptTokens: (genResult as any)?.usageMetadata?.promptTokenCount ?? null,
      candidatesTokens: (genResult as any)?.usageMetadata?.candidatesTokenCount ?? null,
      totalTokens: (genResult as any)?.usageMetadata?.totalTokenCount ?? null,
      modelVersion: (genResult as any)?.modelVersion ?? null,
    };

    const inputRate = Number(process.env.GEMINI_PRICE_INPUT_PER_M_TOKENS || "0");
    const outputRate = Number(process.env.GEMINI_PRICE_OUTPUT_PER_M_TOKENS || "0");
    const inputTokens = usage.promptTokens || 0;
    const outputTokens = usage.candidatesTokens || 0;
    const costEstimate = {
      usd: (inputTokens / 1_000_000) * inputRate + (outputTokens / 1_000_000) * outputRate,
      inputRatePerMTokensUSD: inputRate,
      outputRatePerMTokensUSD: outputRate,
      inputTokens,
      outputTokens,
    };

    const responsePayload = {
      status: "ok",
      engine: "gemini",
      strategy,
      processedImage,
      usage,
      costEstimate,
      echo: {
        roi: body.roi ?? null,
        selectionCoordinates: body.selectionCoordinates ?? null,
        ops: ops ?? null,
        prompt: body.prompt ?? null,
        color: body.color ?? null,
        blendMode: body.blendMode ?? null,
        tintOpacity: body.tintOpacity ?? null,
        meta: body.meta ?? null,
      },
    };

    try {
      const logEntry = {
        id: randomUUID(),
        timestamp: new Date().toISOString(),
        engine: "gemini",
        strategy,
        model,
        requestedFormat,
        usage,
        costEstimate,
        echo: responsePayload.echo,
      };
      const logsDir = path.join(process.cwd(), "logs");
      const logFile = path.join(logsDir, "ai-usage.jsonl");
      await fs.mkdir(logsDir, { recursive: true });
      await fs.appendFile(logFile, JSON.stringify(logEntry) + "\n", "utf8");
    } catch (e) {
      console.warn("upgrade-realista: falha ao gravar log de uso", e);
    }

    return new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("upgrade-realista error:", err);
    return new Response(JSON.stringify({ error: "Falha interna" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
