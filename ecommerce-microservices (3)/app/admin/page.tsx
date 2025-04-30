import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"

export default function AdminDashboard() {
  // Ces données seraient normalement récupérées depuis vos microservices
  const stats = [
    {
      title: "Ventes du jour",
      value: "1,245 €",
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Commandes",
      value: "42",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
    },
    {
      title: "Nouveaux utilisateurs",
      value: "18",
      change: "-3.1%",
      trend: "down",
      icon: Users,
    },
    {
      title: "Produits en stock",
      value: "523",
      change: "+2.5%",
      trend: "up",
      icon: Package,
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className={`flex items-center text-xs ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {stat.trend === "up" ? (
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                ) : (
                  <ArrowDownRight className="mr-1 h-4 w-4" />
                )}
                {stat.change} depuis hier
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ventes récentes</CardTitle>
            <CardDescription>Les 5 dernières commandes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">Commande #{1000 + i}</p>
                    <p className="text-sm text-muted-foreground">Il y a {i + 1} heure(s)</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{(Math.random() * 200 + 50).toFixed(2)} €</p>
                    <p className="text-sm text-muted-foreground">{Math.floor(Math.random() * 5 + 1)} article(s)</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produits populaires</CardTitle>
            <CardDescription>Les produits les plus vendus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">Produit {i + 1}</p>
                    <p className="text-sm text-muted-foreground">
                      {["Électronique", "Vêtements", "Maison", "Sports", "Beauté"][i]}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{(Math.random() * 100 + 20).toFixed(2)} €</p>
                    <p className="text-sm text-muted-foreground">{Math.floor(Math.random() * 100 + 10)} vendu(s)</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
