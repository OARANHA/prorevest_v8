import { supabase } from '../lib/supabaseClient';
import type { Color, Texture } from './productService';

// Helpers
function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function pickColorFields(input: Partial<Color>) {
  const {
    name,
    hex_code,
    ral_code,
    pantone_code,
    ncs_code,
    category,
    pro_revest_code,
    numeric_code,
    rgb_info,
    reference_number,
    description,
    is_archived
  } = input;

  const payload: any = {
    name,
    hex_code,
    ral_code,
    pantone_code,
    ncs_code,
    category,
    pro_revest_code,
    numeric_code,
    rgb_info,
    reference_number,
    description,
    is_archived,
  };

  // Remove undefined keys
  Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
  return payload;
}

function pickTextureFields(input: Partial<Texture> & { slug?: string; is_archived?: boolean }) {
  const { name, description, slug, is_archived, image_url } = input;
  const payload: any = { name, description, slug, is_archived, image_url };
  Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
  return payload;
}

export const colorTextureService = {
  // Colors CRUD
  async createColor(data: Partial<Color>): Promise<Color> {
    const payload = pickColorFields({ ...data, is_archived: data.is_archived ?? false });
    const { data: inserted, error } = await supabase
      .from('colors')
      .insert(payload)
      .select('*')
      .single();
    if (error) throw error;
    return inserted as Color;
  },

  async updateColor(id: string, data: Partial<Color>): Promise<Color> {
    const payload = pickColorFields(data);
    const { data: updated, error } = await supabase
      .from('colors')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return updated as Color;
  },

  async deleteColor(id: string): Promise<void> {
    const { error } = await supabase
      .from('colors')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Textures CRUD
  async createTexture(data: Partial<Texture> & { slug?: string }): Promise<Texture> {
    const baseSlug = data.slug || slugify(String(data.name || ''));
    const payload = pickTextureFields({ ...data, slug: baseSlug, is_archived: (data as any).is_archived ?? false });
    const { data: inserted, error } = await supabase
      .from('textures')
      .insert(payload)
      .select('*')
      .single();
    if (error) throw error;
    return inserted as Texture;
  },

  async updateTexture(id: string, data: Partial<Texture> & { slug?: string }): Promise<Texture> {
    const payload = pickTextureFields(data);
    const { data: updated, error } = await supabase
      .from('textures')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return updated as Texture;
  },

  async deleteTexture(id: string): Promise<void> {
    const { error } = await supabase
      .from('textures')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

export default colorTextureService;