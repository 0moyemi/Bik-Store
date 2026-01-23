"use client"
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Product } from '@/app/types'
import CategoryPills from '@/app/components/CategoryPills'
import Modal from '@/app/components/Modal'
import Searchbar from '@/app/components/Searchbar'
import { useCart } from '@/app/context/CartContext'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Eye } from 'lucide-react'

const categories = [
    { name: "Abaya" },
    { name: "Jalabia" },
    { name: "Hijab" },
    { name: "Caps" },
    { name: "Mat" },
]

const Marketplace = () => {
    const pathname = usePathname()
    const { updateCartCount } = useCart()
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [selectCategory, setSelectCategory] = useState('All Products')
    const [addedProduct, setAddedProduct] = useState<Product | null>(null)
    const [flashingCart, setFlashingCart] = useState<string | null>(null)

    // Reset modal on route change
    useEffect(() => {
        setShowSuccessModal(false)
        document.body.style.overflow = ''
    }, [pathname])

    // Scroll lock for modal
    useEffect(() => {
        if (showSuccessModal) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [showSuccessModal])

    const addToCart = (e: React.MouseEvent, product: Product) => {
        e.preventDefault()
        e.stopPropagation()

        // Flash effect
        setFlashingCart(product._id)
        setTimeout(() => setFlashingCart(null), 300)

        const cart = JSON.parse(localStorage.getItem("cart") || "[]")
        const existing = cart.find((item: any) => item._id === product._id)

        if (existing) {
            existing.quantity += 1
        } else {
            cart.push({ ...product, quantity: 1 })
        }

        localStorage.setItem("cart", JSON.stringify(cart))
        updateCartCount()
        setAddedProduct(product)
        setShowSuccessModal(true)
    }

    const fetchProducts = () => {
        setLoading(true)
        fetch('/api/products')
            .then((res) => res.json())
            .then((data) => {
                if (data.status) {
                    setProducts(data.products || [])
                }
            })
            .catch((err) => {
                console.error('Error fetching products:', err)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const normalizeSearch = (str = '') => str.toLocaleLowerCase().replace(/\s+/g, "")

    const filteredProducts = products.filter(product => {
        const matchesSearch = normalizeSearch(product.name).includes(normalizeSearch(search))
        const matchesCategory = selectCategory === 'All Products' || product.category === selectCategory
        return matchesSearch && matchesCategory
    })

    // Get latest 5-8 products for featured section
    const featuredProducts = products.slice(0, 8)

    return (
        <>
            <Searchbar value={search} onChange={setSearch} />


            {loading ? (
                <div className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="glass-card rounded-lg overflow-hidden border border-white/10 animate-pulse">
                                {/* Image Skeleton */}
                                <div className="w-full h-40 bg-secondary/20" />

                                {/* Content Skeleton */}
                                <div className="p-3 space-y-3">
                                    <div className="h-4 bg-secondary/20 rounded w-3/4" />
                                    <div className="h-5 bg-secondary/20 rounded w-1/2" />

                                    {/* Buttons Skeleton */}
                                    <div className="flex gap-2">
                                        <div className="flex-1 h-9 bg-secondary/20 rounded-full" />
                                        <div className="w-9 h-9 bg-secondary/20 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    {/* Featured/Latest Products - Horizontal Scroll */}
                    {!search && selectCategory === 'All Products' && featuredProducts.length > 0 && (
                        <section className="px-4 py-4 bg-background border-b border-border">
                            <h2 className="text-lg font-bold text-foreground mb-3">Latest in Store</h2>
                            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
                                <div className="flex gap-3 pb-2">
                                    {featuredProducts.map((product) => (
                                        <Link
                                            key={product._id}
                                            href={`/product/${product._id}`}
                                            className="glow-blue flex-shrink-0 w-44 bg-card rounded-lg border border-border overflow-hidden hover:border-accent transition-colors"
                                        >
                                            <div className="w-full h-33 bg-secondary flex items-center justify-center relative">
                                                {product.images && product.images.length > 0 && product.images[0] ? (
                                                    <Image
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        width={176}
                                                        height={144}
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <div className="text-4xl">📦</div>
                                                )}
                                            </div>
                                            <div className="p-3">
                                                <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                                                <p className="text-primary font-bold text-base">₦{product.price.toLocaleString()}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Main Product Grid - 2 Columns */}
                    <div className="bg-background">
                        <div className="px-4 pt-4 pb-2">
                            <h2 className="text-lg font-bold text-foreground mb-3">Browse Collections</h2>
                        </div>
                        <CategoryPills
                            categories={categories}
                            selectedCategory={selectCategory}
                            onCategoryChange={setSelectCategory}
                        />
                        {filteredProducts.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                No products found {search && `for "${search}"`}
                            </div>
                        ) : (
                            <div className="p-4 pt-3">
                                <div className="grid grid-cols-2 gap-4">
                                    {filteredProducts.map((product) => (
                                        <Link
                                            key={product._id}
                                            href={`/product/${product._id}`}
                                            className="glow-blue bg-card rounded-lg border border-border overflow-hidden hover:border-accent transition-colors"
                                        >
                                            {/* Product Image */}
                                            <div className="w-full h-40 bg-secondary flex items-center justify-center text-muted-foreground relative">
                                                {product.images && product.images.length > 0 && product.images[0] ? (
                                                    <Image
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        width={200}
                                                        height={160}
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <div className="text-5xl">📦</div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-3">
                                                <p className="text-sm font-medium text-foreground mb-1 truncate">{product.name}</p>
                                                <p className="text-primary font-bold mb-3">₦{product.price.toLocaleString()}</p>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2">
                                                    <button className="glow-blue flex-1 flex items-center justify-center gap-1 bg-primary text-primary-foreground py-2 rounded-full text-xs font-medium hover:opacity-90">
                                                        <Eye size={14} />
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={(e) => addToCart(e, product)}
                                                        className={`glow-blue flex-shrink-0 w-9 h-9 bg-card border border-border rounded-full flex items-center justify-center hover:bg-secondary transition-all ${flashingCart === product._id ? 'flash-blue' : ''
                                                            }`}
                                                    >
                                                        <ShoppingCart size={14} className={`transition-colors ${flashingCart === product._id ? 'text-white' : 'text-foreground'
                                                            }`} />
                                                    </button>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Success Modal */}
            {showSuccessModal && addedProduct && (
                <Modal
                    title="Added to Cart!"
                    message={`${addedProduct.name} has been added to your cart.`}
                    onClose={() => setShowSuccessModal(false)}
                />
            )}
        </>
    )
}

export default Marketplace
