// auth.ts
// Ce fichier contient les fonctions pour interagir avec le service d'authentification

export async function login(email: string, password: string) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      throw new Error("Échec de la connexion")
    }

    const data = await response.json()

    // Stocker le token JWT dans localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.token)
    }

    return data
  } catch (error) {
    console.error("Erreur lors de la connexion:", error)
    throw error
  }
}

export async function register(userData: {
  firstName: string
  lastName: string
  email: string
  password: string
}) {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      throw new Error("Échec de l'inscription")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    throw error
  }
}

export async function logout() {
  // Supprimer le token JWT du localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
  }
}

export function getAuthToken(): string | null {
  // Récupérer le token JWT du localStorage
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

export function isAuthenticated(): boolean {
  // Vérifier si l'utilisateur est authentifié
  if (typeof window === "undefined") return false
  const token = localStorage.getItem("token")
  return Boolean(token)
}
