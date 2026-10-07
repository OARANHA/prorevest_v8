import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useRef } from "react";
import { Upload, FileText, Download, Eye, Trash2, Save } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Upload de Plantas CAD - ProRevest" },
    { name: "description", content: "Upload e conversão de plantas CAD para o modo Arquiteto" },
  ];
}

export default function AdminCadPlans() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [convertedPlans, setConvertedPlans] = useState<any[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleConvertPlans = async () => {
    if (uploadedFiles.length === 0) return;
    
    setIsConverting(true);
    
    // Simular conversão de plantas CAD
    setTimeout(() => {
      const newPlans = uploadedFiles.map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        size: file.size,
        type: file.type,
        status: "convertido",
        layers: ["Paredes", "Portas", "Janelas", "Texturas"],
        preview: "/placeholder-plan-preview.png"
      }));
      
      setConvertedPlans(prev => [...prev, ...newPlans]);
      setUploadedFiles([]);
      setIsConverting(false);
    }, 2000);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveConvertedPlan = (id: number) => {
    setConvertedPlans(prev => prev.filter(plan => plan.id !== id));
  };

  const handleSavePlans = () => {
    // Em uma implementação real, salvaríamos os planos convertidos no banco de dados
    console.log("Planos CAD salvos:", convertedPlans);
    alert("Planos CAD salvos com sucesso!");
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-cormorant font-bold">Upload de Plantas CAD</h1>
        <p className="text-muted-foreground">Converta e gerencie plantas CAD para o modo Arquiteto</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload de Arquivos */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
            <Upload className="h-5 w-5 mr-2 text-primary" />
            Upload de Plantas
          </h2>
          
          <div 
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium text-foreground">Clique para fazer upload de plantas CAD</p>
            <p className="mt-1 text-xs text-muted-foreground">Formatos suportados: DWG, DXF, PDF, PNG, JPG</p>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept=".dwg,.dxf,.pdf,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
            />
          </div>
          
          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-foreground mb-2">Arquivos selecionados:</h3>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                      <span className="text-sm truncate max-w-xs">{file.name}</span>
                    </div>
                    <button 
                      onClick={() => handleRemoveFile(index)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              <button
                onClick={handleConvertPlans}
                disabled={isConverting}
                className="mt-4 w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isConverting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Convertendo...
                  </span>
                ) : (
                  "Converter Plantas"
                )}
              </button>
            </div>
          )}
        </div>
        
        {/* Plantas Convertidas */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
            <Eye className="h-5 w-5 mr-2 text-primary" />
            Plantas Convertidas
          </h2>
          
          {convertedPlans.length > 0 ? (
            <div className="space-y-4">
              {convertedPlans.map((plan) => (
                <div key={plan.id} className="border border-border rounded-lg overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-foreground">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground">{(plan.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <button 
                        onClick={() => handleRemoveConvertedPlan(plan.id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      {plan.layers.map((layer: string, index: number) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {layer}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-muted border-t border-border p-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-foreground">Status:</span>
                      <span className="text-sm text-green-600 font-medium">{plan.status}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                onClick={handleSavePlans}
                className="w-full flex items-center justify-center bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <Save className="h-5 w-5 mr-2" />
                Salvar Plantas Convertidas
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">Nenhuma planta convertida</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Faça upload de plantas CAD e converta-as para usar no modo Arquiteto.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Informações adicionais */}
      <div className="mt-6 bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-cormorant font-bold mb-4">Como funciona a conversão de plantas CAD</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Upload</h3>
            <p className="text-sm text-muted-foreground">
              Faça upload de plantas em formatos DWG, DXF, PDF ou imagens. Nossos sistemas processam automaticamente os arquivos.
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Conversão</h3>
            <p className="text-sm text-muted-foreground">
              As plantas são convertidas em formatos editáveis com camadas identificadas automaticamente.
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Edição</h3>
            <p className="text-sm text-muted-foreground">
              Após a conversão, você pode atribuir produtos, cores e texturas diretamente às paredes da planta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}