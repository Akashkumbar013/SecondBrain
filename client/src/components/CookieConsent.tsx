import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Cookies from "js-cookie"

function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false)

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem("cookieConsent")
        if (!consent) {
            setShowBanner(true)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem("cookieConsent", "accepted")
        setShowBanner(false)
    }

    const handleDecline = () => {
        localStorage.setItem("cookieConsent", "declined")
        setShowBanner(false)
        // Note: Declining cookies means user can't login/use authenticated features
    }

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700 shadow-2xl"
                >
                    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-white">
                            <span className="text-2xl">🍪</span>
                            <div>
                                <p className="font-semibold">We use cookies</p>
                                <p className="text-sm text-slate-300">
                                    We use cookies to keep you logged in and provide a better experience.
                                    By accepting, you agree to our use of authentication cookies.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 shrink-0">
                            <button
                                onClick={handleDecline}
                                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors"
                            >
                                Decline
                            </button>
                            <button
                                onClick={handleAccept}
                                className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/30"
                            >
                                Accept
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default CookieConsent
