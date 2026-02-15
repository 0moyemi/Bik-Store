import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import { getAdminFromToken } from '@/lib/auth'
import { sanitizeInput, containsMaliciousContent, validateSizeLabel } from '@/lib/validation'

const normalizeSizesInput = (sizes: unknown) => {
    if (!Array.isArray(sizes) || sizes.length === 0) {
        return { sizes: [], error: 'Please provide at least 1 size' }
    }

    const sanitizedSizes: Array<{ label: string; stock: number }> = []
    const seenLabels = new Set<string>()

    for (const entry of sizes) {
        if (!entry || typeof entry !== 'object') {
            return { sizes: [], error: 'Invalid size entry' }
        }

        const rawLabel = typeof (entry as { label?: unknown }).label === 'string'
            ? (entry as { label: string }).label.trim()
            : ''
        const labelResult = validateSizeLabel(rawLabel)
        if (!labelResult.isValid) {
            return { sizes: [], error: labelResult.error || 'Invalid size label' }
        }

        const sanitizedLabel = sanitizeInput(rawLabel).slice(0, 20)
        if (!sanitizedLabel) {
            return { sizes: [], error: 'Invalid size label' }
        }

        const labelKey = sanitizedLabel.toLowerCase()
        if (seenLabels.has(labelKey)) {
            return { sizes: [], error: 'Duplicate size labels are not allowed' }
        }
        seenLabels.add(labelKey)

        const stockValue = (entry as { stock?: unknown }).stock
        const stockNum = Number(stockValue)
        if (!Number.isInteger(stockNum) || stockNum < 0 || stockNum > 1000000) {
            return { sizes: [], error: 'Invalid size stock' }
        }

        sanitizedSizes.push({ label: sanitizedLabel, stock: stockNum })
    }

    return { sizes: sanitizedSizes }
}

const normalizeStockInput = (value: unknown) => {
    const stockNum = Number(value)
    if (!Number.isInteger(stockNum) || stockNum < 0 || stockNum > 1000000) {
        return { stock: 0, error: 'Invalid stock value' }
    }
    return { stock: stockNum }
}

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
        const { name, price, description, category, features, images, hasSizes, sizes, stock } = body

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

        const normalizedHasSizes = Boolean(hasSizes) || Array.isArray(sizes)
        let sanitizedSizes: Array<{ label: string; stock: number }> = []
        let normalizedStock = 0

        if (normalizedHasSizes) {
            const sizesResult = normalizeSizesInput(sizes)
            if (sizesResult.error) {
                return NextResponse.json(
                    { status: false, message: sizesResult.error },
                    { status: 400 }
                )
            }
            sanitizedSizes = sizesResult.sizes
        } else if (stock !== undefined) {
            const stockResult = normalizeStockInput(stock)
            if (stockResult.error) {
                return NextResponse.json(
                    { status: false, message: stockResult.error },
                    { status: 400 }
                )
            }
            normalizedStock = stockResult.stock
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
        const totalSizeStock = sanitizedSizes.reduce((sum, size) => sum + size.stock, 0)

        const sanitizedProduct = {
            name: sanitizeInput(name).slice(0, 200),
            price: priceNum,
            description: sanitizeInput(description).slice(0, 2000),
            category,
            features: features.map((f: string) => sanitizeInput(f).slice(0, 200)).filter(Boolean),
            images: images.filter((img: string) =>
                typeof img === 'string' && img.startsWith('https://res.cloudinary.com/')
            ).slice(0, 20),
            hasSizes: normalizedHasSizes,
            sizes: normalizedHasSizes ? sanitizedSizes : [],
            stock: normalizedHasSizes ? totalSizeStock : normalizedStock
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
