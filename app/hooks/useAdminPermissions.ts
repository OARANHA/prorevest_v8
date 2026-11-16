import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * Hook para verificar permissões administrativas do usuário
 * Baseado em padrões de segurança documentados no CLI Agent Knowledge
 */
export function useAdminPermissions() {
  const { user, isAdmin, loading } = useAuth();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [permissionsLoading, setPermissionsLoading] = useState(true);
  
  useEffect(() => {
    const checkSuperAdmin = async () => {
      
      if (!user || !isAdmin) {
        console.log('[ADMIN_PERMISSIONS] Usuário não é admin ou não está logado');
        setIsSuperAdmin(false);
        setPermissionsLoading(false);
        return;
      }

      try {
        // Verificar se é super_admin no Supabase
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();


        if (!error && profile) {
          const isSuper = profile.role === 'super_admin';
          setIsSuperAdmin(isSuper);
        } else {
          // Metadados do usuario sao editaveis pelo proprio titular.
          // Sem perfil administrativo confiavel, negar o privilegio.
          setIsSuperAdmin(false);
        }
      } catch (error) {
        console.error('[ADMIN_PERMISSIONS] Erro ao verificar permissões de super admin:', error);
        // Fallback seguro
        setIsSuperAdmin(false);
      } finally {
        setPermissionsLoading(false);
      }
    };

    checkSuperAdmin();
  }, [user, isAdmin]);

  /**
   * Verifica se o usuário pode editar produtos
   * @returns boolean - true se admin ou super_admin
   */
  const canEditProducts = (): boolean => {
    return isAdmin || isSuperAdmin;
  };

  /**
   * Verifica se o usuário pode acessar área administrativa
   * @returns boolean - true se admin ou super_admin
   */
  const canAccessAdmin = (): boolean => {
    return isAdmin || isSuperAdmin;
  };

  /**
   * Verifica se o usuário é super admin
   * @returns boolean - true apenas para super_admin
   */
  const isSuperAdminUser = (): boolean => {
    return isSuperAdmin;
  };

  /**
   * Obtém o nível de permissão do usuário
   * @returns string - 'user', 'admin', 'super_admin'
   */
  const getPermissionLevel = (): string => {
    if (isSuperAdmin) return 'super_admin';
    if (isAdmin) return 'admin';
    return 'user';
  };

  return {
    // Estados
    isAdmin,
    isSuperAdmin,
    loading: loading || permissionsLoading,
    
    // Métodos de verificação
    canEditProducts,
    canAccessAdmin,
    isSuperAdminUser,
    getPermissionLevel,
    
    // Informações do usuário
    userId: user?.id || null,
    userEmail: user?.email || null,
  };
}
