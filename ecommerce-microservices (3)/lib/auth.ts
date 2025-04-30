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
    localStorage.setItem("token", data.token)

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
  localStorage.removeItem("token")
}

export function getAuthToken() {
  // Récupérer le token JWT du localStorage
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

export function isAuthenticated() {
  // Vérifier si l'utilisateur est authentifié
  return !!getAuthToken()
}
