# E-commerce Microservices - Structure du Projet

Ce projet est une application e-commerce basée sur une architecture microservices. Voici la structure du projet pour vous aider à comprendre comment ajouter ou améliorer le code.

## Structure des dossiers

\`\`\`
/
├── app/                    # Frontend (pages Next.js)
│   ├── admin/              # Interface d'administration
│   ├── api/                # Backend (Route Handlers Next.js)
│   ├── products/           # Pages des produits
│   ├── cart/               # Page du panier
│   ├── checkout/           # Page de paiement
│   └── ...
├── components/             # Composants React réutilisables
│   ├── ui/                 # Composants UI de base (shadcn/ui)
│   └── ...
├── lib/                    # Utilitaires et services
│   ├── services/           # Services pour communiquer avec les microservices
│   │   ├── auth-service.ts # Service d'authentification
│   │   ├── catalog-service.ts # Service de catalogue
│   │   └── order-service.ts # Service de commandes
│   ├── auth.ts             # Fonctions d'authentification
│   └── utils.ts            # Fonctions utilitaires
├── types/                  # Types TypeScript partagés
│   ├── product.ts          # Types pour les produits
│   ├── order.ts            # Types pour les commandes
│   └── user.ts             # Types pour les utilisateurs
└── next.config.mjs         # Configuration Next.js (rewrites pour les microservices)
\`\`\`

## Frontend (app/)

Le dossier `app/` contient toutes les pages de l'application frontend. Chaque sous-dossier correspond à une route dans l'application.

- `app/page.tsx` - Page d'accueil
- `app/products/` - Pages de catalogue et détails des produits
- `app/cart/` - Page du panier
- `app/checkout/` - Page de paiement
- `app/admin/` - Interface d'administration

### Composants (components/)

Le dossier `components/` contient tous les composants React réutilisables.

- `components/ui/` - Composants UI de base (shadcn/ui)
- `components/product-card.tsx` - Carte de produit réutilisable
- `components/header.tsx` - En-tête de l'application
- `components/footer.tsx` - Pied de page de l'application

## Backend (app/api/)

Le dossier `app/api/` contient tous les gestionnaires de routes API (route handlers) qui servent de backend pour l'application. Ces routes API communiquent avec les microservices externes.

- `app/api/auth/` - Routes d'authentification
- `app/api/products/` - Routes pour les produits
- `app/api/orders/` - Routes pour les commandes
- `app/api/admin/` - Routes pour l'administration

### Services (lib/services/)

Le dossier `lib/services/` contient les services qui communiquent avec les microservices externes.

- `lib/services/auth-service.ts` - Service d'authentification
- `lib/services/catalog-service.ts` - Service de catalogue
- `lib/services/order-service.ts` - Service de commandes

## Types partagés (types/)

Le dossier `types/` contient les types TypeScript partagés entre le frontend et le backend.

- `types/product.ts` - Types pour les produits
- `types/order.ts` - Types pour les commandes
- `types/user.ts` - Types pour les utilisateurs

## Comment ajouter ou améliorer le code

### Ajouter une nouvelle page frontend

1. Créez un nouveau dossier dans `app/` correspondant à la route souhaitée
2. Ajoutez un fichier `page.tsx` dans ce dossier
3. Utilisez les composants existants et les services pour créer la page

Exemple:
\`\`\`tsx
// app/categories/page.tsx
import { getCategories } from "@/lib/services/catalog-service"

export default async function CategoriesPage() {
  const categories = await getCategories()
  
  return (
    <div>
      <h1>Catégories</h1>
      {/* Afficher les catégories */}
    </div>
  )
}
\`\`\`

### Ajouter une nouvelle route API

1. Créez un nouveau dossier dans `app/api/` correspondant à la route souhaitée
2. Ajoutez un fichier `route.ts` dans ce dossier
3. Implémentez les méthodes HTTP nécessaires (GET, POST, PUT, DELETE)

Exemple:
\`\`\`tsx
// app/api/categories/route.ts
import { NextResponse } from "next/server"
import { fetchFromCatalogService } from "@/lib/services/catalog-service"

export async function GET() {
  try {
    const categories = await fetchFromCatalogService("/categories")
    return NextResponse.json({ categories })
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des catégories" },
      { status: 500 }
    )
  }
}
\`\`\`

### Ajouter un nouveau service

1. Créez un nouveau fichier dans `lib/services/`
2. Implémentez les fonctions nécessaires pour communiquer avec le microservice

Exemple:
\`\`\`tsx
// lib/services/analytics-service.ts
import { getAuthToken } from "@/lib/auth"

const ANALYTICS_SERVICE_URL = process.env.ANALYTICS_SERVICE_URL || "http://localhost:8083"

export async function fetchFromAnalyticsService(endpoint, options = {}) {
  // Implémentation similaire aux autres services
}

export async function getSalesStats() {
  return fetchFromAnalyticsService("/stats/sales")
}
\`\`\`

### Ajouter un nouveau type

1. Créez un nouveau fichier dans `types/` ou ajoutez à un fichier existant
2. Définissez les interfaces et types nécessaires

Exemple:
\`\`\`tsx
// types/analytics.ts
export interface SalesStats {
  totalSales: number
  averageOrderValue: number
  topProducts: {
    productId: string
    name: string
    sales: number
  }[]
}
\`\`\`

## Bonnes pratiques

1. **Séparation des préoccupations** : Gardez le frontend et le backend séparés
2. **Réutilisation du code** : Utilisez les services et les types partagés
3. **Typage fort** : Utilisez TypeScript pour éviter les erreurs
4. **Gestion des erreurs** : Gérez correctement les erreurs dans les services et les routes API
5. **Tests** : Ajoutez des tests pour les composants, les services et les routes API

## Microservices externes

Cette application frontend communique avec les microservices suivants :

1. **Service d'authentification** (`AUTH_SERVICE_URL`) - Gestion des utilisateurs et authentification
2. **Service de catalogue** (`CATALOG_SERVICE_URL`) - Gestion des produits et catégories
3. **Service de commandes** (`ORDER_SERVICE_URL`) - Gestion des commandes et du panier
4. **Dashboard admin** (`ADMIN_DASHBOARD_URL`) - Interface d'administration (intégrée dans Next.js)
