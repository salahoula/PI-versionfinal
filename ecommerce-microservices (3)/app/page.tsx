import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PRODUCTS } from "@/lib/data/products"

export default async function Home() {
  // Filtrer les smartphones pour la section en vedette
  const featuredSmartphones = PRODUCTS.filter((product) => product.category === "Smartphones").slice(0, 3)

  // Autres produits populaires (non-smartphones)
  const otherProducts = PRODUCTS.filter((product) => product.category !== "Smartphones").slice(0, 3)

  return (
    <div className="space-y-12">
      <section className="py-12 bg-muted rounded-lg">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Bienvenue sur notre boutique de smartphones</h1>
          <p className="text-xl mb-8">Découvrez notre sélection de smartphones et accessoires exceptionnels</p>
          <Button asChild size="lg">
            <Link href="/products">Voir le catalogue</Link>
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Smartphones en vedette</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSmartphones.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link href="/products?category=Smartphones">Voir tous les smartphones</Link>
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Accessoires populaires</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link href="/products">Voir tous les produits</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
