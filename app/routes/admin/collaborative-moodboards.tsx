import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, Users, Eye, Trash2, Share2, Calendar, Filter } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Moodboards Colaborativos - ProRevest" },
    { name: "description", content: "Gerencie os moodboards colaborativos criados pelos usuários" },
  ];
}

// Dados simulados para moodboards
const SAMPLE_MOODBOARDS = [
  {
    id: "1",
    name: "Paleta Outono 2023",
    creator: "João Silva",
    collaborators: 3,
    items: 12,
    createdAt: "2023-10-15",
    lastUpdated: "2023-10-20",
    status: "ativo"
  },
  {
    id: "2",
    name: "Projeto Residencial ABC",
    creator: "Maria Santos",
    collaborators: 5,
    items: 24,
    createdAt: "2023-10-10",
    lastUpdated: "2023-10-18",
    status: "ativo"
  },
  {
    id: "3",
    name: "Cores para Escritório",
    creator: "Carlos Oliveira",
    collaborators: 2,
    items: 8,
    createdAt: "2023-10-05",
    lastUpdated: "2023-10-12",
    status: "arquivado"
  },
  {
    id: "4",
    name: "Paleta Tropical",
    creator: "Ana Costa",
    collaborators: 4,
    items: 15,
    createdAt: "2023-09-28",
    lastUpdated: "2023-10-08",
    status: "ativo"
  }
];

export default function AdminCollaborativeMoodboards() {
  const [moodboards, setMoodboards] = useState<any[]>(SAMPLE_MOODBOARDS);
  const [filteredMoodboards, setFilteredMoodboards] = useState<any[]>(SAMPLE_MOODBOARDS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  // Filtrar moodboards com base na busca e status
  useEffect(() => {
    let result = SAMPLE_MOODBOARDS;
    
    // Filtrar por termo de busca
    if (searchTerm) {
      result = result.filter(moodboard => 
        moodboard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        moodboard.creator.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por status
    if (statusFilter !== "all") {
      result = result.filter(moodboard => moodboard.status === statusFilter);
    }
    
    setFilteredMoodboards(result);
  }, [searchTerm, statusFilter]);

  const handleDeleteMoodboard = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este moodboard?")) {
      setMoodboards(prev => prev.filter(m => m.id !== id));
      setFilteredMoodboards(prev => prev.filter(m => m.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Ativo</span>;
      case "arquivado":
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Arquivado</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Desconhecido</span>;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-cormorant font-bold">Moodboards Colaborativos</h1>
        <p className="text-muted-foreground">Gerencie os moodboards criados pelos usuários</p>
      </div>

      {/* Filtros e busca */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar moodboards..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <select
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos os status</option>
                <option value="ativo">Ativo</option>
                <option value="arquivado">Arquivado</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-end">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Exportar Dados
            </button>
          </div>
        </div>
      </div>

      {/* Tabela de moodboards */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Moodboard
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Criador
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Colaboradores
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Itens
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Última Atualização
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {filteredMoodboards.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-muted-foreground">
                  Nenhum moodboard encontrado
                </td>
              </tr>
            ) : (
              filteredMoodboards.map((moodboard) => (
                <tr key={moodboard.id} className="hover:bg-muted/10">
                  <td className="px-6 py-4">
                    <div className="font-medium">{moodboard.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Criado em {new Date(moodboard.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium mr-2">
                        {moodboard.creator.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      {moodboard.creator}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-muted-foreground mr-1" />
                      {moodboard.collaborators}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {moodboard.items}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(moodboard.status)}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(moodboard.lastUpdated).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-primary hover:text-primary/80">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button className="text-primary hover:text-primary/80">
                        <Share2 className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-destructive hover:text-destructive/80"
                        onClick={() => handleDeleteMoodboard(moodboard.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Estatísticas */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total de Moodboards</p>
              <p className="text-2xl font-bold">{SAMPLE_MOODBOARDS.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Moodboards Ativos</p>
              <p className="text-2xl font-bold">
                {SAMPLE_MOODBOARDS.filter(m => m.status === "ativo").length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3">
              <Share2 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Média de Colaboradores</p>
              <p className="text-2xl font-bold">
                {Math.round(SAMPLE_MOODBOARDS.reduce((sum, m) => sum + m.collaborators, 0) / SAMPLE_MOODBOARDS.length) || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
