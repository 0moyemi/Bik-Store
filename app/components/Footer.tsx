"use client"
import { Phone, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const Footer = () => {
    const currentYear = new Date().getFullYear()
    const phoneNumber = "+234 8036905102" // Replace with actual number
    const whatsappNumber = "+234 9040991849" // Replace with number (no + or spaces)

    return (
        <footer className="glass-card border-t border-white/10 mt-auto">
            <div className="max-w-4xl mx-auto px-4 py-5">
                {/* Contact Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-4">
                    <a
                        href={`https://wa.me/${whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glow-blue flex items-center justify-center gap-2 glass-interactive px-5 py-3 rounded-full hover:bg-[#25D366]/10 transition-all w-full sm:w-auto"
                    >
                        <Image
                            src="/whatsapp-icon.svg"
                            alt="WhatsApp"
                            width={18}
                            height={18}
                        />
                        <span className="text-sm font-medium text-foreground">WhatsApp</span>
                    </a>
                    
                    <a
                        href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                        className="glow-blue flex items-center justify-center gap-2 glass-interactive px-5 py-3 rounded-full hover:bg-primary/10 transition-all w-full sm:w-auto"
                    >
                        <Phone size={18} className="text-primary" />
                        <span className="text-sm font-medium text-foreground">{phoneNumber}</span>
                    </a>
                </div>

                {/* Store Location */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin size={16} />
                    <span>No. 22 Big Plaza, Oluyole, Ibadan</span>
                </div>

                {/* Bottom Info */}
                <div className="border-t border-white/5 pt-1 space-y-1">
                    <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                        <Link href="/about" className="underline hover:text-primary transition-colors">
                            About Us
                        </Link>
                        <span>•</span>
                        <span>© {currentYear} Bikudiratillah</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
