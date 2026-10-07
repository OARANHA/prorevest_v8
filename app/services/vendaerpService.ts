import 'dotenv/config';
import { supabaseServerClient } from '../lib/supabaseServerClient';

/**
 * vendaerpService — integração com a API do VendaERP (ERP back-office).
 *
 * Objeto: casar a cor escolhida pelo cliente no widget da loja online com o
 * pedido de e-commerce e gravar a cor real no item/observação do pedido, para
 * a fábrica saber qual tinta produzir.
 *
 * Segurança:
 *  - O token (VENDAERP_API_TOKEN) é lido de process.env (server-only, nunca do bundle client).
 *  - Por padrão DRY_RUN=true: o job apenas LOGA o que faria. Virar para false só após validar.
 *  - Pedidos/Salvar SOBRESCREVE o pedido inteiro: sempre GET completo -> alterar só o alvo -> POST.
 */

const CFG = {
  baseUrl: (process.env.VENDAERP_BASE_URL || 'https://voepro.vendaerp.com.br').replace(/\/+$/, ''),
  token: process.env.VENDAERP_API_TOKEN || '',
  user: process.env.VENDAERP_USER || 'prorevest@prorevesttintas.com.br',
  app: process.env.VENDAERP_APP || 'prorevest',
  dryRun: (process.env.VENDAERP_DRY_RUN || 'true').toLowerCase() !== 'false',
  writeAttributes: (process.env.VENDAERP_WRITE_ATTRIBUTES || 'false').toLowerCase() === 'true',
  intentTtlHours: Number(process.env.VENDAERP_INTENT_TTL_HOURS || '24'),
  matchWindowBeforeMin: Number(process.env.VENDAERP_MATCH_WINDOW_BEFORE_MIN || '30'),
  matchWindowAfterHours: Number(process.env.VENDAERP_MATCH_WINDOW_AFTER_HOURS || '6'),
};

export function isConfigured(): boolean {
  return !!CFG.token;
}

export function getConfig() {
  return {
    configured: isConfigured(),
    dryRun: CFG.dryRun,
    writeAttributes: CFG.writeAttributes,
    baseUrl: CFG.baseUrl,
  };
}

function headers(): Record<string, string> {
  return {
    'Authorization-Token': CFG.token,
    User: CFG.user,
    App: CFG.app,
    'Content-Type': 'application/json',
  };
}

async function vfetch(
  path: string,
  opts: { method?: string; body?: any; query?: Record<string, string | number | undefined> } = {}
) {
  let url = CFG.baseUrl + path;
  if (opts.query) {
    const qs = new URLSearchParams();
    Object.entries(opts.query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
    });
    const s = qs.toString();
    if (s) url += (url.includes('?') ? '&' : '?') + s;
  }
  return fetch(url, {
    method: opts.method || 'GET',
    headers: headers(),
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
}

// ─── Leitura de pedidos ────────────────────────────────────────
export async function searchRecentOrders(sinceISO: string): Promise<any[]> {
  const res = await vfetch('/api/request/Pedidos/Pesquisar', {
    query: { dataInicial: sinceISO, filtrarPor: 0, pageSize: 100, skip: 0 },
  });
  if (!res.ok) throw new Error('Pesquisar HTTP ' + res.status);
  const data: any = await res.json();
  return Array.isArray(data) ? data : data?.Resultado || data?.value || [];
}

export async function getOrderByCodigo(codigo: string): Promise<any | null> {
  const res = await vfetch('/api/request/Pedidos/Pesquisar', { query: { codigo } });
  if (!res.ok) throw new Error('Get pedido HTTP ' + res.status);
  const data: any = await res.json();
  const arr = Array.isArray(data) ? data : data?.Resultado || data?.value || [];
  return arr[0] || null;
}

// ─── Montagem do texto/atributos da cor ────────────────────────
function buildTag(c: any): string {
  const parts = [`PROREVEST — COR: ${c?.cor || ''}`];
  if (c?.codigo) parts.push(`Cód: ${c.codigo}`);
  if (c?.hex) parts.push(c.hex);
  if (c?.colecao) parts.push(c.colecao);
  return parts.join(' | ');
}

const ATTR_KEYS = ['cor_prorevest', 'hexcorprorevest', 'codigocorprorevest', 'colecaocor'];

/**
 * GET completo -> alterar só observação (sempre) e atributos do item (opt-in) -> retorna o pedido.
 * Não faz o POST (quem chama decide, respeitando DRY_RUN).
 */
export async function buildEnrichedOrder(pedidoCodigo: string, c: any): Promise<any> {
  const order: any = await getOrderByCodigo(String(pedidoCodigo));
  if (!order) throw new Error('Pedido não encontrado: ' + pedidoCodigo);

  const tag = buildTag(c);

  // 1) Observação do pedido (seguro — campo de texto único)
  const desc = (order.Descricao || '').trim();
  if (!desc.includes('PROREVEST — COR:')) {
    order.Descricao = desc ? desc + '\n' + tag : tag;
  }

  // 2) Atributos do item (opt-in via VENDAERP_WRITE_ATTRIBUTES — mais arriscado)
  if (CFG.writeAttributes && Array.isArray(order.Itens)) {
    const item =
      order.Itens.find((i: any) => String(i.Codigo || '') === String(c?.produto || '')) ||
      order.Itens[0];
    if (item) {
      const kept = (item.Atributos || []).filter(
        (a: any) => !ATTR_KEYS.includes(String(a.Descricao || '').toLowerCase())
      );
      item.Atributos = kept.concat([
        { Descricao: 'cor_prorevest', Valor: c?.cor || '' },
        { Descricao: 'hexcorprorevest', Valor: c?.hex || '' },
        { Descricao: 'codigocorprorevest', Valor: c?.codigo || '' },
        { Descricao: 'colecaocor', Valor: c?.colecao || '' },
      ]);
    }
  }

  return order;
}

export async function saveOrder(order: any): Promise<any> {
  const res = await vfetch('/api/request/Pedidos/Salvar', { method: 'POST', body: order });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error('Salvar HTTP ' + res.status + ' ' + txt.slice(0, 300));
  }
  return res.json().catch(() => ({}));
}

