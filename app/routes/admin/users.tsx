import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, User, Mail, Calendar, Shield, Settings, Plus, X, Check, AlertCircle, History } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { UserService } from "../../services/userService";
import { PermissionService } from "../../services/permissionService";
import type { Permission, Module } from "../../services/permissionService";

export const meta: MetaFunction = () => {
  return [
    { title: "Gestão de Usuários - ProRevest" },
    { name: "description", content: "Gerencie os usuários da ProRevest" },
  ];
}

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Carregar usuários e permissões
  useEffect(() => {
    const loadData = async () => {
      try {
        // Carregar usuários do Supabase
        const allUsers = await UserService.getAllUsers();
        setUsers(allUsers);
        setFilteredUsers(allUsers);
        
        // Carregar permissões disponíveis
        const allPermissions = await PermissionService.getAllPermissions();
        setPermissions(allPermissions);
        
        // Carregar módulos disponíveis
        const allModules = await PermissionService.getAllModules();
        setModules(allModules);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setLoadError("Não foi possível consultar os usuários ou permissões. Confira o acesso ao Supabase e as políticas RLS.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Limpar notificação após 5 segundos
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Filtrar usuários com base no termo de busca
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Administrador</span>;
      case "professional":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Profissional</span>;
      case "customer":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Cliente</span>;
      case "manager":
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Gerente</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Desconhecido</span>;
    }
  };

  // Funções para gerenciar permissões
  const handleOpenPermissionModal = async (user: any) => {
    setSelectedUser(user);
    try {
      const userPerms = await PermissionService.getUserPermissions(user.id);
      setUserPermissions(userPerms);
      setSelectedPermissions(userPerms.map(p => p.id));
    } catch (error) {
      console.error("Erro ao carregar permissões do usuário:", error);
    }
    setShowPermissionModal(true);
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) return;
    
    try {
      // Revogar todas as permissões atuais
      await PermissionService.revokeAllPermissions(selectedUser.id);
      
      // Conceder as permissões selecionadas
      if (selectedPermissions.length > 0) {
        await PermissionService.grantMultiplePermissions(
          selectedUser.id,
          selectedPermissions,
          currentUser?.id || ''
        );
      }
      
      setShowPermissionModal(false);
      setSelectedUser(null);
      setSelectedPermissions([]);
      setUserPermissions([]);
    } catch (error) {
      console.error("Erro ao salvar permissões:", error);
    }
  };

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const getPermissionsByModule = () => {
    const grouped: { [key: string]: Permission[] } = {};
    permissions.forEach(permission => {
      if (!grouped[permission.module]) {
        grouped[permission.module] = [];
      }
      grouped[permission.module].push(permission);
    });
    return grouped;
  };

  const handleViewHistory = async (user: any) => {
    try {
      const history = await UserService.getUserActionHistory(user.id);
      console.log("Histórico do usuário:", history);
      // Aqui você pode abrir um modal com o histórico
      // Por enquanto, vamos apenas exibir no console
      alert(`Histórico de ações para ${user.email}:\n${history.map(h => `${h.action} - ${new Date(h.created_at).toLocaleString('pt-BR')}`).join('\n')}`);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      setNotification({ type: 'error', message: 'Erro ao carregar histórico do usuário' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-cormorant font-bold">Gestão de Usuários</h1>
            <p className="text-muted-foreground">Consulte os perfis cadastrados e visíveis para sua sessão. O total de contas no Auth pode ser diferente.</p>
          </div>
        </div>
      </div>

      {loadError && (
        <div role="alert" className="mb-6 rounded-lg border border-red-400/50 bg-red-950/30 p-4 text-red-100">
          {loadError}
        </div>
      )}

      {/* Barra de busca */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar usuários..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela de usuários */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Usuário
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Função
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Criado em
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-muted/10">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="ml-4">
                      <div className="font-medium">{user.full_name || user.email || 'Perfil sem nome'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                    {user.email || 'Não disponível no perfil'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRoleBadge(user.role)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'Não informado'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenPermissionModal(user)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Gerenciar Permissões"
                    >
                      <Shield className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleViewHistory(user)}
                      className="text-purple-600 hover:text-purple-800 transition-colors"
                      title="Ver Histórico"
                    >
                      <History className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Exibindo {filteredUsers.length} perfil(is) retornado(s) e acessível(is) após o filtro
        </div>
      </div>

      {/* Notificação */}
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center space-x-2 ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {notification.type === 'success' ? (
            <Check className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Modal de Gerenciamento de Permissões */}
      {showPermissionModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold">Gerenciar Permissões</h2>
                <p className="text-sm text-gray-600">
                  {selectedUser.full_name || 'Perfil sem nome'} ({selectedUser.email || 'e-mail indisponível'})
                </p>
              </div>
              <button
                onClick={() => setShowPermissionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                {Object.entries(getPermissionsByModule()).map(([module, modulePermissions]) => (
                  <div key={module}>
                    <h3 className="font-medium text-gray-900 mb-3 capitalize">
                      {module === 'dashboard' ? 'Painel' :
                       module === 'users' ? 'Usuários' :
                       module === 'products' ? 'Produtos' :
                       module === 'blog' ? 'Blog' :
                       module === 'quotes' ? 'Orçamentos' :
                       module === 'reports' ? 'Relatórios' :
                       module === 'settings' ? 'Configurações' : module}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {modulePermissions.map((permission) => (
                        <label
                          key={permission.id}
                          className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(permission.id)}
                            onChange={() => handleTogglePermission(permission.id)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {permission.name ? permission.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : ''}
                            </div>
                            <div className="text-sm text-gray-500">
                              {permission.description}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowPermissionModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePermissions}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Check className="h-4 w-4" />
                <span>Salvar Permissões</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}