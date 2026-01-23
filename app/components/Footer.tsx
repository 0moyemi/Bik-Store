"use client"

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="glass-card border-t border-white/10 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="text-center space-y-3">
                    <p className="text-sm text-muted-foreground">
                        Your trusted destination for quality Islamic clothing and accessories.
                    </p>
                    {/* <div>
                        <a href="/about" className="text-sm text-accent hover:text-accent/80 transition-colors font-medium">
                            Need help? Contact us.
                        </a>
                    </div> */}
                    <p className="text-xs text-muted-foreground">
                        © {currentYear} Bikudiratillah. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
