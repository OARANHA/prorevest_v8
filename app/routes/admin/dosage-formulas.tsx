import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, Send, FileText } from "lucide-react";
import { DosageService, type DosageFormula } from "../../services/dosageService";
import { DatabaseService } from "../../services/databaseService";
import { useNavigate } from "react-router-dom";

export const meta: MetaFunction = () => {
  return [
    { title: "Fórmulas de Dosagem - ProRevest" },
    { name: "description", content: "Gerencie as fórmulas de dosagem da ProRevest" },
  ];
}

export default function AdminDosageFormulas() {
  const [formulas, setFormulas] = useState<DosageFormula[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFormulas, setFilteredFormulas] = useState<DosageFormula[]>([]);
  const [dbError, setDbError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Carregar fórmulas de dosagem
  useEffect(() => {
    const loadFormulas = async () => {
      try {
        // Verificar se as tabelas necessárias existem
        const formulasTableExists = await DatabaseService.checkTableExists('dosage_formulas');
        
        if (!formulasTableExists) {
          setDbError("Tabela de fórmulas não encontrada. Por favor, inicialize o banco de dados.");
          return;
        }
        
        // Buscar as fórmulas do banco de dados
        const formulasData = await DosageService.getAllFormulas();
        setFormulas(formulasData);
        setFilteredFormulas(formulasData);
      } catch (error) {
        console.error("Erro ao carregar fórmulas de dosagem:", error);
        setDbError(error instanceof Error ? error.message : "Erro desconhecido ao carregar fórmulas de dosagem");
      } finally {
        setLoading(false);
      }
    };

    loadFormulas();
  }, []);

  // Filtrar fórmulas com base no termo de busca
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredFormulas(formulas);
    } else {
      const filtered = formulas.filter(formula => 
        formula.quote_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formula.product_variant_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFormulas(filtered);
    }
  }, [searchTerm, formulas]);

  const handleInitDatabase = () => {
    navigate("/admin/init-db");
  };

  const handleSendFormula = async (formulaId: string) => {
    try {
      // Em uma implementação real, aqui enviaríamos a fórmula para a máquina de dosagem
      console.log(`Enviando fórmula ${formulaId} para máquina de dosagem`);
      alert(`Fórmula ${formulaId} enviada para máquina de dosagem com sucesso!`);
    } catch (error) {
      console.error("Erro ao enviar fórmula:", error);
      alert("Erro ao enviar fórmula para máquina de dosagem");
    }
  };

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

  if (dbError) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-cormorant font-bold mb-6">Erro de Banco de Dados</h1>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-2xl">
          <p className="text-destructive mb-4">{dbError}</p>
          <button
            onClick={handleInitDatabase}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Inicializar Banco de Dados
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-cormorant font-bold">Fórmulas de Dosagem</h1>
            <p className="text-muted-foreground">Gerencie as fórmulas de dosagem da ProRevest</p>
          </div>
        </div>
      </div>

      {/* Barra de busca */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar fórmulas..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela de fórmulas */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                ID da Fórmula
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                ID do Orçamento
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                ID da Variante
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Base (%)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Pigmento A (%)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Pigmento B (%)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Pigmento C (%)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Data de Criação
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {filteredFormulas.map((formula) => (
              <tr key={formula.id} className="hover:bg-muted/10">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                  {formula.id.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                  {formula.quote_id.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                  {formula.product_variant_id.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formula.base_percentage}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formula.pigment_a_percentage}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formula.pigment_b_percentage}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formula.pigment_c_percentage}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {new Date(formula.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleSendFormula(formula.id)}
                    className="text-primary hover:text-primary/80 mr-3 flex items-center"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Enviar
                  </button>
                  <button className="text-foreground hover:text-foreground/80 flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredFormulas.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium">Nenhuma fórmula encontrada</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Não há fórmulas de dosagem cadastradas no sistema.
          </p>
        </div>
      )}

      {/* Paginação */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando 1 a {filteredFormulas.length} de {filteredFormulas.length} resultados
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-border rounded-md text-sm font-medium hover:bg-muted/50">
            Anterior
          </button>
          <button className="px-3 py-1 border border-border rounded-md text-sm font-medium hover:bg-muted/50">
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}