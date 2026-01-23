import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import { getAdminFromToken } from '@/lib/auth'
import { sanitizeInput, containsMaliciousContent } from '@/lib/validation'
import mongoose from 'mongoose'

export const dynamic = 'force-dynamic'
export const revalidate = 60

// GET single product by ID
export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect()

        const { id } = await params

        // SECURITY: Validate MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { status: false, message: 'Invalid product ID' },
                { status: 400 }
            )
        }

        const product = await Product.findById(id).lean()

        if (!product) {
            return NextResponse.json(
                { status: false, message: 'Product not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(
            {
                status: true,
                product
            },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=240'
                }
            }
        )
    } catch (error) {
        console.error('Error fetching product:', error)
        return NextResponse.json(
            { status: false, message: 'Failed to fetch product' },
            { status: 500 }
        )
    }
}

// PUT update product (Admin only)
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params

        // SECURITY: Validate MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { status: false, message: 'Invalid product ID' },
                { status: 400 }
            )
        }

        const body = await req.json()

        // SECURITY: Only allow specific fields to be updated (prevent overposting)
        const allowedFields = ['name', 'price', 'description', 'category', 'features', 'images']
        const updateData: any = {}

        for (const field of allowedFields) {
            if (field in body) {
                updateData[field] = body[field]
            }
        }

        // SECURITY: Validate and sanitize each field if present
        if (updateData.name) {
            if (containsMaliciousContent(updateData.name)) {
                return NextResponse.json(
                    { status: false, message: 'Invalid characters in name' },
                    { status: 400 }
                )
            }
            updateData.name = sanitizeInput(updateData.name).slice(0, 200)
        }

        if (updateData.description) {
            if (containsMaliciousContent(updateData.description)) {
                return NextResponse.json(
                    { status: false, message: 'Invalid characters in description' },
                    { status: 400 }
                )
            }
            updateData.description = sanitizeInput(updateData.description).slice(0, 2000)
        }

        if (updateData.price !== undefined) {
            const priceNum = Number(updateData.price)
            if (isNaN(priceNum) || priceNum < 0 || priceNum > 10000000) {
                return NextResponse.json(
                    { status: false, message: 'Invalid price' },
                    { status: 400 }
                )
            }
            updateData.price = priceNum
        }

        if (updateData.category) {
            const validCategories = ['Abaya', 'Jalabia', 'Hijab', 'Caps', 'Mat']
            if (!validCategories.includes(updateData.category)) {
                return NextResponse.json(
                    { status: false, message: 'Invalid category' },
                    { status: 400 }
                )
            }
        }

        if (updateData.features) {
            if (!Array.isArray(updateData.features) || updateData.features.length < 2) {
                return NextResponse.json(
                    { status: false, message: 'Please provide at least 2 key features' },
                    { status: 400 }
                )
            }
            updateData.features = updateData.features
                .map((f: string) => sanitizeInput(f).slice(0, 200))
                .filter(Boolean)
                .slice(0, 10)
        }

        if (updateData.images) {
            if (!Array.isArray(updateData.images) || updateData.images.length < 1) {
                return NextResponse.json(
                    { status: false, message: 'Please provide at least 1 image' },
                    { status: 400 }
                )
            }
            updateData.images = updateData.images
                .filter((img: string) => typeof img === 'string' && img.startsWith('https://res.cloudinary.com/'))
                .slice(0, 20)
        }

        const product = await Product.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        })

        if (!product) {
            return NextResponse.json(
                { status: false, message: 'Product not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            status: true,
            message: 'Product updated successfully',
            product
        })
    } catch (error) {
        console.error('Error updating product:', error)
        // SECURITY: Don't expose error details
        return NextResponse.json(
            { status: false, message: 'Failed to update product' },
            { status: 500 }
        )
    }
}

// DELETE product (Admin only)
export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params

        // SECURITY: Validate MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { status: false, message: 'Invalid product ID' },
                { status: 400 }
            )
        }

        const product = await Product.findById(id)

        if (!product) {
            return NextResponse.json(
                { status: false, message: 'Product not found' },
                { status: 404 }
            )
        }

        // Delete all images/videos from Cloudinary
        if (product.images && product.images.length > 0) {
            const cloudinary = require('cloudinary').v2
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
            })

            for (const url of product.images) {
                try {
                    // Extract public_id from Cloudinary URL
                    const urlParts = url.split('/')
                    const fileWithExt = urlParts[urlParts.length - 1]
                    if (!fileWithExt) continue;

                    const folder = urlParts[urlParts.length - 2]
                    const publicId = `${folder}/${fileWithExt.split('.')[0]}`

                    // Determine resource type
                    const isVideo = url.includes('/video/') || url.match(/\.(mp4|webm|mov)$/i)
                    await cloudinary.uploader.destroy(publicId, {
                        resource_type: isVideo ? 'video' : 'image'
                    })
                } catch (err) {
                    console.error('Error deleting from Cloudinary:', err)
                    // Continue deleting other assets even if one fails
                }
            }
        }

        // Delete product from MongoDB
        await Product.findByIdAndDelete(id)

        return NextResponse.json({
            status: true,
            message: 'Product deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting product:', error)
        return NextResponse.json(
            { status: false, message: 'Failed to delete product' },
            { status: 500 }
        )
    }
}
