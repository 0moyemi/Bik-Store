/**
 * Toast Notification Component
 * 
 * UX Purpose: Provides clear, explicit feedback to non-technical users
 * when they perform actions. Uses simple language and clear instructions.
 */

"use client"
import { useEffect } from 'react'
import { CheckCircle, X } from 'lucide-react'

interface ToastProps {
    message: string
    onClose: () => void
    type?: 'success' | 'error' | 'info'
    duration?: number
}

const Toast = ({ message, onClose, type = 'success', duration = 5000 }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose()
        }, duration)

        return () => clearTimeout(timer)
    }, [duration, onClose])

    return (
        <div className="fixed top-20 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none animate-in slide-in-from-top duration-300">
            <div className="pointer-events-auto max-w-md w-full glass-strong border border-white/20 rounded-lg shadow-2xl overflow-hidden">
                <div className={`flex items-start gap-3 p-4 ${type === 'success' ? 'bg-green-500/10' :
                        type === 'error' ? 'bg-red-500/10' :
                            'bg-blue-500/10'
                    }`}>
                    {type === 'success' && (
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    )}

                    <div className="flex-1 min-w-0">
                        <p className="text-foreground font-medium text-sm leading-relaxed">
                            {message}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1 -m-1"
                        aria-label="Close notification"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Toast
