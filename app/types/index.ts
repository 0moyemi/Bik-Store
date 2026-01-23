export interface Product {
    _id: string
    name: string
    description: string
    price: number
    category: string
    features: string[]
    images: string[]
    createdAt?: string
    updatedAt?: string
}

export interface CartItem extends Product {
    quantity: number
}

export interface Category {
    name: string
}