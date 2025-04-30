"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Trash2 } from "lucide-react"
import Link from "next/link"
import { PRODUCTS } from "@/lib/data/products"
import { useToast } from "@/components/ui/use-toast"

export default function HistoryPage() {
  const { toast } = useToast()
  const [viewedProducts, setViewedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuler le chargement de l'historique des produits consultés
    const timer = setTimeout(() => {
      // Dans un environnement réel, cela viendrait du localStorage ou d'une API
      // Ici, on simule avec quelques produits aléatoires
      const randomProducts = [...PRODUCTS]
        .sort(() => 0.5 - Math.random())
        .slice(0, 4)
        .map((product) => ({
          ...product,
          viewedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
        }))

      setViewedProducts(randomProducts)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const clearHistory = () => {
    setViewedProducts([])
    toast({
      title: "Historique effacé",
      description: "Votre historique de navigation a été effacé.",
    })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Historique de navigation</h1>
        {viewedProducts.length > 0 && (
          <Button variant="outline" onClick={clearHistory}>
            <Trash2 className="mr-2 h-4 w-4" />
            Effacer l'historique
          </Button>
        )}
      </div>

      {viewedProducts.length > 0 ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Produits consultés récemment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {viewedProducts.map((product) => (
                  <div key={product.id} className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>Consulté le {formatDate(product.viewedAt)}</span>
                    </div>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <Clock className="h-16 w-16 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Aucun historique</h2>
              <p className="text-muted-foreground">Vous n'avez pas encore consulté de produits.</p>
              <Button asChild className="mt-4">
                <Link href="/products">Parcourir les produits</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
