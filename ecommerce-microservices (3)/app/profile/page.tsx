"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentUser, updateUserProfile } from "@/lib/api"
import { isAuthenticated } from "@/lib/auth"

interface UserAddress {
  street?: string
  city?: string
  postalCode?: string
  country?: string
}

interface User {
  firstName: string
  lastName: string
  email: string
  address?: UserAddress
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    const loadUserData = async () => {
      try {
        const userData = await getCurrentUser()
        setUser(userData)

        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          street: userData.address?.street || "",
          city: userData.address?.city || "",
          postalCode: userData.address?.postalCode || "",
          country: userData.address?.country || "",
        })
      } catch (err: any) {
        setError(err.message || "Erreur inconnue")
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    setError(null)

    try {
      const updatedUser = await updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: {
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
      })

      setUser(updatedUser)
      alert("Profil mis à jour avec succès")
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour")
    } finally {
      setUpdating(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    alert("Fonction changement de mot de passe à implémenter")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-6">Mon Profil</h1>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Informations personnelles</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="orders">Mes commandes</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Mettez à jour vos informations personnelles et votre adresse de livraison.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileUpdate}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" value={formData.email} onChange={handleInputChange} disabled />
                  <p className="text-sm text-muted-foreground">L'email ne peut pas être modifié.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Adresse</Label>
                  <Input id="street" name="street" value={formData.street} onChange={handleInputChange} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Pays</Label>
                  <Input id="country" name="country" value={formData.country} onChange={handleInputChange} />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={updating}>
                  {updating ? "Mise à jour..." : "Enregistrer les modifications"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
              <CardDescription>Mettez à jour votre mot de passe.</CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordChange}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <Input id="currentPassword" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input id="newPassword" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                  <Input id="confirmPassword" type="password" required />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Changer le mot de passe</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Mes commandes</CardTitle>
              <CardDescription>Consultez l'historique de vos commandes.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Affichage des commandes à implémenter */}
              <p className="text-center py-10 text-muted-foreground">Vous n'avez pas encore passé de commande.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
