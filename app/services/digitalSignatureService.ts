// Serviço para gerenciar assinaturas digitais com integração DocuSign/Clicksign
export type SignatureProvider = 'docusign' | 'clicksign' | 'local';

export type SignatureDocument = {
  id: string;
  quoteId: string;
  documentUrl: string;
  status: 'pending' | 'sent' | 'signed' | 'declined' | 'expired';
  provider: SignatureProvider;
  envelopeId: string | null; // ID do envelope no provedor de assinatura
  signers: SignatureSigner[];
  createdAt: string;
  sentAt: string | null;
  signedAt: string | null;
  declinedAt: string | null;
  declinedReason: string | null;
};

export type SignatureSigner = {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'consultant' | 'admin';
  signed: boolean;
  signedAt: string | null;
  declined: boolean;
  declinedAt: string | null;
  declinedReason: string | null;
};

export type SignatureSettings = {
  provider: SignatureProvider;
  docusignAccountId: string | null;
  docusignApiKey: string | null;
  clicksignToken: string | null;
  webhookUrl: string | null;
};

export class DigitalSignatureService {
  static readonly SETTINGS_KEY = 'tintas_zanai_signature_settings';
  static readonly DOCUMENTS_KEY = 'tintas_zanai_signature_documents';
  
  // Obter configurações de assinatura
  static getSignatureSettings(): SignatureSettings {
    try {
      const stored = localStorage.getItem(this.SETTINGS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações de assinatura:', error);
    }
    
    // Configurações padrão
    return {
      provider: 'local',
      docusignAccountId: null,
      docusignApiKey: null,
      clicksignToken: null,
      webhookUrl: null
    };
  }
  
  // Salvar configurações de assinatura
  static saveSignatureSettings(settings: SignatureSettings): void {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Erro ao salvar configurações de assinatura:', error);
    }
  }
  
