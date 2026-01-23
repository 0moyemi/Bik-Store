import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export interface AdminTokenPayload {
    id: string
    role: string
    iat: number
    exp: number
}

/**
 * Verify admin JWT token
 * @param token - JWT token string
 * @returns Decoded token payload or null if invalid
 */
export function verifyAdminToken(token: string): AdminTokenPayload | null {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AdminTokenPayload

        if (decoded.role !== 'admin') {
            return null
        }

        return decoded
    } catch (error) {
        console.error('Token verification failed:', error)
        return null
    }
}

/**
 * Get and verify admin token from cookies (for API routes)
 * @returns Admin ID if valid, null otherwise
 */
export async function getAdminFromToken(): Promise<string | null> {
    const cookieStore = await cookies()
    const token = cookieStore.get('adminToken')

    if (!token?.value) {
        return null
    }

    const decoded = verifyAdminToken(token.value)
    return decoded?.id || null
}

/**
 * Check if request is authenticated (for API routes)
 * @returns Boolean indicating authentication status
 */
export async function isAuthenticated(): Promise<boolean> {
    const adminId = await getAdminFromToken()
    return adminId !== null
}
