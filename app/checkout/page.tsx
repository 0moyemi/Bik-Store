import Checkout from '.'
import Header from '../components/Header'
import Footer from '../components/Footer'

const page = () => {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-background flex flex-col pt-[52px]">
                <Checkout />
                <Footer />
            </main>
        </>
    )
}

export default page