// Serviço para gerar relatórios inteligentes

export type ReportPeriod = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

export type ReportFilters = {
  startDate?: string;
  endDate?: string;
  productId?: string;
  categoryId?: string;
  colorId?: string;
  textureId?: string;
  userId?: string;
};

export type SalesData = {
  date: string;
  productName: string;
  productId: string;
  categoryId: string;
  categoryName: string;
  color: string;
  texture: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  cost: number;
  margin: number;
  marginPercentage: number;
};

export type ConversionData = {
  color: string;
  texture: string;
  product: string;
  productId: string;
  views: number;
  addToCart: number;
  purchases: number;
  conversionRate: number;
};

export type InventoryData = {
  productId: string;
  productName: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  status: 'adequate' | 'low' | 'critical' | 'overstock';
};

export type CustomerData = {
  customerId: string;
  customerName: string;
  totalSpent: number;
  orderCount: number;
  avgOrderValue: number;
  lastPurchase: string;
  customerLifetimeValue: number;
  segment: 'bronze' | 'silver' | 'gold' | 'platinum';
};

export type ReportData = {
  sales: SalesData[];
  conversions: ConversionData[];
  inventory: InventoryData[];
  customers: CustomerData[];
  summary: {
    totalRevenue: number;
    totalCost: number;
    totalProfit: number;
    profitMargin: number;
    totalOrders: number;
    avgOrderValue: number;
    conversionRate: number;
    topProduct: string;
    topColor: string;
    topTexture: string;
  };
};

export class ReportService {
  // Dados de exemplo para relatórios
  static readonly SAMPLE_SALES_DATA: SalesData[] = [
    { date: '2023-05-01', productName: 'Tinta Acrílica Branca', productId: 'P001', categoryId: 'C001', categoryName: 'Acrílicas', color: 'Branco', texture: 'Liso', quantity: 10, unitPrice: 120, totalValue: 1200, cost: 800, margin: 400, marginPercentage: 33.33 },
    { date: '2023-05-02', productName: 'Tinta Esmalte Preta', productId: 'P002', categoryId: 'C002', categoryName: 'Esmaltes', color: 'Preto', texture: 'Brilhante', quantity: 5, unitPrice: 150, totalValue: 750, cost: 500, margin: 250, marginPercentage: 33.33 },
    { date: '2023-05-03', productName: 'Textura Marrom', productId: 'P003', categoryId: 'C003', categoryName: 'Texturas', color: 'Marrom', texture: 'Texturizado', quantity: 8, unitPrice: 80, totalValue: 640, cost: 400, margin: 240, marginPercentage: 37.5 },
    { date: '2023-05-04', productName: 'Tinta Acrílica Vermelha', productId: 'P004', categoryId: 'C001', categoryName: 'Acrílicas', color: 'Vermelho', texture: 'Liso', quantity: 12, unitPrice: 120, totalValue: 1440, cost: 960, margin: 480, marginPercentage: 33.33 },
    { date: '2023-05-05', productName: 'Tinta Esmalte Azul', productId: 'P005', categoryId: 'C002', categoryName: 'Esmaltes', color: 'Azul', texture: 'Brilhante', quantity: 7, unitPrice: 150, totalValue: 1050, cost: 700, margin: 350, marginPercentage: 33.33 }
  ];

  static readonly SAMPLE_CONVERSION_DATA: ConversionData[] = [
    { color: 'Branco', texture: 'Liso', product: 'Tinta Acrílica Branca', productId: 'P001', views: 1200, addToCart: 360, purchases: 120, conversionRate: 33.33 },
    { color: 'Preto', texture: 'Brilhante', product: 'Tinta Esmalte Preta', productId: 'P002', views: 800, addToCart: 240, purchases: 80, conversionRate: 33.33 },
    { color: 'Marrom', texture: 'Texturizado', product: 'Textura Marrom', productId: 'P003', views: 600, addToCart: 180, purchases: 60, conversionRate: 33.33 },
    { color: 'Vermelho', texture: 'Liso', product: 'Tinta Acrílica Vermelha', productId: 'P004', views: 1000, addToCart: 300, purchases: 100, conversionRate: 33.33 },
    { color: 'Azul', texture: 'Brilhante', product: 'Tinta Esmalte Azul', productId: 'P005', views: 900, addToCart: 270, purchases: 90, conversionRate: 33.33 }
  ];

