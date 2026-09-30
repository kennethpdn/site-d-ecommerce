export interface Univers {
  id: string;
  slug: string;
  nom: string;
  accroche: string;
  description: string;
  image_url: string | null;
  ordre: number;
}

export interface Produit {
  id: string;
  slug: string;
  nom: string;
  univers_id: string;
  prix: number; // numeric (prix fictif à remplacer)
  accroche?: string | null;
  description_courte?: string | null;
  description_longue?: string | null;
  matieres?: string | null;
  dimensions?: string | null;
  poids?: string | null;
  duree?: string | null;
  parfum?: string | null;
  stock?: number | null;
  images?: string[] | null;
  populaire?: boolean | null;
  actif?: boolean | null;
}

export interface Kit {
  id: string;
  slug: string;
  nom: string;
  description: string;
  prix: number;
  image_url: string | null;
  produits?: Array<{
    produit_id: string;
    quantite: number;
    produit?: Produit;
  }>;
}

export interface KitProduit {
  kit_id: string;
  produit_id: string;
  quantite: number;
}

export interface Article {
  id: string;
  slug: string;
  titre: string;
  extrait: string;
  contenu: string;
  image_url: string | null;
}

export interface CartItem {
  produit_id: string;
  quantite: number;
}
