export interface Product {
    _id: string
    name: string
    description: string
    price: number
    category: string
    features: string[]
    images: string[]
    hasSizes?: boolean
    sizes?: ProductSize[]
    stock?: number
    createdAt?: string
    updatedAt?: string
}

export interface ProductSize {
    label: string
    stock: number
}

export interface CartItem extends Product {
    quantity: number
    selectedSize?: string
}

export interface Category {
    name: string
}