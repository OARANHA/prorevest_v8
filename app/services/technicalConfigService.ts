import { supabase } from '../lib/supabaseClient';

export type TechnicalFormula = {
  id: string;
  name: string;
  description: string;
  formula: string; // Expressão matemática
  variables: Record<string, { 
    name: string; 
    description: string; 
    unit: string; 
    defaultValue: number;
    minValue?: number;
    maxValue?: number;
  }>;
  result_unit: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type FormulaVariable = {
  id: string;
  formula_id: string;
  name: string;
  description: string;
  unit: string;
  default_value: number;
  min_value: number | null;
  max_value: number | null;
  created_at: string;
};

export type FormulaCategory = {
  id: string;
  name: string;
  description: string;
  created_at: string;
};

export class TechnicalConfigService {
  static async getActiveFormulas(): Promise<TechnicalFormula[]> {
    try {
      const { data, error } = await supabase
        .from('technical_formulas')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching active formulas:', error);
      throw error;
    }
  }

  static async getAllFormulas(): Promise<TechnicalFormula[]> {
    try {
      const { data, error } = await supabase
        .from('technical_formulas')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all formulas:', error);
      throw error;
    }
  }

  static async getFormulaById(id: string): Promise<TechnicalFormula | null> {
    try {
      const { data, error } = await supabase
        .from('technical_formulas')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching formula by ID:', error);
      throw error;
    }
  }

  static async createFormula(formula: Omit<TechnicalFormula, 'id' | 'created_at' | 'updated_at'>): Promise<TechnicalFormula> {
    try {
      const { data, error } = await supabase
        .from('technical_formulas')
        .insert([{ ...formula, updated_at: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating formula:', error);
      throw error;
    }
  }

  static async updateFormula(id: string, formula: Partial<TechnicalFormula>): Promise<TechnicalFormula> {
    try {
      const { data, error } = await supabase
        .from('technical_formulas')
        .update({ ...formula, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating formula:', error);
      throw error;
    }
  }

  static async deleteFormula(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('technical_formulas')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting formula:', error);
      throw error;
    }
  }

  static async getFormulaCategories(): Promise<FormulaCategory[]> {
    try {
      const { data, error } = await supabase
        .from('formula_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching formula categories:', error);
      throw error;
    }
  }

  static async calculateFormula(formula: TechnicalFormula, variables: Record<string, number>): Promise<number> {
    try {
      // Substituir as variáveis na fórmula
      let expression = formula.formula;
      
      // Substituir cada variável na expressão
      for (const [varName, varValue] of Object.entries(variables)) {
        const regex = new RegExp(`\\b${varName}\\b`, 'g');
        expression = expression.replace(regex, varValue.toString());
      }
      
      // Avaliar a expressão matemática
      // Nota: Em produção, seria melhor usar uma biblioteca de avaliação segura
      // como math.js para evitar vulnerabilidades de segurança
      const result = Function(`"use strict"; return (${expression})`)();
      return result;
    } catch (error) {
      console.error('Error calculating formula:', error);
      throw new Error(`Erro ao calcular fórmula: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  static async getSampleFormulas(): Promise<TechnicalFormula[]> {
    return [
      {
        id: '1',
        name: 'Cálculo de Rendimento de Tinta',
        description: 'Calcula a quantidade de tinta necessária baseada na área e número de demãos',
        formula: 'area * layers / yield',
        variables: {
          area: { 
            name: 'Área', 
            description: 'Área a ser pintada', 
            unit: 'm²', 
            defaultValue: 50,
            minValue: 0
          },
          layers: { 
            name: 'Demãos', 
            description: 'Número de demãos', 
            unit: 'un', 
            defaultValue: 2,
            minValue: 1
          },
          yield: { 
            name: 'Rendimento', 
            description: 'Rendimento do produto', 
            unit: 'm²/L', 
            defaultValue: 10,
            minValue: 0.1
          }
        },
        result_unit: 'L',
        category: 'Pintura',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Cálculo de Diluição',
        description: 'Calcula a proporção de diluente necessária',
        formula: 'base * dilution_ratio / 100',
        variables: {
          base: { 
            name: 'Base', 
            description: 'Quantidade de tinta base', 
            unit: 'L', 
            defaultValue: 10,
            minValue: 0
          },
          dilution_ratio: { 
            name: 'Proporção de Diluição', 
            description: 'Percentual de diluição', 
            unit: '%', 
            defaultValue: 10,
            minValue: 0,
            maxValue: 100
          }
        },
        result_unit: 'L',
        category: 'Preparação',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }
}