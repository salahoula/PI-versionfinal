"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { isAuthenticated } from "@/lib/auth"

export default function CartPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [cart, setCart] = useState({ items: [] })
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const userLoggedIn = isAuthenticated()
    setIsLoggedIn(userLoggedIn)

    const loadCart = () => {
      try {
        const cartItems = JSON.parse(localStorage.getItem("cart") || "[]")
        setCart({ items: cartItems })
      } catch (error) {
        console.error("Erreur lors du chargement du panier:", error)
        setCart({ items: [] })
      } finally {
        setLoading(false)
      }
    }

    loadCart()
  }, [])

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return
    setUpdating(true)
    try {
      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]")
      const updatedItems = cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
      localStorage.setItem("cart", JSON.stringify(updatedItems))
      setCart({ items: updatedItems })
      toast({
        title: "Panier mis à jour",
        description: "La quantité a été mise à jour avec succès.",
      })
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la quantité.",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const removeItem = async (productId) => {
    setUpdating(true)
    try {
      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]")
      const updatedItems = cartItems.filter((item) => item.productId !== productId)
      localStorage.setItem("cart", JSON.stringify(updatedItems))
      setCart({ items: updatedItems })
      toast({
        title: "Produit retiré",
        description: "Le produit a été retiré de votre panier.",
      })
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Impossible de retirer le produit.",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      const price = Number(item.price) || 0
      const quantity = Number(item.quantity) || 1
      return total + price * quantity
    }, 0)
  }

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      toast({
        title: "Panier vide",
        description: "Veuillez ajouter des produits à votre panier avant de passer commande.",
        variant: "destructive",
      })
      return
    }

    if (!isLoggedIn) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour continuer votre commande.",
      })
      router.push("/login?redirect=/checkout")
      return
    }

    router.push("/checkout")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (cart.items.length === 0) {
    return (
      <div className="container max-w-4xl py-10">
        <h1 className="text-3xl font-bold mb-6">Mon Panier</h1>
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Votre panier est vide</h2>
              <p className="text-muted-foreground">Découvrez nos smartphones et ajoutez-les à votre panier.</p>
              <Button asChild className="mt-4">
                <Link href="/products?category=Smartphones">Voir les smartphones</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-6">Mon Panier</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Articles ({cart.items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.items.map((item) => {
                const price = Number(item.price) || 0
                const quantity = Number(item.quantity) || 1
                return (
                  <div key={item.productId} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <div className="w-20 h-20 relative flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <Link href={`/products/${item.productId}`} className="font-medium hover:text-primary">
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground mb-2">{price.toFixed(2)} €</p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.productId, quantity - 1)}
                          disabled={updating || quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.productId, quantity + 1)}
                          disabled={updating}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-between">
                      <span className="font-medium">{(price * quantity).toFixed(2)} €</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive self-end"
                        onClick={() => removeItem(item.productId)}
                        disabled={updating}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{calculateTotal().toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span>Gratuite</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{calculateTotal().toFixed(2)} €</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              {!isLoggedIn ? (
                <>
                  <Button className="w-full" onClick={handleCheckout}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Se connecter pour commander
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Vous devez être connecté pour finaliser votre commande
                  </p>
                </>
              ) : (
                <Button className="w-full" onClick={handleCheckout}>
                  Passer à la caisse
                </Button>
              )}
              <Button variant="outline" asChild className="w-full">
                <Link href="/products">Continuer les achats</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-4">
            <CardContent className="pt-4">
              <h3 className="font-medium mb-2">Comment commander ?</h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <span>Vérifiez les articles dans votre panier</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <span>Cliquez sur "Passer à la caisse"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <span>Remplissez vos informations de livraison et paiement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    4
                  </span>
                  <span>Confirmez votre commande</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6 md:hidden">
        <Button className="w-full" size="lg" onClick={handleCheckout}>
          {!isLoggedIn ? (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Se connecter pour commander
            </>
          ) : (
            <>
              Passer commande <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
