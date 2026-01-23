import Cart from '.'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Shopping Cart',
    description: 'Review your selected items and proceed to checkout.',
    robots: {
        index: false,
        follow: false,
    },
    alternates: {
        canonical: '/cart',
    },
}
import Header from '../components/Header'
import Footer from '../components/Footer'

const page = () => {
    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Header />
            <Cart />
            <Footer />
        </main>
    )
}

export default page