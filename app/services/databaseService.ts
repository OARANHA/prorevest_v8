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

  static async createDosageTables(): Promise<void> {
    try {
      // Verificar se a tabela de máquinas de dosagem existe
      const machinesTableExists = await this.checkTableExists('dosage_machines');
      
      if (!machinesTableExists) {
        // Criar tabela de máquinas de dosagem
        const { error: machineError } = await supabase.rpc('execute_sql', {
          sql: `
            CREATE TABLE IF NOT EXISTS dosage_machines (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              ip_address VARCHAR(45) NOT NULL,
              status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'maintenance')),
              last_connected TIMESTAMP WITH TIME ZONE,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `
        });
        
        if (machineError) throw machineError;
        console.log('Tabela dosage_machines criada com sucesso');
      }

      // Verificar se a tabela de fórmulas de dosagem existe
      const formulasTableExists = await this.checkTableExists('dosage_formulas');
      
      if (!formulasTableExists) {
        // Criar tabela de fórmulas de dosagem
        const { error: formulaError } = await supabase.rpc('execute_sql', {
          sql: `
            CREATE TABLE IF NOT EXISTS dosage_formulas (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              quote_id UUID REFERENCES quotes(id),
              product_variant_id UUID REFERENCES product_variants(id),
              base_percentage DECIMAL(5,2) NOT NULL,
              pigment_a_percentage DECIMAL(5,2) NOT NULL,
              pigment_b_percentage DECIMAL(5,2) NOT NULL,
              pigment_c_percentage DECIMAL(5,2) NOT NULL,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `
        });
        
        if (formulaError) throw formulaError;
        console.log('Tabela dosage_formulas criada com sucesso');
      }
    } catch (error) {
      console.error('Error creating dosage tables:', error);
      throw error;
    }
  }

  static async initSuperAdmin() {
    try {
      // Verificar se já existe um usuário admin
      const { data: existingAdmin, error: selectError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .limit(1);

      if (selectError) throw selectError;

      // Se já existe um admin, não criar outro
      if (existingAdmin && existingAdmin.length > 0) {
        console.log('Já existe um usuário administrador cadastrado');
        return;
      }

      // Criar o super administrador apenas se não houver nenhum admin
      console.log('Criando super administrador...');
      
      const { data: { user }, error: userError } = await supabase.auth.signUp({
        email: 'admin@tintaszanai.com.br',
        password: 'SenhaAdmin123!',
      });

      if (userError) throw userError;
      if (!user) throw new Error("Usuário não criado.");

      // Atualizar o perfil do usuário para definir como admin
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id);

      if (profileError) throw profileError;
      
      console.log('Super administrador criado com sucesso');
    } catch (error) {
      console.error('Error initializing superadmin:', error);
      throw error;
    }
  }

  // Função para criar perfis para todos os usuários que não têm perfil
  static async createMissingProfiles() {
    try {
      console.log('Verificando usuários sem perfil...');
      
      // Obter todos os usuários do auth que não têm perfil
      const { data: users, error: usersError } = await supabase.rpc('execute_sql', {
        sql: `
          SELECT id, email, raw_user_meta_data->>'full_name' as full_name
          FROM auth.users
          WHERE id NOT IN (SELECT id FROM profiles)
        `
      });

      if (usersError) throw usersError;

      if (users && users.length > 0) {
        console.log(`Encontrados ${users.length} usuários sem perfil. Criando perfis...`);
        
        // Criar perfis para esses usuários
        for (const user of users) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              full_name: user.full_name || '',
              role: 'customer' // Definir como cliente por padrão
            });

          if (profileError) {
            console.error(`Erro ao criar perfil para usuário ${user.id}:`, profileError);
          } else {
            console.log(`Perfil criado para usuário ${user.id}`);
          }
        }
      } else {
        console.log('Nenhum usuário sem perfil encontrado');
      }
    } catch (error) {
      console.error('Error creating missing profiles:', error);
      throw error;
    }
  }
}