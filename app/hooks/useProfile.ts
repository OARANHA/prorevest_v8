import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

// Esquema confirmado no Supabase oficial em 2026-11-16.
// Campos de autenticação/permissão nunca são editáveis nesta API.
export type Profile = {
  id: string;
  full_name: string | null;
  company_name: string | null;
  email: string | null;
  role: string;
  created_at: string | null;
};

export type EditableProfile = Pick<Profile, 'full_name' | 'company_name'>;

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user?.id || !supabase) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error: queryError } = await supabase
        .from('profiles')
        .select('id, full_name, company_name, email, role, created_at')
        .eq('id', user.id)
        .maybeSingle();

      if (queryError) throw queryError;
      setProfile(data ?? null);
      setError(null);
    } catch (caught) {
      setProfile(null);
      setError(caught instanceof Error ? caught.message : 'Erro ao consultar o perfil.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProfile();
  }, [user?.id]);

  const updateProfile = async (updates: EditableProfile) => {
    if (!user?.id || !supabase) {
      return { data: null, error: 'Sessão indisponível.' };
    }

    setLoading(true);
    try {
      // Lista explícita de colunas editáveis impede alterações a role/id/email,
      // inclusive se o chamador inserir propriedades inesperadas no objeto.
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: updates.full_name,
          company_name: updates.company_name,
        })
        .eq('id', user.id)
        .select('id, full_name, company_name, email, role, created_at')
        .single();

      if (updateError) throw updateError;
      setProfile(data);
      setError(null);
      return { data, error: null };
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Erro ao atualizar o perfil.';
      setError(message);
      return { data: null, error: message };
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, fetchProfile, updateProfile };
}
