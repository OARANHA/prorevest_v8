import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { DatabaseService } from "../../services/databaseService";

export const meta: MetaFunction = () => {
  return [
    { title: "Teste de Banco de Dados - ProRevest" },
    { name: "description", content: "Página de teste para verificar tabelas do banco de dados" },
  ];
}

export default function TestDatabase() {
  const [tables, setTables] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTables = async () => {
      try {
        // Consultar as tabelas do banco de dados
        const tableNames = await DatabaseService.getTableNames();
        setTables(tableNames);
      } catch (err) {
        console.error("Erro ao carregar tabelas:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    loadTables();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-cormorant font-bold mb-6">Erro ao Carregar Tabelas</h1>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-cormorant font-bold mb-6">Tabelas do Banco de Dados</h1>
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Nome da Tabela
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {tables.map((table, index) => (
              <tr key={index} className="hover:bg-muted/10">
                <td className="px-6 py-4 whitespace-nowrap">
                  {table}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}