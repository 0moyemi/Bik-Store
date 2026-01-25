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
  const [isSubmitting, setIsSubmitting] = useState(false)
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
  const [hasFormData, setHasFormData] = useState(false)

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartItems(cart)

    // Only redirect to cart if empty AND order is not complete
    if (cart.length === 0 && !orderComplete) {
      router.push('/cart')
    }

    // Warn user before leaving page if form has data
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasFormData && !orderComplete) {
        e.preventDefault()
        e.returnValue = 'You have unsaved information. Are you sure you want to leave?'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasFormData, orderComplete])

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value })
    // Clear error when user starts typing
    setErrors({ ...errors, [field]: '' })
    // Track that user has entered data
    if (value.trim()) {
      setHasFormData(true)
    }
  }

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) return

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

    setIsSubmitting(true)

    // Simulate processing delay for better UX feedback
    setTimeout(() => {
      localStorage.removeItem("cart")
      updateCartCount()
      setOrderComplete(true)
      setIsSubmitting(false)
    }, 1500)
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
      {/* Step Indicator - UX for non-technical users */}
      <div className="mb-6">
        <div className="flex items-center justify-center gap-1 lg:gap-2 mb-4 overflow-x-auto">
          <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
            <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs lg:text-sm font-bold">✓</div>
            <span className="text-xs font-medium text-muted-foreground hidden sm:inline">Items Selected</span>
          </div>
          <div className="w-8 lg:w-12 h-0.5 bg-border flex-shrink-0"></div>
          <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
            <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs lg:text-sm font-bold">✓</div>
            <span className="text-xs font-medium text-muted-foreground hidden sm:inline">Cart Reviewed</span>
          </div>
          <div className="w-8 lg:w-12 h-0.5 bg-border flex-shrink-0"></div>
          <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
            <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs lg:text-sm font-bold">3</div>
            <span className="text-xs font-medium text-foreground hidden sm:inline">Payment & Delivery</span>
          </div>
        </div>
        <h1 className="text-xl lg:text-2xl font-bold text-foreground text-center mb-2">Step 3 of 3: Payment & Delivery</h1>
        <p className="text-muted-foreground text-xs lg:text-sm text-center px-2">
          Enter your details below to complete your order.
        </p>
      </div>

      {/* Checkout Summary */}
      <section className="mb-6">

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

        {/* Clear CTA Button - UX optimized for non-technical users */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="glow-blue-active w-full bg-primary text-primary-foreground py-4 rounded-lg font-bold text-base hover:opacity-90 mt-6 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing Order...
            </>
          ) : (
            'Pay for Order'
          )}
        </button>
        {/* Helper text */}
        <p className="text-xs text-muted-foreground text-center mt-2">
          {isSubmitting ? 'Please wait, do not close this page...' : 'Your order will be processed after you click this button.'}
        </p>
      </form>
    </div>
  )
}

export default Checkout