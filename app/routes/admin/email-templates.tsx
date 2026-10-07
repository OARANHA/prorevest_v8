import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";
import { EmailService, type EmailTemplate } from "../../services/emailService";

export const meta: MetaFunction = () => {
  return [
    { title: "Templates de E-mail - ProRevest" },
    { name: "description", content: "Gerencie os templates de e-mail da ProRevest" },
  ];
}

export default function AdminEmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTemplates, setFilteredTemplates] = useState<EmailTemplate[]>([]);

  // Carregar templates de e-mail
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const templatesData = await EmailService.getEmailTemplates();
        setTemplates(templatesData);
        setFilteredTemplates(templatesData);
      } catch (error) {
        console.error("Erro ao carregar templates de e-mail:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // Filtrar templates com base no termo de busca
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredTemplates(templates);
    } else {
      const filtered = templates.filter(template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTemplates(filtered);
    }
  }, [searchTerm, templates]);

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await EmailService.deleteEmailTemplate(templateId);
      const updatedTemplates = templates.filter(t => t.id !== templateId);
      setTemplates(updatedTemplates);
      setFilteredTemplates(updatedTemplates);
    } catch (error) {
      console.error("Erro ao deletar template:", error);
    }
  };

  const handlePreviewTemplate = (template: EmailTemplate) => {
    // Em uma implementação real, isso abriria uma prévia do template
    alert(`Prévia do template: ${template.name}\n\nAssunto: ${template.subject}\n\nConteúdo: ${template.content.substring(0, 100)}...`);
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
            <h1 className="text-3xl font-cormorant font-bold">Templates de E-mail</h1>
            <p className="text-muted-foreground">Gerencie os templates de e-mail da ProRevest</p>
          </div>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center">
            <Plus className="mr-2 h-5 w-5" />
            Novo Template
          </button>
        </div>
      </div>

      {/* Barra de busca */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar templates..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela de templates */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Nome
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Assunto
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
                <td colSpan={4} className="px-6 py-4 text-center text-muted-foreground">
                  Nenhum template encontrado
                </td>
              </tr>
            ) : (
              filteredTemplates.map((template) => (
                <tr key={template.id} className="hover:bg-muted/10">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{template.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-muted-foreground">{template.subject}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                    {new Date(template.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handlePreviewTemplate(template)}
                      className="text-primary hover:text-primary/80 mr-3"
                      title="Prévia"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="text-primary hover:text-primary/80 mr-3">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-destructive hover:text-destructive/80"
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