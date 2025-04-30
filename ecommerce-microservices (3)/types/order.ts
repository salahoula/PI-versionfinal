export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface Cart {
  items: CartItem[]
  totalAmount: number
}

export type OrderStatus = "processing" | "shipped" | "completed" | "cancelled"

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  totalAmount: number
  status: OrderStatus
  shippingAddress: Address
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

export interface Address {
  street: string
  city: string
  postalCode: string
  country: string
}
