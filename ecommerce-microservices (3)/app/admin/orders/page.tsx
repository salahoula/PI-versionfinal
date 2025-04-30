"use client"

import { useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, MoreVertical, Eye, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react"

// Données fictives pour les commandes
const MOCK_ORDERS = [
  {
    id: "1001",
    customer: "Jean Dupont",
    email: "jean.dupont@example.com",
    date: "2023-05-15",
    total: 149.98,
    status: "completed",
    items: 2,
  },
  {
    id: "1002",
    customer: "Marie Martin",
    email: "marie.martin@example.com",
    date: "2023-05-14",
    total: 79.99,
    status: "processing",
    items: 1,
  },
  {
    id: "1003",
    customer: "Pierre Durand",
    email: "pierre.durand@example.com",
    date: "2023-05-13",
    total: 229.97,
    status: "shipped",
    items: 3,
  },
  {
    id: "1004",
    customer: "Sophie Lefebvre",
    email: "sophie.lefebvre@example.com",
    date: "2023-05-12",
    total: 59.99,
    status: "cancelled",
    items: 1,
  },
  {
    id: "1005",
    customer: "Lucas Bernard",
    email: "lucas.bernard@example.com",
    date: "2023-05-11",
    total: 199.98,
    status: "completed",
    items: 2,
  },
]

const statusMap = {
  processing: {
    label: "En traitement",
    color: "bg-blue-100 text-blue-800",
    icon: Clock,
  },
  shipped: {
    label: "Expédiée",
    color: "bg-yellow-100 text-yellow-800",
    icon: Truck,
  },
  completed: {
    label: "Livrée",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Annulée",
    color: "bg-red-100 text-red-800",
    icon: AlertCircle,
  },
}

export default function AdminOrders() {
  const [orders, setOrders] = useState(MOCK_ORDERS)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOrders = orders.filter(
    (order) =>
      order.id.includes(searchTerm) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des commandes</h1>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher une commande..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Commande</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => {
              const status = statusMap[order.status]

              return (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>
                    <div>{order.customer}</div>
                    <div className="text-sm text-muted-foreground">{order.email}</div>
                  </TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${status.color} flex w-fit items-center gap-1`}>
                      <status.icon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div>{order.total.toFixed(2)} €</div>
                    <div className="text-sm text-muted-foreground">{order.items} article(s)</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Ouvrir le menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/orders/${order.id}`} className="flex items-center">
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Détails</span>
                          </Link>
                        </DropdownMenuItem>
                        {order.status === "processing" && (
                          <DropdownMenuItem className="flex items-center">
                            <Truck className="mr-2 h-4 w-4" />
                            <span>Marquer comme expédiée</span>
                          </DropdownMenuItem>
                        )}
                        {order.status === "shipped" && (
                          <DropdownMenuItem className="flex items-center">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            <span>Marquer comme livrée</span>
                          </DropdownMenuItem>
                        )}
                        {(order.status === "processing" || order.status === "shipped") && (
                          <DropdownMenuItem className="text-destructive focus:text-destructive flex items-center">
                            <AlertCircle className="mr-2 h-4 w-4" />
                            <span>Annuler la commande</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
