import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export type Project = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type ProjectItem = {
  id: string;
  project_id: string;
  variant_id: string;
  notes: string;
  created_at: string;
};

export type ProjectWithItems = Project & {
  project_items: ProjectItem[];
};

export class ProjectService {
  static async getProjects(userId: string): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  static async getProjectWithItems(projectId: string): Promise<ProjectWithItems | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_items(*)
        `)
        .eq('id', projectId)
        .single();

      if (error) throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching project with items:', error);
      throw error;
    }
  }

  static async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...project, updated_at: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  static async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  static async deleteProject(id: string): Promise<void> {
    try {
      // First delete all project items
      const { error: itemsError } = await supabase
        .from('project_items')
        .delete()
        .eq('project_id', id);

      if (itemsError) throw itemsError;

      // Then delete the project
      const { error: projectError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (projectError) throw projectError;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  static async addProjectItem(item: Omit<ProjectItem, 'id' | 'created_at'>): Promise<ProjectItem> {
    try {
      const { data, error } = await supabase
        .from('project_items')
        .insert([{ ...item, created_at: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding project item:', error);
      throw error;
    }
  }

  static async removeProjectItem(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('project_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing project item:', error);
      throw error;
    }
  }
}