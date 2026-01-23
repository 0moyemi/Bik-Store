import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import { getAdminFromToken } from '@/lib/auth'
import { sanitizeInput, containsMaliciousContent } from '@/lib/validation'

// GET all products
export async function GET() {
    try {
        await dbConnect()

        const products = await Product.find({}).sort({ createdAt: -1 }).lean()

        return NextResponse.json(
            {
                status: true,
                products
            },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
                }
            }
        )
    } catch (error) {
        console.error('Error fetching products:', error)
        return NextResponse.json(
            { status: false, message: 'Failed to fetch products' },
            { status: 500 }
        )
    }
}

export const dynamic = 'force-dynamic'
export const revalidate = 60

// POST create new product (Admin only)
export async function POST(req: Request) {
    try {
        // SECURITY: Check authentication
        const adminId = await getAdminFromToken()
        if (!adminId) {
            return NextResponse.json(
                { status: false, message: 'Unauthorized' },
                { status: 401 }
            )
        }

        await dbConnect()

        const body = await req.json()
        const { name, price, description, category, features, images } = body

        // SECURITY: Validate required fields exist
        if (!name || !price || !description || !category) {
            return NextResponse.json(
                { status: false, message: 'Missing required fields' },
                { status: 400 }
            )
        }

        // SECURITY: Validate data types
        if (!Array.isArray(features) || features.length < 2) {
            return NextResponse.json(
                { status: false, message: 'Please provide at least 2 key features' },
                { status: 400 }
            )
        }

        if (!Array.isArray(images) || images.length < 1) {
            return NextResponse.json(
                { status: false, message: 'Please provide at least 1 image' },
                { status: 400 }
            )
        }

        // SECURITY: Check for malicious content (XSS)
        if (containsMaliciousContent(name) || containsMaliciousContent(description)) {
            return NextResponse.json(
                { status: false, message: 'Invalid characters detected' },
                { status: 400 }
            )
        }

        // SECURITY: Validate price is a positive number
        const priceNum = Number(price)
        if (isNaN(priceNum) || priceNum < 0 || priceNum > 10000000) {
            return NextResponse.json(
                { status: false, message: 'Invalid price' },
                { status: 400 }
            )
        }

        // SECURITY: Validate category is from allowed list
        const validCategories = ['Abaya', 'Jalabia', 'Hijab', 'Caps', 'Mat']
        if (!validCategories.includes(category)) {
            return NextResponse.json(
                { status: false, message: 'Invalid category' },
                { status: 400 }
            )
        }

        // SECURITY: Sanitize text inputs
        const sanitizedProduct = {
            name: sanitizeInput(name).slice(0, 200),
            price: priceNum,
            description: sanitizeInput(description).slice(0, 2000),
            category,
            features: features.map((f: string) => sanitizeInput(f).slice(0, 200)).filter(Boolean),
            images: images.filter((img: string) =>
                typeof img === 'string' && img.startsWith('https://res.cloudinary.com/')
            ).slice(0, 20)
        }

        const product = await Product.create(sanitizedProduct)

        return NextResponse.json(
            {
                status: true,
                message: 'Product created successfully',
                product
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error creating product:', error)
        // SECURITY: Don't expose error details to client
        return NextResponse.json(
            { status: false, message: 'Failed to create product' },
            { status: 500 }
        )
    }
}
