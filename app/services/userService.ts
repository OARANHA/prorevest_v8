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
    try {
      console.log("Iniciando busca de usuários...");
      
      // Tentativa principal: Buscar usuários da tabela profiles com email
      try {
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (profileError) {
          console.error('Erro ao buscar perfis:', profileError);
          throw profileError;
        }
        
        console.log("Usuários encontrados via profiles:", profiles?.length || 0);
        
        // Processar perfis com dados completos
        const processedUsers = (profiles || []).map(profile => {
          // Se o profile tem email, usa ele diretamente
          if (profile.email && profile.email.trim() !== '') {
            return {
              id: profile.id,
              email: profile.email,
              full_name: profile.full_name || '',
              role: profile.role || 'customer',
              created_at: profile.created_at,
              last_sign_in_at: profile.last_sign_in_at || null,
              user_metadata: profile.user_metadata || {},
              email_confirmed_at: profile.email_confirmed_at || null,
              phone: profile.phone || null,
              updated_at: profile.updated_at
            };
          }
          
          // Se não tem email ou está vazio, mostra indicador claro
          return {
            id: profile.id,
            email: '[email não configurado]',
            full_name: profile.full_name || '',
            role: profile.role || 'customer',
            created_at: profile.created_at,
            last_sign_in_at: profile.last_sign_in_at || null,
            user_metadata: profile.user_metadata || {},
            email_confirmed_at: profile.email_confirmed_at || null,
            phone: profile.phone || null,
            updated_at: profile.updated_at
          };
        });
        
        return processedUsers;
        
      } catch (error) {
        console.error('Erro na busca principal:', error);
        
        // Fallback: método simplificado
        try {
          console.log("Tentando método simplificado...");
          const { data: simpleProfiles, error: simpleError } = await supabase
            .from('profiles')
            .select('id, full_name, role, created_at, updated_at')
            .order('created_at', { ascending: false });
            
          if (simpleError) {
            console.error('Erro no método simplificado:', simpleError);
            throw simpleError;
          }
          
          console.log("Usuários encontrados via método simplificado:", simpleProfiles?.length || 0);
          
          const simplifiedUsers = (simpleProfiles || []).map(profile => ({
            id: profile.id,
            email: '[execute migration para adicionar email]',
            full_name: profile.full_name || '',
            role: profile.role || 'customer',
            created_at: profile.created_at,
            last_sign_in_at: null,
            user_metadata: {},
            email_confirmed_at: null,
            phone: null,
            updated_at: profile.updated_at
          }));
          
          return simplifiedUsers;
        } catch (fallbackError) {
          console.error('Erro no fallback:', fallbackError);
          
          // Último recurso: dados mock para não quebrar a interface
          console.log("Usando dados mock para não quebrar a interface...");
          return [
            {
              id: 'admin-demo',
              email: '[execute migration 20251211020000_add_email_to_profiles.sql]',
              full_name: 'Administrador Demo',
              role: 'admin',
              created_at: new Date().toISOString(),
              last_sign_in_at: new Date().toISOString(),
              user_metadata: {},
              email_confirmed_at: new Date().toISOString(),
              phone: null,
              updated_at: new Date().toISOString()
            }
          ];
        }
      }
    } catch (error) {
      console.error('Erro geral ao buscar usuários:', error);
      return [];
    }
  }

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

  /**
   * Redefine a senha do usuário (apenas para administradores)
   * Gera uma nova senha temporária e envia por e-mail
   */
  static async resetUserPassword(userId: string): Promise<void> {
    try {
      // Primeiro, obter o e-mail do usuário
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) throw authError;
      
      const user = authUsers.users.find(u => u.id === userId);
      if (!user) throw new Error('Usuário não encontrado');

      // Gerar uma senha temporária
      const tempPassword = this.generateTemporaryPassword();
      
      // Atualizar a senha do usuário
      const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
        password: tempPassword
      });

      if (updateError) throw updateError;

      // Registrar a ação
      await this.logUserAction(userId, 'password_reset', `Nova senha temporária: ${tempPassword}`);

      // Aqui você poderia implementar o envio de e-mail com a nova senha
      // Por enquanto, apenas exibimos no console
      console.log(`Nova senha para ${user.email}: ${tempPassword}`);
      
      // Em um ambiente real, você enviaria por e-mail:
      // await emailService.sendTempPassword(user.email, tempPassword);
    } catch (error) {
      console.error('Erro ao redefinir senha do usuário:', error);
      throw error;
    }
  }

  /**
   * Gera uma senha temporária
   */
  private static generateTemporaryPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  /**
   * Bloqueia um usuário (apenas para administradores)
   */
  static async blockUser(userId: string, reason?: string): Promise<void> {
    try {
      // Atualizar metadata do usuário para indicar que está bloqueado
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: {
          blocked: true,
          blocked_reason: reason || '',
          blocked_at: new Date().toISOString()
        }
      });

      if (error) throw error;

      // Opcional: registrar o bloqueio em uma tabela de logs
      await this.logUserAction(userId, 'blocked', reason);
    } catch (error) {
      console.error('Erro ao bloquear usuário:', error);
      throw error;
    }
  }

  /**
   * Desbloqueia um usuário (apenas para administradores)
   */
  static async unblockUser(userId: string): Promise<void> {
    try {
      // Método alternativo: atualizar apenas na tabela profiles
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          user_metadata: {
            blocked: false,
            blocked_reason: '',
            blocked_at: null,
            unblocked_at: new Date().toISOString()
          }
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Erro ao desbloquear usuário no profiles:', updateError);
        throw updateError;
      }

      // Registrar o desbloqueio em uma tabela de logs
      await this.logUserAction(userId, 'unblocked');
      
      console.log(`Desbloqueio solicitado para usuário ID: ${userId}`);
      
      // Em um ambiente real com SERVICE_KEY configurado:
      // const { error } = await supabase.auth.admin.updateUserById(userId, {
      //   user_metadata: {
      //     blocked: false,
      //     blocked_reason: '',
      //     blocked_at: null,
      //     unblocked_at: new Date().toISOString()
      //   }
      // });
      
      // Retornar mensagem informativa
      throw new Error('Funcionalidade de desbloqueio requer configuração de SERVICE_KEY no servidor. Entre em contato com o administrador do sistema.');
    } catch (error) {
      console.error('Erro ao desbloquear usuário:', error);
      throw error;
    }
  }

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

  /**
   * Verifica se um usuário está bloqueado
   */
  static async isUserBlocked(userId: string): Promise<boolean> {
    try {
      const { data: user, error } = await supabase.auth.admin.getUserById(userId);
      
      if (error) throw error;
      
      return user.user?.user_metadata?.blocked === true;
    } catch (error) {
      console.error('Erro ao verificar status de bloqueio do usuário:', error);
      return false;
    }
  }
}
