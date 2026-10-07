import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { processIntents } from "../../../services/vendaerpService";

/**
 * POST|GET /api/vendaerp/processar
 * Dispara o job de casamento (intenções de cor ↔ pedidos de e-commerce).
 * Protegido por VENDAERP_PROCESS_SECRET via header `X-Process-Secret` ou query `?secret=`.
 * Pensado para ser chamado por cron (ex.: a cada 5 min).
 */
function authorized(request: Request): boolean {
  const secret = process.env.VENDAERP_PROCESS_SECRET;
  if (!secret) return true; // sem segredo configurado = liberado (defina um em produção)
  const url = new URL(request.url);
  const provided = request.headers.get("x-process-secret") || url.searchParams.get("secret") || "";
  return provided === secret;
}

async function run() {
  try {
    const result = await processIntents();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  if (!authorized(request)) {
    return new Response(JSON.stringify({ error: "não autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return run();
}

export async function loader({ request }: LoaderFunctionArgs) {
  if (!authorized(request)) {
    return new Response(JSON.stringify({ error: "não autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return run();
}
