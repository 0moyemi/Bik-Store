"use client"
import { Home } from "lucide-react"

interface CategoryPillsProps {
    categories: Array<{ name: string }>
    selectedCategory?: string
    onCategoryChange?: (category: string) => void
}

const CategoryPills = ({ categories, selectedCategory = 'All Products', onCategoryChange }: CategoryPillsProps) => {
    const handleCategoryClick = (category: string) => {
        if (onCategoryChange) {
            onCategoryChange(category)
        }
    }

    return (
        <div className="px-4 py-4 bg-background/50 border-b border-white/5 overflow-x-auto scrollbar-glass">
            <div className="flex gap-3">
                {/* All Products button */}
                <button
                    onClick={() => handleCategoryClick('All Products')}
                    className={`glow-blue flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${selectedCategory === 'All Products'
                            ? 'bg-accent text-accent-foreground glow-blue-active'
                            : 'glass-interactive text-foreground'
                        }`}
                >
                    <Home size={16} /></button>

                {/* Category pills */}
                {categories.map((cat) => (
                    <button
                        key={cat.name}
                        onClick={() => handleCategoryClick(cat.name)}
                        className={`glow-blue px-4 py-2 rounded-full whitespace-nowrap transition-all ${selectedCategory === cat.name
                                ? 'bg-accent text-accent-foreground font-medium glow-blue-active'
                                : 'glass-interactive text-foreground'
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default CategoryPills