import { getAuthToken } from "@/lib/auth"

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || "http://localhost:8082"

/**
 * Fonction pour communiquer avec le service de commandes
 */
export async function fetchFromOrderService(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken()

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${ORDER_SERVICE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  // Vérifier si la réponse est OK
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Erreur du service de commandes: ${error}`)
  }

  // Vérifier si la réponse contient du JSON
  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return response.json()
  }

  return response.text()
}

/**
 * Récupérer le panier de l'utilisateur
 */
export async function getCart() {
  return fetchFromOrderService("/cart")
}

/**
 * Ajouter un produit au panier
 */
export async function addToCart(productId: string, quantity: number) {
  return fetchFromOrderService("/cart", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  })
}

/**
 * Mettre à jour la quantité d'un produit dans le panier
 */
export async function updateCartItem(productId: string, quantity: number) {
  return fetchFromOrderService("/cart/update", {
    method: "PUT",
    body: JSON.stringify({ productId, quantity }),
  })
}

/**
 * Supprimer un produit du panier
 */
export async function removeFromCart(productId: string) {
  return fetchFromOrderService("/cart/remove", {
    method: "DELETE",
    body: JSON.stringify({ productId }),
  })
}

/**
 * Créer une nouvelle commande
 */
export async function createOrder(orderData: any) {
  return fetchFromOrderService("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  })
}

/**
 * Récupérer toutes les commandes de l'utilisateur
 */
export async function getUserOrders() {
  return fetchFromOrderService("/orders")
}

/**
 * Récupérer une commande par son ID
 */
export async function getOrderById(orderId: string) {
  return fetchFromOrderService(`/orders/${orderId}`)
}

/**
 * Mettre à jour le statut d'une commande (admin seulement)
 */
export async function updateOrderStatus(orderId: string, status: string) {
  return fetchFromOrderService(`/orders/${orderId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  })
}
