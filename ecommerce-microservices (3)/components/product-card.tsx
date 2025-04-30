"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ShoppingCart } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleAddToCart = async () => {
    try {
      setIsLoading(true)

      // Simuler un délai d'ajout au panier (remplace l'appel API)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Simuler l'ajout au panier en stockant dans localStorage
      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]")

      // Vérifier si le produit est déjà dans le panier
      const existingItemIndex = cartItems.findIndex((item) => item.productId === product.id)

      if (existingItemIndex >= 0) {
        // Incrémenter la quantité si le produit existe déjà
        cartItems[existingItemIndex].quantity += 1
      } else {
        // Ajouter le nouveau produit au panier
        cartItems.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        })
      }

      // Sauvegarder le panier mis à jour
      localStorage.setItem("cart", JSON.stringify(cartItems))

      // Déclencher un événement personnalisé pour mettre à jour le compteur du panier
      window.dispatchEvent(new Event("cartUpdated"))

      toast({
        title: "Produit ajouté au panier",
        description: `${product.name} a été ajouté à votre panier.`,
        variant: "success",
      })
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter ce produit au panier. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{product.description}</p>
        <p className="font-bold">{product.price.toFixed(2)} €</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button asChild variant="outline" className="w-full">
          <Link href={`/products/${product.id}`}>Détails</Link>
        </Button>
        <Button className="w-full" onClick={handleAddToCart} disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center">
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              Ajout...
            </span>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Ajouter
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
