"use client"
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Product } from '@/app/types'
import CategoryPills from '@/app/components/CategoryPills'
import Modal from '@/app/components/Modal'
import Searchbar from '@/app/components/Searchbar'
import { useCart } from '@/app/context/CartContext'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Eye } from 'lucide-react'

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
    const { updateCartCount } = useCart()
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [products, setProducts] = useState<Product[]>([])
    const [latestProducts, setLatestProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [selectCategory, setSelectCategory] = useState('All Products')
    const [addedProduct, setAddedProduct] = useState<Product | null>(null)
    const [flashingCart, setFlashingCart] = useState<string | null>(null)
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

    const fetchProducts = () => {
        setLoading(true)
        fetch('/api/products')
            .then((res) => res.json())
            .then((data) => {
                if (data.status) {
                    const allProducts = data.products || []
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
                    {!search && selectCategory === 'All Products' && latestProducts.length > 0 && (
                        <section className="product-section px-4 lg:px-8 py-6 lg:py-8 bg-background border-b border-border">
                            <h2 className="text-lg lg:text-3xl font-bold text-foreground mb-4 lg:mb-8">Latest in Store</h2>
                            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
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
                                                <p className="text-sm lg:text-lg font-medium text-foreground truncate">{product.name}</p>
                                                <p className="text-primary font-bold text-base lg:text-2xl">₦{product.price.toLocaleString()}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Main Product Grid - 2 Columns Mobile, 4 Desktop */}
                    <div className="product-section bg-background">
                        <div className="px-4 lg:px-8 pt-4 lg:pt-6 pb-2">
                            <h2 className="text-lg lg:text-3xl font-bold text-foreground mb-3 lg:mb-6">Browse Collections</h2>
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
                                flashingCart={flashingCart}
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

                                                {/* Action Buttons */}
                                                <div className="flex gap-2">
                                                    <button className="glow-blue flex-1 flex items-center justify-center gap-1 lg:gap-2 bg-primary text-primary-foreground py-2 lg:py-3 rounded-full text-xs lg:text-sm font-medium hover:opacity-90">
                                                        <Eye size={14} className="lg:w-5 lg:h-5" />
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={(e) => addToCart(e, product)}
                                                        className={`glow-blue flex-shrink-0 w-9 h-9 lg:w-12 lg:h-12 bg-card border border-border rounded-full flex items-center justify-center hover:bg-secondary transition-all ${flashingCart === product._id ? 'flash-blue' : ''
                                                            }`}
                                                    >
                                                        <ShoppingCart size={14} className={`lg:w-5 lg:h-5 transition-colors ${flashingCart === product._id ? 'text-white' : 'text-foreground'
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
