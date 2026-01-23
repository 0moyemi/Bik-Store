"use client"
import { useState } from 'react'
import Header from '../components/Header'
import Searchbar from '../components/Searchbar'
import ProductGrid from '../components/ProductGrid'

const Page = () => {
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <main className="min-h-screen bg-background">
            <Header />
            <Searchbar value={searchQuery} onChange={setSearchQuery} />
            <ProductGrid />
        </main>
    )
}

export default Page