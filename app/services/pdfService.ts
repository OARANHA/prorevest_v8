import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Quote } from './quoteService';
import type { Product } from './productService';

export type QuoteTemplate = {
  id: string;
  name: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export class PDFService {
  static async generateQuotePDF(quote: Quote, products: Product[], template?: QuoteTemplate): Promise<Blob> {
    // Garantir execução apenas no cliente
    if (typeof window === 'undefined') {
      throw new Error('Geração de PDF disponível apenas no cliente.');
    }

    const doc = new jsPDF();
    
    // Configurações básicas do documento
    doc.setFont('helvetica');
    
    // Cabeçalho
    doc.setFontSize(22);
    doc.setTextColor(74, 68, 80); // roxo-lavanda
    doc.text('TINTAS ZANAI', 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(107, 114, 128); // gray-500
    doc.text('Orçamento Premium', 20, 30);
    
    // Informações do orçamento
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Nº: ${quote.id}`, 150, 20);
    doc.text(`Data: ${new Date(quote.created_at).toLocaleDateString('pt-BR')}`, 150, 25);
    
    // Informações do cliente
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Dados do Cliente:', 20, 45);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Nome: ${quote.customer_name}`, 20, 55);
    doc.text(`E-mail: ${quote.customer_email}`, 20, 60);
    if (quote.customer_phone) {
      doc.text(`Telefone: ${quote.customer_phone}`, 20, 65);
    }
    if (quote.customer_company) {
      doc.text(`Empresa: ${quote.customer_company}`, 20, 70);
    }
    
    // Linha divisória
    doc.setDrawColor(229, 231, 235); // gray-200
    doc.line(20, 75, 190, 75);

    // Tintas selecionadas
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Tintas selecionadas:', 20, 85);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const notes = (quote as any).notes || '';
    const matchA = notes.match(/Parede\s*1:\s*([^,\n]+)/i);
    const matchB = notes.match(/Parede\s*2:\s*([^,\n]+)/i);
    const parede1 = matchA ? matchA[1].trim() : '—';
    const parede2 = matchB ? matchB[1].trim() : '—';
    doc.text(`Parede 1: ${parede1}`, 20, 95);
    doc.text(`Parede 2: ${parede2}`, 20, 100);
    
    // Produtos
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Produtos:', 20, 115);
    
    // Tabela de produtos
    const tableData = quote.items.map((item: any, index: number) => {
      const product = products.find(p => p.id === item.variant_id);
      return [
        index + 1,
        product?.name || 'Produto não encontrado',
        item.quantity.toString(),
        `R$ ${item.price_at_time.toFixed(2)}`,
        `R$ ${(item.quantity * item.price_at_time).toFixed(2)}`
      ];
    });
    
    autoTable(doc, {
      startY: 120,
      head: [['#', 'Produto', 'Quantidade', 'Preço Unitário', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [74, 68, 80], // roxo-lavanda
        textColor: [255, 255, 255]
      },
      styles: {
        fontSize: 8,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 80 },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 30, halign: 'right' }
      }
    });
    
    // Totais
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    
    doc.text(`Subtotal: R$ ${quote.subtotal.toFixed(2)}`, 150, finalY);
    
    if (quote.discount > 0) {
      doc.text(`Desconto: R$ ${quote.discount.toFixed(2)}`, 150, finalY + 5);
    }
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: R$ ${quote.total.toFixed(2)}`, 150, finalY + 15);
    
    // Condições comerciais
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Condições comerciais:', 20, finalY + 30);
    doc.text('Prazo de validade: 30 dias', 20, finalY + 35);
    doc.text('Forma de pagamento: A combinar', 20, finalY + 40);
    
    // Rodapé
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175); // gray-400
      doc.text(`Página ${i} de ${pageCount}`, 100, 280, { align: 'center' });
      doc.text('ProRevest - Qualidade Premium em Tintas e Texturas', 105, 285, { align: 'center' });
    }
    
    // Retornar como Blob
    return doc.output('blob');
  }

  static async saveQuoteTemplate(template: Omit<QuoteTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<QuoteTemplate> {
    // Em uma implementação real, isso salvaria no banco de dados
    // Por enquanto, vamos simular
    const newTemplate: QuoteTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      name: template.name,
      content: template.content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Salvar no localStorage para simular persistência (somente no cliente)
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const templates = JSON.parse(localStorage.getItem('quoteTemplates') || '[]');
      templates.push(newTemplate);
      localStorage.setItem('quoteTemplates', JSON.stringify(templates));
    }
    
    return newTemplate;
  }

  static async getQuoteTemplates(): Promise<QuoteTemplate[]> {
    // Em uma implementação real, isso buscaria do banco de dados
    // Por enquanto, vamos simular com localStorage (somente no cliente)
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return JSON.parse(localStorage.getItem('quoteTemplates') || '[]');
    }
    return [];
  }

  static async deleteQuoteTemplate(templateId: string): Promise<void> {
    // Em uma implementação real, isso deletaria do banco de dados
    // Por enquanto, vamos simular com localStorage (somente no cliente)
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const templates = JSON.parse(localStorage.getItem('quoteTemplates') || '[]');
      const filteredTemplates = templates.filter((t: QuoteTemplate) => t.id !== templateId);
      localStorage.setItem('quoteTemplates', JSON.stringify(filteredTemplates));
    }
  }
}
