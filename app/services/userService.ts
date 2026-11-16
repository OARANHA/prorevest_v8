import { supabase } from '../lib/supabaseClient';

export type UserProfile = {
  id: string;
  full_name: string | null;
  company_name: string | null;
  email: string | null;
  role: string;
  created_at: string | null;
};

// Esta camada é somente leitura. Ações privilegiadas de usuários e perfis
// exigem endpoints server-side com autorização verificada.
export class UserService {
  static async getAllUsers(): Promise<UserProfile[]> {
    if (!supabase) {
      throw new Error('Supabase não configurado');
    }

    const pageSize = 500;
    const profiles: UserProfile[] = [];

    for (let offset = 0; ; offset += pageSize) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, company_name, email, role, created_at')
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })
        .range(offset, offset + pageSize - 1);

      if (error) throw error;
      if (!data) throw new Error('O Supabase não retornou os perfis solicitados.');

      profiles.push(...data.map((row) => ({
        id: row.id,
        full_name: row.full_name ?? null,
        company_name: row.company_name ?? null,
        email: row.email ?? null,
        role: row.role ?? 'unknown',
        created_at: row.created_at ?? null,
      })));

      if (data.length < pageSize) break;
    }

    return profiles;
  }
}
