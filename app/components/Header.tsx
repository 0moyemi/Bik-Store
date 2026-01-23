"use client"
import { Menu, X, ShoppingCart, ArrowLeft, Mail } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useCart } from "@/app/context/CartContext"
import { usePathname, useRouter } from "next/navigation"
import ThemeSwitch from "./ThemeSwitch"

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { cartCount } = useCart()
  const pathname = usePathname()
  const router = useRouter()
  const isHomePage = pathname === '/'

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-card/60 border-b border-white/10 shadow-lg">
        <div className="flex items-center justify-between px-4 py-2">
          {isHomePage ? (
            <h1 className="text-xl font-bold text-foreground">Bik</h1>
          ) : (
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back</span>
            </button>
          )}

          <button className="glow-blue p-2 rounded-lg relative" onClick={() => setIsOpen(!isOpen)}>
            <Menu size={24} className="text-foreground" />
            {!isOpen && cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />

          {/* Slide-in drawer from right */}
          <nav className="fixed right-0 top-0 h-full w-64 glass-strong border-l border-white/10 p-4 z-50 flex flex-col gap-4 animate-in slide-in-from-right duration-300">
            {/* Close button */}
            <button onClick={() => setIsOpen(false)} className="self-end glow-blue p-2 rounded-lg">
              <X size={24} className="text-foreground" />
            </button>

            {/* Menu items */}
            {/* <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link> */}
            <Link
              href="/cart"
              className="text-foreground hover:text-primary transition-colors py-2 flex items-center gap-2 relative"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingCart size={20} />
              Cart
              {cartCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/about"
              className="text-foreground hover:text-primary transition-colors py-2 flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <Mail size={20} />
              About & Contact
            </Link>

            {/* Theme Switch */}
            <div className="mt-auto pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeSwitch />
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  )
}

export default Header