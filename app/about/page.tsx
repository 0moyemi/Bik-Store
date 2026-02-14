import About from '.'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Learn about Bikudiratillah - Your trusted source for premium Islamic modest fashion in Ibadan. Visit our store at No. 22 Big Plaza, Oluyole Estate.',
    alternates: {
        canonical: '/about',
    },
}
import Header from '../components/Header'
import Footer from '../components/Footer'

const page = () => {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-background flex flex-col pt-[52px]">
                <About />
                <Footer />
            </main>
        </>
    )
}

export default page