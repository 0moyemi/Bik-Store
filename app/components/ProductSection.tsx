"use client"
import { ShoppingCart } from "lucide-react"
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

            <div className="overflow-x-auto scrollbar-glass -mx-4 px-4">
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

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button className="glow-blue-active flex-1 flex items-center justify-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-all">
                                        <span>View details</span>
                                    </button>
                                    <button
                                        onClick={(e) => onAddToCart(e, product)}
                                        className="glow-blue flex-shrink-0 w-11 h-11 glass-interactive rounded-full flex items-center justify-center hover:scale-105 transition-all"
                                    >
                                        <ShoppingCart size={18} className="text-foreground" />
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
