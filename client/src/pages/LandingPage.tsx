import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import logo from "../assets/Untitled design.png" // Assuming logo exists here
import LightPillar from "../components/LightPillar"

function LandingPage() {
    return (
        <div className="relative min-h-screen bg-black text-white overflow-hidden font-sans selection:bg-indigo-500/30">

            {/* 🌑 BACKGROUND EFFECTS */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a1f35] via-[#020617] to-black opacity-80" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
            </div>

            {/* 🌌 LIGHT PILLAR (Reusing component for consistency) */}
            <div className="fixed inset-0 z-[1] pointer-events-none opacity-50">
                <LightPillar
                    topColor="#6366f1"
                    bottomColor="#000000"
                    intensity={1}
                    rotationSpeed={0.1}
                    glowAmount={0.005}
                    pillarWidth={4}
                    pillarHeight={0.6}
                />
            </div>

            {/* 🟢 NAVBAR */}
            <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
                    <span className="font-bold text-xl tracking-tight hidden sm:block">Second Brain</span>
                </div>
                <div className="flex items-center gap-6 text-sm font-medium">
                    <Link to="/login" className="text-slate-400 hover:text-white transition-colors">Log In</Link>
                    <Link
                        to="/register"
                        className="bg-white text-black px-5 py-2 rounded-full hover:bg-slate-200 transition-all font-semibold"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* 🚀 HERO SECTION */}
            <main className="relative z-10 flex flex-col items-center justify-center pt-24 pb-20 px-6 text-center max-w-5xl mx-auto">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/50 backdrop-blur-md text-xs font-medium text-slate-300"
                >
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>v1.0 Public Release</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white mb-8"
                >
                    Your Digital <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-600">
                        Extension.
                    </span>
                </motion.h1>

                {/* Subheadline (Copy explaining utility) */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-lg sm:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed"
                >
                    The ultimate workspace to
                    <span className="text-white font-medium"> Capture</span>,
                    <span className="text-white font-medium"> Organize</span>, and
                    <span className="text-white font-medium"> Retrieve</span> your digital life.
                    Store notes, tweets, videos, and links in one intelligent, unified space.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center gap-4"
                >
                    <Link
                        to="/register"
                        className="h-12 px-8 rounded-full bg-white text-black font-semibold text-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                    >
                        Build Your Brain
                    </Link>
                    <Link
                        to="/explore"
                        className="h-12 px-8 rounded-full border border-slate-700 hover:bg-slate-900 text-white font-medium text-lg transition-all flex items-center justify-center hover:border-slate-500"
                    >
                        Explore Brains
                    </Link>
                </motion.div>

                {/* Visual / Grid Decoration */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mt-24 w-full aspect-[16/9] bg-gradient-to-b from-slate-900 via-black to-black rounded-xl border border-slate-800 shadow-2xl relative overflow-hidden group"
                >
                    {/* Fake UI Preview */}
                    <div className="absolute inset-0 bg-slate-950 flex flex-row overflow-hidden select-none cursor-default pointer-events-none">

                        {/* Mock Sidebar */}
                        <div className="w-16 md:w-64 border-r border-slate-800/50 bg-slate-900/30 flex flex-col p-4 gap-6">
                            <div className="flex items-center gap-3 opacity-50">
                                <div className="w-8 h-8 rounded-full bg-indigo-500/20" />
                                <div className="h-4 w-24 bg-slate-800 rounded hidden md:block" />
                            </div>
                            <div className="flex flex-col gap-3">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5">
                                        <div className="w-5 h-5 rounded bg-slate-700/50" />
                                        <div className="h-3 w-32 bg-slate-700/30 rounded hidden md:block" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mock Content */}
                        <div className="flex-1 p-6 md:p-8 flex flex-col gap-8">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div className="h-8 w-48 bg-slate-800/50 rounded-lg" />
                                <div className="h-10 w-32 bg-indigo-600/20 rounded-full border border-indigo-500/20" />
                            </div>

                            {/* Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-70">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="aspect-[4/3] rounded-xl bg-slate-900/50 border border-slate-800/50 p-4 flex flex-col gap-3 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                                        <div className="w-full h-32 rounded-lg bg-slate-800/30" />
                                        <div className="h-4 w-3/4 bg-slate-800/50 rounded" />
                                        <div className="h-3 w-1/2 bg-slate-800/30 rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Overlay Gradient for depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    </div>

                    {/* Bottom Fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
                </motion.div>

            </main>

            {/* Footer */}
            <footer className="relative z-10 py-10 border-t border-slate-900 text-center text-slate-600 text-sm">
                <p>© 2026 Second Brain Inc. Crafted for thinkers.</p>
            </footer>

        </div>
    )
}

export default LandingPage
