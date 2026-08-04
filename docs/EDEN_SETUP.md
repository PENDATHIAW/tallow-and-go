# Activer la plateforme de gestion EDEN

La première version privée d’EDEN est disponible dans le code à l’adresse :

- `/eden-admin` : connexion
- `/eden-admin/dashboard` : tableau de gestion sécurisé

## 1. Installer la base de données

Dans le tableau de bord Supabase du projet déjà relié à Tallow & Go, ouvrir
**SQL Editor** et exécuter, **dans cet ordre exact**, chacune de ces trois
migrations une seule fois :

1. `supabase/migrations/20260803225000_create_eden_management.sql`
   Crée les 7 Odyssées et les 21 senteurs officielles, les ventes, clientes,
   dépenses, lots, matières, recettes et mouvements de stock, ainsi que les
   fonctions atomiques de vente, d’ajustement de stock et d’entrée de lot.

2. `supabase/migrations/20260804090000_secure_eden_admin_access.sql`
   Verrouille l’accès : crée la table `eden_admins` et remplace « tout
   utilisateur connecté » par « les comptes explicitement autorisés » sur
   toutes les tables EDEN. Ajoute aussi une clé d’idempotence sur les ventes,
   les mouvements de stock, les dépenses et les lots, pour qu’un renvoi
   réseau ne double jamais une action.

   **Sans l’étape finale de ce fichier, plus personne n’a accès, vous y
   compris.** Ouvrez le fichier, repérez le bloc commenté à la fin de la
   section 4, remplacez l’UUID d’exemple par votre propre identifiant
   (Supabase → **Authentication → Users** → colonne **UID** de votre compte
   EDEN), puis exécutez cet `insert` séparément :

   ```sql
   insert into public.eden_admins (user_id, email)
   values ('votre-uuid-ici', 'votre-email@exemple.com')
   on conflict (user_id) do nothing;
   ```

3. `supabase/migrations/20260804120000_eden_sale_operations.sql`
   Ajoute le règlement d’une vente due et l’annulation d’une vente (avec
   restauration automatique du stock, sans jamais supprimer la ligne — la
   vente reste visible, marquée « annulée »).

## 2. Créer le compte administratrice

Dans Supabase :

1. Ouvrir **Authentication → Users**.
2. Cliquer sur **Add user**.
3. Renseigner l’email privé de l’administratrice et un mot de passe fort.
4. Ne pas activer d’inscription publique pour cet espace.
5. Copier son **UID** et l’insérer dans `eden_admins` comme indiqué à
   l’étape 1.2 ci-dessus — sans cette ligne, ce compte peut se connecter
   mais `EdenLogin` le refusera avec le message « Ce compte n’a pas accès à
   EDEN. ».

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
2. Se connecter avec un second compte quelconque du même projet Supabase
   (sans l’avoir ajouté à `eden_admins`) : la connexion doit être refusée
   avec le message « Ce compte n’a pas accès à EDEN. ». Si ce test échoue,
   ne continuez pas — revérifiez la migration 2 et la table `eden_admins`.
3. Ajouter les matières réellement achetées, y compris le pot et l’étiquette.
4. Compléter une recette test.
5. Ajouter quelques pots au stock avec le bouton `+`.
6. Enregistrer une vente test.
7. Vérifier que le stock diminue et que le chiffre d’affaires augmente.
8. Marquer cette vente test comme « À payer », puis cliquer sur **Réglé**
   dans l’onglet Argent : elle doit sortir des paiements en attente.
9. Cliquer sur **Annuler** sur une vente test : le stock doit revenir, la
   vente doit disparaître du chiffre d’affaires affiché mais rester visible,
   marquée annulée.
10. Créer un lot de production et vérifier le compteur de macération.
11. Enregistrer une dépense.
12. Couper le réseau du téléphone, enregistrer une vente : une bannière
    « en attente de réseau » doit apparaître au lieu d’une erreur. Remettre
    le réseau : la vente doit partir automatiquement et la bannière
    disparaître.
13. Dans l’onglet Argent, cliquer sur **Exporter le mois** : un fichier CSV
    doit se télécharger et s’ouvrir correctement dans Excel, accents compris.
14. Laisser le tableau de bord ouvert sans y toucher pendant dix minutes :
    EDEN doit se déconnecter tout seul et revenir à l’écran de connexion.
15. Supprimer ensuite les données de test directement dans Supabase si nécessaire.

## 5. Confidentialité

Les recettes, coûts, clientes et marges sont enregistrés dans Supabase, pas dans le code public. Les tables EDEN ont la sécurité RLS activée et ne sont accessibles qu’aux comptes listés dans `eden_admins` (voir migration 2).

## Fonctionnalités incluses

- tableau de bord financier, ventes exclues du calcul si annulées ;
- vente et déduction automatique du stock ;
- règlement d’une vente due et annulation d’une vente (avec restauration du stock, trace conservée) ;
- suivi des impayés ;
- gestion des stocks et prix ;
- lots de production et macération ;
- matières premières et recettes ;
- calcul du coût de revient et de la marge ;
- dépenses ;
- clé d’idempotence sur ventes, ajustements de stock, dépenses et lots : un renvoi réseau ne compte jamais deux fois la même action ;
- file d’attente hors ligne : une action enregistrée sans réseau part automatiquement au retour du réseau, avec bannière et bouton « Réessayer » ;
- export CSV mensuel (ventes actives + dépenses) depuis l’onglet Argent ;
- déconnexion automatique après dix minutes d’inactivité ;
- affichage mobile adapté à l’iPhone.
