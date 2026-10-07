import { supabase } from '../lib/supabaseClient';

export type DosageFormula = {
  id: string;
  quote_id: string;
  product_variant_id: string;
  base_percentage: number;
  pigment_a_percentage: number;
  pigment_b_percentage: number;
  pigment_c_percentage: number;
  created_at: string;
  updated_at: string;
};

export type DosageMachine = {
  id: string;
  name: string;
  ip_address: string;
  status: 'online' | 'offline' | 'maintenance';
  last_connected: string;
  created_at: string;
};

export class DosageService {
  static async sendFormulaToMachine(formula: Omit<DosageFormula, 'id' | 'created_at' | 'updated_at'>): Promise<DosageFormula> {
    try {
      // Salvar a fórmula no banco de dados
      const { data, error } = await supabase
        .from('dosage_formulas')
        .insert([{ ...formula, updated_at: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;
      
      // Em uma implementação real, aqui enviaríamos a fórmula para a máquina de dosagem
      // via API ou arquivo CSV/XML
      console.log('Enviando fórmula para máquina de dosagem:', data);
      
      // Simular envio para máquina (em uma implementação real, isso seria uma chamada API)
      // Por exemplo: await fetch(`http://${machineIP}/api/formula`, { method: 'POST', body: JSON.stringify(data) });
      
      return data;
    } catch (error) {
      console.error('Error sending formula to machine:', error);
      throw error;
    }
  }

  static async getDosageMachines(): Promise<DosageMachine[]> {
    try {
      const { data, error } = await supabase
        .from('dosage_machines')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching dosage machines:', error);
      throw error;
    }
  }

  static async getFormulaByQuoteId(quoteId: string): Promise<DosageFormula | null> {
    try {
      const { data, error } = await supabase
        .from('dosage_formulas')
        .select('*')
        .eq('quote_id', quoteId)
        .single();

      if (error) throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching formula by quote ID:', error);
      throw error;
    }
  }

  static async getAllFormulas(): Promise<DosageFormula[]> {
    try {
      const { data, error } = await supabase
        .from('dosage_formulas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all formulas:', error);
      throw error;
    }
  }

  static async updateMachineStatus(machineId: string, status: 'online' | 'offline' | 'maintenance'): Promise<DosageMachine> {
    try {
      const { data, error } = await supabase
        .from('dosage_machines')
        .update({ 
          status,
          last_connected: new Date().toISOString()
        })
        .eq('id', machineId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating machine status:', error);
      throw error;
    }
  }
}