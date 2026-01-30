import { Link } from "react-router-dom"
import logo from "../assets/Untitled design.png"

function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            {/* NAVBAR */}
            <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
                    <span className="font-bold text-xl tracking-tight hidden sm:block">Second Brain</span>
                </div>
                <div className="flex items-center gap-6 text-sm font-medium">
                    <Link to="/login" className="text-gray-400 hover:text-white transition-colors">Log In</Link>
                    <Link
                        to="/register"
                        className="bg-white text-black px-5 py-2 rounded-full hover:bg-gray-200 transition-all font-semibold"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* HERO SECTION */}
            <main className="flex flex-col items-center justify-center pt-24 pb-20 px-6 text-center max-w-5xl mx-auto">
                {/* Badge */}
                <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-700 bg-gray-800 text-xs font-medium text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span>v1.0 Public Release</span>
                </div>

                {/* Headline */}
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white mb-8">
                    Your Digital <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600">
                        Second Brain
                    </span>
                </h1>

                {/* Subheadline */}
                <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
                    The ultimate workspace to
                    <span className="text-white font-medium"> Capture</span>,
                    <span className="text-white font-medium"> Organize</span>, and
                    <span className="text-white font-medium"> Retrieve</span> your digital life.
                    Store notes, tweets, videos, and links in one intelligent, unified space.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Link
                        to="/register"
                        className="h-12 px-8 rounded-full bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-all flex items-center justify-center"
                    >
                        Build Your Brain
                    </Link>
                    <Link
                        to="/explore"
                        className="h-12 px-8 rounded-full border border-gray-700 hover:bg-gray-800 text-white font-medium text-lg transition-all flex items-center justify-center"
                    >
                        Explore Brains
                    </Link>
                </div>

                {/* Visual Preview */}
                <div className="mt-24 w-full aspect-[16/9] bg-gradient-to-b from-gray-800 to-black rounded-xl border border-gray-700 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gray-900 flex flex-row overflow-hidden">
                        {/* Mock Sidebar */}
                        <div className="w-16 md:w-64 border-r border-gray-700 bg-gray-800 flex flex-col p-4 gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-900" />
                                <div className="h-4 w-24 bg-gray-700 rounded hidden md:block" />
                            </div>
                            <div className="flex flex-col gap-3">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-gray-700 border border-gray-600">
                                        <div className="w-5 h-5 rounded bg-gray-600" />
                                        <div className="h-3 w-32 bg-gray-600 rounded hidden md:block" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mock Content */}
                        <div className="flex-1 p-6 md:p-8 flex flex-col gap-8">
                            <div className="flex items-center justify-between">
                                <div className="h-8 w-48 bg-gray-700 rounded-lg" />
                                <div className="h-10 w-32 bg-indigo-900 rounded-full border border-indigo-800" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="aspect-[4/3] rounded-xl bg-gray-800 border border-gray-700 p-4 flex flex-col gap-3">
                                        <div className="w-full h-32 rounded-lg bg-gray-700" />
                                        <div className="h-4 w-3/4 bg-gray-700 rounded" />
                                        <div className="h-3 w-1/2 bg-gray-700 rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-10 border-t border-gray-800 text-center text-gray-600 text-sm">
                <p>© 2026 Second Brain Inc. Crafted for thinkers.</p>
            </footer>
        </div>
    )
}

export default LandingPage
