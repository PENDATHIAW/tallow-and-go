# Activer la plateforme de gestion EDEN

La première version privée d’EDEN est disponible dans le code à l’adresse :

- `/eden-admin` : connexion
- `/eden-admin/dashboard` : tableau de gestion sécurisé

## 1. Installer la base de données

Dans le tableau de bord Supabase du projet déjà relié à Tallow & Go :

1. Ouvrir **SQL Editor**.
2. Copier le contenu de `supabase/migrations/20260803225000_create_eden_management.sql`.
3. Exécuter la migration une seule fois.

La migration crée :

- les 7 Odyssées et les 21 senteurs officielles ;
- les ventes, clientes, dépenses, lots, matières, recettes et mouvements de stock ;
- les fonctions atomiques de vente, d’ajustement de stock et d’entrée de lot ;
- les règles RLS limitant les données aux utilisateurs authentifiés.

## 2. Créer le compte administratrice

Dans Supabase :

1. Ouvrir **Authentication → Users**.
2. Cliquer sur **Add user**.
3. Renseigner l’email privé de l’administratrice et un mot de passe fort.
4. Ne pas activer d’inscription publique pour cet espace.

Ce compte sera utilisé sur `/eden-admin`.

## 3. Variables d’environnement

Vérifier que le déploiement Vercel contient déjà :

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Ne jamais placer la clé `service_role` dans le navigateur ou dans GitHub.

## 4. Tester avant la mise en production

Effectuer ces tests dans cet ordre :

1. Se connecter à `/eden-admin`.
2. Ajouter les matières réellement achetées, y compris le pot et l’étiquette.
3. Compléter une recette test.
4. Ajouter quelques pots au stock avec le bouton `+`.
5. Enregistrer une vente test.
6. Vérifier que le stock diminue et que le chiffre d’affaires augmente.
7. Créer un lot de production et vérifier le compteur de macération.
8. Enregistrer une dépense.
9. Supprimer ensuite les données de test directement dans Supabase si nécessaire.

## 5. Confidentialité

Les recettes, coûts, clientes et marges sont enregistrés dans Supabase, pas dans le code public. Les tables EDEN ont la sécurité RLS activée et ne sont accessibles qu’après authentification.

## Fonctionnalités incluses dans le MVP

- tableau de bord financier ;
- vente et déduction automatique du stock ;
- suivi des impayés ;
- gestion des stocks et prix ;
- lots de production et macération ;
- matières premières et recettes ;
- calcul du coût de revient et de la marge ;
- dépenses ;
- affichage mobile adapté à l’iPhone.
