"use client"
import { Product } from "@/app/types"
import Image from "next/image"
import Link from "next/link"

interface ProductSectionProps {
    title: string
    products: Product[]
    onAddToCart: (e: React.MouseEvent, product: Product) => void
}

const ProductSection = ({ title, products, onAddToCart }: ProductSectionProps) => {
    return (
        <section className="px-4 py-3 bg-background/50 border-b border-white/5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">{title}</h2>
                <a href="#" className="glow-blue px-4 py-2 rounded-full glass-interactive text-accent-foreground text-sm font-medium hover:scale-105 transition-all">
                    See all →
                </a>
            </div>

            <div className="overflow-x-auto scrollbar-glass">
                <div className="flex gap-4 pb-2">
                    {products.map((product) => (
                        <Link
                            key={product._id}
                            href={`/product/${product._id}`}
                            className="glow-blue flex-shrink-0 w-52 glass-card rounded-lg overflow-hidden hover:border-white/20 transition-all hover:scale-[1.02] block"
                        >
                            {/* Product Image */}
                            <div className="w-full h-50 bg-secondary/20 backdrop-blur-sm flex items-center justify-center text-muted-foreground relative">
                                {product.images && product.images.length > 0 && product.images[0] ? (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        width={208}
                                        height={200}
                                        sizes="(max-width: 768px) 208px, (max-width: 1024px) 250px, 300px"
                                        quality={80}
                                        loading="lazy"
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="text-5xl">📦</div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-4 backdrop-blur-sm">
                                <p className="text-base font-medium text-foreground mb-1 truncate">{product.name}</p>
                                <p className="text-accent font-bold mb-4 text-lg">₦{product.price.toLocaleString()}</p>

                                {/* Action Buttons - UX optimized for non-technical users */}
                                <div className="flex flex-col gap-2">
                                    {/* Primary action: Buy - Most prominent */}
                                    <button
                                        onClick={(e) => onAddToCart(e, product)}
                                        className="glow-blue-active w-full bg-accent text-accent-foreground py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-all"
                                    >
                                        Buy Item Now
                                    </button>
                                    {/* Secondary action: View details - Less prominent */}
                                    <button className="w-full glass-interactive text-foreground py-2 rounded-lg text-xs font-medium hover:bg-white/10 transition-all border border-white/20">
                                        View Item Details
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ProductSection
