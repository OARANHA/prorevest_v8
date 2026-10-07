export type SelectionCoordinates = { x: number; y: number };

// Suporte a múltiplas operações (multi-pontos/ROI)
export type EditOp = {
  point?: { x: number; y: number; units?: string } | null;
  roi?: { x0: number; y0: number; x1: number; y1: number } | null;
  color?: string;
  blendMode?: string;
  tintOpacity?: number;
  surface?: string; // identificar a superfície/alvo (ex.: Parede, Bancada)
  finishType?: 'paint' | 'microcement' | 'epoxy' | 'pebble'; // NOVO: tipo de acabamento
};

// NOVO: Tipos de acabamento
export type FinishType = 'paint' | 'microcement' | 'epoxy' | 'pebble';
export type MicrocementStyle = 'polido' | 'rústico';

export type EditRoomImageOptions = {
  imageDataUrl: string;
  prompt?: string;
  outputFormat?: 'webp' | 'jpeg' | 'png';
  selectionCoordinates?: SelectionCoordinates | null;
  color?: string;
  blendMode?: string;
  tintOpacity?: number;
  meta?: Record<string, any> | null;
  ops?: EditOp[]; // várias operações
  finishType?: FinishType; // NOVO: tipo de acabamento
  microcementStyle?: MicrocementStyle; // NOVO: estilo de microcimento
};

export type EditRoomImageResponse = {
  status: 'ok' | 'error';
  engine?: 'gemini' | 'mock' | 'mock-or-fallback' | 'texture-overlay' | 'basic-pass';
  processedImage?: string; // Data URL
  error?: string;
  usage?: {
    promptTokens?: number | null;
    candidatesTokens?: number | null;
    totalTokens?: number | null;
    modelVersion?: string | null;
  };
  costEstimate?: {
    usd: number;
    inputRatePerMTokensUSD: number;
    outputRatePerMTokensUSD: number;
    inputTokens: number;
    outputTokens: number;
  };
};

export async function editRoomImage(options: EditRoomImageOptions): Promise<EditRoomImageResponse> {
  const body: any = {
    image: options.imageDataUrl,
    prompt: options.prompt ?? '',
    selectionCoordinates: options.selectionCoordinates ?? null,
    color: options.color ?? undefined,
    blendMode: options.blendMode ?? undefined,
    tintOpacity: typeof options.tintOpacity === 'number' ? options.tintOpacity : undefined,
    meta: options.meta ?? undefined,
    finishType: options.finishType ?? undefined, // NOVO: tipo de acabamento
    microcementStyle: options.microcementStyle ?? undefined, // NOVO: estilo de microcimento
  };

  // Incluir ops[] quando fornecido
  if (Array.isArray(options.ops) && options.ops.length > 0) {
    body.ops = options.ops;
  }

  // Detecta TEXTURE pela presença de meta.textureUrl
  const isTextureMode = !!(options.meta && typeof (options.meta as any).textureUrl === 'string');

  // Enviar outputFormat apenas se for explicitamente fornecido
  if (options.outputFormat) {
    body.outputFormat = options.outputFormat;
  }

  // Fallback: em TEXTURE, inferir formato de saída a partir da imagem original quando não especificado
  if (!options.outputFormat && isTextureMode) {
    const match = options.imageDataUrl?.match(/^data:image\/([a-zA-Z0-9+.-]+);/);
    let inferred: string | undefined = match?.[1];
    if (inferred === 'jpg') inferred = 'jpeg';
    if (inferred && (inferred === 'jpeg' || inferred === 'png' || inferred === 'webp')) {
      body.outputFormat = inferred as 'jpeg' | 'png' | 'webp';
    }
  }

  const endpoint = isTextureMode ? '/api/ai/upgrade-texture' : '/api/ai/upgrade-realista';

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 120_000);

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { status: 'error', error: 'O processamento demorou mais de 2 minutos. Tente novamente.' };
    }
    return { status: 'error', error: 'Falha de conexão durante o processamento da imagem. Tente novamente.' };
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (!res.ok) {
    const errText = await res.text();
    return { status: 'error', error: `Falha na requisição: ${res.status} ${errText}` };
  }

  try {
    const data = await res.json();
    const processed: string | undefined = data?.processedImage;
    const engine: 'gemini' | 'mock' | 'mock-or-fallback' | 'texture-overlay' | 'basic-pass' | undefined = data?.engine;
    const usage = data?.usage;
    const costEstimate = data?.costEstimate;

    if (typeof processed === 'string' && processed && processed !== options.imageDataUrl) {
      return { status: 'ok', engine, processedImage: processed, ...(usage ? { usage } : {}), ...(costEstimate ? { costEstimate } : {}) };
    }

    return { status: 'error', error: 'IA/Overlay indisponível ou falha na geração. Nenhuma alteração aplicada.' };
  } catch (e) {
    return { status: 'error', error: 'Resposta inválida do servidor.' };
  }
}
