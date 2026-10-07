import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PermissionService } from '../services/permissionService';

export const usePermissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPermissions = async () => {
      if (!user) {
        setPermissions([]);
        setLoading(false);
        return;
      }

      try {
        const userPermissions = await PermissionService.getUserPermissions(user.id);
        setPermissions(userPermissions.map(p => p.name));
      } catch (error) {
        console.error('Erro ao carregar permissões:', error);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, [user]);

  const hasPermission = (permissionName: string): boolean => {
    // Administradores têm todas as permissões
    if (user?.role === 'admin') return true;
    return permissions && Array.isArray(permissions) && permissions.includes(permissionName);
  };

  const hasAnyPermission = (permissionNames: string[]): boolean => {
    // Administradores têm todas as permissões
    if (user?.role === 'admin') return true;
    return permissions && Array.isArray(permissions) && permissionNames.some(name => permissions.includes(name));
  };

  const hasAllPermissions = (permissionNames: string[]): boolean => {
    // Administradores têm todas as permissões
    if (user?.role === 'admin') return true;
    return permissions && Array.isArray(permissions) && permissionNames.every(name => permissions.includes(name));
  };

  const canAccessModule = (module: string): boolean => {
    // Administradores têm acesso a todos os módulos
    if (user?.role === 'admin') return true;
    
    // Verifica se o usuário tem alguma permissão do módulo
    const modulePermissions = permissions.filter(p => p && p.startsWith(module));
    return modulePermissions.length > 0;
  };

  return {
    permissions,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessModule
  };
};