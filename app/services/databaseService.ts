import { supabase } from '../lib/supabaseClient';

export class DatabaseService {
  static async checkTableExists(tableName: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_name', tableName)
        .limit(1);

      if (error) throw error;
      
      return data.length > 0;
    } catch (error) {
      console.error(`Error checking if table ${tableName} exists:`, error);
      return false;
    }
  }

  static async getTableNames(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

      if (error) throw error;
      
      return data.map(table => table.table_name);
    } catch (error) {
      console.error('Error fetching table names:', error);
      return [];
    }
  }

  // Operações de DDL, bootstrap de admin e backfill são executadas apenas
  // por migração revisada no banco oficial; nunca por RPC no navegador.
}
