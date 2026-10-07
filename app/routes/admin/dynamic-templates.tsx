import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, FileText, Mail } from "lucide-react";
import { TemplateService, type DynamicTemplate } from "../../services/templateService";
import { useNavigate } from "react-router-dom";

export const meta: MetaFunction = () => {
  return [
    { title: "Templates Dinâmicos - ProRevest" },
    { name: "description", content: "Gerencie templates de orçamento e e-mail com variáveis dinâmicas" },
  ];
}

export default function AdminDynamicTemplates() {
  const [templates, setTemplates] = useState<DynamicTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTemplates, setFilteredTemplates] = useState<DynamicTemplate[]>([]);
  const [filterType, setFilterType] = useState<"all" | "quote" | "email">("all");
  const navigate = useNavigate();

  // Carregar templates
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const templatesData = await TemplateService.getTemplates();
        setTemplates(templatesData);
        setFilteredTemplates(templatesData);
      } catch (error) {
        console.error("Erro ao carregar templates:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // Filtrar templates com base no termo de busca e tipo
  useEffect(() => {
    let filtered = templates;
    
    if (searchTerm !== "") {
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== "all") {
      filtered = filtered.filter(template => template.type === filterType);
    }
    
    setFilteredTemplates(filtered);
  }, [searchTerm, filterType, templates]);

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case "quote":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "email":
        return <Mail className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "quote":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Orçamento</span>;
      case "email":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">E-mail</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Desconhecido</span>;
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm("Tem certeza que deseja excluir este template?")) return;
    
    try {
      await TemplateService.deleteTemplate(templateId);
      const updatedTemplates = templates.filter(t => t.id !== templateId);
      setTemplates(updatedTemplates);
      setFilteredTemplates(updatedTemplates);
    } catch (error) {
      console.error("Erro ao deletar template:", error);
      alert("Erro ao deletar template. Por favor, tente novamente.");
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-cormorant font-bold">Templates Dinâmicos</h1>
            <p className="text-muted-foreground">Gerencie templates de orçamento e e-mail com variáveis dinâmicas</p>
          </div>
          <button 
            onClick={() => navigate("/admin/dynamic-templates/new")}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center"
          >
            <Plus className="mr-2 h-5 w-5" />
            Novo Template
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar templates..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">Todos os tipos</option>
          <option value="quote">Orçamentos</option>
          <option value="email">E-mails</option>
        </select>
      </div>

      {/* Tabela de templates */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Template
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Tipo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Variáveis
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
            {filteredTemplates.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">
                  Nenhum template encontrado
                </td>
              </tr>
            ) : (
              filteredTemplates.map((template) => (
                <tr key={template.id} className="hover:bg-muted/10">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getTemplateIcon(template.type)}
                      <div className="ml-3">
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {template.content.substring(0, 100)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(template.type)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {template.variables.slice(0, 3).map(variable => (
                        <span key={variable.id} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                          {variable.label}
                        </span>
                      ))}
                      {template.variables.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                          +{template.variables.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                    {new Date(template.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => navigate(`/admin/dynamic-templates/${template.id}/edit`)}
                      className="text-primary hover:text-primary/80 mr-3"
                      title="Editar"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-destructive hover:text-destructive/80"
                      title="Excluir"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando 1 a {filteredTemplates.length} de {filteredTemplates.length} resultados
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