  static readonly SAMPLE_INVENTORY_DATA: InventoryData[] = [
    { productId: 'P001', productName: 'Tinta Acrílica Branca', currentStock: 50, reservedStock: 10, availableStock: 40, minStock: 20, maxStock: 100, reorderPoint: 25, status: 'adequate' },
    { productId: 'P002', productName: 'Tinta Esmalte Preta', currentStock: 30, reservedStock: 5, availableStock: 25, minStock: 15, maxStock: 80, reorderPoint: 20, status: 'adequate' },
    { productId: 'P003', productName: 'Textura Marrom', currentStock: 25, reservedStock: 8, availableStock: 17, minStock: 20, maxStock: 60, reorderPoint: 22, status: 'low' },
    { productId: 'P004', productName: 'Tinta Acrílica Vermelha', currentStock: 15, reservedStock: 5, availableStock: 10, minStock: 25, maxStock: 70, reorderPoint: 27, status: 'critical' },
    { productId: 'P005', productName: 'Tinta Esmalte Azul', currentStock: 40, reservedStock: 10, availableStock: 30, minStock: 20, maxStock: 90, reorderPoint: 25, status: 'adequate' }
  ];

  static readonly SAMPLE_CUSTOMER_DATA: CustomerData[] = [
    { customerId: 'C001', customerName: 'João Silva', totalSpent: 5000, orderCount: 5, avgOrderValue: 1000, lastPurchase: '2023-05-01', customerLifetimeValue: 7500, segment: 'gold' },
    { customerId: 'C002', customerName: 'Maria Santos', totalSpent: 3000, orderCount: 3, avgOrderValue: 1000, lastPurchase: '2023-05-02', customerLifetimeValue: 4500, segment: 'silver' },
    { customerId: 'C003', customerName: 'Carlos Oliveira', totalSpent: 8000, orderCount: 8, avgOrderValue: 1000, lastPurchase: '2023-05-03', customerLifetimeValue: 12000, segment: 'platinum' },
    { customerId: 'C004', customerName: 'Ana Costa', totalSpent: 1500, orderCount: 2, avgOrderValue: 750, lastPurchase: '2023-05-04', customerLifetimeValue: 2250, segment: 'bronze' },
    { customerId: 'C005', customerName: 'Pedro Almeida', totalSpent: 4000, orderCount: 4, avgOrderValue: 1000, lastPurchase: '2023-05-05', customerLifetimeValue: 6000, segment: 'gold' }
  ];

  static async generateReport(period: ReportPeriod, filters?: ReportFilters): Promise<ReportData> {
    try {
      // Em uma implementação real, isso buscaria dados reais do banco de dados
      // Para esta simulação, vamos usar dados de exemplo
      
      // Filtrar dados com base nos filtros fornecidos
      let salesData = this.SAMPLE_SALES_DATA;
      let conversionData = this.SAMPLE_CONVERSION_DATA;
      let inventoryData = this.SAMPLE_INVENTORY_DATA;
      let customerData = this.SAMPLE_CUSTOMER_DATA;
      
      if (filters) {
        if (filters.productId) {
          salesData = salesData.filter(item => item.productId === filters.productId);
          conversionData = conversionData.filter(item => item.productId === filters.productId);
          inventoryData = inventoryData.filter(item => item.productId === filters.productId);
        }
        
        if (filters.categoryId) {
          salesData = salesData.filter(item => item.categoryId === filters.categoryId);
          conversionData = conversionData.filter(item => 
            this.SAMPLE_SALES_DATA.find(sale => sale.productId === item.productId)?.categoryId === filters.categoryId
          );
        }
        
        if (filters.colorId) {
          // Na prática, teríamos um mapeamento de colorId para cor
          // Para esta simulação, vamos filtrar por nome da cor
          salesData = salesData.filter(item => item.color?.toLowerCase().includes(filters.colorId!.toLowerCase()));
          conversionData = conversionData.filter(item => item.color?.toLowerCase().includes(filters.colorId!.toLowerCase()));
        }
      }
      
      // Calcular resumo
      const totalRevenue = salesData.reduce((sum, item) => sum + item.totalValue, 0);
      const totalCost = salesData.reduce((sum, item) => sum + item.cost, 0);
      const totalProfit = totalRevenue - totalCost;
      const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
      const totalOrders = salesData.length;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      // Calcular taxa de conversão geral
      const totalViews = conversionData.reduce((sum, item) => sum + item.views, 0);
      const totalPurchases = conversionData.reduce((sum, item) => sum + item.purchases, 0);
      const conversionRate = totalViews > 0 ? (totalPurchases / totalViews) * 100 : 0;
      
      // Determinar top produto, cor e textura
      const productSales = salesData.reduce((acc, item) => {
        acc[item.productName] = (acc[item.productName] || 0) + item.totalValue;
        return acc;
      }, {} as Record<string, number>);
      
      const topProduct = Object.keys(productSales).sort((a, b) => productSales[b] - productSales[a])[0] || 'N/A';
      
      const colorSales = salesData.reduce((acc, item) => {
        acc[item.color] = (acc[item.color] || 0) + item.totalValue;
        return acc;
      }, {} as Record<string, number>);
      
      const topColor = Object.keys(colorSales).sort((a, b) => colorSales[b] - colorSales[a])[0] || 'N/A';
      
      const textureSales = salesData.reduce((acc, item) => {
        acc[item.texture] = (acc[item.texture] || 0) + item.totalValue;
        return acc;
      }, {} as Record<string, number>);
      
      const topTexture = Object.keys(textureSales).sort((a, b) => textureSales[b] - textureSales[a])[0] || 'N/A';
      
      const reportData: ReportData = {
        sales: salesData,
        conversions: conversionData,
        inventory: inventoryData,
        customers: customerData,
        summary: {
          totalRevenue,
          totalCost,
          totalProfit,
          profitMargin,
          totalOrders,
          avgOrderValue,
          conversionRate,
          topProduct,
          topColor,
          topTexture
        }
      };
      
      return reportData;
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      throw error;
    }
  }

