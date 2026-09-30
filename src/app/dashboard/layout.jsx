"use client";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
export default function DashboardLayout({ children }) {
  const [role, setRole] = useState("patient");
  useEffect(() => {
    const userRole = localStorage.getItem("role") || "patient";
    setRole(userRole);
  }, []);
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role={role} />
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}