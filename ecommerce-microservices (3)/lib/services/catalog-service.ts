import { getAuthToken } from "@/lib/auth"

const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL || "http://localhost:8081"

/**
 * Fonction pour communiquer avec le service de catalogue
 */
export async function fetchFromCatalogService(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken()

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${CATALOG_SERVICE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  // Vérifier si la réponse est OK
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Erreur du service de catalogue: ${error}`)
  }

  // Vérifier si la réponse contient du JSON
  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return response.json()
  }

  return response.text()
}

/**
 * Récupérer tous les produits avec filtres
 */
export async function getProducts(params = {}) {
  const queryString = new URLSearchParams(params as Record<string, string>).toString()
  return fetchFromCatalogService(`/products?${queryString}`)
}

/**
 * Récupérer un produit par son ID
 */
export async function getProductById(id: string) {
  return fetchFromCatalogService(`/products/${id}`)
}

/**
 * Créer un nouveau produit (admin seulement)
 */
export async function createProduct(productData: any) {
  return fetchFromCatalogService("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  })
}

/**
 * Mettre à jour un produit (admin seulement)
 */
export async function updateProduct(id: string, productData: any) {
  return fetchFromCatalogService(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  })
}

/**
 * Supprimer un produit (admin seulement)
 */
export async function deleteProduct(id: string) {
  return fetchFromCatalogService(`/products/${id}`, {
    method: "DELETE",
  })
}
