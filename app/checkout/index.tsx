"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/app/context/CartContext"
import { CartItem } from "@/app/types"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { validateName, validateEmail, validateAddress, validateCity } from "@/lib/validation"

const Checkout = () => {
  const router = useRouter()
  const { updateCartCount } = useCart()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [orderComplete, setOrderComplete] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: ''
  })
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    address: '',
    city: ''
  })

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartItems(cart)

    if (cart.length === 0) {
      router.push('/cart')
    }
  }, [])

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value })
    // Clear error when user starts typing
    setErrors({ ...errors, [field]: '' })
  }

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const nameValidation = validateName(formData.fullName, 'Full name')
    const emailValidation = validateEmail(formData.email)
    const addressValidation = validateAddress(formData.address)
    const cityValidation = validateCity(formData.city)

    // Set errors
    const newErrors = {
      fullName: nameValidation.error || '',
      email: emailValidation.error || '',
      address: addressValidation.error || '',
      city: cityValidation.error || ''
    }

    setErrors(newErrors)

    // Check if all validations passed
    if (!nameValidation.isValid || !emailValidation.isValid ||
      !addressValidation.isValid || !cityValidation.isValid) {
      return
    }

    localStorage.removeItem("cart")
    updateCartCount()
    setOrderComplete(true)
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = cartItems.length > 0 ? 1500 : 0
  const total = subtotal + shipping

  if (orderComplete) {
    return (
      <div className="p-4 max-w-2xl mx-auto pb-6 text-center py-12">
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="flex justify-center mb-4">
            <CheckCircle size={64} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Order Successful!</h2>
          <p className="text-muted-foreground mb-6">Thank you for your order. We'll process it shortly.</p>
          <Link
            href="/"
            className="glow-blue bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-2xl mx-auto pb-6">
      {/* Checkout Summary */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Checkout</h2>

        <div className="bg-card border border-border rounded-lg p-4 space-y-3 mb-6">
          <h3 className="font-bold text-foreground">Order Items</h3>
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between text-sm text-muted-foreground">
                <span>{item.name} x{item.quantity}</span>
                <span>₦{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery fee</span>
              <span>₦{shipping.toLocaleString()}</span>
            </div>
          </div>
          <div className="border-t border-border pt-2 flex justify-between font-bold text-foreground">
            <span>Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* Shipping Info */}
      <form className="space-y-4" onSubmit={handleCompleteOrder}>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className={`w-full glass-interactive rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 transition-all ${errors.fullName ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-primary/50'
              }`}
            placeholder="Your name"
            required
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full glass-interactive rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 transition-all ${errors.email ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-primary/50'
              }`}
            placeholder="your@email.com"
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className={`w-full glass-interactive rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 transition-all ${errors.address ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-primary/50'
              }`}
            placeholder="Delivery address"
            required
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-500">{errors.address}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className={`w-full glass-interactive rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 transition-all ${errors.city ? 'ring-2 ring-red-500 focus:ring-red-500' : 'focus:ring-primary/50'
                }`}
              placeholder="City"
              required
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-500">{errors.city}</p>
            )}
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-foreground mb-2">Postal Code</label>
            <input
              type="text"
              className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Postal code"
            />
          </div> */}
        </div>

        <button
          type="submit"
          className="glow-blue-active w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 mt-6 transition-all"
        >
          Complete Order
        </button>
      </form>
    </div>
  )
}

export default Checkout