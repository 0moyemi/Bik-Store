"use client"
import { ShoppingCart, Eye } from "lucide-react"

const ProductGrid = () => {
  const products = Array(8)
    .fill(null)
    .map((_, i) => i + 1)
  return (
    <div className="p-4 bg-background">
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product} className="glow-blue glass-card rounded-lg overflow-hidden border border-white/10 hover:border-white/20 transition-all">
            {/* Product Image */}
            <div className="w-full h-40 bg-secondary/20 backdrop-blur-sm flex items-center justify-center text-muted-foreground">
              <div className="text-5xl">👔</div>
            </div>

            {/* Product Info */}
            <div className="p-3 backdrop-blur-sm">
              <p className="text-sm font-medium text-foreground mb-1 truncate">Product Name</p>
              <p className="text-primary font-bold mb-3">₦5,999</p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="glow-blue-active flex-1 flex items-center justify-center gap-1 bg-primary text-primary-foreground py-2 rounded-full text-xs font-medium hover:opacity-90 transition-all">
                  <Eye size={14} />
                  Details
                </button>
                <button className="glow-blue flex-shrink-0 w-9 h-9 glass-interactive rounded-full flex items-center justify-center hover:scale-105 transition-all">
                  <ShoppingCart size={14} className="text-foreground" />
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