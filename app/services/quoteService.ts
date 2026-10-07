import { supabase } from '../lib/supabaseClient';

export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'signed' | 'archived';

export type Quote = {
  id: string;
  user_id: string;
  status: QuoteStatus;
  notes: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_company?: string;
  subtotal: number;
  discount: number;
  total: number;
  created_at: string;
  updated_at: string;
  items?: QuoteItem[]; // Items opcional pois são gerenciados separadamente
};

export type QuoteItem = {
  id: string;
  quote_id: string;
  variant_id: string;
  quantity: number;
  price_at_time: number;
  created_at: string;
};

export type QuoteWithItems = Quote & {
  quote_items: QuoteItem[];
};

export class QuoteService {
  static async getQuotes(userId: string): Promise<Quote[]> {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching quotes:', error);
      throw error;
    }
  }

  static async getAllQuotes(): Promise<Quote[]> {
    try {
      // Verificar se usuário é administrador
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('Usuário não autenticado');
      }

      // Verificar papel do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role !== 'admin') {
        // Se não for admin, retornar apenas orçamentos do usuário
        return this.getQuotes(session.user.id);
      }

      // Admin pode ver todos os orçamentos
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar todos os orçamentos:', error);
      throw error;
    }
  }

  static async getQuoteWithItems(quoteId: string): Promise<QuoteWithItems | null> {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          quote_items(*)
        `)
        .eq('id', quoteId)
        .single();

      if (error) throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching quote with items:', error);
      throw error;
    }
  }

  static async createQuote(quote: Omit<Quote, 'id' | 'created_at' | 'updated_at'>): Promise<Quote> {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .insert([{ ...quote, updated_at: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating quote:', error);
      throw error;
    }
  }

  static async updateQuote(id: string, updates: Partial<Quote>): Promise<Quote> {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating quote:', error);
      throw error;
    }
  }

  static async deleteQuote(id: string): Promise<void> {
    try {
      // First delete all quote items
      const { error: itemsError } = await supabase
        .from('quote_items')
        .delete()
        .eq('quote_id', id);

      if (itemsError) throw itemsError;

      // Then delete the quote
      const { error: quoteError } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id);

      if (quoteError) throw quoteError;
    } catch (error) {
      console.error('Error deleting quote:', error);
      throw error;
    }
  }

  static async addQuoteItem(item: Omit<QuoteItem, 'id' | 'created_at'>): Promise<QuoteItem> {
    try {
      const { data, error } = await supabase
        .from('quote_items')
        .insert([{ ...item, created_at: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding quote item:', error);
      throw error;
    }
  }

  static async removeQuoteItem(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('quote_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing quote item:', error);
      throw error;
    }
  }

  static async signQuote(id: string): Promise<Quote> {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .update({ 
          status: 'signed',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing quote:', error);
      throw error;
    }
  }
}
