"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface CartContextType {
    cartCount: number
    updateCartCount: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartCount, setCartCount] = useState(0)

    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]")
        const total = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)
        setCartCount(total)
    }

    useEffect(() => {
        // Initial load
        updateCartCount()

        // Listen for storage changes from other tabs/windows
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'cart') {
                updateCartCount()
            }
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    return (
        <CartContext.Provider value={{ cartCount, updateCartCount }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
