import Link from 'next/link'
import Header from './components/Header'

export default function NotFound() {
    return (
        <main className="min-h-screen bg-background">
            <Header />
            <div className="flex flex-col items-center justify-center px-4 py-20">
                <div className="text-center space-y-6 max-w-md">
                    <h1 className="text-9xl font-bold text-primary">404</h1>
                    <h2 className="text-3xl font-bold text-foreground">Page Not Found</h2>
                    <p className="text-muted-foreground">
                        Sorry, the page you're looking for doesn't exist or has been moved.
                    </p>
                    <div className="flex gap-4 justify-center pt-4">
                        <Link
                            href="/"
                            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition"
                        >
                            Go Home
                        </Link>
                        <Link
                            href="/marketplace"
                            className="px-6 py-3 bg-secondary text-foreground rounded-lg font-medium hover:bg-border transition"
                        >
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
