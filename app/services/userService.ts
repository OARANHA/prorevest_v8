import { supabase } from '../lib/supabaseClient';

export type UserRole = 'admin' | 'professional' | 'customer';

export type User = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  last_sign_in_at: string | null;
};

export type UserProfile = {
  id: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export class UserService {
  /**
   * Obtém perfil do usuário atual
   * Requer autenticação via Supabase
   */
  static async getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return null;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Perfil não encontrado, criar automaticamente
          return this.createUserProfile(session.user.id, session.user.user_metadata?.full_name);
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      throw error;
    }
  }

  /**
   * Cria perfil de usuário
   */
  static async createUserProfile(userId: string, fullName?: string): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: fullName || null,
          role: 'customer' as UserRole
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar perfil do usuário:', error);
      throw error;
    }
  }

  /**
   * Atualiza perfil do usuário
   */
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar perfil do usuário:', error);
      throw error;
    }
  }

  /**
   * Verifica se usuário é administrador
   */
  static async isAdmin(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data?.role === 'admin';
    } catch (error) {
      console.error('Erro ao verificar papel do usuário:', error);
      return false;
    }
  }

  /**
   * Obtém usuários (apenas para administradores)
   * NOTA: Esta função requer RLS policies adequadas no Supabase
   */
  static async getAllUsers(): Promise<any[]> {
    if (!supabase) throw new Error('Serviço de usuários indisponível: Supabase não configurado.');

    // O PostgREST pode limitar os resultados; percorrer as páginas
    // evita confundir o limite de retorno com o total acessível por RLS.
    const pageSize = 500;
    const users: any[] = [];

    for (let offset = 0; ; offset += pageSize) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })
        .range(offset, offset + pageSize - 1);

      if (error) throw error;
      if (!data) throw new Error('O servidor não retornou os perfis solicitados.');

      users.push(...data.map(profile => ({
        id: profile.id,
        email: typeof profile.email === 'string' && profile.email.trim()
          ? profile.email.trim()
          : null,
        full_name: profile.full_name || '',
        role: profile.role || 'customer',
        created_at: profile.created_at || null,
        updated_at: profile.updated_at || null,
      })));

      if (data.length < pageSize) break;
    }

    return users;
  }

  // Perfis visíveis por RLS não equivalem necessariamente ao total de auth.users.

  /**
   * Obtém usuário por ID (apenas para administradores)
   */
  static async getUserById(id: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Usuário não encontrado
        }
        console.error('Erro ao buscar usuário (verifique permissões):', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }

  /**
   * Atualiza papel do usuário (apenas para administradores)
   */
  static async updateUserRole(userId: string, role: UserRole): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          role,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar papel do usuário:', error);
      throw error;
    }
  }

  /**
   * Busca usuários por termo (apenas para administradores)
   */
  static async searchUsers(searchTerm: string): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .order('full_name');

      if (error) {
        console.error('Erro ao buscar usuários:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }

  // Ações administrativas de Auth dependem de um endpoint no servidor
  // com autorização verificada e não devem usar operações admin no navegador.

  /**
   * Registra ações do usuário em um log
   */
  static async logUserAction(userId: string, action: string, details?: string): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase
        .from('user_action_logs')
        .insert({
          user_id: userId,
          action,
          details,
          performed_by: session?.user?.id || null,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erro ao registrar ação do usuário:', error);
        // Não lançar erro para não interromper o fluxo principal
      }
    } catch (error) {
      console.error('Erro ao registrar log de ação:', error);
      // Não lançar erro para não interromper o fluxo principal
    }
  }

  /**
   * Obtém o histórico de ações de um usuário
   */
  static async getUserActionHistory(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_action_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao obter histórico de ações do usuário:', error);
      throw error;
    }
  }

  // Status de bloqueio exige consulta administrativa verificada no servidor.

}
