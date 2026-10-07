import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState } from "react";
import { Download, FileText, Printer, Share2, Filter } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Exportação de B.O. - ProRevest" },
    { name: "description", content: "Exporte a Base de Orçamento (B.O.) para canteiro de obras" },
  ];
}

export default function AdminBoExport() {
  const [exportFormat, setExportFormat] = useState("pdf");
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  
  // Dados simulados de projetos
  const projects = [
    { id: 1, name: "Residência Silva", client: "Carlos Silva", status: "Assinado", value: 12500, date: "2023-05-15" },
    { id: 2, name: "Escritório Central", client: "Tecnologia LTDA", status: "Assinado", value: 35000, date: "2023-05-18" },
    { id: 3, name: "Hotéis Praia", client: "Hotéis do Litoral S/A", status: "Assinado", value: 85000, date: "2023-05-20" },
    { id: 4, name: "Apartamentos Vista", client: "Construtora Vista", status: "Assinado", value: 120000, date: "2023-05-22" },
  ];

  const handleExport = () => {
    // Em uma implementação real, aqui geraríamos o arquivo de exportação
    console.log("Exportando B.O.:", { exportFormat, selectedProjects, dateRange });
    alert(`B.O. exportado com sucesso no formato ${exportFormat.toUpperCase()}!`);
  };

  const handlePrint = () => {
    // Em uma implementação real, aqui abriríamos a janela de impressão
    console.log("Imprimindo B.O.:", { selectedProjects, dateRange });
    alert("Preparando impressão do B.O.!");
  };

  const toggleProjectSelection = (id: number) => {
    setSelectedProjects(prev => 
      prev.includes(id) 
        ? prev.filter(projectId => projectId !== id) 
        : [...prev, id]
    );
  };

  const selectAllProjects = () => {
    if (selectedProjects.length === projects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(projects.map(p => p.id));
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-cormorant font-bold">Exportação de B.O.</h1>
        <p className="text-muted-foreground">Exporte a Base de Orçamento para canteiro de obras</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filtros */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
            <Filter className="h-5 w-5 mr-2 text-primary" />
            Filtros
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Período
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Formato de Exportação
              </label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="pdf">PDF</option>
                <option value="xlsx">Excel (XLSX)</option>
                <option value="csv">CSV</option>
                <option value="xml">XML</option>
              </select>
            </div>
            
            <div className="pt-4">
              <button
                onClick={handleExport}
                className="w-full flex items-center justify-center bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <Download className="h-5 w-5 mr-2" />
                Exportar B.O.
              </button>
              
              <button
                onClick={handlePrint}
                className="w-full mt-2 flex items-center justify-center bg-muted text-foreground px-4 py-2 rounded-lg font-medium hover:bg-muted/80 transition-colors"
              >
                <Printer className="h-5 w-5 mr-2" />
                Imprimir B.O.
              </button>
            </div>
          </div>
        </div>
        
        {/* Lista de Projetos */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-cormorant font-bold flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Projetos para Exportação
            </h2>
            <button 
              onClick={selectAllProjects}
              className="text-sm text-primary hover:text-primary/80"
            >
              {selectedProjects.length === projects.length ? "Desmarcar todos" : "Selecionar todos"}
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/30">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <span className="sr-only">Selecionar</span>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Projeto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Cliente
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Valor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {projects.map((project) => (
                  <tr 
                    key={project.id} 
                    className={`hover:bg-muted/10 ${selectedProjects.includes(project.id) ? "bg-primary/5" : ""}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProjects.includes(project.id)}
                        onChange={() => toggleProjectSelection(project.id)}
                        className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">{project.name}</div>
                      <div className="text-sm text-muted-foreground">{project.status}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {project.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      R$ {project.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(project.date).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Informações adicionais */}
      <div className="mt-6 bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-cormorant font-bold mb-4 flex items-center">
          <Share2 className="h-5 w-5 mr-2 text-primary" />
          Sobre a Exportação de B.O.
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Formatos Disponíveis</h3>
            <p className="text-sm text-muted-foreground">
              Exporte a Base de Orçamento em PDF, Excel, CSV ou XML para atender às necessidades do canteiro de obras.
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Conteúdo do B.O.</h3>
            <p className="text-sm text-muted-foreground">
              O B.O. inclui lista de materiais, quantitativos, especificações técnicas e instruções de aplicação.
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Integração</h3>
            <p className="text-sm text-muted-foreground">
              O B.O. pode ser integrado diretamente com sistemas de gestão de canteiro de obras e ERPs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}