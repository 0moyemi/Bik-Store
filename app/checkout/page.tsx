import Checkout from '.'
import Header from '../components/Header'
import Footer from '../components/Footer'

const page = () => {
    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Header />
            <Checkout />
            <Footer />
        </main>
    )
}

export default page