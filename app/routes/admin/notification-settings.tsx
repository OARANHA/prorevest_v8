import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState } from "react";
import { Bell, Mail, Smartphone, Save } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Configuração de Notificações - ProRevest" },
    { name: "description", content: "Configure notificações automáticas de assinatura de orçamentos" },
  ];
}

export default function AdminNotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState({
    quoteSigned: true,
    quoteReminder: true,
    quoteExpiration: true
  });
  
  const [smsNotifications, setSmsNotifications] = useState({
    quoteSigned: false,
    quoteReminder: true,
    quoteExpiration: true
  });
  
  const [pushNotifications, setPushNotifications] = useState({
    quoteSigned: true,
    quoteReminder: true,
    quoteExpiration: true
  });

  const handleSave = () => {
    // Em uma implementação real, salvaríamos essas configurações no banco de dados
    console.log("Configurações de notificação salvas:", { emailNotifications, smsNotifications, pushNotifications });
    alert("Configurações de notificação salvas com sucesso!");
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-cormorant font-bold">Configuração de Notificações</h1>
        <p className="text-muted-foreground">Gerencie as notificações automáticas de assinatura de orçamentos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notificações por E-mail */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
            <Mail className="h-5 w-5 mr-2 text-primary" />
            Notificações por E-mail
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Orçamento Assinado</h3>
                <p className="text-sm text-muted-foreground">Notificar quando um orçamento for assinado</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications.quoteSigned}
                  onChange={(e) => setEmailNotifications({...emailNotifications, quoteSigned: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Lembrete de Orçamento</h3>
                <p className="text-sm text-muted-foreground">Notificar antes do vencimento do orçamento</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications.quoteReminder}
                  onChange={(e) => setEmailNotifications({...emailNotifications, quoteReminder: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Orçamento Vencido</h3>
                <p className="text-sm text-muted-foreground">Notificar quando um orçamento expirar</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications.quoteExpiration}
                  onChange={(e) => setEmailNotifications({...emailNotifications, quoteExpiration: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Notificações por SMS */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
            <Smartphone className="h-5 w-5 mr-2 text-primary" />
            Notificações por SMS
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Orçamento Assinado</h3>
                <p className="text-sm text-muted-foreground">Notificar quando um orçamento for assinado</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsNotifications.quoteSigned}
                  onChange={(e) => setSmsNotifications({...smsNotifications, quoteSigned: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Lembrete de Orçamento</h3>
                <p className="text-sm text-muted-foreground">Notificar antes do vencimento do orçamento</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsNotifications.quoteReminder}
                  onChange={(e) => setSmsNotifications({...smsNotifications, quoteReminder: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Orçamento Vencido</h3>
                <p className="text-sm text-muted-foreground">Notificar quando um orçamento expirar</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsNotifications.quoteExpiration}
                  onChange={(e) => setSmsNotifications({...smsNotifications, quoteExpiration: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Notificações Push */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-primary" />
            Notificações Push
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Orçamento Assinado</h3>
                <p className="text-sm text-muted-foreground">Notificar quando um orçamento for assinado</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushNotifications.quoteSigned}
                  onChange={(e) => setPushNotifications({...pushNotifications, quoteSigned: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Lembrete de Orçamento</h3>
                <p className="text-sm text-muted-foreground">Notificar antes do vencimento do orçamento</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushNotifications.quoteReminder}
                  onChange={(e) => setPushNotifications({...pushNotifications, quoteReminder: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Orçamento Vencido</h3>
                <p className="text-sm text-muted-foreground">Notificar quando um orçamento expirar</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushNotifications.quoteExpiration}
                  onChange={(e) => setPushNotifications({...pushNotifications, quoteExpiration: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Save className="h-5 w-5 mr-2" />
          Salvar Configurações
        </button>
      </div>
      
      {/* Informações adicionais */}
      <div className="mt-6 bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-cormorant font-bold mb-4">Como funcionam as notificações</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Orçamento Assinado</h3>
            <p className="text-sm text-muted-foreground">
              Notifica automaticamente quando um cliente assina um orçamento, permitindo o início imediato da produção.
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Lembrete de Orçamento</h3>
            <p className="text-sm text-muted-foreground">
              Envia lembretes automáticos antes do vencimento do orçamento para evitar perda de vendas.
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Orçamento Vencido</h3>
            <p className="text-sm text-muted-foreground">
              Notifica quando um orçamento expira, permitindo ações de follow-up com o cliente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}