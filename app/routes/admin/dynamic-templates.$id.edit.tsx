import { useState, useEffect } from "react";
import { useLoaderData, useNavigate, useParams, type MetaFunction, type LoaderFunctionArgs } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, FileText, Mail } from "lucide-react";
import { TemplateService, type DynamicTemplate, type TemplateVariable } from "../../services/templateService";

export const meta: MetaFunction = () => {
  return [
    { title: "Editar Template - ProRevest" },
    { name: "description", content: "Edite um template com variáveis dinâmicas" },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    const { id } = params;
    if (id === 'new') {
      return { template: null };
    }

    if (!id) {
      throw new Error("ID do template é inválido");
    }
    
    const template = await TemplateService.getTemplateById(id);
    if (!template) {
      throw new Error("Template não encontrado");
    }
    
    return { template };
  } catch (error) {
    console.error("Error loading template:", error);
    return { template: null, error: "Falha ao carregar o template" };
  }
}

export default function EditDynamicTemplate() {
  const { template, error } = useLoaderData() as { template: DynamicTemplate | null; error?: string };
  const navigate = useNavigate();
  const { id } = useParams();
  const isCreating = id === 'new';

  const [name, setName] = useState(template?.name || '');
  const [type, setType] = useState<DynamicTemplate['type']>(template?.type || 'quote');
  const [content, setContent] = useState(template?.content || '');
  const [variables, setVariables] = useState<TemplateVariable[]>(template?.variables || []);
  const [newVariable, setNewVariable] = useState({ name: '', label: '', type: 'text' as const, required: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const templateData = {
        name,
        type,
        content,
        variables
      };
      
      if (isCreating) {
        await TemplateService.createTemplate(templateData);
      } else if (template) {
        await TemplateService.updateTemplate(template.id, templateData);
      }
      
      navigate('/admin/dynamic-templates');
    } catch (error) {
      console.error("Erro ao salvar template:", error);
      alert("Erro ao salvar template. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddVariable = () => {
    if (!newVariable.name || !newVariable.label) {
      alert("Por favor, preencha todos os campos da variável.");
      return;
    }
    
    // Verificar se a variável já existe
    if (variables.some(v => v.name === newVariable.name)) {
      alert("Já existe uma variável com este nome.");
      return;
    }
    
    const variable: TemplateVariable = {
      id: Math.random().toString(36).substr(2, 9),
      name: newVariable.name,
      label: newVariable.label,
      type: newVariable.type,
      required: newVariable.required
    };
    
    setVariables([...variables, variable]);
    setNewVariable({ name: '', label: '', type: 'text', required: false });
  };

  const handleRemoveVariable = (variableId: string) => {
    setVariables(variables.filter(v => v.id !== variableId));
  };

  const handleExtractVariables = () => {
    const extractedVariables = TemplateService.extractVariablesFromContent(content);
    
    // Filtrar variáveis que já existem
    const newVariables = extractedVariables.filter(
      extracted => !variables.some(existing => existing.name === extracted.name) &&
                  !TemplateService.DEFAULT_VARIABLES.some(defaultVar => defaultVar.name === extracted.name)
    );
    
    if (newVariables.length > 0) {
      setVariables([...variables, ...newVariables]);
      alert(`${newVariables.length} variáveis foram extraídas do conteúdo e adicionadas.`);
    } else {
      alert("Nenhuma nova variável foi encontrada no conteúdo.");
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-2xl">
          <h2 className="text-xl font-bold text-destructive mb-2">Erro</h2>
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-primary hover:text-primary/80 mb-6"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Voltar
      </button>
      
      <div className="mb-6">
        <h1 className="text-3xl font-cormorant font-bold">
          {isCreating ? 'Criar Novo Template' : 'Editar Template'}
        </h1>
        <p className="text-muted-foreground">
          {isCreating ? 'Crie um novo template com variáveis dinâmicas' : 'Edite as informações do template'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
              Nome do Template *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ex: Orçamento Padrão"
              required
            />
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-foreground mb-1">
              Tipo de Template *
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as DynamicTemplate['type'])}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="quote">Orçamento</option>
              <option value="email">E-mail</option>
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-medium text-foreground mb-1">
            Conteúdo do Template *
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
            placeholder="Digite o conteúdo do template. Use {{nome_da_variavel}} para inserir variáveis."
            required
          />
          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleExtractVariables}
              className="text-primary hover:text-primary/80 text-sm"
            >
              Extrair variáveis do conteúdo
            </button>
            <div className="text-sm text-muted-foreground">
              {content.length} caracteres
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-cormorant font-bold">Variáveis do Template</h2>
            <span className="text-sm text-muted-foreground">
              {variables.length} variáveis personalizadas
            </span>
          </div>
          
          {/* Formulário para adicionar nova variável */}
          <div className="bg-muted/30 rounded-lg p-4 mb-4">
            <h3 className="font-medium mb-3">Adicionar Nova Variável</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label htmlFor="varName" className="block text-xs text-muted-foreground mb-1">
                  Nome (sem espaços)
                </label>
                <input
                  type="text"
                  id="varName"
                  value={newVariable.name}
                  onChange={(e) => setNewVariable({...newVariable, name: e.target.value})}
                  className="w-full px-2 py-1 text-sm border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="ex: nome_cliente"
                />
              </div>
              <div>
                <label htmlFor="varLabel" className="block text-xs text-muted-foreground mb-1">
                  Rótulo
                </label>
                <input
                  type="text"
                  id="varLabel"
                  value={newVariable.label}
                  onChange={(e) => setNewVariable({...newVariable, label: e.target.value})}
                  className="w-full px-2 py-1 text-sm border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Ex: Nome do Cliente"
                />
              </div>
              <div>
                <label htmlFor="varType" className="block text-xs text-muted-foreground mb-1">
                  Tipo
                </label>
                <select
                  id="varType"
                  value={newVariable.type}
                  onChange={(e) => setNewVariable({...newVariable, type: e.target.value as any})}
                  className="w-full px-2 py-1 text-sm border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="text">Texto</option>
                  <option value="number">Número</option>
                  <option value="date">Data</option>
                  <option value="currency">Moeda</option>
                  <option value="percentage">Porcentagem</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newVariable.required}
                    onChange={(e) => setNewVariable({...newVariable, required: e.target.checked})}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm">Obrigatória</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddVariable}
                  className="ml-2 bg-primary text-primary-foreground px-3 py-1 rounded text-sm hover:bg-primary/90 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Lista de variáveis existentes */}
          {variables.length > 0 ? (
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/30">
                  <tr>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                      Nome
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                      Rótulo
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                      Tipo
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase">
                      Obrigatória
                    </th>
                    <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {variables.map((variable) => (
                    <tr key={variable.id} className="hover:bg-muted/10">
                      <td className="px-4 py-2 text-sm">
                        <code className="bg-muted px-2 py-1 rounded">{`{{${variable.name}}}`}</code>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {variable.label}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                          {variable.type}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {variable.required ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Sim
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                            Não
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariable(variable.id)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/20" />
              <p>Nenhuma variável personalizada adicionada ainda.</p>
              <p className="text-sm mt-1">Use o formulário acima para adicionar variáveis.</p>
            </div>
          )}
        </div>
        
        {/* Variáveis padrão disponíveis */}
        <div className="mb-8">
          <h3 className="font-medium mb-3">Variáveis Padrão Disponíveis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {TemplateService.DEFAULT_VARIABLES.map(variable => (
              <div key={variable.id} className="bg-muted/30 rounded p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <code className="text-sm bg-muted px-2 py-1 rounded">{`{{${variable.name}}}`}</code>
                    <div className="text-xs text-muted-foreground mt-1">{variable.label}</div>
                  </div>
                  {variable.required && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      Obrigatória
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted/50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </>
            ) : (
              'Salvar Template'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
