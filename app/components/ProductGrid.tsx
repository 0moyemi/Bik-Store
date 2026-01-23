"use client"
import { ShoppingCart, Eye } from "lucide-react"

const ProductGrid = () => {
  const products = Array(8)
    .fill(null)
    .map((_, i) => i + 1)
  return (
    <div className="p-4 lg:p-8 bg-background">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {products.map((product) => (
          <div key={product} className="glow-blue glass-card rounded-lg overflow-hidden border border-white/10 hover:border-white/20 transition-all">
            {/* Product Image */}
            <div className="w-full h-40 lg:h-64 bg-secondary/20 backdrop-blur-sm flex items-center justify-center text-muted-foreground">
              <div className="text-5xl lg:text-7xl">👔</div>
            </div>

            {/* Product Info */}
            <div className="p-3 lg:p-5 backdrop-blur-sm">
              <p className="text-sm lg:text-base font-medium text-foreground mb-1 truncate">Product Name</p>
              <p className="text-primary font-bold mb-3 lg:mb-4 text-base lg:text-xl">₦5,999</p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="glow-blue-active flex-1 flex items-center justify-center gap-1 lg:gap-2 bg-primary text-primary-foreground py-2 lg:py-3 rounded-full text-xs lg:text-sm font-medium hover:opacity-90 transition-all">
                  <Eye size={14} className="lg:w-5 lg:h-5" />
                  Details
                </button>
                <button className="glow-blue flex-shrink-0 w-9 h-9 lg:w-12 lg:h-12 glass-interactive rounded-full flex items-center justify-center hover:scale-105 transition-all">
                  <ShoppingCart size={14} className="lg:w-5 lg:h-5 text-foreground" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductGrid