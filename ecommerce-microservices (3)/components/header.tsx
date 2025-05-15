"use client"

import Link from "next/link"
import { ShoppingCart, User, Search, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { isAuthenticated } from "@/lib/auth"

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)

  useEffect(() => {
    setIsLoggedIn(isAuthenticated())

    // Charger le nombre d'articles dans le panier
    const loadCartItemCount = () => {
      try {
        const cartItems = JSON.parse(localStorage.getItem("cart") || "[]")
        const count = cartItems.reduce((total, item) => total + item.quantity, 0)
        setCartItemCount(count)
      } catch (error) {
        console.error("Erreur lors du chargement du panier:", error)
        setCartItemCount(0)
      }
    }

    loadCartItemCount()

    // Créer un événement personnalisé pour mettre à jour le panier
    const handleCartUpdate = () => {
      loadCartItemCount()
    }

    // Ajouter un écouteur d'événement pour l'événement personnalisé
    window.addEventListener("cartUpdated", handleCartUpdate)

    // Vérifier régulièrement le panier (pour les mises à jour dans le même onglet)
    const interval = setInterval(loadCartItemCount, 1000)

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
      clearInterval(interval)
    }
  }, [])

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            E-Shop
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="hover:text-primary">
              Produits
            </Link>
            
            <Link href="/history" className="hover:text-primary">
              Historique
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Rechercher..." className="w-[200px] pl-8" />
            </div>

            <Button variant="ghost" size="icon" asChild>
              <Link href="/history">
                <Clock className="h-5 w-5" />
                <span className="sr-only">Historique</span>
              </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
                <span className="sr-only">Panier</span>
              </Link>
            </Button>

            {isLoggedIn ? (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/profile">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Mon compte</span>
                </Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/login">Connexion</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
