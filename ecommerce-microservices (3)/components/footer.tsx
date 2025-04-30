import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-muted py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">E-Shop</h3>
            <p className="text-muted-foreground">
              Votre destination pour des produits de qualité à des prix compétitifs.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="hover:text-primary">
                  Produits
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-primary">
                  Catégories
                </Link>
              </li>
              <li>
                <Link href="/promotions" className="hover:text-primary">
                  Promotions
                </Link>
              </li>
              <li>
                <Link href="/nouveautes" className="hover:text-primary">
                  Nouveautés
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Informations</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-primary">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/livraison" className="hover:text-primary">
                  Livraison
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Légal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/conditions" className="hover:text-primary">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className="hover:text-primary">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-primary">
                  Cookies
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="hover:text-primary">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} E-Shop. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
