import { getAuthToken } from "@/lib/auth"

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:8080"

/**
 * Fonction pour communiquer avec le service d'authentification
 */
export async function fetchFromAuthService(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken()

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${AUTH_SERVICE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  // Vérifier si la réponse est OK
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Erreur du service d'authentification: ${error}`)
  }

  // Vérifier si la réponse contient du JSON
  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return response.json()
  }

  return response.text()
}

/**
 * Connecter un utilisateur
 */
export async function loginUser(email: string, password: string) {
  const response = await fetchFromAuthService("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })

  // Stocker le token JWT dans localStorage
  if (response.token) {
    localStorage.setItem("token", response.token)
  }

  return response
}

/**
 * Inscrire un nouvel utilisateur
 */
export async function registerUser(userData: any) {
  return fetchFromAuthService("/register", {
    method: "POST",
    body: JSON.stringify(userData),
  })
}

/**
 * Récupérer les informations de l'utilisateur connecté
 */
export async function getCurrentUser() {
  return fetchFromAuthService("/me")
}

/**
 * Mettre à jour le profil de l'utilisateur
 */
export async function updateUserProfile(profileData: any) {
  return fetchFromAuthService("/update-profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  })
}

/**
 * Changer le mot de passe de l'utilisateur
 */
export async function changePassword(passwordData: any) {
  return fetchFromAuthService("/change-password", {
    method: "PUT",
    body: JSON.stringify(passwordData),
  })
}

/**
 * Récupérer tous les utilisateurs (admin seulement)
 */
export async function getAllUsers() {
  return fetchFromAuthService("/users")
}

/**
 * Mettre à jour le rôle d'un utilisateur (admin seulement)
 */
export async function updateUserRole(userId: string, role: string) {
  return fetchFromAuthService(`/users/${userId}/role`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  })
}

/**
 * Mettre à jour le statut d'un utilisateur (admin seulement)
 */
export async function updateUserStatus(userId: string, status: string) {
  return fetchFromAuthService(`/users/${userId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  })
}
