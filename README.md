# Maison Minuit

Boutique en ligne premium de décoration et illuminations pour le réveillon du 31 décembre 2026.
Site mobile-first, sombre, élégant et cérémoniel, conçu sans paiement en ligne : la commande est enregistrée dans Supabase, puis confirmée avec le client sur WhatsApp ; le règlement et la livraison s'effectuent hors ligne.

---

## 1. Variables d'Environnement

Créez un fichier `.env` à la racine en vous basant sur `.env.example` :

```bash
# Configuration Supabase
VITE_SUPABASE_URL="https://votre-projet.supabase.co"
VITE_SUPABASE_ANON_KEY="votre_cle_anon_publique"

# Contact & Conciergerie WhatsApp
VITE_WHATSAPP_NUMBER="2290154754544"

# Lien optionnel du guide des 10 ambiances (section newsletter de l'accueil)
VITE_GUIDE_URL="https://maisonminuit.com/guides/10-ambiances.pdf"

# Informations logistiques optionnelles (affichées uniquement si renseignées)
VITE_DEADLINE_COMMANDE="28 décembre 2026 à 18h"
VITE_DELAI_LIVRAISON="Sous 24h à 48h par coursier dédié"
VITE_ZONES="Abidjan, Dakar, Paris et environs"
VITE_MODE_PAIEMENT="Règlement à la livraison par espèces ou transfert sécurisé"
VITE_RETOURS="Retours acceptés sous 48h après la réception en cas d'avarie"
```

*Remarque :* L'application dispose d'un repli local autonome complet. Si les clés Supabase ne sont pas renseignées, la navigation, la sélection en `localStorage`, le calcul des prix et la commande fonctionnent instantanément.

---

## 2. Ordre d'Exécution des Migrations SQL Supabase

Dans l'interface Supabase (SQL Editor), appliquez les fichiers de migration dans l'ordre suivant :

1. **`supabase/migrations/20260929_init_schema_and_seed.sql`**
   - Crée les tables : `univers`, `produits`, `kits`, `kit_produits`, `articles`.
   - Active la Row Level Security (RLS) avec lecture publique autorisée (SELECT).
   - Insère les 6 univers, les 24 produits de la collection, les 3 kits et les articles de carnet.

2. **`supabase/migrations/20260929_commandes_and_rpc.sql`**
   - Crée les tables : `commandes`, `commande_lignes`, `newsletter`.
   - Active la RLS sans lecture publique.
   - Définit la politique d'insertion publique avec validation d'email pour la table `newsletter`.
   - Crée la fonction RPC `creer_commande(...)` en `SECURITY DEFINER` avec recalcul des prix côté serveur, contrôle des stocks, validation des champs obligatoires et génération des numéros au format `MM-AAMMJJ-XXXX`.
   - Accorde les droits d'exécution `GRANT EXECUTE` au rôle `anon`.

---

## 3. Commandes de Compilation et de Build

```bash
# Installation des dépendances
npm install

# Lancer le serveur de développement local
npm run dev

# Vérifier la validité des types TypeScript
npm run lint

# Compiler l'application pour la production
npm run build
```

Le build de production est généré dans le dossier **`dist/`**.
Le déploiement est compatible avec Vercel (configuration de réécriture SPA fournie dans `vercel.json`), Netlify ou tout hébergeur de site statique.

---

## 4. Parcours Utilisateur Hors-Ligne

1. **Sélection** : Ajout de pièces au panier avec persistance `localStorage` synchrone.
2. **Tunnel `/commande`** : Saisie du nom, téléphone WhatsApp, adresse et créneau souhaité.
3. **Sécurité** : Appel de la fonction RPC `creer_commande` avec recalcul des prix serveur et attribution de la référence `MM-AAMMJJ-XXXX`.
4. **Confirmation `/commande/confirmation`** : Lien direct WhatsApp prérempli (`https://wa.me/2290154754544?text=...`) et bouton pour copier le récapitulatif textuel.
