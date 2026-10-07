import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, Plus, Send, Clock, CheckCircle, XCircle } from "lucide-react";
import { EmailService, type EmailTemplate, type EmailSchedule } from "../../services/emailService";

export const meta: MetaFunction = () => {
  return [
    { title: "Agendar E-mails - ProRevest" },
    { name: "description", content: "Agende e-mails automatizados da ProRevest" },
  ];
}

export default function AdminScheduleEmails() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [schedules, setSchedules] = useState<EmailSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSchedules, setFilteredSchedules] = useState<EmailSchedule[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Carregar templates e agendamentos
  useEffect(() => {
    const loadData = async () => {
      try {
        const templatesData = await EmailService.getEmailTemplates();
        const schedulesData = await EmailService.getEmailSchedules();
        setTemplates(templatesData);
        setSchedules(schedulesData);
        setFilteredSchedules(schedulesData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtrar agendamentos com base no termo de busca
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredSchedules(schedules);
    } else {
      const filtered = schedules.filter(schedule => 
        schedule.recipient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.recipient_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSchedules(filtered);
    }
  }, [searchTerm, schedules]);

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTemplate || !recipientEmail || !scheduledDate || !scheduledTime) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    
    try {
      setIsCreating(true);
      
      // Combinar data e hora
      const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
      
      const newSchedule = await EmailService.scheduleEmail(
        selectedTemplate,
        recipientEmail,
        recipientName || undefined,
        scheduledAt
      );
      
      setSchedules([...schedules, newSchedule]);
      setFilteredSchedules([...schedules, newSchedule]);
      
      // Limpar formulário
      setSelectedTemplate("");
      setRecipientEmail("");
      setRecipientName("");
      setScheduledDate("");
      setScheduledTime("");
      
      alert("E-mail agendado com sucesso!");
    } catch (error) {
      console.error("Erro ao agendar e-mail:", error);
      alert("Erro ao agendar e-mail. Por favor, tente novamente.");
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "sent":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pendente</span>;
      case "sent":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Enviado</span>;
      case "failed":
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Falhou</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Desconhecido</span>;
    }
  };

  const handleProcessScheduledEmails = async () => {
    try {
      await EmailService.processScheduledEmails();
      
      // Recarregar agendamentos após processamento
      const updatedSchedules = await EmailService.getEmailSchedules();
      setSchedules(updatedSchedules);
      setFilteredSchedules(updatedSchedules);
      
      alert("E-mails agendados processados com sucesso!");
    } catch (error) {
      console.error("Erro ao processar e-mails agendados:", error);
      alert("Erro ao processar e-mails agendados. Por favor, tente novamente.");
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
            <h1 className="text-3xl font-cormorant font-bold">Agendar E-mails</h1>
            <p className="text-muted-foreground">Agende e-mails automatizados da ProRevest</p>
          </div>
          <button 
            onClick={handleProcessScheduledEmails}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center"
          >
            <Send className="mr-2 h-5 w-5" />
            Processar Agendados
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário de agendamento */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-cormorant font-bold mb-4">Agendar Novo E-mail</h2>
          
          <form onSubmit={handleCreateSchedule}>
            <div className="space-y-4">
              <div>
                <label htmlFor="template" className="block text-sm font-medium text-foreground mb-1">
                  Template de E-mail *
                </label>
                <select
                  id="template"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Selecione um template</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="recipientEmail" className="block text-sm font-medium text-foreground mb-1">
                  E-mail do Destinatário *
                </label>
                <input
                  type="email"
                  id="recipientEmail"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="exemplo@tintaszanai.com.br"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="recipientName" className="block text-sm font-medium text-foreground mb-1">
                  Nome do Destinatário
                </label>
                <input
                  type="text"
                  id="recipientName"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Nome do destinatário"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="scheduledDate" className="block text-sm font-medium text-foreground mb-1">
                    Data de Envio *
                  </label>
                  <input
                    type="date"
                    id="scheduledDate"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="scheduledTime" className="block text-sm font-medium text-foreground mb-1">
                    Hora de Envio *
                  </label>
                  <input
                    type="time"
                    id="scheduledTime"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isCreating}
                className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {isCreating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Agendando...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-5 w-5" />
                    Agendar E-mail
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Lista de agendamentos */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-cormorant font-bold mb-4">E-mails Agendados</h2>
          
          {/* Barra de busca */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar agendamentos..."
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Tabela de agendamentos */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/30">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Destinatário
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Data/Hora
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredSchedules.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-4 text-center text-muted-foreground">
                      Nenhum e-mail agendado
                    </td>
                  </tr>
                ) : (
                  filteredSchedules.map((schedule) => (
                    <tr key={schedule.id} className="hover:bg-muted/10">
                      <td className="px-4 py-3">
                        <div className="font-medium">{schedule.recipient_name || 'Não informado'}</div>
                        <div className="text-sm text-muted-foreground">{schedule.recipient_email}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>{new Date(schedule.scheduled_at).toLocaleDateString('pt-BR')}</div>
                        <div className="text-sm text-muted-foreground">{new Date(schedule.scheduled_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(schedule.status)}
                          <div className="ml-2">
                            {getStatusBadge(schedule.status)}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}