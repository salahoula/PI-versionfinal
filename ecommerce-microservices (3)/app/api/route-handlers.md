# Route Handlers (Backend)

Ce dossier contient tous les gestionnaires de routes API (route handlers) qui servent de backend pour l'application.

Ces routes API peuvent :
1. Communiquer avec les microservices externes
2. Effectuer des opérations de validation
3. Gérer l'authentification et l'autorisation
4. Servir de proxy pour les microservices

Exemple de structure :
- `/api/auth/[...route]/route.ts` - Routes d'authentification
- `/api/products/[...route]/route.ts` - Routes pour les produits
- `/api/orders/[...route]/route.ts` - Routes pour les commandes
- `/api/admin/[...route]/route.ts` - Routes pour l'administration
\`\`\`

Maintenant, créons quelques exemples de route handlers pour le backend :
