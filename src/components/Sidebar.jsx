// src/components/Sidebar.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { FaCalendarAlt, FaStar, FaUserMd, FaUsers, FaChartBar, FaClock, FaPrescription, FaUser } from "react-icons/fa";

export default function Sidebar({ role: propRole }) {
  const pathname = usePathname();
  const { user } = useContext(AuthContext);

  // প্রপস থেকে রোল পেলে সেটা নিবে, তা না হলে Context এর user.role নিবে
  const currentRole = propRole || user?.role || "patient";

  const navLinks = {
    patient: [
      { name: "My Appointments", href: "/dashboard/patient", icon: FaCalendarAlt },
      { name: "My Reviews", href: "/dashboard/my-reviews", icon: FaStar },
      { name: "Profile", href: "/dashboard/profile", icon: FaUser },
    ],
    doctor: [
      { name: "Appointment Requests", href: "/dashboard/doctor", icon: FaCalendarAlt },
      { name: "Schedule Manage", href: "/dashboard/doctor/schedule", icon: FaClock },
      { name: "Prescriptions", href: "/dashboard/doctor/prescriptions", icon: FaPrescription },
      { name: "Profile", href: "/dashboard/profile", icon: FaUser },
    ],
    admin: [
      { name: "Manage Users", href: "/dashboard/admin/users", icon: FaUsers },
      { name: "Verify Doctors", href: "/dashboard/admin/doctors", icon: FaUserMd },
      { name: "Analytics", href: "/dashboard/admin/analytics", icon: FaChartBar },
      { name: "Profile", href: "/dashboard/profile", icon: FaUser },
    ],
  };

  const links = navLinks[currentRole] || navLinks.patient;

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-5 flex flex-col">
      <h2 className="text-2xl font-bold mb-8 text-cyan-400">MediCare Dashboard</h2>
      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive ? "bg-cyan-600 text-white" : "hover:bg-slate-800 text-slate-300"
              }`}
            >
              <Icon /> {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}