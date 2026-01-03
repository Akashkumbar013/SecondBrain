import { NavLink } from "react-router-dom"
import logo from "../assets/Untitled design.png"

function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-slate-950/30 backdrop-blur-2xl border-r border-slate-800/50 flex flex-col z-50">

      {/* BRAND / LOGO SECTION */}
      <div className="px-6 py-8 flex flex-col items-center text-center">
        <div className="relative group">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl group-hover:bg-indigo-500/30 transition-all duration-500" />
          <img
            src={logo}
            alt="Second Brain"
            className="
              relative
              h-32 w-32
              object-contain
              drop-shadow-2xl
              select-none
              transition-transform duration-300 group-hover:scale-105
            "
          />
        </div>

        <h1 className="mt-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
          Second Brain
        </h1>

        <p className="mt-1 text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">
          Capture • Organize
        </p>
      </div>

      {/* NAV LINKS */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        <NavItem to="/dashboard" icon="🧠" label="Dashboard" />
        <NavItem to="/notes" icon="📄" label="Notes" />
        <NavItem to="/videos" icon="🎥" label="Videos" />
        <NavItem to="/tweets" icon="🐦" label="Tweets" />
        <NavItem to="/links" icon="🔗" label="Links" />
        <NavItem to="/explore" icon="🌍" label="Explore" />
      </nav>

      {/* Footer / User Info could go here */}
      <div className="p-4 text-center text-xs text-slate-600">
        v1.0.0
      </div>
    </div>
  )
}

function NavItem({
  to,
  icon,
  label,
}: {
  to: string
  icon: string
  label: string
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group overflow-hidden
        ${isActive
          ? "bg-indigo-600/10 text-white shadow-[0_0_20px_rgba(79,70,229,0.1)] border border-indigo-500/20"
          : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-full" />
          )}
          <span className={`text-lg transition-transform duration-300 group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>{icon}</span>
          <span className="tracking-wide">{label}</span>
        </>
      )}
    </NavLink>
  )
}

export default Sidebar
