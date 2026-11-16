import type { MetaFunction } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Package, ShoppingCart, Users } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export const meta: MetaFunction = () => [
  { title: "Dashboard - ProRevest" },
  { name: "description", content: "Visão geral do sistema administrativo da ProRevest" },
];

type Metrics = {
  profiles: number | null;
  products: number | null;
  quotes: number | null;
};

type RecentQuote = {
  id: string;
  status: string;
  created_at: string;
};

const initialMetrics: Metrics = {
  profiles: null,
  products: null,
  quotes: null,
};

async function countVisibleRows(table: "profiles" | "quotes"): Promise<number> {
  if (!supabase) {
    throw new Error("Supabase não configurado");
  }

  const { count, error } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true });

  if (error) throw error;
  if (count === null) throw new Error("Contagem não retornada");
  return count;
}

async function countActiveProducts(): Promise<number> {
  if (!supabase) {
    throw new Error("Supabase não configurado");
  }

  const { count, error } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("is_archived", false);

  if (error) throw error;
  if (count === null) throw new Error("Contagem de produtos não retornada");
  return count;
}

async function loadRecentQuotes(): Promise<RecentQuote[]> {
  if (!supabase) {
    throw new Error("Supabase não configurado");
  }

  const { data, error } = await supabase
    .from("quotes")
    .select("id, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) throw error;
  return data || [];
}

function displayCount(value: number | null): string {
  return value === null ? "Indisponível" : value.toLocaleString("pt-BR");
}

const quoteStatusLabels: Record<string, string> = {
  draft: "Rascunho",
  sent: "Enviado",
  approved: "Aprovado",
  signed: "Assinado",
  archived: "Arquivado",
};

export default function AdminHome() {
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics);
  const [recentQuotes, setRecentQuotes] = useState<RecentQuote[] | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadDashboardData() {
      const results = await Promise.allSettled([
        countVisibleRows("profiles"),
        countActiveProducts(),
        countVisibleRows("quotes"),
        loadRecentQuotes(),
      ]);

      if (!active) return;

      const [profiles, products, quotes, latest] = results;
      setMetrics({
        profiles: profiles.status === "fulfilled" ? profiles.value : null,
        products: products.status === "fulfilled" ? products.value : null,
        quotes: quotes.status === "fulfilled" ? quotes.value : null,
      });
      setRecentQuotes(latest.status === "fulfilled" ? latest.value : null);

      const messages: string[] = [];
      if (profiles.status === "rejected") messages.push("Não foi possível consultar perfis.");
      if (products.status === "rejected") messages.push("Não foi possível consultar produtos.");
      if (quotes.status === "rejected") messages.push("Não foi possível consultar orçamentos.");
      if (latest.status === "rejected") messages.push("Não foi possível consultar orçamentos recentes.");
      setErrors(messages);
      setLoading(false);
    }

    void loadDashboardData();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64" role="status">
        <span className="text-slate-300">Carregando dados administrativos...</span>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-cormorant font-bold text-slate-100 mb-2">Visão Geral</h1>
        <p className="text-slate-300 text-lg">Indicadores consultados no sistema ProRevest</p>
      </div>

      {errors.length > 0 && (
        <div role="alert" className="mb-8 rounded-lg border border-amber-500/50 bg-amber-950/30 p-4 text-amber-100">
          <p className="font-semibold">Alguns dados não estão disponíveis.</p>
          <p className="text-sm mt-1">{errors.join(" ")}</p>
          <p className="text-sm mt-1">Verifique a conexão e as permissões de acesso. Valores não são estimados.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/admin/users" className="block bg-slate-800/50 border border-slate-600 rounded-xl p-6 hover:border-blue-400 transition-colors">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-300 mb-2">Perfis visíveis</p>
              <p className="text-2xl font-bold text-slate-100">{displayCount(metrics.profiles)}</p>
            </div>
            <Users className="h-8 w-8 text-blue-400 shrink-0" aria-hidden="true" />
          </div>
          <p className="text-sm text-slate-400 mt-4">Registros da tabela profiles permitidos pela sessão.</p>
        </Link>

        <Link to="/admin/products" className="block bg-slate-800/50 border border-slate-600 rounded-xl p-6 hover:border-yellow-400 transition-colors">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-300 mb-2">Produtos ativos no catálogo</p>
              <p className="text-2xl font-bold text-slate-100">{displayCount(metrics.products)}</p>
            </div>
            <Package className="h-8 w-8 text-yellow-400 shrink-0" aria-hidden="true" />
          </div>
          <p className="text-sm text-slate-400 mt-4">Contagem de produtos não arquivados, sujeitos à política RLS.</p>
        </Link>

        <Link to="/admin/quotes" className="block bg-slate-800/50 border border-slate-600 rounded-xl p-6 hover:border-purple-400 transition-colors">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-300 mb-2">Orçamentos visíveis</p>
              <p className="text-2xl font-bold text-slate-100">{displayCount(metrics.quotes)}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-purple-400 shrink-0" aria-hidden="true" />
          </div>
          <p className="text-sm text-slate-400 mt-4">Registros acessíveis na tabela quotes.</p>
        </Link>
      </div>

      <p className="text-sm text-slate-400 mb-10">
        A contagem de perfis não equivale necessariamente ao total de contas no Supabase Auth.
        É preciso validar a sincronização entre auth.users, profiles e as políticas RLS
        antes de apresentar um total geral de usuários cadastrados.
      </p>

      <section className="bg-slate-800/50 border border-slate-600 rounded-xl shadow-sm p-6 md:p-8">
        <h2 className="text-2xl font-cormorant font-bold mb-6 text-slate-100">Orçamentos recentes</h2>
        {recentQuotes === null ? (
          <p className="text-slate-300">Dados indisponíveis para consulta.</p>
        ) : recentQuotes.length === 0 ? (
          <p className="text-slate-300">Nenhum orçamento encontrado entre os registros visíveis.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-600">
              <thead>
                <tr className="text-left text-sm text-slate-300">
                  <th scope="col" className="px-3 py-3">Orçamento</th>
                  <th scope="col" className="px-3 py-3">Status</th>
                  <th scope="col" className="px-3 py-3">Criado em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 text-slate-200">
                {recentQuotes.map((quote) => (
                  <tr key={quote.id}>
                    <td className="px-3 py-4 font-mono text-sm">{quote.id.slice(0, 8)}</td>
                    <td className="px-3 py-4">{quoteStatusLabels[quote.status] ?? quote.status}</td>
                    <td className="px-3 py-4">
                      {new Date(quote.created_at).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
