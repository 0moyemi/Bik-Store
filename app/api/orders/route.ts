import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import mongoose from 'mongoose'

export async function POST(req: Request) {
    try {
        await dbConnect()

        const body = await req.json()
        const { cartItems } = body

        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            return NextResponse.json(
                { status: false, message: 'Cart is empty' },
                { status: 400 }
            )
        }

        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            for (const item of cartItems) {
                if (!mongoose.Types.ObjectId.isValid(item._id)) {
                    throw new Error(`Invalid product ID: ${item._id}`)
                }

                const product = await Product.findById(item._id).session(session)
                if (!product) {
                    throw new Error(`Product not found: ${item._id}`)
                }

                // Handle sized products
                if (product.hasSizes && Array.isArray(product.sizes)) {
                    const sizeIndex = product.sizes.findIndex(
                        (s: { label: string; stock: number }) => s.label === item.selectedSize
                    )

                    if (sizeIndex === -1) {
                        throw new Error(`Size ${item.selectedSize} not found for ${product.name}`)
                    }

                    const currentStock = product.sizes[sizeIndex].stock
                    if (currentStock < item.quantity) {
                        throw new Error(`Insufficient stock for ${product.name} size ${item.selectedSize}`)
                    }

                    // Decrement size stock
                    product.sizes[sizeIndex].stock -= item.quantity

                    // Recalculate total stock
                    const newTotalStock = product.sizes.reduce(
                        (sum: number, size: { stock: number }) => sum + size.stock,
                        0
                    )
                    product.stock = newTotalStock

                    await product.save({ session })
                } else {
                    // Handle non-sized products
                    if (product.stock < item.quantity) {
                        throw new Error(`Insufficient stock for ${product.name}`)
                    }

                    product.stock -= item.quantity
                    await product.save({ session })
                }
            }

            await session.commitTransaction()
            session.endSession()

            return NextResponse.json({
                status: true,
                message: 'Order processed successfully'
            })
        } catch (error) {
            await session.abortTransaction()
            session.endSession()
            throw error
        }
    } catch (error) {
        console.error('Order processing error:', error)
        return NextResponse.json(
            {
                status: false,
                message: error instanceof Error ? error.message : 'Failed to process order'
            },
            { status: 500 }
        )
    }
}
