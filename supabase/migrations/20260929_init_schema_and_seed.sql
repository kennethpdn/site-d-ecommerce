-- ==============================================================================
-- MAISON MINUIT — Migration Supabase & Schéma Relationnel
-- Réveillon du 31 Décembre 2026
-- ==============================================================================

-- 1. Table: Univers
CREATE TABLE IF NOT EXISTS public.univers (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    nom TEXT NOT NULL,
    accroche TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    ordre INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Table: Produits
CREATE TABLE IF NOT EXISTS public.produits (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    nom TEXT NOT NULL,
    univers_id TEXT REFERENCES public.univers(id) ON DELETE SET NULL,
    prix NUMERIC NOT NULL,
    accroche TEXT,
    description_courte TEXT,
    description_longue TEXT,
    matieres TEXT,
    dimensions TEXT,
    poids TEXT,
    duree TEXT,
    parfum TEXT,
    stock INTEGER DEFAULT 0,
    images TEXT[],
    populaire BOOLEAN DEFAULT FALSE,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Table: Kits
CREATE TABLE IF NOT EXISTS public.kits (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    nom TEXT NOT NULL,
    description TEXT NOT NULL,
    prix NUMERIC NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Table: Kit Produits
CREATE TABLE IF NOT EXISTS public.kit_produits (
    kit_id TEXT NOT NULL REFERENCES public.kits(id) ON DELETE CASCADE,
    produit_id TEXT NOT NULL REFERENCES public.produits(id) ON DELETE CASCADE,
    quantite INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (kit_id, produit_id)
);

-- 5. Table: Articles
CREATE TABLE IF NOT EXISTS public.articles (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    titre TEXT NOT NULL,
    extrait TEXT NOT NULL,
    contenu TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- POLITIQUES DE SÉCURITÉ ROW LEVEL SECURITY (RLS)
-- Lecture publique autorisée (SELECT). Aucune écriture publique.
-- ==============================================================================

ALTER TABLE public.univers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kit_produits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique univers" ON public.univers FOR SELECT USING (true);
CREATE POLICY "Lecture publique produits" ON public.produits FOR SELECT USING (actif = true);
CREATE POLICY "Lecture publique kits" ON public.kits FOR SELECT USING (true);
CREATE POLICY "Lecture publique kit_produits" ON public.kit_produits FOR SELECT USING (true);
CREATE POLICY "Lecture publique articles" ON public.articles FOR SELECT USING (true);

-- ==============================================================================
-- INSERTION DES DONNÉES INITIALES (SEED)
-- ==============================================================================

INSERT INTO public.univers (id, slug, nom, accroche, description, ordre) VALUES
('u-compte-a-rebours', 'compte-a-rebours', 'Compte à rebours', 'Les chiffres qui font battre le cœur à 23 h 59.', 'L’attente de minuit concentre toutes les attentions dans les dernières minutes de l’année. Cet univers rassemble sabliers, cadrans silencieux et résonances douces pour rythmer le passage du temps.', 1),
('u-salon-dore', 'salon-dore', 'Salon doré', 'Le grand salon, à la lumière des dorures.', 'Les dorures et les flammes chaudes révèlent les textures du grand salon au crépuscule. Cet univers compose un écrin de miroirs patinés et de candélabres sculpturaux pour recevoir vos proches.', 2),
('u-diner-de-minuit', 'diner-de-minuit', 'Dîner de minuit', 'Une table qui donne envie de rester.', 'Une table de réveillon se joue dans les détails : une flamme, un reflet, un verre qui brille. Cet univers réunit bougies, photophores et centres de table pour que la conversation dure jusqu’à l’aube.', 3),
('u-nuit-scintillante', 'nuit-scintillante', 'Nuit scintillante', 'Un ciel d’étoiles, dans votre salon.', 'Les micro-lumières créent une voûte diaphane qui adoucit les contours de la pièce. Cet univers suspend le temps grâce à des guirlandes argentées et des suspensions facettées.', 4),
('u-exterieur', 'exterieur', 'Extérieur', 'Que la façade fête l’année, elle aussi.', 'L’accueil de vos hôtes commence dès le franchissement du portail sous la fraîcheur nocturne. Cet univers illumine les allées et les balcons avec des lanternes monumentales et des vasques de feu.', 5),
('u-rituel-du-1er-janvier', 'rituel-du-1er-janvier', 'Rituel du 1er janvier', 'Le lendemain, tout en douceur.', 'Les premières heures de l’an neuf invitent au silence et à la contemplation d’un jour nouveau. Cet univers réunit des grès tournés, des plaids soyeux et des papiers vergés pour consigner vos souhaits.', 6)
ON CONFLICT (id) DO UPDATE SET accroche = EXCLUDED.accroche, description = EXCLUDED.description;

-- Produits (prix fictifs signalés à remplacer)
INSERT INTO public.produits (id, slug, nom, univers_id, prix, accroche, description_courte, description_longue, matieres, stock, populaire, actif) VALUES
('p-bougie-nuit-blanche', 'bougie-nuit-blanche', 'Bougie Nuit Blanche', 'u-diner-de-minuit', 28000, 'Elle veille avec vous jusqu’aux douze coups.', 'Une bougie au pot noir et à l’étiquette immaculée, pour une table de réveillon sobre et lumineuse.', 'Nuit Blanche joue le contraste : un pot en verre noir brillant, une cire claire et une flamme douce qui éclaire la table sans l’écraser. Son étiquette blanche, sobre et élégante, s’accorde avec les couverts, les photophores et les nappes de fête. Posée au centre du dîner, elle installe l’atmosphère avant l’arrivée des invités et accompagne la soirée jusqu’au premier matin de 2027.', 'Pot en verre noir brillant, cire claire noble, mèche de lin', 35, true, true),
('p-bougie-or-de-minuit', 'bougie-or-de-minuit', 'Bougie Or de Minuit', 'u-diner-de-minuit', 32000, 'L’éclat doré du dernier soir de l’année.', 'Un pot noir mat orné d’un monogramme doré, dont la lumière chaude fait briller toute la pièce.', 'Or de Minuit est pensée comme un objet de décoration autant que comme une bougie. Son pot noir mat, cerclé d’un liseré doré à l’intérieur, porte un monogramme en or. Allumée, elle diffuse un halo chaud qui fait ressortir les surfaces sombres et les touches métalliques de votre décor.', 'Pot noir mat, intérieur liseré doré, monogramme or à chaud', 28, true, true),
('p-chemin-de-table-nocturne', 'chemin-de-table-nocturne', 'Chemin de Table Nocturne', 'u-diner-de-minuit', 52000, 'Le tissage lourd du lin bleu profond.', 'Lin lavé de grand tissage, bordé d’un filet champagne tissé en lisière.', 'Il habille la longueur de votre table avec une texture organique et une tenue impeccable.', 'Pur lin prélavé de filature européenne', 16, false, true),
('p-repose-couverts-albatre', 'repose-couverts-albatre', 'Repose-Couverts Albâtre', 'u-diner-de-minuit', 24000, 'Quatre blocs minéraux sculptés dans la pierre.', 'Ensemble de quatre cales de table taillées dans un albâtre translucide.', 'Une ponctuation minérale qui reçoit les couverts entre les plats avec une discrète noblesse.', 'Albâtre naturel poli satin', 18, false, true),

('p-clepsydre-astrale', 'clepsydre-astrale', 'Clepsydre Astrale', 'u-compte-a-rebours', 65000, 'Le passage mesuré des instants précieux.', 'Sablier de précision en verre soufflé et sable minéral noir rehaussé de particules dorées.', 'Posé au centre de vos festivités, cet instrument capte le regard tandis que s’égrènent les derniers instants avant minuit.', 'Verre borosilicate soufflé, sable de quartz noir', 12, true, true),
('p-cadran-solennel', 'cadran-solennel', 'Cadran Solennel', 'u-compte-a-rebours', 82000, 'Un repère discret pour l’ultime minute.', 'Horloge murale silencieuse à mouvement doux, cerclage en laiton brossé et fond bleu nuit.', 'Conçue pour ponctuer le salon d’une présence calme et noble sans troubler la musique de vos réjouissances.', 'Laiton brossé, verre minéral antireflet', 8, false, true),
('p-carillon-cristallin', 'carillon-cristallin', 'Carillon Cristallin', 'u-compte-a-rebours', 48000, 'Une résonance cristalline pour les douze coups.', 'Cloche de table cérémonielle en cristal taillé main et manche en argent patiné.', 'Un timbre pur et velouté pour faire silence et porter le toast solennel au franchissement de l’année.', 'Cristal soufflé à la bouche, argent patiné', 15, false, true),
('p-flambeau-de-minuit', 'flambeau-de-minuit', 'Flambeau de Minuit', 'u-compte-a-rebours', 39000, 'Le flambeau rituel pour allumer l’espoir.', 'Cierge rituel de grande taille infusé de cire végétale naturelle non fumigène.', 'À embraser à 23 heures pour accompagner la transition avec une flamme haute et immobile.', 'Cire végétale pure, mèche en coton tressé', 20, true, true),

('p-miroir-soleil-bruni', 'miroir-soleil-bruni', 'Miroir Soleil Bruni', 'u-salon-dore', 145000, 'Un astre immobile pour sublimer la pièce.', 'Rayonnement sculptural composé de tiges de laiton chaud travaillées à la flamme.', 'Il reflète les chandelles et multiplie la clarté du réveillon dans tout votre espace de réception.', 'Laiton artisanal patiné', 5, true, true),
('p-candelabre-olympe', 'candelabre-olympe', 'Candélabre Olympe', 'u-salon-dore', 92000, 'Cinq feux de lumière chaleureuse.', 'Pièce maîtresse architecturée à branches asymétriques en fonte d’aluminium dorée mat.', 'Il accueille vos cierges fins avec une stabilité remarquable et une géométrie contemporaine.', 'Fonte d’aluminium, finition dorée sablée', 9, false, true),
('p-photophore-aureole', 'photophore-aureole', 'Photophore Auréole', 'u-salon-dore', 34000, 'Un halo ambré diffus et feutré.', 'Verre double paroi teinté champagne et socle texturé taillé dans la masse.', 'Sa structure dissimule la flamme pour ne laisser filtrer qu’une chaleur visuelle d’une grande quiétude.', 'Verre texturé teinté dans la masse', 24, false, true),
('p-plateau-dapparat-dore', 'plateau-dapparat-dore', 'Plateau d’Apparat Doré', 'u-salon-dore', 58000, 'Le service raffiné des coupes de fête.', 'Plateau rectangulaire aux bordures franches et fond satiné préservant des rayures.', 'Conçu pour la présentation des flûtes de champagne et des mets d’accueil de votre soirée.', 'Acier brossé plaqué or doux', 14, true, true),

('p-guirlande-diaphane', 'guirlande-diaphane', 'Guirlande Diaphane', 'u-nuit-scintillante', 38000, 'Un ruban de micro-diodes aux reflets chauds.', 'Fil de cuivre gainé d’argent mat portant cent micro-lumières blanc chaud feutré.', 'Elle se faufile entre les feuillages ou court le long d’une corniche pour créer une nappe lumineuse sans éblouir.', 'Micro-LED 2400K, câble argenté flexible', 40, true, true),
('p-suspension-nebuleuse', 'suspension-nebuleuse', 'Suspension Nébuleuse', 'u-nuit-scintillante', 110000, 'Une sphère de fils d’argent en lévitation.', 'Luminaire aérien tressé à la main, créant des ombres projetées délicates.', 'Suspendue au-dessus d’un guéridon ou dans un hall, elle donne l’illusion d’une constellation capturée.', 'Fils d’acier et d’argent entrelacés', 7, false, true),
('p-etoile-de-faite-facettee', 'etoile-de-faite-facettee', 'Étoile de Faîte Facettée', 'u-nuit-scintillante', 45000, 'Le point d’orgue géométrique.', 'Sculpture à facettes en verre biseauté et soudures laiton champagne.', 'Elle couronne un arrangement végétal ou se pose sur une console comme un prisme précieux.', 'Verre biseauté, laiton patiné', 14, false, true),
('p-cascade-boreale', 'cascade-boreale', 'Cascade Boréale', 'u-nuit-scintillante', 76000, 'Un rideau de lueurs délicates.', 'Rideau lumineux à brins verticaux indépendants pour habiller une baie vitrée.', 'Il métamorphose la vue nocturne en une draperie lumineuse d’une discrétion totale.', 'Polymère optique, câblage textile sombre', 11, true, true),

('p-lanterne-monumentale', 'lanterne-monumentale', 'Lanterne Monumentale', 'u-exterieur', 125000, 'La silhouette protectrice du parvis.', 'Grande lanterne d’extérieur en acier traité noir mat et vitres claires épaisses.', 'Conçue pour résister aux brises d’hiver tout en abritant un feu de cire généreux.', 'Acier traité thermolaqué, verre securit 4mm', 6, true, true),
('p-brasero-de-minuit', 'brasero-de-minuit', 'Brasero de Minuit', 'u-exterieur', 195000, 'Un foyer d’accueil pour le décompte en plein air.', 'Vasque épurée en acier corten stabilisé, reposant sur un socle géométrique franc.', 'Elle réunit vos invités autour de braises rougeoyantes pour trinquer sous la voûte d’hiver.', 'Acier corten de forte épaisseur', 4, false, true),
('p-balise-porte-bonheur', 'balise-porte-bonheur', 'Balise Porte-Bonheur', 'u-exterieur', 42000, 'Le tracé lumineux de l’allée d’honneur.', 'Piquet de sol en bronze patiné surmonté d’un diffuseur en verre opaque sablé.', 'À planter le long de votre accès pour jalonner la venue des premières voitures avec distinction.', 'Bronze d’art coulé, verre opalin', 22, false, true),
('p-torche-scandinave', 'torche-scandinave', 'Torche Scandinave', 'u-exterieur', 31000, 'Une combustion lente et naturelle.', 'Bûche de résineux évidée et préparée selon la méthode nordique traditionnelle.', 'Elle offre deux heures de flamme verticale continue pour saluer l’arrivée de la minuit.', 'Bois de pin issu de forêts gérées, mèche végétale', 30, true, true),

('p-coffret-des-souhaits', 'coffret-des-souhaits', 'Coffret des Souhaits', 'u-rituel-du-1er-janvier', 55000, 'Les premiers mots couchés sur papier vergé.', 'Écrin rigide contenant cinquante cartes de vœux épaisses et un cachet de cire noire.', 'Un rituel intime pour consigner les intentions de l’année naissante dès les premières heures de l’aube.', 'Papier chiffon 350g, cire de sceau naturelle', 19, true, true),
('p-brume-daurore', 'brume-daurore', 'Brume d’Aurore', 'u-rituel-du-1er-janvier', 36000, 'La fraîcheur végétale du premier matin.', 'Brume d’ambiance aux notes d’aiguilles de cèdre blanc et d’agrumes givrés.', 'À vaporiser sur le linge et dans les pièces pour renouveler l’air et ouvrir le premier jour dans la clarté.', 'Alcool biologique, essences de cèdre et bergamote', 25, false, true),
('p-plaid-cachemire-givre', 'plaid-cachemire-givre', 'Plaid Cachemire Givré', 'u-rituel-du-1er-janvier', 180000, 'Une étreinte soyeuse pour le réveil.', 'Laine de cachemire brossée au ton écru argenté, franges courtes nouées à la main.', 'Il vous accompagne lors du premier café partagé face au jour qui se lève sur l’horizon d’hiver.', '100% cachemire de Mongolie peigné', 5, false, true),
('p-tasse-en-gres-cendree', 'tasse-en-gres-cendree', 'Tasse en Grès Cendrée', 'u-rituel-du-1er-janvier', 22000, 'Le premier breuvage de l’an neuf.', 'Pièce tournée d’une seule traite, émail satiné aux nuances de cendre et d’or pâle.', 'Sa prise en main généreuse restitue la chaleur de l’infusion pour un moment de silence contemplatif.', 'Grès chamotté cuit à haute température', 26, true, true)
ON CONFLICT (id) DO NOTHING;

-- Kits
INSERT INTO public.kits (id, slug, nom, description, prix) VALUES
('k-table-de-minuit', 'table-de-minuit', 'Table de minuit', 'Bougies, photophores et chemin de table, réunis pour un dîner sans faute.', 120000),
('k-salon-dore', 'salon-dore', 'Salon doré', 'Guirlandes, sphères et rideaux lumineux pour habiller la pièce en une soirée.', 198000),
('k-facade-etoilee', 'facade-etoilee', 'Façade étoilée', 'Guirlandes et projecteurs d’ambiance pour éclairer l’entrée et le balcon.', 260000)
ON CONFLICT (id) DO UPDATE SET description = EXCLUDED.description;

-- Kit Produits
INSERT INTO public.kit_produits (kit_id, produit_id, quantite) VALUES
('k-table-de-minuit', 'p-bougie-nuit-blanche', 2),
('k-table-de-minuit', 'p-bougie-or-de-minuit', 2),
('k-table-de-minuit', 'p-chemin-de-table-nocturne', 1),
('k-table-de-minuit', 'p-repose-couverts-albatre', 1),

('k-salon-dore', 'p-candelabre-olympe', 1),
('k-salon-dore', 'p-photophore-aureole', 2),
('k-salon-dore', 'p-plateau-dapparat-dore', 1),

('k-facade-etoilee', 'p-lanterne-monumentale', 2),
('k-facade-etoilee', 'p-guirlande-diaphane', 1)
ON CONFLICT (kit_id, produit_id) DO NOTHING;

-- Articles
INSERT INTO public.articles (id, slug, titre, extrait, contenu) VALUES
('a-composer-table-reveillon', 'composer-une-table-de-reveillon-en-5-gestes', 'Composer une table de réveillon en 5 gestes', 'Une nappe sombre, une lumière chaude, un seul métal. Cinq gestes suffisent pour transformer un dîner en événement.', '1. Choisir une nappe sombre
Le noir ou le bleu nuit absorbe la clarté ambiante et crée une assise théâtrale pour la vaisselle. Les assiettes et les couverts clairs s’y découpent avec une netteté remarquable.

2. S’en tenir à une teinte métallique
Le mélange des ors et des chromes disperse le regard et brouille la lecture de la table. Choisissez un seul métal pour l’ensemble des chandeliers, couverts et liserés.

3. Multiplier les petites lumières
Les grandes sources aveuglent et coupent les convives dans leurs conversations intimes. Disposez de nombreux photophores bas pour baigner chaque couvert d’une lueur feutrée.

4. Varier les hauteurs
Une table plane manque de souffle et tasse les perspectives de votre salle à manger. Érigez deux ou trois cierges hauts au centre, puis redescendez vers des pièces rases aux extrémités.

5. Éteindre le plafonnier
La lumière zénithale écrase les visages et brise le mystère des douze coups de minuit. Dès l’entrée des premiers invités, laissez les bougies et lampes d’appoint régner seules.'),
('a-le-temps-suspendu-du-31', 'le-temps-suspendu-du-31-decembre', 'Le temps suspendu du 31 décembre', 'Une halte collective pour célébrer l’intervalle entre deux années.', 'La dernière nuit de l’année n’est pas une simple transition calendaire. Elle constitue une parenthèse où le monde s’accorde une halte pour mesurer le chemin parcouru et projeter ses espérances dans le silence qui précède les douze coups.'),
('a-lart-des-lueurs-feutrees', 'lart-des-lueurs-feutrees', 'L’art des lueurs feutrées et de la pénombre', 'Doser les intensités pour sublimer les matières sans éblouir.', 'L’éclat d’une fête réussie réside dans l’art de soustraire la lumière directe. Privilégiez des sources multiples à faible intensité réparties à différentes hauteurs pour nimber la pièce d’une aura dorée et chaleureuse.')
ON CONFLICT (id) DO UPDATE SET titre = EXCLUDED.titre, extrait = EXCLUDED.extrait, contenu = EXCLUDED.contenu;
