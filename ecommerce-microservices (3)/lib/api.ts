// api.ts
import { getAuthToken } from "./auth"

// Fonction générique pour effectuer des requêtes API avec authentification
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAuthToken()

  const headers = {
    "Content-Type": "application/json",  // Toujours préciser JSON sauf cas particulier
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Si la réponse est 401 Unauthorized, déconnecter l'utilisateur
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    throw new Error("Session expirée. Veuillez vous reconnecter.")
  }

  return response
}

// Exemple de fonction pour récupérer l'utilisateur connecté
export async function getCurrentUser() {
  const response = await fetchWithAuth("/api/auth/me")

  if (!response.ok) {
    throw new Error("Échec de la récupération des données utilisateur")
  }

  return response.json()
}

// Exemple fonction mise à jour profil
export async function updateUserProfile(data: any) {
  const response = await fetchWithAuth("/api/auth/update-profile", {
    method: "PUT",
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Échec de la mise à jour du profil")
  }

  return response.json()
}
