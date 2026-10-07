// Simulação de serviço de e-mail, em uma implementação real isso se conectaria a um provedor de e-mail como SendGrid, SMTP, etc.

export type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type EmailSchedule = {
  id: string;
  template_id: string;
  recipient_email: string;
  recipient_name?: string;
  scheduled_at: string;
  sent_at?: string;
  status: 'pending' | 'sent' | 'failed';
  created_at: string;
};

export class EmailService {
  static async sendEmail(
    to: string,
    subject: string,
    content: string,
    recipientName?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Em uma implementação real, isso enviaria o e-mail através de um provedor
      console.log(`Enviando e-mail para: ${to}`);
      console.log(`Assunto: ${subject}`);
      console.log(`Conteúdo: ${content}`);
      console.log(`Nome do destinatário: ${recipientName || 'Não informado'}`);
      
      // Simular envio com sucesso
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Simular um pequeno atraso para parecer com uma chamada de API real
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        messageId
      };
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao enviar e-mail'
      };
    }
  }

  static async saveEmailTemplate(template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<EmailTemplate> {
    // Em uma implementação real, isso salvaria no banco de dados
    const newTemplate: EmailTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      name: template.name,
      subject: template.subject,
      content: template.content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Salvar no localStorage para simular persistência
    const templates = JSON.parse(localStorage.getItem('emailTemplates') || '[]');
    templates.push(newTemplate);
    localStorage.setItem('emailTemplates', JSON.stringify(templates));
    
    return newTemplate;
  }

  static async getEmailTemplates(): Promise<EmailTemplate[]> {
    // Em uma implementação real, isso buscaria do banco de dados
    return JSON.parse(localStorage.getItem('emailTemplates') || '[]');
  }

  static async getEmailTemplateById(templateId: string): Promise<EmailTemplate | null> {
    const templates = await this.getEmailTemplates();
    return templates.find(t => t.id === templateId) || null;
  }

  static async deleteEmailTemplate(templateId: string): Promise<void> {
    // Em uma implementação real, isso deletaria do banco de dados
    const templates = JSON.parse(localStorage.getItem('emailTemplates') || '[]');
    const filteredTemplates = templates.filter((t: EmailTemplate) => t.id !== templateId);
    localStorage.setItem('emailTemplates', JSON.stringify(filteredTemplates));
  }

  static async scheduleEmail(
    templateId: string,
    recipientEmail: string,
    recipientName: string | undefined,
    scheduledAt: string
  ): Promise<EmailSchedule> {
    // Em uma implementação real, isso salvaria no banco de dados
    const schedule: EmailSchedule = {
      id: Math.random().toString(36).substr(2, 9),
      template_id: templateId,
      recipient_email: recipientEmail,
      recipient_name: recipientName,
      scheduled_at: scheduledAt,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    // Salvar no localStorage para simular persistência
    const schedules = JSON.parse(localStorage.getItem('emailSchedules') || '[]');
    schedules.push(schedule);
    localStorage.setItem('emailSchedules', JSON.stringify(schedules));
    
    return schedule;
  }

  static async getEmailSchedules(): Promise<EmailSchedule[]> {
    // Em uma implementação real, isso buscaria do banco de dados
    return JSON.parse(localStorage.getItem('emailSchedules') || '[]');
  }

  static async processScheduledEmails(): Promise<void> {
    const schedules = await this.getEmailSchedules();
    const pendingSchedules = schedules.filter(
      (s: EmailSchedule) => 
        s.status === 'pending' && 
        new Date(s.scheduled_at) <= new Date()
    );
    
    for (const schedule of pendingSchedules) {
      try {
        const template = await this.getEmailTemplateById(schedule.template_id);
        if (template) {
          const result = await this.sendEmail(
            schedule.recipient_email,
            template.subject,
            template.content,
            schedule.recipient_name
          );
          
          if (result.success) {
            // Atualizar status para enviado
            schedule.status = 'sent';
            schedule.sent_at = new Date().toISOString();
          } else {
            // Atualizar status para falha
            schedule.status = 'failed';
          }
        }
      } catch (error) {
        console.error('Erro ao processar e-mail agendado:', error);
        schedule.status = 'failed';
      }
    }
    
    // Salvar atualizações no localStorage
    localStorage.setItem('emailSchedules', JSON.stringify(schedules));
  }

  static async sendQuoteFollowUp(
    customerEmail: string,
    customerName: string,
    quoteId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const subject = `Lembrete: Orçamento #${quoteId} - ProRevest`;
      const content = `
        <h2>Olá ${customerName},</h2>
        <p>Estamos entrando em contato para lembrá-lo sobre o orçamento #${quoteId} que você solicitou em nossa plataforma.</p>
        <p>Caso tenha alguma dúvida ou precise de mais informações, estamos à disposição para ajudar.</p>
        <p>Atenciosamente,<br>Equipe ProRevest</p>
      `;
      
      const result = await this.sendEmail(customerEmail, subject, content, customerName);
      return result;
    } catch (error) {
      console.error('Erro ao enviar lembrete de orçamento:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao enviar lembrete'
      };
    }
  }

}