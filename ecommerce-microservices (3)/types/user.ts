export type UserRole = "user" | "admin"
export type UserStatus = "active" | "inactive" | "blocked"

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  status: UserStatus
  address?: Address
  registeredAt: string
  orders?: number
}

export interface Address {
  street: string
  city: string
  postalCode: string
  country: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}
