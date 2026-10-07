import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Calculator, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Play, 
  Database,
  FolderCog
} from "lucide-react";
import { 
  TechnicalConfigService, 
  type TechnicalFormula 
} from "../../services/technicalConfigService";
import { DatabaseService } from "../../services/databaseService";
import { useNavigate } from "react-router-dom";

export const meta: MetaFunction = () => {
  return [
    { title: "Configurações Técnicas - ProRevest" },
    { name: "description", content: "Gerencie as configurações técnicas e fórmulas de cálculo automático" },
  ];
}

export default function AdminTechnicalConfig() {
  const [formulas, setFormulas] = useState<TechnicalFormula[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [editingFormula, setEditingFormula] = useState<TechnicalFormula | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [testVariables, setTestVariables] = useState<Record<string, Record<string, number>>>({});
  const [testResults, setTestResults] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  // Carregar fórmulas técnicas
  useEffect(() => {
    const loadFormulas = async () => {
      try {
        // Verificar se as tabelas necessárias existem
        const formulasTableExists = await DatabaseService.checkTableExists('technical_formulas');
        
        if (!formulasTableExists) {
          setDbError("Tabela de fórmulas técnicas não encontrada. Por favor, inicialize o banco de dados.");
          return;
        }
        
        // Buscar as fórmulas do banco de dados ou usar amostras
        try {
          const formulasData = await TechnicalConfigService.getAllFormulas();
          setFormulas(formulasData);
        } catch (error) {
          // Se não conseguir carregar do banco, usar amostras
          console.warn("Não foi possível carregar fórmulas do banco, usando amostras:", error);
          const sampleFormulas = await TechnicalConfigService.getSampleFormulas();
          setFormulas(sampleFormulas);
        }
      } catch (error) {
        console.error("Erro ao carregar fórmulas técnicas:", error);
        setDbError(error instanceof Error ? error.message : "Erro desconhecido ao carregar fórmulas técnicas");
      } finally {
        setLoading(false);
      }
    };

    loadFormulas();
  }, []);

  const handleInitDatabase = () => {
    navigate("/admin/init-db");
  };

  const handleCreateFormula = () => {
    const newFormula: TechnicalFormula = {
      id: '',
      name: '',
      description: '',
      formula: '',
      variables: {},
      result_unit: '',
      category: '',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setEditingFormula(newFormula);
    setIsCreating(true);
  };

  const handleEditFormula = (formula: TechnicalFormula) => {
    setEditingFormula({...formula});
    setIsCreating(false);
  };

  const handleDeleteFormula = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta fórmula?")) {
      try {
        await TechnicalConfigService.deleteFormula(id);
        setFormulas(formulas.filter(f => f.id !== id));
      } catch (error) {
        console.error("Erro ao excluir fórmula:", error);
        alert("Erro ao excluir fórmula");
      }
    }
  };

  const handleSaveFormula = async () => {
    if (!editingFormula) return;

    try {
      let savedFormula: TechnicalFormula;
      
      if (isCreating) {
        // Remover o ID vazio antes de criar
        const { id, ...formulaWithoutId } = editingFormula;
        savedFormula = await TechnicalConfigService.createFormula(formulaWithoutId);
      } else {
        savedFormula = await TechnicalConfigService.updateFormula(editingFormula.id, editingFormula);
      }
      
      // Atualizar a lista de fórmulas
      if (isCreating) {
        setFormulas([...formulas, savedFormula]);
      } else {
        setFormulas(formulas.map(f => f.id === savedFormula.id ? savedFormula : f));
      }
      
      setEditingFormula(null);
      setIsCreating(false);
    } catch (error) {
      console.error("Erro ao salvar fórmula:", error);
      alert("Erro ao salvar fórmula");
    }
  };

  const handleCancelEdit = () => {
    setEditingFormula(null);
    setIsCreating(false);
  };

  const handleTestFormula = async (formula: TechnicalFormula) => {
    try {
      const variables = testVariables[formula.id] || {};
      // Preencher com valores padrão se não estiverem definidos
      const completeVariables: Record<string, number> = {};
      for (const [varKey, varConfig] of Object.entries(formula.variables)) {
        completeVariables[varKey] = variables[varKey] !== undefined ? variables[varKey] : varConfig.defaultValue;
      }
      
      const result = await TechnicalConfigService.calculateFormula(formula, completeVariables);
      setTestResults(prev => ({...prev, [formula.id]: result}));
    } catch (error) {
      console.error("Erro ao testar fórmula:", error);
      alert(error instanceof Error ? error.message : "Erro ao testar fórmula");
    }
  };

  const handleVariableChange = (formulaId: string, varName: string, value: string) => {
    setTestVariables(prev => ({
      ...prev,
      [formulaId]: {
        ...prev[formulaId],
        [varName]: parseFloat(value) || 0
      }
    }));
  };

  const handleFormulaChange = (field: keyof TechnicalFormula, value: string | boolean) => {
    if (editingFormula) {
      setEditingFormula({
        ...editingFormula,
        [field]: value
      });
    }
  };

  const handleVariableConfigChange = (varKey: string, field: string, value: string | number) => {
    if (editingFormula) {
      setEditingFormula({
        ...editingFormula,
        variables: {
          ...editingFormula.variables,
          [varKey]: {
            ...editingFormula.variables[varKey],
            [field]: value
          }
        }
      });
    }
  };

  const addVariable = () => {
    if (editingFormula) {
      const newVarKey = `var${Object.keys(editingFormula.variables).length + 1}`;
      setEditingFormula({
        ...editingFormula,
        variables: {
          ...editingFormula.variables,
          [newVarKey]: {
            name: '',
            description: '',
            unit: '',
            defaultValue: 0
          }
        }
      });
    }
  };

  const removeVariable = (varKey: string) => {
    if (editingFormula) {
      const newVariables = {...editingFormula.variables};
      delete newVariables[varKey];
      setEditingFormula({
        ...editingFormula,
        variables: newVariables
      });
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

  if (editingFormula) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-cormorant font-bold">
                {isCreating ? "Nova Fórmula Técnica" : "Editar Fórmula Técnica"}
              </h1>
              <p className="text-muted-foreground">
                {isCreating ? "Crie uma nova fórmula técnica" : "Edite os detalhes da fórmula técnica"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted/50 transition-colors"
              >
                <X className="h-4 w-4" />
                Cancelar
              </button>
              <button
                onClick={handleSaveFormula}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Save className="h-4 w-4" />
                Salvar
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nome da Fórmula
              </label>
              <input
                type="text"
                value={editingFormula.name}
                onChange={(e) => handleFormulaChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ex: Cálculo de Rendimento"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Categoria
              </label>
              <input
                type="text"
                value={editingFormula.category}
                onChange={(e) => handleFormulaChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ex: Pintura"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Descrição
              </label>
              <textarea
                value={editingFormula.description}
                onChange={(e) => handleFormulaChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                placeholder="Descreva a fórmula..."
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Expressão Matemática
              </label>
              <input
                type="text"
                value={editingFormula.formula}
                onChange={(e) => handleFormulaChange('formula', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono"
                placeholder="Ex: area * layers / yield"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Use os nomes das variáveis definidas abaixo na expressão
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Unidade do Resultado
              </label>
              <input
                type="text"
                value={editingFormula.result_unit}
                onChange={(e) => handleFormulaChange('result_unit', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ex: L"
              />
            </div>
            
            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingFormula.is_active}
                  onChange={(e) => handleFormulaChange('is_active', e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm text-foreground">Fórmula Ativa</span>
              </label>
            </div>
          </div>
          
          <div className="border-t border-border pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-cormorant font-bold">Variáveis</h2>
              <button
                onClick={addVariable}
                className="flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors text-sm"
              >
                <Plus className="h-4 w-4" />
                Adicionar Variável
              </button>
            </div>
            
            {Object.entries(editingFormula.variables).map(([varKey, variable]) => (
              <div key={varKey} className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 items-end">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Nome (ID)
                  </label>
                  <input
                    type="text"
                    value={varKey}
                    disabled
                    className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground"
                  />
                </div>
                
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Nome Amigável
                  </label>
                  <input
                    type="text"
                    value={variable.name}
                    onChange={(e) => handleVariableConfigChange(varKey, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ex: Área"
                  />
                </div>
                
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Descrição
                  </label>
                  <input
                    type="text"
                    value={variable.description}
                    onChange={(e) => handleVariableConfigChange(varKey, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ex: Área a ser pintada"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Unidade
                  </label>
                  <input
                    type="text"
                    value={variable.unit}
                    onChange={(e) => handleVariableConfigChange(varKey, 'unit', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ex: m²"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Valor Padrão
                  </label>
                  <input
                    type="number"
                    value={variable.defaultValue}
                    onChange={(e) => handleVariableConfigChange(varKey, 'defaultValue', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-12 flex justify-end">
                  <button
                    onClick={() => removeVariable(varKey)}
                    className="flex items-center gap-1 px-2 py-1 text-destructive hover:bg-destructive/10 rounded transition-colors text-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remover
                  </button>
                </div>
              </div>
            ))}
            
            {Object.keys(editingFormula.variables).length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma variável adicionada. Clique em "Adicionar Variável" para começar.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-cormorant font-bold">Configurações Técnicas</h1>
            <p className="text-muted-foreground">Gerencie as fórmulas de cálculo automático</p>
          </div>
          <button
            onClick={handleCreateFormula}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nova Fórmula
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {formulas.map((formula) => (
          <div key={formula.id} className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-cormorant font-bold flex items-center">
                  <Calculator className="h-5 w-5 mr-2 text-primary" />
                  {formula.name}
                  {!formula.is_active && (
                    <span className="ml-2 px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                      Inativa
                    </span>
                  )}
                </h2>
                <p className="text-muted-foreground mt-1">{formula.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm bg-secondary/20 text-secondary px-2 py-1 rounded">
                    {formula.category}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Resultado em: {formula.result_unit}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditFormula(formula)}
                  className="p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteFormula(formula.id)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4 mb-4 font-mono text-sm">
              <div className="text-muted-foreground mb-1">Fórmula:</div>
              <div className="font-medium">{formula.formula}</div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium text-foreground mb-2">Variáveis:</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(formula.variables).map(([varKey, variable]) => (
                  <div key={varKey} className="bg-background border border-border rounded-lg px-3 py-2 text-sm">
                    <div className="font-medium">{variable.name}</div>
                    <div className="text-muted-foreground text-xs">
                      {varKey} ({variable.unit}) = {variable.defaultValue}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-border pt-4">
              <h3 className="font-medium text-foreground mb-3">Testar Fórmula:</h3>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                {Object.entries(formula.variables).map(([varKey, variable]) => (
                  <div key={varKey} className="md:col-span-3">
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {variable.name} ({variable.unit})
                    </label>
                    <input
                      type="number"
                      value={testVariables[formula.id]?.[varKey] ?? variable.defaultValue}
                      onChange={(e) => handleVariableChange(formula.id, varKey, e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                ))}
                <div className="md:col-span-12 flex justify-end">
                  <button
                    onClick={() => handleTestFormula(formula)}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
                  >
                    <Play className="h-4 w-4" />
                    Calcular
                  </button>
                </div>
              </div>
              
              {testResults[formula.id] !== undefined && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-1">Resultado:</h4>
                  <div className="text-2xl font-bold text-primary">
                    {testResults[formula.id].toFixed(2)} {formula.result_unit}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {formulas.length === 0 && (
        <div className="text-center py-12">
          <FolderCog className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium">Nenhuma fórmula técnica encontrada</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Comece criando sua primeira fórmula técnica.
          </p>
          <div className="mt-6">
            <button
              onClick={handleCreateFormula}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors mx-auto"
            >
              <Plus className="h-4 w-4" />
              Criar Fórmula Técnica
            </button>
          </div>
        </div>
      )}
    </div>
  );
}