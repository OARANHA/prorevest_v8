import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState } from "react";
import { Cloud, HardDrive, Upload, Download, Shield, Key } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Armazenamento em Nuvem - ProRevest" },
    { name: "description", content: "Configure e gerencie o armazenamento em nuvem para imagens, plantas e PDFs" },
  ];
}

export default function AdminCloudStorage() {
  const [storageConfig, setStorageConfig] = useState({
    provider: "supabase",
    bucketName: "tintas-zanai-storage",
    region: "us-east-1",
    accessKey: "",
    secretKey: "",
    encryption: true,
    backup: true
  });
  
  const [storageStats, setStorageStats] = useState({
    totalSpace: 1000, // GB
    usedSpace: 420, // GB
    fileCount: 12540,
    lastBackup: "2023-05-22 14:30:00"
  });

  const handleSaveConfig = () => {
    // Em uma implementação real, salvaríamos essas configurações no banco de dados
    console.log("Configurações de armazenamento salvas:", storageConfig);
    alert("Configurações de armazenamento salvas com sucesso!");
  };

  const handleTestConnection = () => {
    // Em uma implementação real, testaríamos a conexão com o provedor de armazenamento
    console.log("Testando conexão com provedor de armazenamento:", storageConfig.provider);
    alert(`Conexão com ${storageConfig.provider} testada com sucesso!`);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-cormorant font-bold">Armazenamento em Nuvem</h1>
        <p className="text-muted-foreground">Configure e gerencie o armazenamento em nuvem para imagens, plantas e PDFs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Estatísticas de Armazenamento */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
            <HardDrive className="h-5 w-5 mr-2 text-primary" />
            Estatísticas
          </h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-foreground">Espaço Utilizado</span>
                <span className="text-sm font-medium text-foreground">{storageStats.usedSpace} GB / {storageStats.totalSpace} GB</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${(storageStats.usedSpace / storageStats.totalSpace) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Arquivos</p>
                <p className="text-lg font-medium text-foreground">{storageStats.fileCount.toLocaleString('pt-BR')}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Último Backup</p>
                <p className="text-lg font-medium text-foreground">{new Date(storageStats.lastBackup).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
            
            <div className="pt-2">
              <button className="w-full flex items-center justify-center bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                <Upload className="h-5 w-5 mr-2" />
                Fazer Backup Agora
              </button>
            </div>
          </div>
        </div>
        
        {/* Configurações de Armazenamento */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
            <Cloud className="h-5 w-5 mr-2 text-primary" />
            Configurações de Armazenamento
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Provedor de Armazenamento
              </label>
              <select
                value={storageConfig.provider}
                onChange={(e) => setStorageConfig({...storageConfig, provider: e.target.value})}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="supabase">Supabase Storage</option>
                <option value="aws">Amazon S3</option>
                <option value="google">Google Cloud Storage</option>
                <option value="azure">Azure Blob Storage</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nome do Bucket
              </label>
              <input
                type="text"
                value={storageConfig.bucketName}
                onChange={(e) => setStorageConfig({...storageConfig, bucketName: e.target.value})}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Digite o nome do bucket"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Região
                </label>
                <input
                  type="text"
                  value={storageConfig.region}
                  onChange={(e) => setStorageConfig({...storageConfig, region: e.target.value})}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ex: us-east-1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Chave de Acesso
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={storageConfig.accessKey}
                    onChange={(e) => setStorageConfig({...storageConfig, accessKey: e.target.value})}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Digite a chave de acesso"
                  />
                  <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Chave Secreta
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={storageConfig.secretKey}
                  onChange={(e) => setStorageConfig({...storageConfig, secretKey: e.target.value})}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Digite a chave secreta"
                />
                <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={storageConfig.encryption}
                    onChange={(e) => setStorageConfig({...storageConfig, encryption: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
                <span className="ml-3 text-sm font-medium text-foreground flex items-center">
                  <Shield className="h-4 w-4 mr-1 text-primary" />
                  Criptografia
                </span>
              </div>
              
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={storageConfig.backup}
                    onChange={(e) => setStorageConfig({...storageConfig, backup: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
                <span className="ml-3 text-sm font-medium text-foreground flex items-center">
                  <Download className="h-4 w-4 mr-1 text-primary" />
                  Backup Automático
                </span>
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleSaveConfig}
                className="flex-1 flex items-center justify-center bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <Cloud className="h-5 w-5 mr-2" />
                Salvar Configurações
              </button>
              
              <button
                onClick={handleTestConnection}
                className="flex-1 flex items-center justify-center bg-muted text-foreground px-4 py-2 rounded-lg font-medium hover:bg-muted/80 transition-colors"
              >
                <Cloud className="h-5 w-5 mr-2" />
                Testar Conexão
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tipos de Arquivos e Políticas */}
      <div className="mt-6 bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-cormorant font-bold mb-4">Tipos de Arquivos e Políticas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Imagens</h3>
            <p className="text-sm text-muted-foreground">
              Formatos: JPG, PNG, GIF, WEBP<br/>
              Tamanho máximo: 10MB<br/>
              Compressão automática: Ativa<br/>
              Retenção: 5 anos
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Plantas Técnicas</h3>
            <p className="text-sm text-muted-foreground">
              Formatos: DWG, DXF, PDF<br/>
              Tamanho máximo: 50MB<br/>
              Conversão automática: Ativa<br/>
              Retenção: 10 anos
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Documentos</h3>
            <p className="text-sm text-muted-foreground">
              Formatos: PDF, DOCX, XLSX<br/>
              Tamanho máximo: 25MB<br/>
              OCR automático: Ativo<br/>
              Retenção: 7 anos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}