"use client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"

const Carousel = () => {
    // Array of slide objects with image/video paths
    const slides = [
        { id: 0, type: "video", src: "/carousel-vid.mp4", alt: "Promotional Video" },
        { id: 3, type: "image", src: "/track-store.png", alt: "Slide 2" },
        { id: 2, type: "image", src: "/48h-delivery.png", alt: "Slide 3" },
        { id: 4, type: "image", src: "/livechatonWA.png", alt: "Slide 4" },
        { id: 5, type: "image", src: "/track-store.png", alt: "Slide 5" },
    ]
    const [current, setCurrent] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true)
            setTimeout(() => {
                setCurrent((prev) => (prev + 1) % slides.length)
                setIsTransitioning(false)
            }, 300)
        }, 5000) // Auto-play every 5 seconds
        return () => clearInterval(interval)
    }, [slides.length])

    const next = () => {
        setIsTransitioning(true)
        setTimeout(() => {
            setCurrent((prev) => (prev + 1) % slides.length)
            setIsTransitioning(false)
        }, 300)
    }

    const prev = () => {
        setIsTransitioning(true)
        setTimeout(() => {
            setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
            setIsTransitioning(false)
        }, 300)
    }
    return (
        <div className="px-4 py-3 bg-background/50">
            <div className="relative w-full max-w-4xl mx-auto">
                <div className="glow-blue relative w-full h-48 md:h-64 lg:h-80 glass-card rounded-lg overflow-hidden border border-white/10">
                    <div className={`w-full h-full transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                        {slides[current] && (
                            slides[current].type === "video" ? (
                                <video
                                    key={slides[current].id}
                                    src={slides[current].src}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                    onEnded={(e) => {
                                        // Backup to ensure video loops if loop attribute fails
                                        (e.target as HTMLVideoElement).play()
                                    }}
                                />
                            ) : (
                                <Image
                                    key={slides[current].id}
                                    src={slides[current].src}
                                    alt={slides[current].alt}
                                    fill
                                    className="object-cover"
                                    priority={current === 1}
                                />
                            )
                        )}
                    </div>
                </div>

                <button
                    onClick={prev}
                    className="glow-blue absolute left-2 md:left-0 md:-translate-x-12 top-1/2 -translate-y-1/2 glass-interactive rounded-full p-2 text-foreground hover:scale-105 transition-all"
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={24} />
                </button>

                <button
                    onClick={next}
                    className="glow-blue absolute right-2 md:right-0 md:translate-x-12 top-1/2 -translate-y-1/2 glass-interactive rounded-full p-2 text-foreground hover:scale-105 transition-all"
                    aria-label="Next slide"
                >
                    <ChevronRight size={24} />
                </button>

                {/* <div className="flex justify-center gap-2 mt-4">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${index === current ? "bg-primary" : "bg-border"}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div> */}
            </div>
        </div>
    )
}

export default Carousel