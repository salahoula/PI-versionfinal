import { NextResponse } from "next/server"
import { fetchFromCatalogService } from "@/lib/services/catalog-service"

// GET /api/products/[id]
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const productId = params.id

    // Appeler le service de catalogue
    const product = await fetchFromCatalogService(`/products/${productId}`)

    if (!product) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error(`Erreur lors de la récupération du produit ${params.id}:`, error)
    return NextResponse.json({ error: "Erreur lors de la récupération du produit" }, { status: 500 })
  }
}

// PUT /api/products/[id] - Mettre à jour un produit (admin seulement)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const productId = params.id
    const body = await request.json()

    // Ici, vous pourriez ajouter une vérification d'authentification et d'autorisation

    // Appeler le service de catalogue pour mettre à jour un produit
    const updatedProduct = await fetchFromCatalogService(`/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du produit ${params.id}:`, error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour du produit" }, { status: 500 })
  }
}

// DELETE /api/products/[id] - Supprimer un produit (admin seulement)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const productId = params.id

    // Ici, vous pourriez ajouter une vérification d'authentification et d'autorisation

    // Appeler le service de catalogue pour supprimer un produit
    await fetchFromCatalogService(`/products/${productId}`, {
      method: "DELETE",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Erreur lors de la suppression du produit ${params.id}:`, error)
    return NextResponse.json({ error: "Erreur lors de la suppression du produit" }, { status: 500 })
  }
}
