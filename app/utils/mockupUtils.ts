/**
 * Utilitários para gerenciamento de imagens de mockup de produtos
 */

// Lista de mockups disponíveis
const MOCKUP_IMAGES = [
  '/images/mockup_produto.png',
  '/images/mockup_produto_02.png', 
  '/images/mockup_produto_03.png'
];

/**
 * Obtém uma URL de mockup aleatória
 * @returns URL de uma imagem de mockup aleatória
 */
export function getRandomMockup(): string {
  const randomIndex = Math.floor(Math.random() * MOCKUP_IMAGES.length);
  return MOCKUP_IMAGES[randomIndex];
}

/**
 * Verifica se uma URL de imagem é válida ou se deve usar mockup
 * @param imageUrl URL da imagem a ser verificada
 * @returns true se deve usar mockup, false se a imagem é válida
 */
export function shouldUseMockup(imageUrl: string | null | undefined): boolean {
  // Se não há imagem, usa mockup
  if (!imageUrl) return true;
  
  // Se é uma string vazia, usa mockup
  if (imageUrl.trim() === '') return true;
  
  // Verifica se é uma URL de imagem padrão/placeholder (que indica falta de imagem real)
  const placeholderPatterns = [
    '/images/default-product',
    'default-product',
    'placeholder',
    'data:image',
    'undefined',
    'null'
  ];
  
  // Se contém qualquer padrão de placeholder, usa mockup
  if (placeholderPatterns.some(pattern => imageUrl.includes(pattern))) {
    return true;
  }
  
  // Para URLs reais de imagens (http, https, /images/ que não são placeholders), NÃO usa mockup
  if (imageUrl.startsWith('http') || imageUrl.startsWith('https') || 
      (imageUrl.startsWith('/images/') && !imageUrl.includes('default-product'))) {
    return false;
  }
  
  // Caso padrão: usa mockup para qualquer outra coisa
  return true;
}

/**
 * Obtém a URL da imagem ideal para um produto
 * Prioridade: Imagem original > Mockup aleatório > Fallback padrão
 * @param originalImageUrl URL da imagem original do produto
 * @returns URL da imagem a ser usada
 */
export function getProductImageUrl(originalImageUrl: string | null | undefined): string {
  // Se a imagem original é válida, usa ela
  if (originalImageUrl && !shouldUseMockup(originalImageUrl)) {
    return originalImageUrl;
  }
  
  // Se não, usa um mockup aleatório
  return getRandomMockup();
}

/**
 * Obtém um array de mockups para uso em galerias
 * @param count Número de mockups desejados
 * @returns Array de URLs de mockups
 */
export function getMockupsArray(count: number): string[] {
  const result: string[] = [];
  
  for (let i = 0; i < count; i++) {
    // Garante que não haja repetições consecutivas
    let mockup = getRandomMockup();
    if (result.length > 0 && result[result.length - 1] === mockup) {
      mockup = MOCKUP_IMAGES.find(img => img !== mockup) || mockup;
    }
    result.push(mockup);
  }
  
  return result;
}