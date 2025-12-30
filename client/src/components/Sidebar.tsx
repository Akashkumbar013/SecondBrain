import { NavLink } from "react-router-dom"
import logo from "../assets/Untitled design.png"

function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col">

      {/* BRAND / LOGO SECTION */}
      <div className="px-6 py-10 flex flex-col items-center text-center">
        <img
          src={logo}
          alt="Second Brain"
          className="
            h-36 w-36
            object-contain
            bg-transparent
            select-none
          "
        />

        <h1 className="mt-4 text-2xl font-extrabold text-white tracking-tight">
          Second Brain
        </h1>

        <p className="mt-1 text-xs text-slate-400 uppercase tracking-widest">
          Capture • Organize • Connect
        </p>
      </div>

      {/* NAV LINKS */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavItem to="/notes" icon="📄" label="Notes" />
        <NavItem to="/videos" icon="🎥" label="Videos" />
        <NavItem to="/tweets" icon="🐦" label="Tweets" />
        <NavItem to="/links" icon="🔗" label="Links" />
        <NavItem to="/explore" icon="🌍" label="Explore" />
      </nav>

      {/* CREATE BRAIN BUTTON */}
      {/* <div className="p-4">
        <button className="
          w-full bg-indigo-600 hover:bg-indigo-700
          text-white py-2 rounded-xl font-semibold
          transition
        ">
          
        </button>
      </div> */}
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
        `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
        ${
          isActive
            ? "bg-slate-800 text-white"
            : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }`
      }
    >
      <span className="text-lg">{icon}</span>
      {label}
    </NavLink>
  )
}

export default Sidebar
