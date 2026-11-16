import type { MetaFunction } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Calendar, Mail, Search, User } from "lucide-react";
import { UserService } from "../../services/userService";
import type { UserProfile } from "../../services/userService";

export const meta: MetaFunction = () => [
  { title: "Gestão de Usuários - ProRevest" },
  { name: "description", content: "Perfis cadastrados e visíveis no sistema ProRevest" },
];

const roleNames: Record<string, string> = {
  admin: "Administrador",
  professional: "Profissional",
  customer: "Cliente",
  manager: "Gerente",
};

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let active = true;

    void UserService.getAllUsers()
      .then((result: UserProfile[]) => {
        if (active) {
          setUsers(result);
          setLoadError(null);
        }
      })
      .catch((error) => {
        console.error("Não foi possível consultar os perfis:", error);
        if (active) {
          setUsers([]);
          setLoadError("Não foi possível consultar os perfis. Verifique o acesso e as políticas RLS do Supabase.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLocaleLowerCase("pt-BR");
    if (!term) return users;
    return users.filter((user) =>
      (user.full_name || "").toLocaleLowerCase("pt-BR").includes(term) ||
      (user.email || "").toLocaleLowerCase("pt-BR").includes(term) ||
      (user.company_name || "").toLocaleLowerCase("pt-BR").includes(term)
    );
  }, [users, searchTerm]);

  if (loading) {
    return <div className="p-6 text-slate-300" role="status">Carregando perfis do Supabase...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-cormorant font-bold mb-2">Gestão de Usuários</h1>
      <p className="text-sm text-slate-300 mb-2">
        Perfis retornados pela tabela profiles, sujeitos à política RLS da sessão.
        A contagem não representa necessariamente o total de contas no Supabase Auth.
      </p>
      <p className="text-sm text-slate-400 mb-6">
        Operações de alterar permissões, redefinir senhas e bloquear contas estão indisponíveis
        até validação do serviço administrativo no servidor.
      </p>

      {loadError && (
        <div role="alert" className="mb-6 rounded-lg border border-red-500/50 p-4 text-red-100">
          {loadError}
        </div>
      )}

      <label htmlFor="admin-user-search" className="block text-sm font-medium mb-2">Buscar perfis</label>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" aria-hidden="true" />
        <input
          id="admin-user-search"
          type="search"
          placeholder="Nome, e-mail ou empresa"
          className="w-full pl-10 pr-4 py-2 border border-slate-600 rounded-lg bg-slate-900"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-600">
        <table className="min-w-full divide-y divide-slate-700">
          <thead>
            <tr className="text-left text-sm text-slate-300">
              <th scope="col" className="p-4">Usuário</th>
              <th scope="col" className="p-4">E-mail</th>
              <th scope="col" className="p-4">Papel</th>
              <th scope="col" className="p-4">Criado em</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="p-4">
                  <span className="inline-flex items-center gap-2">
                    <User className="h-4 w-4" aria-hidden="true" />
                    {user.full_name || user.email || "Perfil sem nome"}
                  </span>
                  {user.company_name && <p className="text-xs text-slate-400 mt-1">{user.company_name}</p>}
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {user.email || "Não informado"}
                  </span>
                </td>
                <td className="p-4">{roleNames[user.role] || user.role}</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    {user.created_at ? new Date(user.created_at).toLocaleDateString("pt-BR") : "Não informado"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loadError && filteredUsers.length === 0 && (
          <p className="p-4 text-slate-300">Nenhum perfil acessível corresponde à busca.</p>
        )}
      </div>

      <p className="mt-4 text-sm text-slate-400">
        {loadError ? "Contagem indisponível" : `Exibindo ${filteredUsers.length} de ${users.length} perfis acessíveis`}
      </p>
    </div>
  );
}
