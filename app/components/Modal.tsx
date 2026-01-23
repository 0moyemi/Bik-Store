"use client"
import { X } from 'lucide-react'

interface ModalProps {
    title: string
    message: string
    onClose: () => void
}

const Modal = ({ title, message, onClose }: ModalProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
            <div className="glass-strong rounded-lg p-6 max-w-sm mx-4 relative border border-white/10">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X size={20} />
                </button>
                <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground">{message}</p>
                <button
                    onClick={onClose}
                    className="glow-blue-active w-full mt-4 bg-accent text-accent-foreground px-4 py-2 rounded-full hover:opacity-90 transition-all"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    )
}

export default Modal