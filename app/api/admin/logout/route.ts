import { NextResponse } from 'next/server'

export async function POST() {
    const response = NextResponse.json({
        status: true,
        message: 'Logged out successfully'
    })

    // Clear the admin token cookie
    response.cookies.delete('adminToken')

    return response
}