  // Obter documentos de assinatura
  static getSignatureDocuments(): SignatureDocument[] {
    try {
      const stored = localStorage.getItem(this.DOCUMENTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Erro ao carregar documentos de assinatura:', error);
    }
    
    return [];
  }
  
  // Salvar documentos de assinatura
  static saveSignatureDocuments(documents: SignatureDocument[]): void {
    try {
      localStorage.setItem(this.DOCUMENTS_KEY, JSON.stringify(documents));
    } catch (error) {
      console.error('Erro ao salvar documentos de assinatura:', error);
    }
  }
  
  // Criar um novo documento de assinatura
  static createSignatureDocument(quoteId: string, documentUrl: string, signers: SignatureSigner[]): SignatureDocument {
    const newDocument: SignatureDocument = {
      id: `doc_${Date.now()}`,
      quoteId,
      documentUrl,
      status: 'pending',
      provider: this.getSignatureSettings().provider,
      envelopeId: null,
      signers,
      createdAt: new Date().toISOString(),
      sentAt: null,
      signedAt: null,
      declinedAt: null,
      declinedReason: null
    };
    
    // Salvar documento
    const documents = this.getSignatureDocuments();
    documents.push(newDocument);
    this.saveSignatureDocuments(documents);
    
    return newDocument;
  }
  
  // Obter documento de assinatura por ID
  static getSignatureDocumentById(documentId: string): SignatureDocument | null {
    const documents = this.getSignatureDocuments();
    return documents.find(doc => doc.id === documentId) || null;
  }
  
  // Obter documentos de assinatura por ID de orçamento
  static getSignatureDocumentsByQuoteId(quoteId: string): SignatureDocument[] {
    const documents = this.getSignatureDocuments();
    return documents.filter(doc => doc.quoteId === quoteId);
  }
  
  // Atualizar status do documento
  static updateDocumentStatus(documentId: string, status: SignatureDocument['status'], envelopeId?: string): SignatureDocument | null {
    const documents = this.getSignatureDocuments();
    const document = documents.find(doc => doc.id === documentId);
    
    if (!document) {
      console.warn(`Documento de assinatura não encontrado: ${documentId}`);
      return null;
    }
    
    // Atualizar status
    document.status = status;
    
    // Atualizar envelope ID se fornecido
    if (envelopeId) {
      document.envelopeId = envelopeId;
    }
    
    // Atualizar timestamps
    const now = new Date().toISOString();
    switch (status) {
      case 'sent':
        document.sentAt = now;
        break;
      case 'signed':
        document.signedAt = now;
        break;
      case 'declined':
        document.declinedAt = now;
        break;
      case 'expired':
        // Não atualizar timestamps adicionais
        break;
    }
    
    // Salvar documentos atualizados
    this.saveSignatureDocuments(documents);
    
    return document;
  }
  
  // Atualizar status de um signatário
  static updateSignerStatus(documentId: string, signerId: string, signed: boolean, declined: boolean = false, declinedReason?: string): SignatureDocument | null {
    const documents = this.getSignatureDocuments();
    const document = documents.find(doc => doc.id === documentId);
    
    if (!document) {
      console.warn(`Documento de assinatura não encontrado: ${documentId}`);
      return null;
    }
    
    const signer = document.signers.find(s => s.id === signerId);
    
    if (!signer) {
      console.warn(`Signatário não encontrado: ${signerId}`);
      return null;
    }
    
    // Atualizar status do signatário
    signer.signed = signed;
    signer.declined = declined;
    
    const now = new Date().toISOString();
    if (signed) {
      signer.signedAt = now;
    }
    if (declined) {
      signer.declinedAt = now;
      signer.declinedReason = declinedReason || null;
    }
    
    // Verificar se todos os signatários assinaram
    const allSigned = document.signers.every(s => s.signed);
    if (allSigned) {
      this.updateDocumentStatus(documentId, 'signed');
    }
    
    // Verificar se algum signatário recusou
    const anyDeclined = document.signers.some(s => s.declined);
    if (anyDeclined) {
      this.updateDocumentStatus(documentId, 'declined');
    }
    
    // Salvar documentos atualizados
    this.saveSignatureDocuments(documents);
    
    return document;
  }
  
  // Enviar documento para assinatura (simulação)
  static async sendDocumentForSignature(documentId: string): Promise<{ success: boolean; envelopeId?: string; error?: string }> {
    try {
      const document = this.getSignatureDocumentById(documentId);
      
      if (!document) {
        return { success: false, error: 'Documento não encontrado' };
      }
      
      const settings = this.getSignatureSettings();
      
      // Simular envio para provedor de assinatura
      switch (settings.provider) {
        case 'docusign':
          // Em uma implementação real, aqui faríamos uma chamada à API do DocuSign
          console.log(`Enviando documento ${documentId} para DocuSign`);
          // Exemplo: await DocuSignAPI.sendEnvelope(document);
          break;
          
        case 'clicksign':
          // Em uma implementação real, aqui faríamos uma chamada à API do Clicksign
          console.log(`Enviando documento ${documentId} para Clicksign`);
          // Exemplo: await ClicksignAPI.sendDocument(document);
          break;
          
        case 'local':
          // Para assinatura local, apenas atualizar o status
          console.log(`Documento ${documentId} pronto para assinatura local`);
          break;
      }
      
      // Gerar um ID de envelope simulado
      const envelopeId = `env_${Date.now()}`;
      
      // Atualizar status do documento
      this.updateDocumentStatus(documentId, 'sent', envelopeId);
      
      return { success: true, envelopeId };
    } catch (error) {
      console.error('Erro ao enviar documento para assinatura:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  }
  
  // Simular assinatura de documento
  static simulateDocumentSignature(documentId: string, signerId: string): boolean {
    try {
      const result = this.updateSignerStatus(documentId, signerId, true);
      return result !== null;
    } catch (error) {
      console.error('Erro ao simular assinatura de documento:', error);
      return false;
    }
  }
  
  // Simular recusa de documento
  static simulateDocumentDecline(documentId: string, signerId: string, reason: string): boolean {
    try {
      const result = this.updateSignerStatus(documentId, signerId, false, true, reason);
      return result !== null;
    } catch (error) {
      console.error('Erro ao simular recusa de documento:', error);
      return false;
    }
  }
  
  // Verificar se documento está pronto para assinatura
  static isDocumentReadyForSignature(documentId: string): boolean {
    const document = this.getSignatureDocumentById(documentId);
    return document !== null && document.status === 'pending';
  }
  
  // Verificar se documento foi assinado
  static isDocumentSigned(documentId: string): boolean {
    const document = this.getSignatureDocumentById(documentId);
    return document !== null && document.status === 'signed';
  }
  
  // Obter URL de assinatura para provedor local
  static getLocalSignatureUrl(documentId: string): string {
    // Em uma implementação real, isso retornaria uma URL para a página de assinatura
    return `/assinatura-local/${documentId}`;
  }
  
  // Processar webhook de assinatura (para integração com DocuSign/Clicksign)
  static async processSignatureWebhook(payload: any): Promise<boolean> {
    try {
      // Em uma implementação real, aqui processaríamos o webhook recebido
      // do provedor de assinatura (DocuSign/Clicksign) para atualizar
      // o status do documento
      
      console.log('Processando webhook de assinatura:', payload);
      
      // Exemplo de processamento:
      /*
      const { envelopeId, status, signers } = payload;
      
      // Encontrar documento pelo envelopeId
      const documents = this.getSignatureDocuments();
      const document = documents.find(doc => doc.envelopeId === envelopeId);
      
      if (document) {
        // Atualizar status do documento
        this.updateDocumentStatus(document.id, status);
        
        // Atualizar status dos signatários
        if (signers) {
          signers.forEach((signer: any) => {
            this.updateSignerStatus(
              document.id, 
              signer.id, 
              signer.status === 'signed',
              signer.status === 'declined',
              signer.declinedReason
            );
          });
        }
        
        return true;
      }
      */
      
      return true;
    } catch (error) {
      console.error('Erro ao processar webhook de assinatura:', error);
      return false;
    }
  }
}