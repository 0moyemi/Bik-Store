"use client"
import { useState } from 'react'
import Header from '../components/Header'
import Searchbar from '../components/Searchbar'
import ProductGrid from '../components/ProductGrid'

const Page = () => {
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <>
            <Header />
            <main className="min-h-screen bg-background pt-[52px]">
                <Searchbar value={searchQuery} onChange={setSearchQuery} />
                <ProductGrid />
            </main>
        </>
    )
}

export default Page