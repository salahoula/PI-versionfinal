import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "E-commerce Microservices",
  description: "Application e-commerce basée sur une architecture microservices",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Header />
        <main className="container mx-auto px-4 py-8 min-h-screen">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
