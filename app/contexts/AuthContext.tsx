import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { User, Session, AuthResponse, AuthTokenResponsePassword } from '@supabase/supabase-js';

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
  const [loading, setLoading] = useState(true);

  // Função para criar ou atualizar o perfil do usuário
  const createOrUpdateProfile = async (userData: { id: string; full_name?: string; email?: string; role?: string }) => {
    try {
      console.log("Tentando criar/atualizar perfil para usuário:", userData);
      
      // Verificar se o perfil já existe
      const { data: existingProfile, error: selectError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userData.id)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        console.error("Erro ao verificar perfil existente:", selectError);
        return;
      }

      if (existingProfile) {
        console.log("Perfil já existe, atualizando...");
        // Atualizar perfil existente (sem updated_at)
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            full_name: userData.full_name
          })
          .eq('id', userData.id);

        if (updateError) {
          console.error("Erro ao atualizar perfil:", updateError);
        } else {
          console.log("Perfil atualizado com sucesso");
        }
      } else {
        console.log("Perfil não existe, criando...");
        // Criar novo perfil
        const role = userData.role || 'customer';
        console.log("Criando perfil com papel:", role);
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userData.id,
            full_name: userData.full_name,
            role: role
          });

        if (insertError) {
          console.error("Erro ao criar perfil:", insertError);
        } else {
          console.log("Perfil criado com sucesso");
        }
      }
    } catch (err) {
      console.error("Erro ao criar/atualizar perfil:", err);
    }
  };

  useEffect(() => {
    const getSession = async () => {
      console.log("Obtendo sessão do Supabase...");
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Sessão obtida:", session);
      setSession(session);
      setUser(session?.user || null);
      
      // Verificar se o usuário é admin
      if (session?.user) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          if (!error && profile?.role === 'admin') {
            console.log("Usuário é administrador");
            setIsAdmin(true);
          } else {
            console.log("Usuário não é administrador", { profile, error });
            setIsAdmin(false);
          }
        } catch (err) {
          console.error("Erro ao verificar função do usuário:", err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
      
      // Listen for auth changes
      const { data: { subscription } } = await supabase.auth.onAuthStateChange((_event, session) => {
        console.log("Estado de autenticação alterado:", _event, session);
        setSession(session);
        setUser(session?.user || null);
        
        // Criar ou atualizar perfil quando o usuário fizer login/registro
        if (session?.user) {
          console.log("Usuário autenticado, criando/atualizando perfil...");
          // Criar/atualizar perfil
          createOrUpdateProfile({
            id: session.user.id,
            full_name: session.user.user_metadata?.full_name || '',
            email: session.user.email || ''
          });
          
          // Verificar se o usuário é admin
          supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()
            .then(({ data: profile, error }) => {
              if (!error && profile?.role === 'admin') {
                console.log("Usuário é administrador (onAuthStateChange)");
                setIsAdmin(true);
              } else {
                console.log("Usuário não é administrador (onAuthStateChange)", { profile, error });
                setIsAdmin(false);
              }
            })
            .catch((err) => {
              console.error("Erro ao verificar função do usuário:", err);
              setIsAdmin(false);
            });
        } else {
          console.log("Usuário não autenticado");
          setIsAdmin(false);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    };

    getSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log("Tentando fazer login com:", email);
    const result = await supabase.auth.signInWithPassword({ email, password });
    console.log("Resultado do login:", result);
    
    // Melhorar a mensagem de erro para email não confirmado
    if (result.error && result.error.message.includes("Email not confirmed")) {
      result.error.message = "Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada ou reenvie o email de confirmação.";
    }
    
    return result;
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log("Tentando registrar usuário:", email);
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });
    
    console.log("Resultado do registro:", result);
    return result;
  };

  const signOut = async () => {
    console.log("Fazendo logout...");
    const { error } = await supabase.auth.signOut();
    console.log("Resultado do logout:", error);
    setIsAdmin(false);
    return { error };
  };

  const value = {
    session,
    user,
    signIn,
    signUp,
    signOut,
    loading,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}