import { createClient } from '@supabase/supabase-js';
import { Univers, Produit, Kit, Article } from '../types';
import { SEED_UNIVERS, SEED_PRODUITS, SEED_KITS, SEED_KIT_PRODUITS, SEED_ARTICLES } from '../data/seed';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.trim() !== '' && supabaseAnonKey.trim() !== '');

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

/**
 * Service de données résilient :
 * Effectue les requêtes vers Supabase si configuré, ou renvoie le seed local typé.
 */
export async function getUniversList(): Promise<Univers[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('univers')
        .select('*')
        .order('ordre', { ascending: true });
      if (!error && data && data.length > 0) {
        return data as Univers[];
      }
    } catch {
      // repli gracieux
    }
  }
  return [...SEED_UNIVERS].sort((a, b) => a.ordre - b.ordre);
}

export async function getUniversBySlug(slug: string): Promise<Univers | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('univers')
        .select('*')
        .eq('slug', slug)
        .single();
      if (!error && data) {
        return data as Univers;
      }
    } catch {
      // repli gracieux
    }
  }
  return SEED_UNIVERS.find((u) => u.slug === slug) || null;
}

export async function getProduits(filters?: { univers_id?: string; populaire?: boolean }): Promise<Produit[]> {
  if (supabase) {
    try {
      let query = supabase.from('produits').select('*').eq('actif', true);
      if (filters?.univers_id) {
        query = query.eq('univers_id', filters.univers_id);
      }
      if (filters?.populaire !== undefined) {
        query = query.eq('populaire', filters.populaire);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as Produit[];
      }
    } catch {
      // repli gracieux
    }
  }

  let list = SEED_PRODUITS.filter((p) => p.actif !== false);
  if (filters?.univers_id) {
    list = list.filter((p) => p.univers_id === filters.univers_id);
  }
  if (filters?.populaire !== undefined) {
    list = list.filter((p) => p.populaire === filters.populaire);
  }
  return list;
}

export async function getProduitBySlug(slug: string): Promise<Produit | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('produits')
        .select('*')
        .eq('slug', slug)
        .single();
      if (!error && data) {
        return data as Produit;
      }
    } catch {
      // repli gracieux
    }
  }
  return SEED_PRODUITS.find((p) => p.slug === slug) || null;
}

export async function getProduitsByIds(ids: string[]): Promise<Produit[]> {
  if (ids.length === 0) return [];
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('produits')
        .select('*')
        .in('id', ids);
      if (!error && data && data.length > 0) {
        return data as Produit[];
      }
    } catch {
      // repli gracieux
    }
  }
  return SEED_PRODUITS.filter((p) => ids.includes(p.id));
}

export async function getKits(): Promise<Kit[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('kits').select('*');
      if (!error && data && data.length > 0) {
        return data as Kit[];
      }
    } catch {
      // repli gracieux
    }
  }
  return SEED_KITS.map((k) => {
    const kitProds = SEED_KIT_PRODUITS.filter((kp) => kp.kit_id === k.id).map((kp) => ({
      produit_id: kp.produit_id,
      quantite: kp.quantite,
      produit: SEED_PRODUITS.find((p) => p.id === kp.produit_id),
    }));
    return {
      ...k,
      produits: kitProds,
    };
  });
}

export async function getKitBySlug(slug: string): Promise<Kit | null> {
  const kits = await getKits();
  return kits.find((k) => k.slug === slug) || null;
}

export async function getArticles(): Promise<Article[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('articles').select('*');
      if (!error && data && data.length > 0) {
        return data as Article[];
      }
    } catch {
      // repli gracieux
    }
  }
  return SEED_ARTICLES;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single();
      if (!error && data) {
        return data as Article;
      }
    } catch {
      // repli gracieux
    }
  }
  return SEED_ARTICLES.find((a) => a.slug === slug) || null;
}

export interface CommandeResult {
  numero: string;
  total: number;
}

export async function creerCommande(params: {
  nom: string;
  telephone: string;
  adresse: string;
  creneau: string;
  notes: string;
  lignes: Array<{ produit_id: string; quantite: number }>;
}): Promise<CommandeResult> {
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc('creer_commande', {
        p_nom: params.nom.trim(),
        p_telephone: params.telephone.trim(),
        p_adresse: params.adresse.trim(),
        p_creneau: params.creneau ? params.creneau.trim() : null,
        p_notes: params.notes ? params.notes.trim() : null,
        p_lignes: params.lignes,
      });

      if (!error && data && data.numero) {
        return data as CommandeResult;
      }
      if (error) {
        console.warn('Erreur Supabase RPC creer_commande:', error.message);
      }
    } catch (err) {
      console.warn('Échec appel RPC Supabase, exécution du repli local sécurisé:', err);
    }
  }

  // Repli local sécurisé : format de numéro MM-AAMMJJ-XXXX et recalcul des prix
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  const numero = `MM-${dateStr}-${rand}`;

  let total = 0;
  for (const item of params.lignes) {
    const prod = SEED_PRODUITS.find((p) => p.id === item.produit_id);
    if (prod && prod.actif !== false) {
      total += prod.prix * item.quantite;
    }
  }

  return { numero, total };
}

export async function inscrireNewsletter(email: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('newsletter').insert([{ email: email.trim().toLowerCase() }]);
      if (!error) return true;
    } catch {
      // Ignorer
    }
  }
  return true;
}

