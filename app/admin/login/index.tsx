"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { validateEmail, validateText } from '@/lib/validation'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setErrors({ email: '', password: '' })
    setLoading(true)

    // Validate email
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      setErrors(prev => ({ ...prev, email: emailValidation.error || '' }))
      setLoading(false)
      return
    }

    // Validate password
    const passwordValidation = validateText(password, 'Password', 6, 100)
    if (!passwordValidation.isValid) {
      setErrors(prev => ({ ...prev, password: passwordValidation.error || '' }))
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Login successful - redirect to dashboard
        router.push('/admin/dashboard')
      } else {
        setError(data.message || 'Invalid credentials')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-card border border-border rounded-lg p-6 space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Admin Sign In</h1>
        {/* <p className="text-muted-foreground text-sm">Manage your store products</p> */}
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setErrors(prev => ({ ...prev, email: '' }))
            }}
            required
            className={`w-full bg-input border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 transition-all ${errors.email ? 'border-red-500 ring-2 ring-red-500' : 'border-border focus:ring-primary'
              }`}
            placeholder="admin@bikudiratillah.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setErrors(prev => ({ ...prev, password: '' }))
            }}
            required
            className={`w-full bg-input border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 transition-all ${errors.password ? 'border-red-500 ring-2 ring-red-500' : 'border-border focus:ring-primary'
              }`}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center p-2 bg-red-50 dark:bg-red-950 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="glow-blue w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}

export default AdminLogin