import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Wifi, WifiOff, Settings } from "lucide-react";
import { DosageService, type DosageMachine } from "../../services/dosageService";
import { DatabaseService } from "../../services/databaseService";
import { useNavigate } from "react-router-dom";

export const meta: MetaFunction = () => {
  return [
    { title: "Máquinas de Dosagem - ProRevest" },
    { name: "description", content: "Gerencie as máquinas de dosagem da ProRevest" },
  ];
}

export default function AdminDosageMachines() {
  const [machines, setMachines] = useState<DosageMachine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMachines, setFilteredMachines] = useState<DosageMachine[]>([]);
  const [dbError, setDbError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Carregar máquinas de dosagem
  useEffect(() => {
    const loadMachines = async () => {
      try {
        // Verificar se as tabelas necessárias existem
        const machinesTableExists = await DatabaseService.checkTableExists('dosage_machines');
        const formulasTableExists = await DatabaseService.checkTableExists('dosage_formulas');
        
        if (!machinesTableExists || !formulasTableExists) {
          setDbError("Tabelas necessárias não encontradas. Por favor, inicialize o banco de dados.");
          return;
        }
        
        // Buscar as máquinas do banco de dados
        const machinesData = await DosageService.getDosageMachines();
        setMachines(machinesData);
        setFilteredMachines(machinesData);
      } catch (error) {
        console.error("Erro ao carregar máquinas de dosagem:", error);
        setDbError(error instanceof Error ? error.message : "Erro desconhecido ao carregar máquinas de dosagem");
      } finally {
        setLoading(false);
      }
    };

    loadMachines();
  }, []);

  // Filtrar máquinas com base no termo de busca
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredMachines(machines);
    } else {
      const filtered = machines.filter(machine => 
        machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        machine.ip_address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMachines(filtered);
    }
  }, [searchTerm, machines]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <Wifi className="h-5 w-5 text-green-500" />;
      case "offline":
        return <WifiOff className="h-5 w-5 text-red-500" />;
      case "maintenance":
        return <Settings className="h-5 w-5 text-yellow-500" />;
      default:
        return <WifiOff className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Online</span>;
      case "offline":
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Offline</span>;
      case "maintenance":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Manutenção</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Desconhecido</span>;
    }
  };

  const handleInitDatabase = () => {
    navigate("/admin/init-db");
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

  if (dbError) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-cormorant font-bold mb-6">Erro de Banco de Dados</h1>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-2xl">
          <p className="text-destructive mb-4">{dbError}</p>
          <button
            onClick={handleInitDatabase}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Inicializar Banco de Dados
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-cormorant font-bold">Máquinas de Dosagem</h1>
            <p className="text-muted-foreground">Gerencie as máquinas de dosagem da ProRevest</p>
          </div>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center">
            <Plus className="mr-2 h-5 w-5" />
            Nova Máquina
          </button>
        </div>
      </div>

      {/* Barra de busca */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar máquinas..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela de máquinas */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Máquina
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                IP Address
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Última Conexão
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {filteredMachines.map((machine) => (
              <tr key={machine.id} className="hover:bg-muted/10">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(machine.status)}
                    <div className="ml-3">
                      <div className="font-medium">{machine.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {machine.ip_address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(machine.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                  {new Date(machine.last_connected).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-primary hover:text-primary/80 mr-3">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button className="text-destructive hover:text-destructive/80">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando 1 a {filteredMachines.length} de {filteredMachines.length} resultados
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-border rounded-md text-sm font-medium hover:bg-muted/50">
            Anterior
          </button>
          <button className="px-3 py-1 border border-border rounded-md text-sm font-medium hover:bg-muted/50">
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}