  static async getSalesByPeriod(period: ReportPeriod, filters?: ReportFilters): Promise<any[]> {
    // Em uma implementação real, isso buscaria dados agregados por período
    // Para esta simulação, vamos retornar dados de exemplo
    return [
      { period: '2023-05-01', revenue: 1200, orders: 10 },
      { period: '2023-05-02', revenue: 750, orders: 5 },
      { period: '2023-05-03', revenue: 640, orders: 8 },
      { period: '2023-05-04', revenue: 1440, orders: 12 },
      { period: '2023-05-05', revenue: 1050, orders: 7 }
    ];
  }

  static async getTopProducts(limit: number = 10): Promise<any[]> {
    // Em uma implementação real, isso buscaria os produtos mais vendidos
    // Para esta simulação, vamos retornar dados de exemplo
    return [
      { productId: 'P001', productName: 'Tinta Acrílica Branca', sales: 1200, units: 10 },
      { productId: 'P004', productName: 'Tinta Acrílica Vermelha', sales: 1440, units: 12 },
      { productId: 'P005', productName: 'Tinta Esmalte Azul', sales: 1050, units: 7 },
      { productId: 'P002', productName: 'Tinta Esmalte Preta', sales: 750, units: 5 },
      { productId: 'P003', productName: 'Textura Marrom', sales: 640, units: 8 }
    ];
  }

  static async getTopColors(limit: number = 10): Promise<any[]> {
    // Em uma implementação real, isso buscaria as cores mais vendidas
    // Para esta simulação, vamos retornar dados de exemplo
    return [
      { color: 'Branco', sales: 1200, units: 10 },
      { color: 'Vermelho', sales: 1440, units: 12 },
      { color: 'Azul', sales: 1050, units: 7 },
      { color: 'Preto', sales: 750, units: 5 },
      { color: 'Marrom', sales: 640, units: 8 }
    ];
  }

  static async getTopTextures(limit: number = 10): Promise<any[]> {
    // Em uma implementação real, isso buscaria as texturas mais vendidas
    // Para esta simulação, vamos retornar dados de exemplo
    return [
      { texture: 'Liso', sales: 2640, units: 22 },
      { texture: 'Brilhante', sales: 1800, units: 12 },
      { texture: 'Texturizado', sales: 640, units: 8 }
    ];
  }

  static async getCustomerSegments(): Promise<any[]> {
    // Em uma implementação real, isso buscaria dados de segmentação de clientes
    // Para esta simulação, vamos retornar dados de exemplo
    return [
      { segment: 'platinum', count: 1, totalSpent: 8000 },
      { segment: 'gold', count: 2, totalSpent: 9000 },
      { segment: 'silver', count: 1, totalSpent: 3000 },
      { segment: 'bronze', count: 1, totalSpent: 1500 }
    ];
  }

  static async getInventoryStatus(): Promise<any[]> {
    // Em uma implementação real, isso buscaria o status atual do inventário
    // Para esta simulação, vamos retornar dados de exemplo
    return [
      { status: 'adequate', count: 3, totalValue: 15000 },
      { status: 'low', count: 1, totalValue: 2000 },
      { status: 'critical', count: 1, totalValue: 1200 },
      { status: 'overstock', count: 0, totalValue: 0 }
    ];
  }

  static formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  static formatPercentage(value: number): string {
    return value.toFixed(2) + '%';
  }

  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }
}
