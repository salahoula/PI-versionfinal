"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { PRODUCTS } from "@/lib/data/products"
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function ProductDetailPage() {
  const params = useParams()
  const id = params.id

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const { toast } = useToast()
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    setLoading(true)
    // Simuler un chargement de produit
    const timer = setTimeout(() => {
      const foundProduct = PRODUCTS.find((p) => p.id === id)
      setProduct(foundProduct || null)
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [id])

  const handleAddToCart = async () => {
    if (!product) return

    try {
      setAdding(true)

      // Simuler un délai d'ajout au panier
      await new Promise((resolve) => setTimeout(resolve, 500))

      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]")
      const existingItemIndex = cartItems.findIndex((item) => item.productId === product.id)

      if (existingItemIndex >= 0) {
        cartItems[existingItemIndex].quantity += quantity
      } else {
        cartItems.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.image,
        })
      }

      localStorage.setItem("cart", JSON.stringify(cartItems))
      window.dispatchEvent(new Event("cartUpdated"))

      toast({
        title: "Produit ajouté au panier",
        description: `${quantity} x ${product.name} a été ajouté à votre panier.`,
        variant: "success",
      })

      setAddedToCart(true)
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter ce produit au panier. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-4xl py-10">
        <div className="animate-pulse">
          <div className="h-8 w-2/3 bg-muted rounded mb-6"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-24 bg-muted rounded"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container max-w-4xl py-10 text-center">
        <h1 className="text-3xl font-bold mb-6">Produit non trouvé</h1>
        <p className="mb-6">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
        <Button asChild>
          <Link href="/products">Retour aux produits</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-10">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux produits
        </Link>
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square relative rounded-lg overflow-hidden">
          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-bold text-primary">{product.price.toFixed(2)} €</p>

          <Separator />

          <div>
            <h2 className="font-medium mb-2">Description</h2>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div>
            <h2 className="font-medium mb-2">Disponibilité</h2>
            <p className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
              {product.stock > 0 ? `En stock (${product.stock} disponibles)` : "Rupture de stock"}
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {!addedToCart ? (
              <Button className="w-full" onClick={handleAddToCart} disabled={adding || product.stock <= 0}>
                {adding ? (
                  <span className="flex items-center">
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    Ajout en cours...
                  </span>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Ajouter au panier
                  </>
                )}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button className="w-full" onClick={handleAddToCart} disabled={adding || product.stock <= 0}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter encore
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/cart">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Voir le panier
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Card className="mt-8 p-6">
        <h2 className="text-xl font-bold mb-4">Caractéristiques</h2>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span className="text-muted-foreground">Catégorie</span>
            <span>{product.category}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Garantie</span>
            <span>2 ans</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Livraison</span>
            <span>Gratuite</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
