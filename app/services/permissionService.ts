import { supabase } from '../lib/supabaseClient';

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
}

export interface UserPermission {
  id: string;
  user_id: string;
  permission_id: string;
  granted_by: string;
  granted_at: string;
}

export class PermissionService {
  // Get all permissions
  static async getAllPermissions(): Promise<Permission[]> {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .order('module', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Get all modules
  static async getAllModules(): Promise<Module[]> {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Get user permissions
  static async getUserPermissions(userId: string): Promise<Permission[]> {
    const { data, error } = await supabase
      .rpc('get_user_permissions', { user_uuid: userId });

    if (error) throw error;
    return data || [];
  }

  // Get accessible modules for user
  static async getUserModules(userId: string): Promise<Module[]> {
    const { data, error } = await supabase
      .rpc('get_user_modules', { user_uuid: userId });

    if (error) throw error;
    return data || [];
  }

  // Check if user has specific permission
  static async userHasPermission(userId: string, permissionName: string): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('user_has_permission', { 
        user_uuid: userId, 
        permission_name: permissionName 
      });

    if (error) throw error;
    return data || false;
  }

  // Grant permission to user
  static async grantPermission(
    userId: string, 
    permissionId: string, 
    grantedBy: string
  ): Promise<UserPermission> {
    const { data, error } = await supabase
      .from('user_permissions')
      .insert({
        user_id: userId,
        permission_id: permissionId,
        granted_by: grantedBy
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Revoke permission from user
  static async revokePermission(userId: string, permissionId: string): Promise<void> {
    const { error } = await supabase
      .from('user_permissions')
      .delete()
      .eq('user_id', userId)
      .eq('permission_id', permissionId);

    if (error) throw error;
  }

  // Get permissions by module
  static async getPermissionsByModule(module: string): Promise<Permission[]> {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .eq('module', module)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Grant multiple permissions to user
  static async grantMultiplePermissions(
    userId: string, 
    permissionIds: string[], 
    grantedBy: string
  ): Promise<UserPermission[]> {
    const permissions = permissionIds.map(permissionId => ({
      user_id: userId,
      permission_id: permissionId,
      granted_by: grantedBy
    }));

    const { data, error } = await supabase
      .from('user_permissions')
      .upsert(permissions, { onConflict: 'user_id,permission_id' })
      .select();

    if (error) throw error;
    return data || [];
  }

  // Revoke all permissions from user
  static async revokeAllPermissions(userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_permissions')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  }

  // Get user permissions with details
  static async getUserPermissionsWithDetails(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('user_permissions')
      .select(`
        *,
        permissions (
          id,
          name,
          description,
          module
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  }
}