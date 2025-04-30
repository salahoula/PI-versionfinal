import { NextResponse } from "next/server"
import { fetchFromCatalogService } from "@/lib/services/catalog-service"

// GET /api/products
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  try {
    // Récupérer les paramètres de recherche
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const sortBy = searchParams.get("sortBy") || "name"
    const order = searchParams.get("order") || "asc"

    // Construire les paramètres pour le service de catalogue
    const params = new URLSearchParams()
    if (category) params.append("category", category)
    if (search) params.append("search", search)
    if (minPrice) params.append("minPrice", minPrice)
    if (maxPrice) params.append("maxPrice", maxPrice)
    params.append("sortBy", sortBy)
    params.append("order", order)

    // Appeler le service de catalogue
    const products = await fetchFromCatalogService(`/products?${params.toString()}`)

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des produits" }, { status: 500 })
  }
}

// POST /api/products - Ajouter un nouveau produit (admin seulement)
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Ici, vous pourriez ajouter une vérification d'authentification et d'autorisation
    // par exemple, vérifier si l'utilisateur est un admin

    // Appeler le service de catalogue pour créer un produit
    const newProduct = await fetchFromCatalogService("/products", {
      method: "POST",
      body: JSON.stringify(body),
    })

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création du produit:", error)
    return NextResponse.json({ error: "Erreur lors de la création du produit" }, { status: 500 })
  }
}
