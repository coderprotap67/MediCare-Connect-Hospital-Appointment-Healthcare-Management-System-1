"use client";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import { Moon, Sun, LogOut, Stethoscope } from "lucide-react";

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const { theme, setTheme } = useTheme();

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-gradient-to-tr from-sky-500 to-teal-400 text-white rounded-xl shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Stethoscope size={22} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-800">
            MediCare <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-500">Connect</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-semibold text-slate-600 text-sm">
          <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
          <Link href="/doctors" className="hover:text-sky-600 transition-colors">Find Doctors</Link>
          {user && (
            <Link href={`/dashboard/${user.role}`} className="hover:text-sky-600 transition-colors">
              Dashboard
            </Link>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
            className="p-2 text-slate-500 hover:text-sky-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar ring-2 ring-sky-500/20">
                <div className="w-9 rounded-full">
                  <img src={user.photo || "https://i.ibb.co/mR3h85y/user-placeholder.png"} alt="avatar" />
                </div>
              </label>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-xl bg-white border border-slate-100 rounded-2xl w-56 space-y-1">
                <li className="px-3 py-2 font-semibold text-slate-800 border-b border-slate-100">{user.name}</li>
                <li><Link href={`/dashboard/${user.role}`} className="py-2 hover:bg-sky-50 rounded-lg text-slate-700">Dashboard</Link></li>
                <li><button onClick={logoutUser} className="py-2 hover:bg-rose-50 text-rose-600 rounded-lg"><LogOut size={16} /> Logout</button></li>
              </ul>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="px-4 py-2 text-slate-700 hover:text-sky-600 font-semibold text-sm transition-colors">
                Login
              </Link>
              <Link href="/register" className="px-5 py-2.5 bg-gradient-to-r from-sky-600 to-teal-500 hover:from-sky-700 hover:to-teal-600 text-white font-semibold text-sm rounded-full shadow-md shadow-sky-500/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                Register
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}