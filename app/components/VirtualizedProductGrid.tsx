"use client"
import { useEffect, useState, ReactElement } from 'react'
import { Grid } from 'react-window'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/app/types'

interface VirtualizedProductGridProps {
    products: Product[]
    onAddToCart: (e: React.MouseEvent, product: Product) => void
    addingProductId: string | null
}

const VirtualizedProductGrid = ({ products, onAddToCart, addingProductId }: VirtualizedProductGridProps) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    useEffect(() => {
        let timeoutId: NodeJS.Timeout

        const updateDimensions = () => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
                const width = window.innerWidth
                const height = window.innerHeight
                setDimensions({ width: width - 64, height }) // Account for padding
            }, 150) // Debounce resize events
        }

        updateDimensions()
        window.addEventListener('resize', updateDimensions)
        return () => {
            clearTimeout(timeoutId)
            window.removeEventListener('resize', updateDimensions)
        }
    }, [])

    // Calculate columns based on screen width
    const columnCount = dimensions.width >= 1536 ? 5 : 4 // 5 cols on 2xl, 4 on lg
    const columnWidth = dimensions.width / columnCount
    const rowHeight = 450 // Increased height for full product card display

    const Cell = ({ columnIndex, rowIndex, style }: any): ReactElement | null => {
        const index = rowIndex * columnCount + columnIndex
        const product = products[index]

        if (!product) return null

        return (
            <div style={style} className="p-3">
                <Link
                    href={`/product/${product._id}`}
                    className="block bg-card rounded-lg border border-border overflow-hidden hover:border-accent transition-colors h-full"
                >
                    {/* Product Image */}
                    <div className="w-full h-64 bg-secondary flex items-center justify-center text-muted-foreground relative">
                        {product.images && product.images.length > 0 && product.images[0] ? (
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                width={300}
                                height={256}
                                sizes="25vw"
                                quality={80}
                                loading="lazy"
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <div className="text-7xl">📦</div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                        <p className="text-base font-medium text-foreground mb-1 truncate">{product.name}</p>
                        <p className="text-primary font-bold mb-4 text-xl">₦{product.price.toLocaleString()}</p>

                        {/* Action Buttons - UX optimized for non-technical users */}
                        <div className="flex flex-col gap-2">
                            {/* Primary action: Buy - Most prominent */}
                            <button
                                onClick={(e) => onAddToCart(e, product)}
                                disabled={addingProductId === product._id}
                                className="glow-blue-active w-full bg-primary text-primary-foreground py-3 rounded-lg text-base font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                            <button className="w-full glass-interactive text-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-all border border-white/20">
                                View Item Details
                            </button>
                        </div>
                    </div>
                </Link>
            </div>
        )
    }

    if (dimensions.width === 0) {
        // Loading state
        return (
            <div className="p-8">
                <div className="grid grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="glass-card rounded-lg overflow-hidden border border-white/10 animate-pulse h-96" />
                    ))}
                </div>
            </div>
        )
    }

    const rowCount = Math.ceil(products.length / columnCount)

    return (
        <div className="px-8 py-6">
            <Grid
                columnCount={columnCount}
                columnWidth={columnWidth}
                defaultHeight={Math.min(dimensions.height - 200, rowCount * rowHeight)}
                rowCount={rowCount}
                rowHeight={rowHeight}
                defaultWidth={dimensions.width}
                overscanCount={2}
                style={{ margin: '0 auto' }}
                cellComponent={Cell}
                cellProps={{}}
            />
        </div>
    )
}

export default VirtualizedProductGrid
