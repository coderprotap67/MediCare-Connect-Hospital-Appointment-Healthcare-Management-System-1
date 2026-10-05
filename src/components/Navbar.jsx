"use client";
import Link from "next/link";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import { Moon, Sun, LogOut, Stethoscope, Menu, X, LayoutDashboard, User } from "lucide-react";
export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter(); 
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const handleLogout = async () => {
    try {
      await logoutUser();
      closeMobileMenu();
      router.push("/"); 
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const defaultPhoto = "https://i.ibb.co/mR3h85y/user-placeholder.png";
  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-2 group">
          <div className="p-2 bg-gradient-to-tr from-sky-500 to-teal-400 text-white rounded-xl shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Stethoscope size={22} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-800">
            MediCare <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-500">Connect</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 font-semibold text-slate-600 text-sm">
          <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
          <Link href="/doctors" className="hover:text-sky-600 transition-colors">Find Doctors</Link>
          {user && (
            <Link href={`/dashboard/${user.role || "patient"}`} className="hover:text-sky-600 transition-colors">
              Dashboard
            </Link>
          )}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
            className="p-2 text-slate-500 hover:text-sky-600 rounded-full hover:bg-slate-100 transition-colors"
            title="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {user ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar ring-2 ring-sky-500/20">
                <div className="w-9 rounded-full">
                  <img src={user.photo || user.photoURL || defaultPhoto} alt="avatar" />
                </div>
              </label>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-xl bg-white border border-slate-100 rounded-2xl w-56 space-y-1">
                <li className="px-3 py-2 font-semibold text-slate-800 border-b border-slate-100">
                  {user.name || user.displayName || "User"}
                </li>
                <li>
                  <Link href={`/dashboard/${user.role || "patient"}`} className="py-2 hover:bg-sky-50 rounded-lg text-slate-700">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="py-2 hover:bg-rose-50 text-rose-600 rounded-lg w-full text-left flex items-center gap-2">
                    <LogOut size={16} /> Logout
                  </button>
                </li>
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
        <div className="flex md:hidden items-center gap-2">
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
            className="p-2 text-slate-500 hover:text-sky-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-xl text-slate-600 hover:text-sky-600 hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
                    <div className="flex flex-col space-y-2 font-medium text-slate-700">
            <Link 
              href="/" 
              onClick={closeMobileMenu} 
              className="px-3 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-600 transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/doctors" 
              onClick={closeMobileMenu} 
              className="px-3 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-600 transition-colors"
            >
              Find Doctors
            </Link>
            {user && (
              <Link 
                href={`/dashboard/${user.role || "patient"}`} 
                onClick={closeMobileMenu} 
                className="px-3 py-2.5 rounded-xl hover:bg-sky-50 hover:text-sky-600 transition-colors flex items-center gap-2"
              >
                <LayoutDashboard size={18} /> Dashboard
              </Link>
            )}
          </div>

          <hr className="border-slate-100" />
          {user ? (
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                <img 
                  src={user.photo || user.photoURL || defaultPhoto} 
                  alt="avatar" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-sky-500/30"
                />
                <div className="overflow-hidden">
                  <p className="font-semibold text-slate-800 text-sm truncate">
                    {user.name || user.displayName || "User"}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">{user.role || "Patient"}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout} 
                className="w-full py-2.5 px-3 flex items-center justify-center gap-2 text-rose-600 bg-rose-50 hover:bg-rose-100 font-semibold rounded-xl transition-colors text-sm"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              <Link 
                href="/login" 
                onClick={closeMobileMenu} 
                className="w-full text-center py-2.5 text-slate-700 bg-slate-100 hover:bg-slate-200 font-semibold rounded-xl text-sm transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                onClick={closeMobileMenu} 
                className="w-full text-center py-2.5 bg-gradient-to-r from-sky-600 to-teal-500 text-white font-semibold rounded-xl text-sm shadow-md shadow-sky-500/20 transition-all"
              >
                Register
              </Link>
            </div>
          )}

        </div>
      )}
    </div>
  );
}