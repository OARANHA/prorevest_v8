import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import type {
  User,
  Session,
  AuthResponse,
  AuthTokenResponsePassword
} from '@supabase/supabase-js';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<AuthTokenResponsePassword>;
  signUp: (email: string, password: string, fullName: string) => Promise<AuthResponse>;
  signOut: () => Promise<{ error: Error | null }>;
  loading: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);

  // Nunca gravar registros de Auth no navegador. A criação obrigatória de
  // public.profiles pertence ao gatilho revisado do banco, não ao callback.
  useEffect(() => {
    let disposed = false;
    let authEventReceived = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (disposed) return;
      authEventReceived = true;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setSessionReady(true);
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (disposed) return;
      if (error) {
        console.error('Erro ao recuperar a sessão:', error.message);
      }
      if (!authEventReceived) {
        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
      }
      setSessionReady(true);
    }).catch((error) => {
      if (!disposed) {
        console.error('Não foi possível recuperar a sessão:', error);
        setSessionReady(true);
      }
    });

    return () => {
      disposed = true;
      subscription.unsubscribe();
    };
  }, []);

  // O callback de onAuthStateChange não consulta o Supabase.
  // A permissão visual é consultada separadamente depois de atualizar a sessão.
  // O banco também precisa aplicar RLS às ações administrativas.
  useEffect(() => {
    if (!sessionReady) return;
    if (!user) {
      setIsAdmin(false);
      setRoleLoading(false);
      return;
    }

    let active = true;
    setIsAdmin(false);
    setRoleLoading(true);

    void (async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;
        if (active) setIsAdmin(data?.role === 'admin');
      } catch (error) {
        console.error('Não foi possível consultar o papel da sessão:', error);
        if (active) setIsAdmin(false);
      } finally {
        if (active) setRoleLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [sessionReady, user?.id]);

  const signIn = async (email: string, password: string): Promise<AuthTokenResponsePassword> => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<AuthResponse> => {
    // Não salvar role a partir de user_metadata; valores vindos do usuário
    // não podem conceder privilégios. A criação do perfil é server-side.
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName.trim() }
      }
    });
  };

  const signOut = async (): Promise<{ error: Error | null }> => {
    const result = await supabase.auth.signOut();
    if (!result.error) {
      setSession(null);
      setUser(null);
      setIsAdmin(false);
    }
    return result;
  };

  const value: AuthContextType = {
    session,
    user,
    signIn,
    signUp,
    signOut,
    loading: !sessionReady || roleLoading,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
