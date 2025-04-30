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
import { Separator } from "@/components/ui/separator"
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
    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated()) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour accéder à la page de paiement.",
      })
      router.push("/login?redirect=/checkout")
      return
    }

    // Charger les données nécessaires
    const loadData = async () => {
      setLoading(true)
      try {
        // Charger le panier depuis localStorage
        const cartItems = JSON.parse(localStorage.getItem("cart") || "[]")
        setCart({ items: cartItems })

        // Si le panier est vide, rediriger vers la page du panier
        if (cartItems.length === 0) {
          toast({
            title: "Panier vide",
            description: "Votre panier est vide. Veuillez ajouter des produits avant de passer commande.",
            variant: "destructive",
          })
          router.push("/cart")
          return
        }

        // Simuler les données utilisateur
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

        // Préremplir l'adresse de livraison
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

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const validateForm = () => {
    const errors = {}

    // Valider l'adresse
    if (!shippingAddress.street.trim()) errors.street = "L'adresse est requise"
    if (!shippingAddress.city.trim()) errors.city = "La ville est requise"
    if (!shippingAddress.postalCode.trim()) errors.postalCode = "Le code postal est requis"
    if (!shippingAddress.country.trim()) errors.country = "Le pays est requis"

    // Valider les détails de carte si le mode de paiement est par carte
    if (paymentMethod === "card") {
      if (!cardDetails.cardNumber.trim() || cardDetails.cardNumber.length < 16)
        errors.cardNumber = "Numéro de carte invalide"
      if (!cardDetails.expiryDate.trim() || !cardDetails.expiryDate.match(/^\d{2}\/\d{2}$/))
        errors.expiryDate = "Format invalide (MM/AA)"
      if (!cardDetails.cvv.trim() || cardDetails.cvv.length < 3) errors.cvv = "CVV invalide"
      if (!cardDetails.cardName.trim()) errors.cardName = "Le nom sur la carte est requis"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault()

    // Valider le formulaire
    if (!validateForm()) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires correctement.",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)

    try {
      // Simuler le traitement de la commande
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Générer un ID de commande aléatoire
      const orderId = Math.floor(10000 + Math.random() * 90000).toString()

      // Vider le panier après la commande
      localStorage.setItem("cart", "[]")

      toast({
        title: "Commande confirmée",
        description: `Votre commande #${orderId} a été traitée avec succès.`,
        variant: "success",
      })

      // Rediriger vers la page de confirmation
      router.push(`/order-confirmation/${orderId}`)
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement de votre commande.",
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
        <Link href="/cart">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au panier
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-6">Finaliser la commande</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmitOrder}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Adresse de livraison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
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
                  <div className="space-y-2">
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
                  <div className="space-y-2">
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

                <div className="space-y-2">
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
                      PayPal
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Numéro de carte</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={handleCardDetailsChange}
                        placeholder="1234 5678 9012 3456"
                        required
                        className={formErrors.cardNumber ? "border-red-500" : ""}
                      />
                      {formErrors.cardNumber && <p className="text-sm text-red-500">{formErrors.cardNumber}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Date d'expiration</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          value={cardDetails.expiryDate}
                          onChange={handleCardDetailsChange}
                          placeholder="MM/AA"
                          required
                          className={formErrors.expiryDate ? "border-red-500" : ""}
                        />
                        {formErrors.expiryDate && <p className="text-sm text-red-500">{formErrors.expiryDate}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          value={cardDetails.cvv}
                          onChange={handleCardDetailsChange}
                          placeholder="123"
                          required
                          className={formErrors.cvv ? "border-red-500" : ""}
                        />
                        {formErrors.cvv && <p className="text-sm text-red-500">{formErrors.cvv}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
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

            <Button type="submit" className="w-full" disabled={processing || cart.items.length === 0} size="lg">
              {processing ? (
                <span className="flex items-center">
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  Traitement en cours...
                </span>
              ) : (
                "Confirmer la commande"
              )}
            </Button>
          </form>
        </div>

        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex gap-3 border-b pb-3 last:border-0 last:pb-0">
                    <div className="w-16 h-16 relative flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} x {item.price.toFixed(2)} €
                      </p>
                    </div>
                    <div className="text-right text-sm font-medium">{(item.price * item.quantity).toFixed(2)} €</div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{calculateTotal().toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span>Gratuite</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{calculateTotal().toFixed(2)} €</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/cart" className="text-sm text-primary hover:underline w-full text-center">
                Modifier le panier
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
