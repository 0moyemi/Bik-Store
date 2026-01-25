"use client"
import { ShoppingCart, ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/app/context/CartContext"
import { usePathname, useRouter } from "next/navigation"

const Header = () => {
  const { cartCount } = useCart()
  const pathname = usePathname()
  const router = useRouter()
  const isHomePage = pathname === '/'

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-xl lg:backdrop-blur-md bg-card/60 lg:bg-card/80 border-b border-white/10 shadow-lg will-change-transform">
        <div className="flex items-center justify-between px-4 py-2">
          {isHomePage ? (
            <h1 className="text-xl font-bold text-foreground">Bikudiratillah</h1>
          ) : (
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back</span>
            </button>
          )}

          {/* Horizontal Pill Navigation */}
          <div className="glow-blue flex items-center gap-2 bg-secondary/50 backdrop-blur-sm rounded-full px-3 py-2.5 border border-border">
            <Link
              href="/cart"
              className="flex items-center gap-1.5 text-foreground hover:text-primary transition-colors relative"
            >
              <ShoppingCart size={18} />
              <span className="text-sm font-medium">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            <div className="w-px h-4 bg-border" />

            <Link
              href="/about"
              className="flex items-center gap-1.5 text-foreground hover:text-primary transition-colors"
            >
              <Mail size={18} />
              <span className="text-sm font-medium">About</span>
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header