// ─── Casamento (matching) ──────────────────────────────────────
function orderTime(o: any): number {
  const t = o?.Data ? Date.parse(o.Data) : o?.UltimaAlteracao ? Date.parse(o.UltimaAlteracao) : NaN;
  return t;
}

function orderHasProduct(o: any, intent: any): boolean {
  const itens = o?.Itens || o?.Produtos || [];
  return itens.some((it: any) => {
    if (intent.produto && String(it.Codigo || '') === String(intent.produto)) return true;
    if (intent.produto_nome && String(it.Descricao || '').includes(String(intent.produto_nome)))
      return true;
    return false;
  });
}

export interface ProcessResult {
  ok: boolean;
  processed?: number;
  log: string[];
  error?: string;
}

async function expireOld(push: (m: string) => void) {
  if (!supabaseServerClient) return;
  const cutoff = new Date(Date.now() - CFG.intentTtlHours * 3600 * 1000).toISOString();
  const { data } = await supabaseServerClient
    .from('vendaerp_color_intents')
    .update({ status: 'expired' })
    .eq('status', 'pending')
    .lt('created_at', cutoff)
    .select('id');
  if (data && data.length) push(`Expiradas: ${data.length}`);
}

export async function processIntents(): Promise<ProcessResult> {
  const log: string[] = [];
  const push = (m: string) => {
    console.log('[VendaERP]', m);
    log.push(m);
  };

  if (!isConfigured()) {
    push('Token não configurado (VENDAERP_API_TOKEN).');
    return { ok: false, log };
  }
  if (!supabaseServerClient) {
    push('Supabase não configurado.');
    return { ok: false, log };
  }
  if (CFG.dryRun) push('⚠ DRY-RUN ativo: nada será gravado no ERP.');

  const ttlMs = CFG.intentTtlHours * 3600 * 1000;
  const since = new Date(Date.now() - ttlMs).toISOString();

  // 1) intenções pendentes (mais antigas primeiro)
  const { data: intents, error } = await supabaseServerClient
    .from('vendaerp_color_intents')
    .select('*')
    .eq('status', 'pending')
    .gte('created_at', since)
    .order('created_at', { ascending: true });
  if (error) {
    push('Erro ao ler intenções: ' + error.message);
    return { ok: false, log };
  }
  push(`Intenções pendentes: ${intents?.length || 0}`);

  if (!intents || intents.length === 0) {
    await expireOld(push);
    return { ok: true, processed: 0, log };
  }

  // 2) pedidos recentes
  let orders: any[] = [];
  try {
    orders = await searchRecentOrders(since);
  } catch (e: any) {
    push('Erro ao buscar pedidos: ' + e.message);
  }
  push(`Pedidos recentes: ${orders.length}`);

  // 3) casamento por produto + janela de tempo
  const claimed = new Set<string>();
  const beforeMs = CFG.matchWindowBeforeMin * 60000;
  const afterMs = CFG.matchWindowAfterHours * 3600000;
  let processed = 0;

  for (const intent of intents) {
    const intentTime = new Date(intent.created_at).getTime();

    const cand = orders.filter((o) => {
      const key = String(o.Codigo || o.ID || '');
      if (claimed.has(key)) return false;
      if (!orderHasProduct(o, intent)) return false;
      const ot = orderTime(o);
      if (!isNaN(ot) && (ot < intentTime - beforeMs || ot > intentTime + afterMs)) return false;
      return true;
    });

    if (cand.length === 0) {
      push(`Sem pedido para intenção ${intent.id} (prod ${intent.produto || '?'}).`);
      continue;
    }

    // pede mais próximo no tempo
    cand.sort(
      (a, b) => Math.abs(orderTime(a) - intentTime) - Math.abs(orderTime(b) - intentTime)
    );
    const order = cand[0];
    const orderKey = String(order.Codigo || order.ID || '');
    claimed.add(orderKey);
    push(`Casou intenção ${intent.id} (cor "${intent.cor}") ↔ pedido ${orderKey}`);

    try {
      if (CFG.dryRun) {
        push(`[DRY-RUN] gravaria a cor no pedido ${orderKey}.`);
      } else {
        const enriched = await buildEnrichedOrder(orderKey, intent);
        await saveOrder(enriched);
        push(`Gravado no pedido ${orderKey} (obs${CFG.writeAttributes ? ' + atributos' : ''}).`);
      }
      await supabaseServerClient
        .from('vendaerp_color_intents')
        .update({
          status: 'matched',
          pedido_codigo: orderKey,
          matched_at: new Date().toISOString(),
          matched_log: log.slice(-3).join(' | '),
        })
        .eq('id', intent.id);
      processed++;
    } catch (e: any) {
      push(`Erro ao gravar intenção ${intent.id}: ${e.message}`);
      await supabaseServerClient
        .from('vendaerp_color_intents')
        .update({ status: 'error', matched_log: e.message })
        .eq('id', intent.id);
    }
  }

  await expireOld(push);
  return { ok: true, processed, log };
}
