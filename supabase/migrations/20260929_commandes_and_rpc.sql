-- ==============================================================================
-- MAISON MINUIT — Migration : Commandes Hors-Ligne, RPC & Newsletter
-- Réveillon du 31 Décembre 2026
-- ==============================================================================

-- 1. Table des Commandes
CREATE TABLE IF NOT EXISTS public.commandes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero TEXT UNIQUE NOT NULL,
    nom TEXT NOT NULL,
    telephone TEXT NOT NULL,
    adresse TEXT NOT NULL,
    creneau TEXT,
    notes TEXT,
    total NUMERIC NOT NULL,
    statut TEXT NOT NULL DEFAULT 'nouvelle',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Table des Lignes de Commande
CREATE TABLE IF NOT EXISTS public.commande_lignes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    commande_id UUID NOT NULL REFERENCES public.commandes(id) ON DELETE CASCADE,
    produit_id TEXT NOT NULL REFERENCES public.produits(id),
    nom TEXT NOT NULL,
    prix_unitaire NUMERIC NOT NULL,
    quantite INTEGER NOT NULL CHECK (quantite >= 1 AND quantite <= 20)
);

-- 3. Table Newsletter
CREATE TABLE IF NOT EXISTS public.newsletter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Aucune lecture publique sur ces trois tables.
-- Le client anon ne peut pas insérer directement dans commandes/commande_lignes.
-- ==============================================================================

ALTER TABLE public.commandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commande_lignes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;

-- Pas de SELECT public (lecture réservée aux administrateurs ou service_role)
-- Pas de direct INSERT sur commandes et commande_lignes pour anon (passage obligatoire par la fonction RPC creer_commande)

-- Politique d'insertion contrôlée sur la table newsletter pour anon
CREATE POLICY "Insertion publique newsletter" ON public.newsletter
    FOR INSERT TO anon, authenticated
    WITH CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- ==============================================================================
-- FONCTION RPC : creer_commande
-- Sécurité : SECURITY DEFINER, search_path = public
-- Validation stricte : nom, téléphone, adresse non vides
-- Quantités 1 à 20, refus des produits inactifs, recalcul sécurisé du prix depuis la table produits
-- Génération du numéro : MM-AAMMJJ-XXXX
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.creer_commande(
    p_nom TEXT,
    p_telephone TEXT,
    p_adresse TEXT,
    p_creneau TEXT,
    p_notes TEXT,
    p_lignes JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_commande_id UUID;
    v_numero TEXT;
    v_total NUMERIC := 0;
    v_ligne JSONB;
    v_produit_id TEXT;
    v_quantite INTEGER;
    v_produit_nom TEXT;
    v_produit_prix NUMERIC;
    v_produit_actif BOOLEAN;
    v_rand_part TEXT;
BEGIN
    -- 1. Validation des champs obligatoires
    IF TRIM(COALESCE(p_nom, '')) = '' THEN
        RAISE EXCEPTION 'Le nom complet est obligatoire.';
    END IF;

    IF TRIM(COALESCE(p_telephone, '')) = '' THEN
        RAISE EXCEPTION 'Le numéro de téléphone est obligatoire.';
    END IF;

    IF TRIM(COALESCE(p_adresse, '')) = '' THEN
        RAISE EXCEPTION 'L’adresse de livraison est obligatoire.';
    END IF;

    IF p_lignes IS NULL OR jsonb_array_length(p_lignes) = 0 THEN
        RAISE EXCEPTION 'La commande doit comporter au moins un article.';
    END IF;

    -- 2. Génération du numéro de commande au format MM-AAMMJJ-XXXX
    v_rand_part := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    v_numero := 'MM-' || TO_CHAR(NOW(), 'YYMMDD') || '-' || v_rand_part;

    -- Vérification d'unicité éventuelle
    WHILE EXISTS (SELECT 1 FROM public.commandes WHERE numero = v_numero) LOOP
        v_rand_part := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        v_numero := 'MM-' || TO_CHAR(NOW(), 'YYMMDD') || '-' || v_rand_part;
    END LOOP;

    -- 3. Création initiale de la commande avec total temporaire à 0
    INSERT INTO public.commandes (numero, nom, telephone, adresse, creneau, notes, total, statut)
    VALUES (
        v_numero,
        TRIM(p_nom),
        TRIM(p_telephone),
        TRIM(p_adresse),
        NULLIF(TRIM(p_creneau), ''),
        NULLIF(TRIM(p_notes), ''),
        0,
        'nouvelle'
    )
    RETURNING id INTO v_commande_id;

    -- 4. Parcours des lignes de commande & recalcul sécurisé des prix
    FOR v_ligne IN SELECT * FROM jsonb_array_elements(p_lignes)
    LOOP
        v_produit_id := v_ligne->>'produit_id';
        v_quantite := COALESCE((v_ligne->>'quantite')::INTEGER, 0);

        IF v_quantite < 1 OR v_quantite > 20 THEN
            RAISE EXCEPTION 'La quantité pour chaque article doit être comprise entre 1 et 20.';
        END IF;

        -- Recherche du produit en base (ne jamais faire confiance au prix envoyé par le client)
        SELECT nom, prix, actif
        INTO v_produit_nom, v_produit_prix, v_produit_actif
        FROM public.produits
        WHERE id = v_produit_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Produit introuvable : %', v_produit_id;
        END IF;

        IF v_produit_actif IS FALSE THEN
            RAISE EXCEPTION 'Le produit « % » n’est plus disponible.', v_produit_nom;
        END IF;

        -- Ajout du sous-total
        v_total := v_total + (v_produit_prix * v_quantite);

        -- Insertion de la ligne
        INSERT INTO public.commande_lignes (commande_id, produit_id, nom, prix_unitaire, quantite)
        VALUES (v_commande_id, v_produit_id, v_produit_nom, v_produit_prix, v_quantite);
    END LOOP;

    -- 5. Mise à jour du total calculé
    UPDATE public.commandes
    SET total = v_total
    WHERE id = v_commande_id;

    -- 6. Retour du numéro et du total
    RETURN jsonb_build_object(
        'numero', v_numero,
        'total', v_total
    );
END;
$$;

-- Droits d'exécution accordés au rôle anonyme pour la validation de commande
GRANT EXECUTE ON FUNCTION public.creer_commande(TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) TO anon, authenticated;
