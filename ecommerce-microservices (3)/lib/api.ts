import { getAuthToken } from "./auth"

// Fonction générique pour effectuer des requêtes API avec authentification
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAuthToken()

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Si la réponse est 401 Unauthorized, déconnecter l'utilisateur
  if (response.status === 401) {
    // Rediriger vers la page de connexion
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    throw new Error("Session expirée. Veuillez vous reconnecter.")
  }

  return response
}

// Fonctions pour interagir avec le service de catalogue
export async function getProducts(params = {}) {
  try {
    const queryString = new URLSearchParams(params as Record<string, string>).toString()
    const url = `/api/products?${queryString}`

    const response = await fetchWithAuth(url)

    // Vérifier si la réponse est OK et contient du JSON
    if (response.ok) {
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        return response.json()
      }
    }

    // Si on arrive ici, c'est qu'il y a eu un problème
    throw new Error("La réponse n'est pas au format JSON attendu")
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error)
    // Retourner un objet avec une structure similaire à ce que l'API aurait renvoyé
    return { products: [] }
  }
}

export async function getProductById(id: string) {
  const response = await fetchWithAuth(`/api/products/${id}`)

  if (!response.ok) {
    throw new Error("Échec de la récupération du produit")
  }

  return response.json()
}

// Fonctions pour interagir avec le service de commandes
export async function getCart() {
  const response = await fetchWithAuth("/api/orders/cart")

  if (!response.ok) {
    throw new Error("Échec de la récupération du panier")
  }

  return response.json()
}

export async function addToCart(productId: string, quantity: number) {
  const response = await fetchWithAuth("/api/orders/cart", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  })

  if (!response.ok) {
    throw new Error("Échec de l'ajout au panier")
  }

  return response.json()
}

export async function createOrder(orderData: any) {
  const response = await fetchWithAuth("/api/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  })

  if (!response.ok) {
    throw new Error("Échec de la création de la commande")
  }

  return response.json()
}

export async function getOrders() {
  const response = await fetchWithAuth("/api/orders")

  if (!response.ok) {
    throw new Error("Échec de la récupération des commandes")
  }

  return response.json()
}
