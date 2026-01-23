import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dbConnect from "@/lib/mongodb"
import Admin from "@/models/Admin"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, password } = body

        // SECURITY: Validate input presence
        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            )
        }

        // SECURITY: Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: "Invalid email format" },
                { status: 400 }
            )
        }

        // SECURITY: Rate limiting check (basic implementation)
        // TODO: Implement proper rate limiting with Redis or similar

        await dbConnect()

        const admin = await Admin.findOne({ email: email.toLowerCase().trim() })
        if (!admin) {
            // SECURITY: Generic error message to prevent user enumeration
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            )
        }

        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) {
            // SECURITY: Generic error message
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            )
        }

        // SECURITY: Check JWT_SECRET exists
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined')
            return NextResponse.json(
                { message: "Internal server error" },
                { status: 500 }
            )
        }

        const token = jwt.sign(
            { id: admin._id.toString(), role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        const res = NextResponse.json({ message: "Login successful" })

        // SECURITY: Secure cookie settings
        res.cookies.set("adminToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 86400, // 1 day in seconds
            path: "/"
        })

        return res
    } catch (error) {
        console.error('Error during admin login:', error)
        // SECURITY: Don't expose error details
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
