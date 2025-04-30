"use client"

import { useState } from "react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"

export default function DebugPage() {
  const [services, setServices] = useState([
    {
      name: "Service d'authentification",
      url: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "Non configuré",
      status: "pending",
    },
    {
      name: "Service de catalogue",
      url: process.env.NEXT_PUBLIC_CATALOG_SERVICE_URL || "Non configuré",
      status: "pending",
    },
    {
      name: "Service de commandes",
      url: process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || "Non configuré",
      status: "pending",
    },
    { name: "Dashboard admin", url: process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL || "Non configuré", status: "pending" },
  ])

  const checkService = async (index) => {
    const service = services[index]
    if (service.url === "Non configuré") {
      return
    }

    try {
      // Mettre à jour le statut en "checking"
      setServices((prev) => {
        const updated = [...prev]
        updated[index] = { ...updated[index], status: "checking" }
        return updated
      })

      // Vérifier si le service est accessible
      // Note: Ceci est une vérification simplifiée, dans un environnement réel
      // vous devriez utiliser un endpoint de health check spécifique
      const response = await fetch(`/api/check-service?url=${encodeURIComponent(service.url)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      // Mettre à jour le statut en fonction de la réponse
      setServices((prev) => {
        const updated = [...prev]
        updated[index] = { ...updated[index], status: response.ok ? "online" : "offline" }
        return updated
      })
    } catch (error) {
      // En cas d'erreur, marquer le service comme offline
      setServices((prev) => {
        const updated = [...prev]
        updated[index] = { ...updated[index], status: "offline" }
        return updated
      })
    }
  }

  const checkAllServices = () => {
    services.forEach((_, index) => {
      checkService(index)
    })
  }

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-6">Diagnostic des Microservices</h1>
      <p className="text-muted-foreground mb-8">
        Cette page vous permet de vérifier la configuration et la disponibilité de vos microservices.
      </p>

      <div className="grid gap-6">
        {services.map((service, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {service.name}
                {service.status === "online" && (
                  <Badge variant="success" className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" /> En ligne
                  </Badge>
                )}
                {service.status === "offline" && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <XCircle className="h-4 w-4" /> Hors ligne
                  </Badge>
                )}
                {service.status === "checking" && (
                  <Badge className="flex items-center gap-1">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />{" "}
                    Vérification...
                  </Badge>
                )}
                {service.status === "pending" && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Non vérifié
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>URL: {service.url}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                onClick={() => checkService(index)}
                disabled={service.url === "Non configuré" || service.status === "checking"}
                variant="outline"
              >
                Vérifier
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Button onClick={checkAllServices}>Vérifier tous les services</Button>
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Notes importantes</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Les variables d'environnement côté serveur (sans préfixe NEXT_PUBLIC_) ne sont pas visibles ici, mais sont
            utilisées dans next.config.mjs pour les redirections.
          </li>
          <li>
            Pour que cette page affiche correctement les URLs, vous devez définir des variables d'environnement avec le
            préfixe NEXT_PUBLIC_.
          </li>
          <li>En production, vous devriez implémenter des endpoints de health check dédiés pour chaque service.</li>
        </ul>
      </div>
    </div>
  )
}
