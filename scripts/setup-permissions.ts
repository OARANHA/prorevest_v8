import { supabase } from '../app/lib/supabaseClient';

async function setupPermissions() {
  try {
    console.log('Iniciando configuração do sistema de permissões...');

    // Verificar se as tabelas já existem
    const { data: existingTables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['permissions', 'user_permissions', 'modules']);

    if (tablesError) {
      console.error('Erro ao verificar tabelas existentes:', tablesError);
      return;
    }

    const tableNames = existingTables?.map((t: any) => t.table_name) || [];
    
    // Criar tabelas se não existirem
    if (!tableNames.includes('permissions')) {
      console.log('Criando tabela permissions...');
      const { error: permissionsError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS permissions (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            module TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });

      if (permissionsError) {
        console.error('Erro ao criar tabela permissions:', permissionsError);
        return;
      }
    }

    if (!tableNames.includes('user_permissions')) {
      console.log('Criando tabela user_permissions...');
      const { error: userPermissionsError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS user_permissions (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
            permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
            granted_by UUID REFERENCES profiles(id),
            granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, permission_id)
          );
        `
      });

      if (userPermissionsError) {
        console.error('Erro ao criar tabela user_permissions:', userPermissionsError);
        return;
      }
    }

    if (!tableNames.includes('modules')) {
      console.log('Criando tabela modules...');
      const { error: modulesError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS modules (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            icon TEXT,
            route TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });

      if (modulesError) {
        console.error('Erro ao criar tabela modules:', modulesError);
        return;
      }
    }

    // Inserir módulos padrão
    console.log('Inserindo módulos padrão...');
    const { error: modulesInsertError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO modules (name, description, icon, route) VALUES
        ('dashboard', 'Painel Principal', 'ri-dashboard-line', '/admin'),
        ('users', 'Gestão de Usuários', 'ri-user-line', '/admin/users'),
        ('products', 'Gestão de Produtos', 'ri-palette-line', '/admin/products'),
        ('blog', 'Gestão de Blog', 'ri-article-line', '/admin/blog-posts'),
        ('quotes', 'Gestão de Orçamentos', 'ri-file-list-line', '/admin/quotes'),
        ('reports', 'Relatórios', 'ri-bar-chart-line', '/admin/reports'),
        ('settings', 'Configurações', 'ri-settings-line', '/admin/settings')
        ON CONFLICT (name) DO NOTHING;
      `
    });

    if (modulesInsertError) {
      console.error('Erro ao inserir módulos:', modulesInsertError);
    }

    // Inserir permissões padrão
    console.log('Inserindo permissões padrão...');
    const { error: permissionsInsertError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO permissions (name, description, module) VALUES
        ('view_dashboard', 'Visualizar Painel', 'dashboard'),
        ('view_users', 'Visualizar Usuários', 'users'),
        ('create_users', 'Criar Usuários', 'users'),
        ('edit_users', 'Editar Usuários', 'users'),
        ('delete_users', 'Excluir Usuários', 'users'),
        ('manage_permissions', 'Gerenciar Permissões', 'users'),
        ('view_products', 'Visualizar Produtos', 'products'),
        ('create_products', 'Criar Produtos', 'products'),
        ('edit_products', 'Editar Produtos', 'products'),
        ('delete_products', 'Excluir Produtos', 'products'),
        ('view_blog', 'Visualizar Blog', 'blog'),
        ('create_posts', 'Criar Posts', 'blog'),
        ('edit_posts', 'Editar Posts', 'blog'),
        ('delete_posts', 'Excluir Posts', 'blog'),
        ('publish_posts', 'Publicar Posts', 'blog'),
        ('view_quotes', 'Visualizar Orçamentos', 'quotes'),
        ('create_quotes', 'Criar Orçamentos', 'quotes'),
        ('edit_quotes', 'Editar Orçamentos', 'quotes'),
        ('delete_quotes', 'Excluir Orçamentos', 'quotes'),
        ('approve_quotes', 'Aprovar Orçamentos', 'quotes'),
        ('view_reports', 'Visualizar Relatórios', 'reports'),
        ('export_reports', 'Exportar Relatórios', 'reports'),
        ('view_settings', 'Visualizar Configurações', 'settings'),
        ('edit_settings', 'Editar Configurações', 'settings')
        ON CONFLICT (name) DO NOTHING;
      `
    });

    if (permissionsInsertError) {
      console.error('Erro ao inserir permissões:', permissionsInsertError);
    }

    // Habilitar RLS nas tabelas
    console.log('Configurando Row Level Security...');
    const rlsQueries = [
      'ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE modules ENABLE ROW LEVEL SECURITY;'
    ];

    for (const query of rlsQueries) {
      const { error: rlsError } = await supabase.rpc('exec_sql', { sql: query });
      if (rlsError) {
        console.error('Erro ao configurar RLS:', rlsError, query);
      }
    }

    // Criar políticas de segurança
    console.log('Criando políticas de segurança...');
    const policyQueries = [
      // Políticas para permissions
      `CREATE POLICY IF NOT EXISTS "Admins can view all permissions" 
       ON permissions FOR SELECT 
       TO authenticated 
       USING (EXISTS (
         SELECT 1 FROM profiles 
         WHERE id = auth.uid() AND role = 'admin'
       ));`,
      
      `CREATE POLICY IF NOT EXISTS "Admins can manage permissions" 
       ON permissions FOR ALL 
       TO authenticated 
       USING (EXISTS (
         SELECT 1 FROM profiles 
         WHERE id = auth.uid() AND role = 'admin'
       ))
       WITH CHECK (EXISTS (
         SELECT 1 FROM profiles 
         WHERE id = auth.uid() AND role = 'admin'
       ));`,

      // Políticas para modules
      `CREATE POLICY IF NOT EXISTS "Authenticated users can view modules" 
       ON modules FOR SELECT 
       TO authenticated 
       USING (true);`,

      // Políticas para user_permissions
      `CREATE POLICY IF NOT EXISTS "Admins can view all user permissions" 
       ON user_permissions FOR SELECT 
       TO authenticated 
       USING (EXISTS (
         SELECT 1 FROM profiles 
         WHERE id = auth.uid() AND role = 'admin'
       ));`,
      
      `CREATE POLICY IF NOT EXISTS "Users can view their own permissions" 
       ON user_permissions FOR SELECT 
       TO authenticated 
       USING (user_id = auth.uid());`,
      
      `CREATE POLICY IF NOT EXISTS "Admins can manage user permissions" 
       ON user_permissions FOR ALL 
       TO authenticated 
       USING (EXISTS (
         SELECT 1 FROM profiles 
         WHERE id = auth.uid() AND role = 'admin'
       ))
       WITH CHECK (EXISTS (
         SELECT 1 FROM profiles 
         WHERE id = auth.uid() AND role = 'admin'
       ));`
    ];

    for (const query of policyQueries) {
      const { error: policyError } = await supabase.rpc('exec_sql', { sql: query });
      if (policyError) {
        console.error('Erro ao criar política:', policyError);
      }
    }

    // Criar funções auxiliares
    console.log('Criando funções auxiliares...');
    const functionQueries = [
      // Função para verificar permissão do usuário
      `CREATE OR REPLACE FUNCTION user_has_permission(user_uuid UUID, permission_name TEXT)
       RETURNS BOOLEAN AS $$
       BEGIN
         RETURN EXISTS (
           SELECT 1 
           FROM user_permissions up
           JOIN permissions p ON up.permission_id = p.id
           WHERE up.user_id = user_uuid 
           AND p.name = permission_name
         ) OR EXISTS (
           SELECT 1 FROM profiles 
           WHERE id = user_uuid AND role = 'admin'
         );
       END;
       $$ LANGUAGE plpgsql SECURITY DEFINER;`,

      // Função para obter permissões do usuário
      `CREATE OR REPLACE FUNCTION get_user_permissions(user_uuid UUID)
       RETURNS TABLE(permission_name TEXT, module_name TEXT) AS $$
       BEGIN
         RETURN QUERY
         SELECT p.name, p.module
         FROM user_permissions up
         JOIN permissions p ON up.permission_id = p.id
         WHERE up.user_id = user_uuid
         UNION ALL
         SELECT p.name, p.module
         FROM permissions p
         WHERE EXISTS (
           SELECT 1 FROM profiles 
           WHERE id = user_uuid AND role = 'admin'
         );
       END;
       $$ LANGUAGE plpgsql SECURITY DEFINER;`,

      // Função para obter módulos acessíveis
      `CREATE OR REPLACE FUNCTION get_user_modules(user_uuid UUID)
       RETURNS TABLE(module_name TEXT, module_description TEXT, module_icon TEXT, module_route TEXT) AS $$
       BEGIN
         RETURN QUERY
         SELECT DISTINCT m.name, m.description, m.icon, m.route
         FROM modules m
         WHERE EXISTS (
           SELECT 1 FROM permissions p
           JOIN user_permissions up ON p.id = up.permission_id
           WHERE up.user_id = user_uuid 
           AND p.module = m.name
         ) OR EXISTS (
           SELECT 1 FROM profiles 
           WHERE id = user_uuid AND role = 'admin'
         );
       END;
       $$ LANGUAGE plpgsql SECURITY DEFINER;`
    ];

    for (const query of functionQueries) {
      const { error: functionError } = await supabase.rpc('exec_sql', { sql: query });
      if (functionError) {
        console.error('Erro ao criar função:', functionError);
      }
    }

    console.log('Sistema de permissões configurado com sucesso!');
    
  } catch (error) {
    console.error('Erro geral ao configurar permissões:', error);
  }
}

// Executar a configuração
setupPermissions();