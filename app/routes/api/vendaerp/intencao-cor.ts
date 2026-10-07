import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { supabaseServerClient } from "../../../lib/supabaseServerClient";

/**
 * POST /api/vendaerp/intencao-cor
 * Recebe do widget da loja online a cor escolhida + produto e grava como intenção pendente.
 * CORS aberto (*): a loja roda num domínio diferente (VendaERP) do que a API (prorevesttintas.com.br).
 */
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

// GET direto (debug/saúde) e preflight CORS
export async function loader({ request }: LoaderFunctionArgs) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }
  return json({
    ok: true,
    endpoint: "intencao-cor",
    method: "POST",
    usage: "POST { produto, cor, hex, codigo, colecao }",
  });
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (request.method !== "POST") {
    return json({ error: "Method Not Allowed" }, 405);
  }
  if (!supabaseServerClient) {
    return json({ error: "DB indisponível" }, 503);
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: "JSON inválido" }, 400);
  }

  const cor = (body?.cor || "").toString().trim();
  if (!cor) return json({ error: "cor ausente" }, 400);

  const row = {
    produto: (body?.produto || "").toString().trim() || null,
    produto_nome: (body?.produto_nome || "").toString().trim() || null,
    cor,
    hex: (body?.hex || "").toString().trim() || null,
    codigo: (body?.codigo || "").toString().trim() || null,
    colecao: (body?.colecao || "").toString().trim() || null,
    valor: (body?.valor || "").toString().trim() || null,
    session_id: (body?.session_id || "").toString().trim() || null,
    status: "pending",
  };

  const { error } = await supabaseServerClient
    .from("vendaerp_color_intents")
    .insert(row);

  if (error) {
    console.error("[VendaERP] insert intent error:", error.message);
    return json({ error: "Falha ao gravar" }, 500);
  }

  return json({ ok: true });
}
