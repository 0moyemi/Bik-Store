"use client"
import { ChevronLeft, ChevronRight, ShoppingCart, Play, X, Minus, Plus } from "lucide-react"
import { useState, useEffect } from "react"
import { Product } from "@/app/types"
import Image from "next/image"
import { useCart } from "@/app/context/CartContext"
import Modal from "@/app/components/Modal"

interface ProductDetailsProps {
  productId: string
}

const ProductDetails = ({ productId }: ProductDetailsProps) => {
  const { updateCartCount } = useCart()
  const [currentImage, setCurrentImage] = useState(0)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/products/${productId}`)
        const data = await res.json()
        if (data.status && data.product) {
          setProduct(data.product)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [productId])

  const addToCart = () => {
    if (!product) return
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existing = cart.find((item: any) => item._id === product._id)

    if (existing) {
      existing.quantity += quantity
    } else {
      cart.push({ ...product, quantity })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartCount()
    setShowSuccessModal(true)
    setQuantity(1) // Reset quantity after adding
  }

  const hasVideos = product?.images.some(url =>
    url.includes('/video/') || url.match(/\.(mp4|webm|mov)$/i)
  )

  const videoUrls = product?.images.filter(url =>
    url.includes('/video/') || url.match(/\.(mp4|webm|mov)$/i)
  ) || []

  const nextImage = () => {
    if (!product?.images) return
    setCurrentImage((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    if (!product?.images) return
    setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  if (loading) {
    return (
      <div className="pb-6 animate-pulse">
        {/* Image Skeleton */}
        <div className="w-full h-80 bg-secondary/20 backdrop-blur-sm" />

        {/* Content Skeleton */}
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="h-8 bg-secondary/20 rounded w-3/4" />
            <div className="h-8 bg-secondary/20 rounded w-1/3" />
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-secondary/20 rounded w-full" />
            <div className="h-4 bg-secondary/20 rounded w-full" />
            <div className="h-4 bg-secondary/20 rounded w-2/3" />
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-secondary/20 rounded w-1/4" />
            <div className="h-4 bg-secondary/20 rounded w-1/2" />
          </div>

          <div className="h-12 bg-secondary/20 rounded" />
          <div className="h-12 bg-secondary/20 rounded" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Product not found
      </div>
    )
  }
  return (
    <div className="pb-6">
      {/* Image Carousel */}
      <div className="relative glass-card border-b border-white/10">
        <div className="w-full h-80 bg-secondary/20 backdrop-blur-sm flex items-center justify-center text-muted-foreground">
          {product.images && product.images.length > 0 && product.images[currentImage] ? (
            <Image
              src={product.images[currentImage]}
              alt={product.name}
              width={400}
              height={320}
              className="object-contain w-full h-full"
            />
          ) : (
            <div className="text-7xl">📦</div>
          )}
        </div>

        {/* Carousel Controls - Only show if multiple images */}
        {product.images && product.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="glow-blue absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 glass-interactive rounded-full flex items-center justify-center hover:scale-105 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="glow-blue absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 glass-interactive rounded-full flex items-center justify-center hover:scale-105 transition-all"
            >
              <ChevronRight size={20} />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === currentImage ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Watch Video Button - Right under carousel */}
      {hasVideos && (
        <div className="p-3 pb-0">
          <button
            onClick={() => setShowVideoModal(true)}
            className="glow-blue w-full flex items-center justify-center gap-2 glass-interactive text-foreground py-3 rounded-lg hover:scale-[1.02] transition-all"
          >
            <Play size={18} />
            Watch Product Video
          </button>
        </div>
      )}

      {/* Product Info */}
      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{product.name}</h1>
          <p className="text-primary text-2xl font-bold">₦{product.price.toLocaleString()}</p>
        </div>

        <p className="text-foreground text-base leading-relaxed">
          {product.description}
        </p>

        {/* Product Details */}
        <div className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Category:</span> <span className="text-foreground">{product.category}</span>
          </p>
          {product.features && product.features.length > 0 && (
            <div>
              <p className="text-muted-foreground mb-1">Key Features:</p>
              <ul className="list-disc list-inside space-y-1 text-foreground">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between glass-card rounded-lg p-2 border border-white/10">
          <span className="text-foreground font-medium">Quantity</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="glow-blue w-9 h-9 rounded-full glass-interactive flex items-center justify-center hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={quantity <= 1}
            >
              <Minus size={16} />
            </button>
            <span className="text-foreground font-bold text-lg w-12 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="glow-blue w-9 h-9 rounded-full glass-interactive flex items-center justify-center hover:scale-105 transition-all"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={addToCart}
          className="glow-blue-active w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-all"
        >
          <ShoppingCart size={20} />
          Add {quantity > 1 ? `${quantity} Items` : 'to Cart'}
        </button>
      </div>

      {/* Success Modal */}
      {showSuccessModal && product && (
        <Modal
          title="Added to Cart!"
          message={`${product.name} has been added to your cart.`}
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      {/* Video Modal */}
      {showVideoModal && videoUrls.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" onClick={() => setShowVideoModal(false)}>
          <div className="glass-strong rounded-lg p-6 max-w-2xl w-full mx-4 relative border border-white/10" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
            >
              <X size={24} />
            </button>
            <h3 className="text-lg font-bold text-foreground mb-4">Product Videos</h3>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto scrollbar-glass">
              {videoUrls.map((url, index) => (
                <video
                  key={index}
                  src={url}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetails