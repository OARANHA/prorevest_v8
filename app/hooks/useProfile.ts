import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export type Profile = {
  id: string;
  full_name: string;
  company_name: string;
  role: string;
  phone?: string;
  cpf?: string;
  cnpj?: string;
  created_at: string;
  updated_at: string;
};

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
      setProfile(null);
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles') // Corrigido: usando a tabela 'profiles' em vez de 'user_profiles'
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
    } catch (err) {
      setError((err as Error).message);
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles') // Corrigido: usando a tabela 'profiles' em vez de 'user_profiles'
        .update(updates)
        .eq('id', user?.id)
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data);
      return { data, error: null };
    } catch (err) {
      setError((err as Error).message);
      console.error('Error updating profile:', err);
      return { data: null, error: (err as Error).message };
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles') // Corrigido: usando a tabela 'profiles' em vez de 'user_profiles'
        .insert([
          {
            id: user?.id,
            ...profileData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data);
      return { data, error: null };
    } catch (err) {
      setError((err as Error).message);
      console.error('Error creating profile:', err);
      return { data: null, error: (err as Error).message };
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    createProfile
  };
}