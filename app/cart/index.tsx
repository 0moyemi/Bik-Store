"use client"
import { Trash2, Plus, Minus } from "lucide-react"
import { useState, useEffect } from "react"
import { CartItem } from "@/app/types"
import Image from "next/image"
import { useCart } from "@/app/context/CartContext"
import Link from "next/link"

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { updateCartCount } = useCart()
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; productId: string; productName: string }>({ show: false, productId: '', productName: '' })

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartItems(cart)
  }

  const updateQuantity = (productId: string, change: number) => {
    const updatedCart = cartItems.map(item => {
      if (item._id === productId) {
        const newQuantity = item.quantity + change
        return { ...item, quantity: Math.max(1, newQuantity) }
      }
      return item
    })

    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    updateCartCount()
  }

  const removeItem = (productId: string) => {
    const item = cartItems.find(item => item._id === productId)
    if (!item) return

    setDeleteConfirm({ show: true, productId, productName: item.name })
  }

  const confirmDelete = () => {
    const updatedCart = cartItems.filter(item => item._id !== deleteConfirm.productId)
    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    updateCartCount()
    setDeleteConfirm({ show: false, productId: '', productName: '' })
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = cartItems.length > 0 ? 1500 : 0
  const total = subtotal + shipping

  return (
    <div className="p-4 pb-6">
      {/* Cart Items */}
      <section className="mb-4">
        <h2 className="text-xl font-bold text-foreground mb-3">Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-2">Your cart is empty</p>
            <a href="/" className="text-primary hover:underline">Continue shopping</a>
          </div>
        ) : (
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item._id} className="glass-card rounded-lg p-3 flex gap-3 border border-white/10">
                <div className="w-20 h-20 bg-secondary/20 backdrop-blur-sm rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {item.images && item.images.length > 0 && item.images[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="text-3xl">📦</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{item.name}</p>
                  <p className="text-primary font-bold">₦{item.price.toLocaleString()}</p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item._id, -1)}
                      className="glow-blue w-7 h-7 rounded-full glass-interactive flex items-center justify-center hover:scale-105 transition-all"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, 1)}
                      className="glow-blue w-7 h-7 rounded-full glass-interactive flex items-center justify-center hover:scale-105 transition-all"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item._id)}
                  className="glow-blue text-destructive hover:opacity-70 self-start"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Checkout Summary */}
      {cartItems.length > 0 && (
        <section className="glass-strong rounded-lg p-4 space-y-3 border border-white/10">
          <h3 className="font-bold text-foreground">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery fee</span>
              <span>₦{shipping.toLocaleString()}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-bold text-foreground">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="glow-blue-active w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 block text-center transition-all"
          >
            Proceed to Checkout
          </Link>
        </section>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" onClick={() => setDeleteConfirm({ show: false, productId: '', productName: '' })}>
          <div className="glass-strong rounded-lg p-6 max-w-md w-full mx-4 border border-white/10" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-foreground mb-3">Remove Item?</h3>
            <p className="text-foreground/80 mb-6">
              Are you sure you want to remove <span className="font-semibold text-foreground">"{deleteConfirm.productName}"</span> from your cart?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm({ show: false, productId: '', productName: '' })}
                className="flex-1 glass-interactive text-foreground py-2.5 rounded-lg font-medium hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-lg font-medium hover:bg-red-600 transition-all"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


export default Cart