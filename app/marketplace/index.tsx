"use client"
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Product } from '@/app/types'
import CategoryPills from '@/app/components/CategoryPills'
import Searchbar from '@/app/components/Searchbar'
import Toast from '@/app/components/Toast'
import { useCart } from '@/app/context/CartContext'
import Link from 'next/link'
import Image from 'next/image'

// Lazy load virtualized grid for better initial load
const VirtualizedProductGrid = dynamic(() => import('@/app/components/VirtualizedProductGrid'), {
    ssr: false,
    loading: () => (
        <div className="p-8">
            <div className="grid grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="glass-card rounded-lg overflow-hidden border border-white/10 animate-pulse h-96" />
                ))}
            </div>
        </div>
    )
})

const categories = [
    { name: "Abaya" },
    { name: "Jalabia" },
    { name: "Hijab" },
    { name: "Caps" },
    { name: "Mat" },
]

const Marketplace = () => {
    const pathname = usePathname()
    const router = useRouter()
    const { updateCartCount } = useCart()
    const [showToast, setShowToast] = useState(false)
    const [products, setProducts] = useState<Product[]>([])
    const [latestProducts, setLatestProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [selectCategory, setSelectCategory] = useState('All Products')
    const [addedProduct, setAddedProduct] = useState<Product | null>(null)
    const [addingProductId, setAddingProductId] = useState<string | null>(null)
    // Initialize virtualization based on screen size immediately
    const [useVirtualization, setUseVirtualization] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
    )

    // Detect large screen for virtualization
    useEffect(() => {
        let timeoutId: NodeJS.Timeout

        const checkScreenSize = () => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
                setUseVirtualization(window.innerWidth >= 1024)
            }, 150)
        }

        // Set immediately on mount
        setUseVirtualization(window.innerWidth >= 1024)

        window.addEventListener('resize', checkScreenSize)
        return () => {
            clearTimeout(timeoutId)
            window.removeEventListener('resize', checkScreenSize)
        }
    }, [])

    // Reset toast on route change
    useEffect(() => {
        setShowToast(false)
    }, [pathname])

    const addToCart = (e: React.MouseEvent, product: Product) => {
        if (product.hasSizes) {
            e.preventDefault()
            e.stopPropagation()
            router.push(`/product/${product._id}`)
            return
        }

        e.preventDefault()
        e.stopPropagation()

        if (addingProductId) return
        setAddingProductId(product._id)

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
        setShowToast(true)

        setTimeout(() => setAddingProductId(null), 1000)
    }

    // Fisher-Yates shuffle algorithm
    const shuffleArray = (array: Product[]): Product[] => {
        const shuffled = [...array]
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            const temp = shuffled[i]!
            shuffled[i] = shuffled[j]!
            shuffled[j] = temp
        }
        return shuffled
    }

    const getProductStock = (product: Product) => {
        if (Array.isArray(product.sizes) && product.sizes.length > 0) {
            return product.sizes.reduce((sum, size) => sum + (size.stock || 0), 0)
        }
        if (typeof product.stock === 'number') {
            return product.stock
        }
        return 1
    }

    const fetchProducts = () => {
        setLoading(true)
        fetch('/api/products')
            .then((res) => res.json())
            .then((data) => {
                if (data.status) {
                    const allProducts = (data.products || []).filter((product: Product) => getProductStock(product) > 0)
                    // Keep latest products unshuffled for "Latest in Store"
                    setLatestProducts(allProducts.slice(0, 8))
                    // Shuffle products for main grid variety
                    const shuffled = shuffleArray(allProducts)
                    setProducts(shuffled)
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
                    {!search && latestProducts.length > 0 && (
                        <section className="product-section px-4 lg:px-8 py-3 lg:py-4 bg-background border-b border-border">
                            <h2 className="text-lg lg:text-3xl font-bold text-foreground mb-3 lg:mb-5">Latest in Store</h2>
                            <div className="overflow-x-auto scrollbar-hide">
                                <div className="flex gap-3 lg:gap-6 pb-2">
                                    {latestProducts.map((product) => (
                                        <Link
                                            key={product._id}
                                            href={`/product/${product._id}`}
                                            className="glow-blue flex-shrink-0 w-44 lg:w-72 bg-card rounded-lg border border-border overflow-hidden hover:border-accent transition-colors"
                                        >
                                            <div className="w-full h-33 lg:h-60 bg-secondary flex items-center justify-center relative">
                                                {product.images && product.images.length > 0 && product.images[0] ? (
                                                    <Image
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        width={288}
                                                        height={240}
                                                        sizes="(max-width: 768px) 176px, (max-width: 1024px) 250px, 288px"
                                                        quality={80}
                                                        loading="lazy"
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <div className="text-4xl lg:text-7xl">📦</div>
                                                )}
                                            </div>
                                            <div className="p-3 lg:p-5">
                                                <p className="text-sm lg:text-lg font-medium text-foreground truncate mb-2">{product.name}</p>
                                                {/* Price and Buy Now button on same row */}
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="text-primary font-bold text-base lg:text-2xl">₦{product.price.toLocaleString()}</p>
                                                    <button
                                                        onClick={(e) => addToCart(e, product)}
                                                        disabled={addingProductId === product._id}
                                                        className="glow-blue-active bg-primary text-primary-foreground px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-bold hover:opacity-90 transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                                    >
                                                        {addingProductId === product._id ? (
                                                            <>
                                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                                                <span className="hidden lg:inline">Adding...</span>
                                                            </>
                                                        ) : (
                                                            'Buy Now'
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Main Product Grid - 2 Columns Mobile, 4 Desktop */}
                    <div className="product-section bg-background">
                        <div className="px-4 lg:px-8 pt-3 lg:pt-4 pb-1 lg:pb-2">
                            <h2 className="text-lg lg:text-3xl font-bold text-foreground mb-2 lg:mb-4">Browse Collections</h2>
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
                        ) : useVirtualization ? (
                            /* Use virtualized grid on large screens for better performance */
                            <VirtualizedProductGrid
                                products={filteredProducts}
                                onAddToCart={addToCart}
                                addingProductId={addingProductId}
                            />
                        ) : (
                            /* Regular grid for mobile/tablet */
                            <div className="p-4 lg:px-8 lg:py-6 pt-3">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                                    {filteredProducts.map((product) => (
                                        <Link
                                            key={product._id}
                                            href={`/product/${product._id}`}
                                            className="glow-blue bg-card rounded-lg border border-border overflow-hidden hover:border-accent transition-colors"
                                        >
                                            {/* Product Image */}
                                            <div className="w-full h-40 lg:h-64 bg-secondary flex items-center justify-center text-muted-foreground relative">
                                                {product.images && product.images.length > 0 && product.images[0] ? (
                                                    <Image
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        width={300}
                                                        height={256}
                                                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                        quality={80}
                                                        loading="lazy"
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <div className="text-5xl lg:text-7xl">📦</div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-3 lg:p-5">
                                                <p className="text-sm lg:text-base font-medium text-foreground mb-1 truncate">{product.name}</p>
                                                <p className="text-primary font-bold mb-3 lg:mb-4 text-base lg:text-xl">₦{product.price.toLocaleString()}</p>

                                                {/* Action Buttons - UX optimized for non-technical users */}
                                                <div className="flex flex-col gap-2">
                                                    {/* Primary action: Buy - Most prominent */}
                                                    <button
                                                        onClick={(e) => addToCart(e, product)}
                                                        disabled={addingProductId === product._id}
                                                        className="glow-blue-active w-full bg-primary text-primary-foreground py-2.5 lg:py-3 rounded-lg text-sm lg:text-base font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                    >
                                                        {addingProductId === product._id ? (
                                                            <>
                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                                Adding...
                                                            </>
                                                        ) : (
                                                            'Buy Item Now'
                                                        )}
                                                    </button>
                                                    {/* Secondary action: View details - Less prominent */}
                                                    <button className="w-full glass-interactive text-foreground py-2 lg:py-2.5 rounded-lg text-xs lg:text-sm font-medium hover:bg-white/10 transition-all border border-white/20">
                                                        View Item Details
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

            {/* Toast Notification - Clear feedback for non-technical users */}
            {showToast && addedProduct && (
                <Toast
                    message={`✓ 1 item added to your cart! Tap the CART button at the top of the page to continue your order.`}
                    onClose={() => setShowToast(false)}
                    type="success"
                    duration={6000}
                />
            )}
        </>
    )
}

export default Marketplace
