import bcrypt from 'bcryptjs'
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { password } = await req.json()

  const hashed = await bcrypt.hash(password, 10)

  return NextResponse.json({ hashed })
}

export async function GET() {
  const password = process.env.ADMIN_PASSWORD || 'default-password'
  const hash = await bcrypt.hash(password, 10)

  console.log('=== HASHED PASSWORD ===')
  console.log(hash)

  return NextResponse.json({
    message: 'Check your server console for the hashed password',
    hashed: hash
  })
}