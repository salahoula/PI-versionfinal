export interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: string
  stock: number
  createdAt?: string
  updatedAt?: string
}

export interface ProductFilter {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  order?: "asc" | "desc"
}
