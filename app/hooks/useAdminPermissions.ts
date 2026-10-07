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
      console.log('[ADMIN_PERMISSIONS] Iniciando verificação de permissões');
      console.log('[ADMIN_PERMISSIONS] User:', user?.id, 'IsAdmin:', isAdmin);
      
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

        console.log('[ADMIN_PERMISSIONS] Profile do usuário:', profile, 'Error:', error);

        if (!error && profile) {
          const isSuper = profile.role === 'super_admin';
          console.log('[ADMIN_PERMISSIONS] Role encontrado:', profile.role, 'IsSuperAdmin:', isSuper);
          setIsSuperAdmin(isSuper);
        } else {
          // Fallback: verificar metadata do usuário
          const isSuper = user.user_metadata?.role === 'super_admin';
          console.log('[ADMIN_PERMISSIONS] Fallback para metadata, IsSuperAdmin:', isSuper);
          setIsSuperAdmin(isSuper);
        }
      } catch (error) {
        console.error('[ADMIN_PERMISSIONS] Erro ao verificar permissões de super admin:', error);
        // Fallback seguro
        setIsSuperAdmin(false);
      } finally {
        setPermissionsLoading(false);
        console.log('[ADMIN_PERMISSIONS] Verificação finalizada. IsSuperAdmin:', isSuperAdmin);
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
