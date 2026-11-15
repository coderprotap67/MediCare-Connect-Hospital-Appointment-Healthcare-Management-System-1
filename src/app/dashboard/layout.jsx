
"use client";

import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex w-full min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 min-w-0 w-full p-3 sm:p-4 lg:p-6 overflow-x-auto">
        {children}
      </main>
    </div>
  );
}
