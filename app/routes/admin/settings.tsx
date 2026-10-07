import type { MetaFunction } from "react-router-dom";
import { useState, useEffect } from "react";
import { Settings, Save, Bell, Shield, Database, Palette, Globe, Mail } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export const meta: MetaFunction = () => {
  return [
    { title: "Configurações - ProRevest" },
    { name: "description", content: "Configure as configurações da ProRevest" },
  ];
}

export default function AdminSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    siteName: "ProRevest",
    siteDescription: "Soluções em tintas e revestimentos",
    contactEmail: "contato@prorevest.com.br",
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    theme: "light"
  });
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSave = async () => {
    setSaveStatus("Salvando...");
    
    // Simular salvamento
    setTimeout(() => {
      setSaveStatus("Configurações salvas com sucesso!");
      setTimeout(() => setSaveStatus(""), 3000);
    }, 1000);
  };

  const handleReset = () => {
    setSettings({
      siteName: "ProRevest",
      siteDescription: "Soluções em tintas e revestimentos",
      contactEmail: "contato@prorevest.com.br",
      maintenanceMode: false,
      allowRegistration: true,
      emailNotifications: true,
      theme: "light"
    });
    setSaveStatus("Configurações redefinidas");
    setTimeout(() => setSaveStatus(""), 3000);
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
            <h1 className="text-3xl font-cormorant font-bold">Configurações</h1>
            <p className="text-muted-foreground">Configure as configurações do sistema</p>
          </div>
        </div>
      </div>

      {/* Status de salvamento */}
      {saveStatus && (
        <div className={`mb-6 p-4 rounded-lg ${
          saveStatus.includes("sucesso") 
            ? "bg-green-50 border border-green-200 text-green-800" 
            : "bg-blue-50 border border-blue-200 text-blue-800"
        }`}>
          <div className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            {saveStatus}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações Gerais */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Settings className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold">Configurações Gerais</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Site
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição do Site
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={settings.siteDescription}
                onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email de Contato
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={settings.contactEmail}
                onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Configurações do Sistema */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold">Configurações do Sistema</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Modo de Manutenção
                </label>
                <p className="text-xs text-gray-500">
                  Ative para mostrar mensagem de manutenção
                </p>
              </div>
              <button
                onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Permitir Registro
                </label>
                <p className="text-xs text-gray-500">
                  Novos usuários podem se cadastrar
                </p>
              </div>
              <button
                onClick={() => setSettings({...settings, allowRegistration: !settings.allowRegistration})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.allowRegistration ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.allowRegistration ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Configurações de Notificação */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Mail className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold">Notificações</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Notificações por Email
                </label>
                <p className="text-xs text-gray-500">
                  Enviar alertas e notificações por email
                </p>
              </div>
              <button
                onClick={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Configurações de Aparência */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Palette className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold">Aparência</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tema
              </label>
              <select
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={settings.theme}
                onChange={(e) => setSettings({...settings, theme: e.target.value})}
              >
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
                <option value="auto">Automático</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="mt-8 flex justify-end space-x-4">
        <button
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
        >
          <Settings className="h-4 w-4" />
          <span>Redefinir Configurações</span>
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>Salvar Configurações</span>
        </button>
      </div>
    </div>
  );
}