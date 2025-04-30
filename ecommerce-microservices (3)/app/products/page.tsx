"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { PRODUCTS, CATEGORIES } from "@/lib/data/products"

export default function ProductsPage() {
  const [products, setProducts] = useState(PRODUCTS)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: 0,
    maxPrice: 1500,
    sortBy: "price-asc",
  })

  useEffect(() => {
    // Simuler un chargement
    const timer = setTimeout(() => {
      setLoading(false)
      // Définir la catégorie par défaut sur "Smartphones"
      setFilters((prev) => ({
        ...prev,
        category: "Smartphones",
      }))
      // Appliquer les filtres immédiatement
      applyFilters()
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    let filteredProducts = [...PRODUCTS]

    // Filtre par recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (p) => p.name.toLowerCase().includes(searchLower) || p.description.toLowerCase().includes(searchLower),
      )
    }

    // Filtre par catégorie
    if (filters.category && filters.category !== "all") {
      filteredProducts = filteredProducts.filter((p) => p.category === filters.category)
    }

    // Filtre par prix
    filteredProducts = filteredProducts.filter((p) => p.price >= filters.minPrice && p.price <= filters.maxPrice)

    // Tri
    const [sortField, sortOrder] = filters.sortBy.split("-")
    filteredProducts.sort((a, b) => {
      if (sortField === "price") {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price
      } else if (sortField === "name") {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      }
      return 0
    })

    setProducts(filteredProducts)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Catalogue de produits</h1>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-1 space-y-6 bg-muted p-4 rounded-lg">
          <div>
            <h3 className="font-medium mb-2">Recherche</h3>
            <Input
              type="search"
              placeholder="Rechercher un produit..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <div>
            <h3 className="font-medium mb-2">Catégorie</h3>
            <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="font-medium mb-2">Prix</h3>
            <div className="space-y-4">
              <div>
                <Slider
                  defaultValue={[filters.minPrice, filters.maxPrice]}
                  max={1500}
                  step={10}
                  onValueChange={(values) => {
                    handleFilterChange("minPrice", values[0])
                    handleFilterChange("maxPrice", values[1])
                  }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span>{filters.minPrice} €</span>
                <span>{filters.maxPrice} €</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Trier par</h3>
            <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
                <SelectItem value="name-asc">Nom A-Z</SelectItem>
                <SelectItem value="name-desc">Nom Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full" onClick={applyFilters}>
            Appliquer les filtres
          </Button>
        </div>

        <div className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-muted rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Aucun produit ne correspond à vos critères.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
