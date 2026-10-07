import { supabase } from '~/lib/supabaseClient';

export interface LogoResult {
  success: boolean;
  url?: string | null;
  error?: string;
}

export class LogoService {
  private static readonly BUCKET_NAME = 'prorevest';
  private static readonly LOGO_DIR = 'branding';
  private static readonly BASE_NAME = 'site-logo';

  static async uploadSiteLogo(file: File): Promise<LogoResult> {
    try {
      const ext = this.getFileExtension(file) || 'png';
      const path = `${this.LOGO_DIR}/${this.BASE_NAME}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(path, file, { upsert: true, cacheControl: '3600' });

      if (uploadError) {
        return { success: false, error: uploadError.message };
      }

      const publicUrl = this.getPublicUrl(path);
      if (!publicUrl) {
        return { success: false, error: 'Não foi possível obter URL pública do logotipo.' };
      }

      // Persistir localmente para carregamento rápido
      localStorage.setItem('siteLogo', publicUrl);
      localStorage.setItem('adminLogo', publicUrl);

      return { success: true, url: publicUrl };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  }

  static async removeSiteLogo(): Promise<LogoResult> {
    try {
      // Listar arquivos do diretório de branding e remover os que iniciam com site-logo
      const { data: files, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(this.LOGO_DIR);

      if (error) {
        return { success: false, error: error.message };
      }

      const targets = (files || [])
        .filter(f => f.name.startsWith(this.BASE_NAME))
        .map(f => `${this.LOGO_DIR}/${f.name}`);

      if (targets.length > 0) {
        const { error: removeError } = await supabase.storage
          .from(this.BUCKET_NAME)
          .remove(targets);
        if (removeError) {
          return { success: false, error: removeError.message };
        }
      }

      localStorage.removeItem('siteLogo');
      localStorage.removeItem('adminLogo');

      return { success: true, url: null };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  }

  static async getSiteLogoUrl(): Promise<string | null> {
    try {
      const saved = localStorage.getItem('siteLogo');
      if (saved) return saved;

      const { data: files, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(this.LOGO_DIR);

      if (error) {
        return null;
      }

      const logo = (files || []).find(f => f.name.startsWith(this.BASE_NAME));
      if (!logo) return null;

      const path = `${this.LOGO_DIR}/${logo.name}`;
      const url = this.getPublicUrl(path);
      if (url) {
        localStorage.setItem('siteLogo', url);
        localStorage.setItem('adminLogo', url);
      }
      return url || null;
    } catch {
      return null;
    }
  }

  private static getPublicUrl(path: string): string | null {
    const { data } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(path);
    return data?.publicUrl || null;
  }

  private static getFileExtension(file: File): string | null {
    const type = file.type;
    if (type && type.includes('/')) {
      const ext = type.split('/')[1];
      if (ext) return ext.replace('jpeg', 'jpg');
    }
    const nameExt = file.name.split('.').pop();
    return nameExt ? nameExt.toLowerCase() : null;
  }
}