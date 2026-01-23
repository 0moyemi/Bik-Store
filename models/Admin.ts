import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IAdmin extends Document {
    email: string
    password: string
    createdAt: Date
    updatedAt: Date
}

const adminSchema = new Schema<IAdmin>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true
    }
)

// Prevent model recompilation during hot reloads in development
const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', adminSchema)

export default Admin
