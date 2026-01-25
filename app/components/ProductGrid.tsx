"use client"

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

              {/* Action Buttons - UX optimized for non-technical users */}
              <div className="flex flex-col gap-2">
                {/* Primary action: Buy - Most prominent */}
                <button className="glow-blue-active w-full bg-primary text-primary-foreground py-2.5 lg:py-3 rounded-lg text-sm lg:text-base font-bold hover:opacity-90 transition-all">
                  Buy Item Now
                </button>
                {/* Secondary action: View details - Less prominent */}
                <button className="w-full glass-interactive text-foreground py-2 lg:py-2.5 rounded-lg text-xs lg:text-sm font-medium hover:bg-white/10 transition-all border border-white/20">
                  View Item Details
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