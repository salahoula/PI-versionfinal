"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { CreditCard, ArrowLeft, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { isAuthenticated } from "@/lib/auth"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [cart, setCart] = useState({ items: [] })
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const [paymentMethod, setPaymentMethod] = useState("card")
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "",
  })
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (!isAuthenticated()) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour accéder à la page de paiement.",
      })
      router.push("/login?redirect=/checkout")
      return
    }

    const loadData = async () => {
      setLoading(true)
      try {
        const cartItems = JSON.parse(localStorage.getItem("cart") || "[]")
        if (!Array.isArray(cartItems)) throw new Error("Panier invalide")
        setCart({ items: cartItems })

        if (cartItems.length === 0) {
          toast({
            title: "Panier vide",
            description: "Votre panier est vide. Ajoutez des produits avant de passer commande.",
            variant: "destructive",
          })
          router.push("/cart")
          return
        }

        // Simuler récupération utilisateur
        setUser({
          firstName: "Jean",
          lastName: "Dupont",
          email: "jean.dupont@example.com",
          address: {
            street: "123 Rue de Paris",
            city: "Paris",
            postalCode: "75001",
            country: "France",
          },
        })

        setShippingAddress({
          street: "123 Rue de Paris",
          city: "Paris",
          postalCode: "75001",
          country: "France",
        })
      } catch (error) {
        console.error("Erreur:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les données. Veuillez réessayer.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router, toast])

  function handleAddressChange(e) {
    const { name, value } = e.target
    setShippingAddress((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: null }))
  }

  function handleCardDetailsChange(e) {
    const { name, value } = e.target
    setCardDetails((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: null }))
  }

  function calculateTotal() {
    return cart.items.reduce((total, item) => {
      const price = Number(item.price) || 0
      const qty = Number(item.quantity) || 1
      return total + price * qty
    }, 0)
  }

  function validateForm() {
    const errors = {}

    if (!shippingAddress.street.trim()) errors.street = "L'adresse est requise"
    if (!shippingAddress.city.trim()) errors.city = "La ville est requise"
    if (!shippingAddress.postalCode.trim()) errors.postalCode = "Le code postal est requis"
    if (!shippingAddress.country.trim()) errors.country = "Le pays est requis"

    if (paymentMethod === "card") {
      if (!cardDetails.cardNumber.trim() || cardDetails.cardNumber.replace(/\s+/g, "").length !== 16)
        errors.cardNumber = "Numéro de carte invalide"
      if (!cardDetails.expiryDate.trim() || !/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate))
        errors.expiryDate = "Format date invalide (MM/AA)"
      if (!cardDetails.cvv.trim() || cardDetails.cvv.length < 3) errors.cvv = "CVV invalide"
      if (!cardDetails.cardName.trim()) errors.cardName = "Le nom sur la carte est requis"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmitOrder(e) {
    e.preventDefault()
    if (!validateForm()) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez corriger les erreurs avant de continuer.",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)
    try {
      await new Promise((r) => setTimeout(r, 1500)) // Simule paiement

      const orderId = Math.floor(10000 + Math.random() * 90000).toString()

      localStorage.setItem("cart", "[]")

      toast({
        title: "Commande confirmée",
        description: `Votre commande #${orderId} a bien été prise en compte.`,
        variant: "success",
      })

      router.push(`/order-confirmation/${orderId}`)
    } catch {
      toast({
        title: "Erreur",
        description: "Le traitement de votre commande a échoué.",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-10">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/cart" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au panier
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-6">Finaliser la commande</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmitOrder} noValidate>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Adresse de livraison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="street">Adresse</Label>
                  <Input
                    id="street"
                    name="street"
                    value={shippingAddress.street}
                    onChange={handleAddressChange}
                    required
                    className={formErrors.street ? "border-red-500" : ""}
                  />
                  {formErrors.street && <p className="text-sm text-red-500">{formErrors.street}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      required
                      className={formErrors.city ? "border-red-500" : ""}
                    />
                    {formErrors.city && <p className="text-sm text-red-500">{formErrors.city}</p>}
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleAddressChange}
                      required
                      className={formErrors.postalCode ? "border-red-500" : ""}
                    />
                    {formErrors.postalCode && <p className="text-sm text-red-500">{formErrors.postalCode}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="country">Pays</Label>
                  <Input
                    id="country"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleAddressChange}
                    required
                    className={formErrors.country ? "border-red-500" : ""}
                  />
                  {formErrors.country && <p className="text-sm text-red-500">{formErrors.country}</p>}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Méthode de paiement</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  <div className="flex items-center space-x-2 border rounded-md p-4">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-5 w-5" />
                      Carte bancaire
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-4">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="cursor-pointer">
                      PayPal (non implémenté)
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Numéro de carte</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={handleCardDetailsChange}
                        placeholder="1234 5678 9012 3456"
                        required
                        maxLength={19}
                        className={formErrors.cardNumber ? "border-red-500" : ""}
                      />
                      {formErrors.cardNumber && <p className="text-sm text-red-500">{formErrors.cardNumber}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Date d'expiration</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          value={cardDetails.expiryDate}
                          onChange={handleCardDetailsChange}
                          placeholder="MM/AA"
                          required
                          maxLength={5}
                          className={formErrors.expiryDate ? "border-red-500" : ""}
                        />
                        {formErrors.expiryDate && <p className="text-sm text-red-500">{formErrors.expiryDate}</p>}
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          value={cardDetails.cvv}
                          onChange={handleCardDetailsChange}
                          placeholder="123"
                          required
                          maxLength={4}
                          className={formErrors.cvv ? "border-red-500" : ""}
                        />
                        {formErrors.cvv && <p className="text-sm text-red-500">{formErrors.cvv}</p>}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cardName">Nom sur la carte</Label>
                      <Input
                        id="cardName"
                        name="cardName"
                        value={cardDetails.cardName}
                        onChange={handleCardDetailsChange}
                        placeholder="John Doe"
                        required
                        className={formErrors.cardName ? "border-red-500" : ""}
                      />
                      {formErrors.cardName && <p className="text-sm text-red-500">{formErrors.cardName}</p>}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  <span>Paiement sécurisé - Vos données sont protégées</span>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" disabled={processing} className="w-full">
              {processing ? "Traitement..." : "Passer la commande"}
            </Button>
          </form>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Résumé du panier</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.items.length === 0 ? (
                <p>Votre panier est vide.</p>
              ) : (
                <ul className="space-y-4">
                  {cart.items.map((item, i) => (
                    <li key={i} className="flex items-center space-x-4">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded"
                          unoptimized
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {Number(item.price).toFixed(2)} € x {item.quantity || 1}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {(Number(item.price) * (Number(item.quantity) || 1)).toFixed(2)} €
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
            <CardFooter className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{calculateTotal().toFixed(2)} €</span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
