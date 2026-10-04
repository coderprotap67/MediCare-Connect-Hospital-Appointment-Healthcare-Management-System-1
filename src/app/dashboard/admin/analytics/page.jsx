"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function AdminAnalytics() {
  const [stats, setStats] = useState({ totalRevenue: 0, totalDoctors: 0, totalPatients: 0, totalAppointments: 0 });

  useEffect(() => {
    api.get("/api/admin/analytics")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error fetching analytics:", err));
  }, []);

  const chartData = [
    { name: "Doctors", count: stats.totalDoctors },
    { name: "Patients", count: stats.totalPatients },
    { name: "Appointments", count: stats.totalAppointments },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-blue-500">
          <p className="text-slate-500 text-sm">Total Revenue</p>
          <h3 className="text-2xl font-bold">${stats.totalRevenue}</h3>
        </div>
        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-green-500">
          <p className="text-slate-500 text-sm">Total Doctors</p>
          <h3 className="text-2xl font-bold">{stats.totalDoctors}</h3>
        </div>
        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-purple-500">
          <p className="text-slate-500 text-sm">Total Patients</p>
          <h3 className="text-2xl font-bold">{stats.totalPatients}</h3>
        </div>
        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-amber-500">
          <p className="text-slate-500 text-sm">Total Appointments</p>
          <h3 className="text-2xl font-bold">{stats.totalAppointments}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow h-80">
        <h3 className="text-lg font-bold mb-4">Platform Growth Overview</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#0284c7" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}