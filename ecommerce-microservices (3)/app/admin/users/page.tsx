"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, MoreVertical, UserCog, ShieldAlert, ShieldCheck, UserX } from "lucide-react"

// Données fictives pour les utilisateurs
const MOCK_USERS = [
  {
    id: "1",
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    role: "user",
    status: "active",
    registeredAt: "2023-01-15",
    orders: 5,
  },
  {
    id: "2",
    name: "Marie Martin",
    email: "marie.martin@example.com",
    role: "admin",
    status: "active",
    registeredAt: "2022-11-20",
    orders: 12,
  },
  {
    id: "3",
    name: "Pierre Durand",
    email: "pierre.durand@example.com",
    role: "user",
    status: "inactive",
    registeredAt: "2023-02-05",
    orders: 2,
  },
  {
    id: "4",
    name: "Sophie Lefebvre",
    email: "sophie.lefebvre@example.com",
    role: "user",
    status: "active",
    registeredAt: "2023-03-10",
    orders: 8,
  },
  {
    id: "5",
    name: "Lucas Bernard",
    email: "lucas.bernard@example.com",
    role: "user",
    status: "blocked",
    registeredAt: "2022-12-18",
    orders: 0,
  },
]

const statusMap = {
  active: {
    label: "Actif",
    color: "bg-green-100 text-green-800",
  },
  inactive: {
    label: "Inactif",
    color: "bg-yellow-100 text-yellow-800",
  },
  blocked: {
    label: "Bloqué",
    color: "bg-red-100 text-red-800",
  },
}

export default function AdminUsers() {
  const [users, setUsers] = useState(MOCK_USERS)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleBlockUser = (id) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, status: "blocked" } : user)))
  }

  const handleActivateUser = (id) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, status: "active" } : user)))
  }

  const handleMakeAdmin = (id) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, role: "admin" } : user)))
  }

  const handleRemoveAdmin = (id) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, role: "user" } : user)))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un utilisateur..."
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
              <TableHead>ID</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Inscription</TableHead>
              <TableHead className="text-right">Commandes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => {
              const status = statusMap[user.status]

              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>
                    <div>{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    {user.role === "admin" ? (
                      <Badge variant="outline" className="bg-purple-100 text-purple-800">
                        Administrateur
                      </Badge>
                    ) : (
                      <Badge variant="outline">Utilisateur</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={status.color}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.registeredAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">{user.orders}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Ouvrir le menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="flex items-center">
                          <UserCog className="mr-2 h-4 w-4" />
                          <span>Voir le profil</span>
                        </DropdownMenuItem>

                        {user.role !== "admin" && (
                          <DropdownMenuItem className="flex items-center" onClick={() => handleMakeAdmin(user.id)}>
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            <span>Promouvoir admin</span>
                          </DropdownMenuItem>
                        )}

                        {user.role === "admin" && (
                          <DropdownMenuItem className="flex items-center" onClick={() => handleRemoveAdmin(user.id)}>
                            <ShieldAlert className="mr-2 h-4 w-4" />
                            <span>Rétrograder</span>
                          </DropdownMenuItem>
                        )}

                        {user.status !== "blocked" && (
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive flex items-center"
                            onClick={() => handleBlockUser(user.id)}
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            <span>Bloquer</span>
                          </DropdownMenuItem>
                        )}

                        {user.status === "blocked" && (
                          <DropdownMenuItem className="flex items-center" onClick={() => handleActivateUser(user.id)}>
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            <span>Activer</span>
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
