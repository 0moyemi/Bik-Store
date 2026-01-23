"use client"
import { Search } from "lucide-react"
import { useState } from "react"
import { validateText } from "@/lib/validation"

interface SearchbarProps {
  value: string
  onChange: (value: string) => void
}

const Searchbar = ({ value, onChange }: SearchbarProps) => {
  const [error, setError] = useState('')

  const handleChange = (input: string) => {
    const validation = validateText(input, 'Search query', 1, 100)
    if (!validation.isValid && input.length > 0) {
      setError(validation.error || '')
      return
    }
    setError('')
    onChange(input)
  }

  return (
    <div className="px-4 py-3 bg-background/50 border-b border-white/5">
      <div className={`flex items-center gap-3 glass-interactive rounded-full px-4 py-2 glow-blue transition-all ${error ? 'ring-2 ring-red-500' : 'focus-within:border-white/20'
        }`}>
        <Search size={20} className="text-muted-foreground" />
        <input
          type="text"
          placeholder="Search products..."
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="bg-transparent text-foreground placeholder-muted-foreground/60 outline-none flex-1"
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1 px-4">{error}</p>
      )}
    </div>
  )
}

export default Searchbar