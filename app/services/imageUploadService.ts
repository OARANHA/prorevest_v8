import { supabase } from '~/lib/supabaseClient';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export class ImageUploadService {
  private static readonly BUCKET_NAME = 'prorevest';

  /**
   * Faz upload de uma imagem para o Supabase Storage
   */
  static async uploadImage(file: File, productId: string): Promise<UploadResult> {
    try {
      // Verificar se o bucket existe (somente para aviso)
      await this.ensureBucketExists();

      // Garantir que o usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return {
          success: false,
          error: 'Você precisa estar autenticado para fazer uploads.'
        };
      }

      // Construir caminho organizado: userId/blog/slug/AAAA/MM/nome-unico.ext
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const slugSafe = this.slugify(productId || 'post');
      const baseName = this.slugify(file.name.replace(/\.[^/.]+$/, '')) || 'image';
      const ext = this.getFileExtension(file) || 'png';
      const uniqueName = `${baseName}-${Date.now()}.${ext}`;
      const filePath = `${user.id}/blog/${slugSafe}/${year}/${month}/${uniqueName}`;

      // Fazer upload do arquivo
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Erro no upload:', error);
        return {
          success: false,
          error: error.message
        };
      }

      // Obter URL pública da imagem
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        return {
          success: false,
          error: 'Não foi possível obter URL pública da imagem'
        };
      }

      return {
        success: true,
        url: urlData.publicUrl
      };

    } catch (error) {
      console.error('Erro no serviço de upload:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Deleta uma imagem do Supabase Storage
   */
  static async deleteImage(imageUrl: string): Promise<UploadResult> {
    try {
      // Extrair o caminho completo do objeto a partir da URL pública
      const objectPath = this.extractObjectPathFromPublicUrl(imageUrl);

      if (!objectPath) {
        return {
          success: false,
          error: 'URL da imagem inválida'
        };
      }

      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([objectPath]);

      if (error) {
        console.error('Erro ao deletar imagem:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true
      };

    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Verifica se o bucket existe e cria se necessário
   */
  private static async ensureBucketExists(): Promise<void> {
    try {
      // Tentar acessar o bucket diretamente para verificar se existe
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list('', { limit: 1 });
      
      if (error) {
        // Se o erro for "bucket not found", o bucket não existe
        if (error.message?.includes('bucket') && error.message?.includes('not found')) {
          console.warn(`Bucket '${this.BUCKET_NAME}' não existe. É necessário criá-lo manualmente no painel do Supabase.`);
        } else {
          console.error('Erro ao verificar bucket:', error);
        }
        return;
      }

      // Se chegou aqui, o bucket existe e é acessível
      console.log(`Bucket '${this.BUCKET_NAME}' verificado e acessível.`);

    } catch (error) {
      console.error('Erro ao verificar bucket:', error);
    }
  }

  /**
   * Extrai o nome do arquivo de uma URL do Supabase Storage
   */
  private static extractObjectPathFromPublicUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const marker = '/storage/v1/object/public/';
      const idx = urlObj.pathname.indexOf(marker);
      if (idx === -1) return null;
      const after = urlObj.pathname.substring(idx + marker.length); // <bucket>/<path>
      const parts = after.split('/');
      const bucket = parts.shift();
      if (!bucket || bucket !== this.BUCKET_NAME) return null;
      return parts.join('/');
    } catch {
      return null;
    }
  }

  /**
   * Verifica se uma URL é do Supabase Storage
   */
  static isSupabaseStorageUrl(url: string): boolean {
    return url.includes('/storage/v1/object/public/');
  }

  /**
   * Verifica se uma URL é base64
   */
  static isBase64Url(url: string): boolean {
    return url.startsWith('data:image/');
  }

  private static slugify(input: string): string {
    return (input || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private static getFileExtension(file: File): string | null {
    const type = file.type; // e.g., image/png
    if (type && type.includes('/')) {
      const ext = type.split('/')[1];
      if (ext) return ext.replace('jpeg', 'jpg');
    }
    const nameExt = file.name.split('.').pop();
    return nameExt ? nameExt.toLowerCase() : null;
  }
}