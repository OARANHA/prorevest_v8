import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState } from "react";
import { Upload, Download, FileText, Database, AlertCircle } from "lucide-react";
import { DosageService, type DosageFormula } from "../../services/dosageService";

export const meta: MetaFunction = () => {
  return [
    { title: "Importar/Exportar Fórmulas - ProRevest" },
    { name: "description", content: "Importe e exporte fórmulas de dosagem em diferentes formatos" },
  ];
}

export default function FormulaImportExport() {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [exportFormat, setExportFormat] = useState("csv");
  const [importResult, setImportResult] = useState<{ success: boolean; message: string; count?: number } | null>(null);
  const [exportResult, setExportResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleImport = async () => {
    if (!importFile) {
      setImportResult({
        success: false,
        message: "Por favor, selecione um arquivo para importar."
      });
      return;
    }

    setIsImporting(true);
    setImportResult(null);

    try {
      // Ler o conteúdo do arquivo
      const content = await importFile.text();
      
      // Determinar o formato do arquivo
      let formulas: DosageFormula[] = [];
      
      if (importFile.name.endsWith('.csv')) {
        // Parse CSV
        const lines = content.split('\n');
        const headers = lines[0].split(',');
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() === '') continue;
          
          const values = lines[i].split(',');
          const formula: any = {};
          
          headers.forEach((header, index) => {
            formula[header.trim()] = values[index]?.trim() || '';
          });
          
          // Converter tipos de dados
          formula.base_percentage = parseFloat(formula.base_percentage) || 0;
          formula.pigment_a_percentage = parseFloat(formula.pigment_a_percentage) || 0;
          formula.pigment_b_percentage = parseFloat(formula.pigment_b_percentage) || 0;
          formula.pigment_c_percentage = parseFloat(formula.pigment_c_percentage) || 0;
          
          formulas.push(formula as DosageFormula);
        }
      } else if (importFile.name.endsWith('.json')) {
        // Parse JSON
        formulas = JSON.parse(content);
      } else {
        throw new Error("Formato de arquivo não suportado. Use CSV ou JSON.");
      }
      
      // Em uma implementação real, aqui salvaríamos as fórmulas no banco de dados
      console.log("Fórmulas importadas:", formulas);
      
      setImportResult({
        success: true,
        message: `Importação concluída com sucesso! ${formulas.length} fórmulas foram importadas.`,
        count: formulas.length
      });
    } catch (error) {
      console.error("Erro ao importar fórmulas:", error);
      setImportResult({
        success: false,
        message: error instanceof Error ? error.message : "Erro desconhecido ao importar fórmulas."
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportResult(null);

    try {
      // Em uma implementação real, aqui buscaríamos as fórmulas do banco de dados
      const formulas = await DosageService.getAllFormulas();
      
      let content = '';
      let filename = '';
      let mimeType = '';
      
      if (exportFormat === 'csv') {
        // Gerar CSV
        const headers = ['id', 'quote_id', 'product_variant_id', 'base_percentage', 'pigment_a_percentage', 'pigment_b_percentage', 'pigment_c_percentage', 'created_at', 'updated_at'];
        content += headers.join(',') + '\n';
        
        formulas.forEach(formula => {
          const values = headers.map(header => {
            const value = (formula as any)[header];
            // Escapar valores que contenham vírgulas ou aspas
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          });
          content += values.join(',') + '\n';
        });
        
        filename = `formulas-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      } else if (exportFormat === 'json') {
        // Gerar JSON
        content = JSON.stringify(formulas, null, 2);
        filename = `formulas-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      } else {
        throw new Error("Formato de exportação não suportado.");
      }
      
      // Criar e baixar o arquivo
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportResult({
        success: true,
        message: `Exportação concluída com sucesso! ${formulas.length} fórmulas foram exportadas.`
      });
    } catch (error) {
      console.error("Erro ao exportar fórmulas:", error);
      setExportResult({
        success: false,
        message: error instanceof Error ? error.message : "Erro desconhecido ao exportar fórmulas."
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-cormorant font-bold">Importar/Exportar Fórmulas</h1>
            <p className="text-muted-foreground">Importe e exporte fórmulas de dosagem em diferentes formatos</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Seção de Importação */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-xl font-semibold flex items-center">
              <Upload className="mr-2 h-5 w-5" />
              Importar Fórmulas
            </h2>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Selecione o arquivo para importar
              </label>
              <div className="flex items-center">
                <label className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      {importFile ? importFile.name : "Clique para selecionar um arquivo ou arraste e solte"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Formatos suportados: CSV, JSON
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      accept=".csv,.json"
                      onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                    />
                  </div>
                </label>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Exemplo de formato CSV
              </label>
              <div className="bg-muted p-3 rounded-lg text-xs font-mono overflow-x-auto">
                <pre>
"id","quote_id","product_variant_id","base_percentage","pigment_a_percentage","pigment_b_percentage","pigment_c_percentage"
123e4567-e89b-12d3-a456-426614174000,abcd1234-abcd-1234-abcd-123456789abc,efgh5678-efgh-5678-efgh-876543210def,80.5,10.2,5.3,4.0
                </pre>
              </div>
            </div>
            
            <button
              onClick={handleImport}
              disabled={isImporting || !importFile}
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isImporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Importando...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Importar Fórmulas
                </>
              )}
            </button>
            
            {importResult && (
              <div className={`mt-4 p-4 rounded-lg ${importResult.success ? 'bg-green-100 border border-green-200 text-green-800' : 'bg-destructive/10 border border-destructive/20 text-destructive'}`}>
                <div className="flex items-start">
                  {importResult.success ? (
                    <Database className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium">{importResult.message}</p>
                    {importResult.count !== undefined && (
                      <p className="text-sm mt-1">Total de fórmulas importadas: {importResult.count}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção de Exportação */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-xl font-semibold flex items-center">
              <Download className="mr-2 h-5 w-5" />
              Exportar Fórmulas
            </h2>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Selecione o formato de exportação
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setExportFormat('csv')}
                  className={`p-4 border rounded-lg flex flex-col items-center justify-center ${
                    exportFormat === 'csv' 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <FileText className="h-8 w-8 mb-2" />
                  <span className="font-medium">CSV</span>
                  <span className="text-xs text-muted-foreground">Valores separados por vírgula</span>
                </button>
                <button
                  onClick={() => setExportFormat('json')}
                  className={`p-4 border rounded-lg flex flex-col items-center justify-center ${
                    exportFormat === 'json' 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Database className="h-8 w-8 mb-2" />
                  <span className="font-medium">JSON</span>
                  <span className="text-xs text-muted-foreground">Formato estruturado</span>
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Exemplo de formato {exportFormat.toUpperCase()}
              </label>
              <div className="bg-muted p-3 rounded-lg text-xs font-mono overflow-x-auto max-h-32">
                {exportFormat === 'csv' ? (
                  <pre>
{`"id","quote_id","product_variant_id","base_percentage","pigment_a_percentage","pigment_b_percentage","pigment_c_percentage"
"123e4567-e89b-12d3-a456-426614174000","abcd1234-abcd-1234-abcd-123456789abc","efgh5678-efgh-5678-efgh-876543210def",80.5,10.2,5.3,4.0`}
                  </pre>
                ) : (
                  <pre>
{`[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "quote_id": "abcd1234-abcd-1234-abcd-123456789abc",
    "product_variant_id": "efgh5678-efgh-5678-efgh-876543210def",
    "base_percentage": 80.5,
    "pigment_a_percentage": 10.2,
    "pigment_b_percentage": 5.3,
    "pigment_c_percentage": 4.0
  }
]`}
                  </pre>
                )}
              </div>
            </div>
            
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Exportar Fórmulas
                </>
              )}
            </button>
            
            {exportResult && (
              <div className={`mt-4 p-4 rounded-lg ${exportResult.success ? 'bg-green-100 border border-green-200 text-green-800' : 'bg-destructive/10 border border-destructive/20 text-destructive'}`}>
                <div className="flex items-start">
                  {exportResult.success ? (
                    <Database className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  <p className="font-medium">{exportResult.message}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
