import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState } from "react";
import { Database, Shield, Clock, Download, Upload, Key, UserX } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Backup e LGPD - ProRevest" },
    { name: "description", content: "Configure backup diário e gerencie conformidade com a LGPD" },
  ];
}

export default function AdminBackupLgpd() {
  const [backupConfig, setBackupConfig] = useState({
    frequency: "daily",
    time: "02:00",
    retention: 30,
    encryption: true,
    location: "local"
  });
  
  const [lgpdConfig, setLgpdConfig] = useState({
    consentRequired: true,
    dataRetention: 365,
    autoDelete: true,
    accessLog: true
  });
  
  const [backupStats, setBackupStats] = useState({
    lastBackup: "2023-05-22 02:00:00",
    nextBackup: "2023-05-23 02:00:00",
    backupSize: "12.4 GB",
    successRate: "99.8%"
  });

  const handleSaveBackupConfig = () => {
    // Em uma implementação real, salvaríamos essas configurações no banco de dados
    console.log("Configurações de backup salvas:", backupConfig);
    alert("Configurações de backup salvas com sucesso!");
  };

  const handleSaveLgpdConfig = () => {
    // Em uma implementação real, salvaríamos essas configurações no banco de dados
    console.log("Configurações de LGPD salvas:", lgpdConfig);
    alert("Configurações de LGPD salvas com sucesso!");
  };

  const handleManualBackup = () => {
    // Em uma implementação real, iniciaríamos um backup manual
    console.log("Iniciando backup manual...");
    alert("Backup manual iniciado com sucesso!");
  };

  const handleExportData = () => {
    // Em uma implementação real, exportaríamos os dados do usuário
    console.log("Exportando dados do usuário...");
    alert("Exportação de dados iniciada!");
  };

  const handleDeleteUserData = () => {
    // Em uma implementação real, excluiríamos os dados do usuário
    console.log("Excluindo dados do usuário...");
    alert("Exclusão de dados do usuário solicitada!");
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-cormorant font-bold">Backup e LGPD</h1>
        <p className="text-muted-foreground">Configure backup diário e gerencie conformidade com a LGPD</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações de Backup */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
            <Database className="h-5 w-5 mr-2 text-primary" />
            Configurações de Backup
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Frequência de Backup
              </label>
              <select
                value={backupConfig.frequency}
                onChange={(e) => setBackupConfig({...backupConfig, frequency: e.target.value})}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="hourly">A cada hora</option>
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Horário do Backup
              </label>
              <input
                type="time"
                value={backupConfig.time}
                onChange={(e) => setBackupConfig({...backupConfig, time: e.target.value})}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Retenção de Backups (dias)
              </label>
              <input
                type="number"
                value={backupConfig.retention}
                onChange={(e) => setBackupConfig({...backupConfig, retention: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                min="1"
                max="365"
              />
            </div>
            
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={backupConfig.encryption}
                  onChange={(e) => setBackupConfig({...backupConfig, encryption: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
              <span className="ml-3 text-sm font-medium text-foreground flex items-center">
                <Key className="h-4 w-4 mr-1 text-primary" />
                Criptografia
              </span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Local de Armazenamento
              </label>
              <select
                value={backupConfig.location}
                onChange={(e) => setBackupConfig({...backupConfig, location: e.target.value})}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="local">Servidor Local</option>
                <option value="cloud">Nuvem</option>
                <option value="hybrid">Híbrido</option>
              </select>
            </div>
            
            <div className="pt-4">
              <button
                onClick={handleSaveBackupConfig}
                className="w-full flex items-center justify-center bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <Database className="h-5 w-5 mr-2" />
                Salvar Configurações de Backup
              </button>
              
              <button
                onClick={handleManualBackup}
                className="w-full mt-2 flex items-center justify-center bg-muted text-foreground px-4 py-2 rounded-lg font-medium hover:bg-muted/80 transition-colors"
              >
                <Download className="h-5 w-5 mr-2" />
                Executar Backup Manual
              </button>
            </div>
          </div>
        </div>
        
        {/* Configurações de LGPD */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            Configurações de LGPD
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={lgpdConfig.consentRequired}
                  onChange={(e) => setLgpdConfig({...lgpdConfig, consentRequired: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
              <span className="ml-3 text-sm font-medium text-foreground">
                Consentimento obrigatório para coleta de dados
              </span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Retenção de Dados do Usuário (dias)
              </label>
              <input
                type="number"
                value={lgpdConfig.dataRetention}
                onChange={(e) => setLgpdConfig({...lgpdConfig, dataRetention: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                min="1"
                max="3650"
              />
            </div>
            
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={lgpdConfig.autoDelete}
                  onChange={(e) => setLgpdConfig({...lgpdConfig, autoDelete: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
              <span className="ml-3 text-sm font-medium text-foreground">
                Exclusão automática após período de retenção
              </span>
            </div>
            
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={lgpdConfig.accessLog}
                  onChange={(e) => setLgpdConfig({...lgpdConfig, accessLog: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
              <span className="ml-3 text-sm font-medium text-foreground">
                Registrar acesso a dados pessoais
              </span>
            </div>
            
            <div className="pt-4">
              <button
                onClick={handleSaveLgpdConfig}
                className="w-full flex items-center justify-center bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <Shield className="h-5 w-5 mr-2" />
                Salvar Configurações de LGPD
              </button>
              
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={handleExportData}
                  className="flex items-center justify-center bg-muted text-foreground px-4 py-2 rounded-lg font-medium hover:bg-muted/80 transition-colors text-sm"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Exportar Dados
                </button>
                <button
                  onClick={handleDeleteUserData}
                  className="flex items-center justify-center bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-medium hover:bg-destructive/90 transition-colors text-sm"
                >
                  <UserX className="h-4 w-4 mr-1" />
                  Excluir Dados
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status de Backup */}
      <div className="mt-6 bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-primary" />
          Status de Backup
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Último Backup</p>
            <p className="text-lg font-medium text-foreground">{new Date(backupStats.lastBackup).toLocaleString('pt-BR')}</p>
          </div>
          
          <div className="border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Próximo Backup</p>
            <p className="text-lg font-medium text-foreground">{new Date(backupStats.nextBackup).toLocaleString('pt-BR')}</p>
          </div>
          
          <div className="border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Tamanho do Backup</p>
            <p className="text-lg font-medium text-foreground">{backupStats.backupSize}</p>
          </div>
          
          <div className="border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
            <p className="text-lg font-medium text-foreground">{backupStats.successRate}</p>
          </div>
        </div>
      </div>
      
      {/* Informações sobre LGPD */}
      <div className="mt-6 bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-cormorant font-bold mb-4">Conformidade com a LGPD</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Direito de Acesso</h3>
            <p className="text-sm text-muted-foreground">
              Os usuários podem solicitar acesso aos seus dados pessoais armazenados em nosso sistema a qualquer momento.
            </p>
          </div>
          
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Direito de Retificação</h3>
            <p className="text-sm text-muted-foreground">
              Os usuários têm o direito de corrigir dados incompletos, inexatos ou desatualizados.
            </p>
          </div>
          
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Direito de Exclusão</h3>
            <p className="text-sm text-muted-foreground">
              Os usuários podem solicitar a exclusão de seus dados pessoais, exceto quando houver obrigação legal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}