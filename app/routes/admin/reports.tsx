import type { MetaFunction } from "react-router-dom";
import { Link } from "react-router-dom";

export const meta: MetaFunction = () => [
  { title: "Relatórios - ProRevest" },
  { name: "description", content: "Relatórios administrativos da ProRevest" },
];

export default function AdminReports() {
  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-3xl font-cormorant font-bold mb-3">Relatórios e Análises</h1>
      <p className="text-muted-foreground mb-8">
        Os relatórios de vendas e receita anteriores usavam valores demonstrativos.
        Eles foram retirados para não apresentar informações fictícias como indicadores reais.
      </p>

      <div className="rounded-xl border border-slate-600 bg-slate-800/50 p-6">
        <h2 className="text-xl font-semibold text-slate-100 mb-2">Relatórios detalhados ainda não disponíveis</h2>
        <p className="text-slate-300 mb-6">
          A publicação de novos indicadores depende de fontes de dados verificadas,
          permissões de acesso adequadas e validação dos resultados.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link className="text-blue-300 underline hover:text-blue-200" to="/admin/users">
            Consultar usuários
          </Link>
          <Link className="text-blue-300 underline hover:text-blue-200" to="/admin/products">
            Consultar produtos
          </Link>
          <Link className="text-blue-300 underline hover:text-blue-200" to="/admin/quotes">
            Consultar orçamentos
          </Link>
        </div>
      </div>
    </div>
  );
}
