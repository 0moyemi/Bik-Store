import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IProduct extends Document {
    name: string
    price: number
    description: string
    category: string
    features: string[]
    images: string[]
    createdAt: Date
    updatedAt: Date
}

const productSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        features: {
            type: [String],
            validate: {
                validator: (v: string[]) => v.length >= 2,
                message: "At least 2 features required"
            }
        },
        images: {
            type: [String],
            default: [],
            validate: {
                validator: (v: string[]) => v.length >= 1,
                message: "At least 1 image required"
            }
        }
    },
    { timestamps: true }
)

// Prevent model recompilation during hot reloads
const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema)

export default Product
