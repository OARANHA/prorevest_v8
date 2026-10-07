import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Wifi, WifiOff, Settings, Upload, Download } from "lucide-react";
import { DosageService, type DosageMachine } from "../../services/dosageService";

export const meta: MetaFunction = () => {
  return [
    { title: "Máquinas de Tintura - ProRevest" },
    { name: "description", content: "Gerencie as máquinas de tintura da ProRevest" },
  ];
}

export default function TintingMachines() {
  const [machines, setMachines] = useState<DosageMachine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMachine, setEditingMachine] = useState<DosageMachine | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    ip_address: "",
    status: "offline" as "online" | "offline" | "maintenance"
  });

  // Carregar máquinas de tintura
  useEffect(() => {
    const loadMachines = async () => {
      try {
        const machinesData = await DosageService.getDosageMachines();
        setMachines(machinesData);
      } catch (error) {
        console.error("Erro ao carregar máquinas de tintura:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMachines();
  }, []);

  const handleCreateMachine = async () => {
    try {
      // Em uma implementação real, aqui criaríamos a máquina no banco de dados
      const newMachine: DosageMachine = {
        id: `machine-${Date.now()}`,
        name: formData.name,
        ip_address: formData.ip_address,
        status: formData.status,
        last_connected: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      
      setMachines([...machines, newMachine]);
      setShowModal(false);
      setFormData({ name: "", ip_address: "", status: "offline" });
    } catch (error) {
      console.error("Erro ao criar máquina:", error);
    }
  };

  const handleUpdateMachine = async () => {
    try {
      if (!editingMachine) return;
      
      // Em uma implementação real, aqui atualizaríamos a máquina no banco de dados
      const updatedMachines = machines.map(machine => 
        machine.id === editingMachine.id 
          ? { ...machine, ...formData } 
          : machine
      );
      
      setMachines(updatedMachines);
      setShowModal(false);
      setEditingMachine(null);
      setFormData({ name: "", ip_address: "", status: "offline" });
    } catch (error) {
      console.error("Erro ao atualizar máquina:", error);
    }
  };

  const handleDeleteMachine = async (id: string) => {
    try {
      // Em uma implementação real, aqui deletaríamos a máquina do banco de dados
      const updatedMachines = machines.filter(machine => machine.id !== id);
      setMachines(updatedMachines);
    } catch (error) {
      console.error("Erro ao deletar máquina:", error);
    }
  };

  const handleEditMachine = (machine: DosageMachine) => {
    setEditingMachine(machine);
    setFormData({
      name: machine.name,
      ip_address: machine.ip_address,
      status: machine.status
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMachine) {
      handleUpdateMachine();
    } else {
      handleCreateMachine();
    }
  };

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
            <h1 className="text-3xl font-cormorant font-bold">Máquinas de Tintura</h1>
            <p className="text-muted-foreground">Gerencie as máquinas de tintura da ProRevest</p>
          </div>
          <button 
            onClick={() => {
              setEditingMachine(null);
              setFormData({ name: "", ip_address: "", status: "offline" });
              setShowModal(true);
            }}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center"
          >
            <Plus className="mr-2 h-5 w-5" />
            Nova Máquina
          </button>
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
            {machines.map((machine) => (
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
                  <button 
                    onClick={() => handleEditMachine(machine)}
                    className="text-primary hover:text-primary/80 mr-3"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDeleteMachine(machine.id)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {machines.length === 0 && (
        <div className="text-center py-12">
          <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium">Nenhuma máquina cadastrada</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Não há máquinas de tintura registradas no sistema.
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                setEditingMachine(null);
                setFormData({ name: "", ip_address: "", status: "offline" });
                setShowModal(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Adicionar Máquina
            </button>
          </div>
        </div>
      )}

      {/* Modal para adicionar/editar máquina */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-xl font-semibold">
                {editingMachine ? "Editar Máquina" : "Nova Máquina"}
              </h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
                    Nome da Máquina
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="ip_address" className="block text-sm font-medium text-muted-foreground mb-1">
                    Endereço IP
                  </label>
                  <input
                    type="text"
                    id="ip_address"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.ip_address}
                    onChange={(e) => setFormData({...formData, ip_address: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-muted-foreground mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="maintenance">Manutenção</option>
                  </select>
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-border flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingMachine(null);
                    setFormData({ name: "", ip_address: "", status: "offline" });
                  }}
                  className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted/50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  {editingMachine ? "Atualizar" : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}