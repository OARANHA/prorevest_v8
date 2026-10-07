import { supabase } from '../app/lib/supabaseClient';

async function createMissingProfiles() {
  try {
    console.log('Verificando usuários sem perfil...');
    
    // Obter todos os usuários do auth que não têm perfil
    const { data: users, error: usersError } = await supabase.rpc('execute_sql', {
      sql: `
        SELECT id, email, raw_user_meta_data->>'full_name' as full_name
        FROM auth.users
        WHERE id NOT IN (SELECT id FROM profiles)
      `
    });

    if (usersError) throw usersError;

    if (users && users.length > 0) {
      console.log(`Encontrados ${users.length} usuários sem perfil. Criando perfis...`);
      
      // Criar perfis para esses usuários
      for (const user of users) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: user.full_name || '',
            role: 'customer' // Definir como cliente por padrão
          });

        if (profileError) {
          console.error(`Erro ao criar perfil para usuário ${user.id}:`, profileError);
        } else {
          console.log(`Perfil criado para usuário ${user.id}`);
        }
      }
    } else {
      console.log('Nenhum usuário sem perfil encontrado');
    }
  } catch (error) {
    console.error('Error creating missing profiles:', error);
  }
}

createMissingProfiles();