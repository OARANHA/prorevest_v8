import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useProfile } from "../hooks/useProfile";

export const meta: MetaFunction = () => {
  return [
    { title: "Meu Perfil - ProRevest" },
    { name: "description", content: "Gerencie suas informações de perfil e preferências." },
  ];
}

export default function Perfil() {
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const [activeTab, setActiveTab] = useState<"profile" | "projects" | "preferences">("profile");
  const [isEditing, setIsEditing] = useState(false);

  // Dados do perfil (do hook)
  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    role: "",
    cpf: "",
    cnpj: ""
  });

  // Atualizar dados do perfil quando carregar
  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || "",
        email: user?.email || "",
        phone: profile.phone || "",
        company_name: profile.company_name || "",
        role: profile.role || "",
        cpf: profile.cpf || "",
        cnpj: profile.cnpj || ""
      });
    } else if (user) {
      setProfileData({
        full_name: user.user_metadata?.full_name || "",
        email: user.email || "",
        phone: "",
        company_name: "",
        role: "",
        cpf: "",
        cnpj: ""
      });
    }
  }, [profile, user]);

  const handleSave = async () => {
    if (profile) {
      await updateProfile({
        full_name: profileData.full_name,
        phone: profileData.phone,
        company_name: profileData.company_name,
        role: profileData.role,
        cpf: profileData.cpf,
        cnpj: profileData.cnpj
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-cormorant font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-cormorant font-bold">{profileData.full_name || "Usuário"}</h2>
              <p className="text-muted-foreground text-sm">{profileData.role || "Cliente"}</p>
              <p className="text-muted-foreground text-sm">{profileData.company_name || ""}</p>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${
                  activeTab === "profile"
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Informações Pessoais
              </button>
              <button
                onClick={() => setActiveTab("projects")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${
                  activeTab === "projects"
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Projetos
              </button>
              <button
                onClick={() => setActiveTab("preferences")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${
                  activeTab === "preferences"
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Preferências
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-xl shadow-sm p-6 md:p-8 border border-border">
            {activeTab === "profile" && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-cormorant font-bold">Informações Pessoais</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    {isEditing ? "Cancelar" : "Editar"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome Completo</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-muted/50 rounded-lg">{profileData.full_name || "Não informado"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <p className="px-4 py-2 bg-muted/50 rounded-lg">{profileData.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Telefone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-muted/50 rounded-lg">{profileData.phone || "Não informado"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Empresa</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.company_name}
                        onChange={(e) => setProfileData({...profileData, company_name: e.target.value})}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-muted/50 rounded-lg">{profileData.company_name || "Não informado"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Cargo</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.role}
                        onChange={(e) => setProfileData({...profileData, role: e.target.value})}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-muted/50 rounded-lg">{profileData.role || "Não informado"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">CPF</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.cpf}
                        onChange={(e) => setProfileData({...profileData, cpf: e.target.value})}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-muted/50 rounded-lg">{profileData.cpf || "Não informado"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">CNPJ</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.cnpj}
                        onChange={(e) => setProfileData({...profileData, cnpj: e.target.value})}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-muted/50 rounded-lg">{profileData.cnpj || "Não informado"}</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end mt-8">
                    <button
                      onClick={handleSave}
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Salvar Alterações
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "projects" && (
              <div>
                <h2 className="text-2xl font-cormorant font-bold mb-8">Meus Projetos</h2>
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="text-xl font-semibold mb-2">Nenhum projeto encontrado</h3>
                  <p className="text-muted-foreground mb-6">Você ainda não criou nenhum projeto.</p>
                  <Link to="/catalogo" className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    Explorar Catálogo
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div>
                <h2 className="text-2xl font-cormorant font-bold mb-8">Preferências</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Notificações</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium">Atualizações de orçamentos</p>
                          <p className="text-sm text-muted-foreground">Receba notificações quando seus orçamentos forem atualizados</p>
                        </div>
                        <div className="relative inline-block w-12 h-6">
                          <input type="checkbox" className="sr-only" defaultChecked />
                          <div className="block w-12 h-6 rounded-full bg-primary"></div>
                          <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform"></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium">Novidades e dicas</p>
                          <p className="text-sm text-muted-foreground">Receba novidades sobre produtos e dicas de aplicação</p>
                        </div>
                        <div className="relative inline-block w-12 h-6">
                          <input type="checkbox" className="sr-only" />
                          <div className="block w-12 h-6 rounded-full bg-border"></div>
                          <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Tema</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border border-border rounded-lg text-center cursor-pointer hover:bg-muted/30">
                        <div className="w-full h-20 bg-white rounded mb-2 border border-border"></div>
                        <p>Claro</p>
                      </div>
                      <div className="p-4 border border-border rounded-lg text-center cursor-pointer hover:bg-muted/30">
                        <div className="w-full h-20 bg-gray-900 rounded mb-2 border border-border"></div>
                        <p>Escuro</p>
                      </div>
                      <div className="p-4 border-2 border-primary rounded-lg text-center bg-primary/5">
                        <div className="w-full h-20 bg-gradient-to-r from-amber-200 to-amber-400 rounded mb-2 border border-border"></div>
                        <p className="font-medium">Automático</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Idioma</h3>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Português</button>
                      <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted">English</button>
                      <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted">Español</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}