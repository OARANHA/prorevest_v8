import { supabase } from '../lib/supabaseClient';

export type Design = {
  id: string;
  project_id: string;
  name: string;
  original_image_url: string;
  mime_type: string;
  designer_name?: string | null;
  work_type?: 'Parede' | 'Piso' | 'Aberturas' | null;
  created_at: string;
  updated_at: string;
};

export type DesignEdit = {
  id: string;
  design_id: string;
  prompt: string | null;
  image_url: string;
  created_at: string;
};

export type DesignWithEdits = Design & { edits: DesignEdit[] };

export class DesignService {
  static async getDesigns(projectId: string): Promise<Design[]> {
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  static async getDesignWithEdits(designId: string): Promise<DesignWithEdits | null> {
    const { data, error } = await supabase
      .from('designs')
      .select('*, design_edits(*)')
      .eq('id', designId)
      .single();
    if (error) throw error;
    if (!data) return null;
    const edits = (data.design_edits || []) as DesignEdit[];
    const { design_edits, ...design } = data as any;
    return { ...(design as Design), edits };
  }

  static async createDesign(payload: Omit<Design, 'id' | 'created_at' | 'updated_at'>): Promise<Design> {
    const { data, error } = await supabase
      .from('designs')
      .insert([{ ...payload, updated_at: new Date().toISOString() }])
      .select()
      .single();
    if (error) throw error;
    return data!;
  }

  static async updateDesign(id: string, updates: Partial<Design>): Promise<Design> {
    const { data, error } = await supabase
      .from('designs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data!;
  }

  static async deleteDesign(id: string): Promise<void> {
    const { error } = await supabase
      .from('designs')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  static async addEdit(payload: Omit<DesignEdit, 'id' | 'created_at'>): Promise<DesignEdit> {
    const { data, error } = await supabase
      .from('design_edits')
      .insert([{ ...payload, created_at: new Date().toISOString() }])
      .select()
      .single();
    if (error) throw error;
    return data!;
  }

  static async getEdits(designId: string): Promise<DesignEdit[]> {
    const { data, error } = await supabase
      .from('design_edits')
      .select('*')
      .eq('design_id', designId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  }
}