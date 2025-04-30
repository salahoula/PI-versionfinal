"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Check, Truck, ShoppingBag, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { isAuthenticated } from "@/lib/auth"
import { PRODUCTS } from "@/lib/data/products"

export default function OrderConfirmationPage({ params }) {
  const router = useRouter()
  const { orderId } = params
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    // Simuler le chargement des détails de la commande
    const timer = setTimeout(() => {
      // Créer une commande fictive
      const randomProducts = PRODUCTS.slice(0, 2).map((product) => ({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      }))

      const totalAmount = randomProducts.reduce((total, item) => total + item.price * item.quantity, 0)

      const mockOrder = {
        id: orderId,
        items: randomProducts,
        totalAmount,
        status: "processing",
        shippingAddress: {
          street: "123 Rue de Paris",
          city: "Paris",
          postalCode: "75001",
          country: "France",
        },
        paymentMethod: "card",
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      }

      setOrder(mockOrder)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [orderId, router])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container max-w-4xl py-10 text-center">
        <h1 className="text-3xl font-bold mb-6">Commande introuvable</h1>
        <p className="mb-6">Nous n'avons pas pu trouver les détails de cette commande.</p>
        <Button asChild>
          <Link href="/">Retour à l'accueil</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="flex items-center justify-center mb-8">
        <div className="bg-primary/10 rounded-full p-4">
          <Check className="h-12 w-12 text-primary" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-center mb-2">Commande confirmée</h1>
      <p className="text-center text-muted-foreground mb-8">
        Merci pour votre commande ! Votre numéro de commande est <strong>#{orderId}</strong>.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Détails de la commande</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="font-medium">Statut</h3>
              <div className="flex items-center gap-2 text-primary">
                <Check className="h-4 w-4" />
                <span>Paiement confirmé</span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-medium">Livraison</h3>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Livraison estimée : {formatDate(order.estimatedDelivery)}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-4">Articles</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="w-16 h-16 relative flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} x {item.price.toFixed(2)} €
                      </p>
                    </div>
                    <div className="ml-auto">{(item.price * item.quantity).toFixed(2)} €</div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{order.totalAmount.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span>Gratuite</span>
              </div>
              <div className="flex justify-between font-semibold pt-1.5">
                <span>Total</span>
                <span>{order.totalAmount.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button variant="outline" asChild>
            <Link href="/">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continuer les achats
            </Link>
          </Button>
          <Button asChild>
            <Link href="/profile">
              <Calendar className="mr-2 h-4 w-4" />
              Voir mes commandes
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
        <p>
          Un email de confirmation a été envoyé à votre adresse email. Si vous avez des questions concernant votre
          commande, n'hésitez pas à nous contacter.
        </p>
      </div>
    </div>
  )
}
