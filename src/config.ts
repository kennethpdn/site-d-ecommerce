/**
 * Maison Minuit — Configuration centrale
 * Tous les paramètres optionnels restent vides par défaut et ne sont affichés
 * dans l'interface que s'ils sont explicitement renseignés.
 */

export const REVEILLON_TARGET_DATE = new Date('2026-12-31T23:59:59');

export const DEVISE = 'FCFA';

export const NUMERO_WHATSAPP = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined)?.trim() || '2290154754544';

export const DEADLINE_COMMANDE = (import.meta.env.VITE_DEADLINE_COMMANDE as string | undefined)?.trim() || '';

export const DELAI_LIVRAISON = (import.meta.env.VITE_DELAI_LIVRAISON as string | undefined)?.trim() || '';

export const ZONES = (import.meta.env.VITE_ZONES as string | undefined)?.trim() || '';

export const MODE_PAIEMENT = (import.meta.env.VITE_MODE_PAIEMENT as string | undefined)?.trim() || '';

export const RETOURS = (import.meta.env.VITE_RETOURS as string | undefined)?.trim() || '';

export const GUIDE_URL = (import.meta.env.VITE_GUIDE_URL as string | undefined)?.trim() || '';

/**
 * Formatage de prix élégant avec séparateur de milliers et devise FCFA
 */
export function formatPrix(prix: number | null | undefined): string {
  if (prix === null || prix === undefined || isNaN(prix)) {
    return 'Prix sur demande';
  }
  const formatted = Math.round(prix)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} ${DEVISE}`;
}
