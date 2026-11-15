
"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AdminAnalytics() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
  });

  useEffect(() => {
    api
      .get("/api/admin/analytics")
      .then((res) => setStats(res.data))
      .catch((err) =>
        console.error("Error fetching analytics:", err)
      );
  }, []);

  const chartData = [
    { name: "Doctors", count: stats.totalDoctors },
    { name: "Patients", count: stats.totalPatients },
    { name: "Appointments", count: stats.totalAppointments },
  ];

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue}`,
      color: "border-blue-500",
    },
    {
      title: "Total Doctors",
      value: stats.totalDoctors,
      color: "border-green-500",
    },
    {
      title: "Total Patients",
      value: stats.totalPatients,
      color: "border-purple-500",
    },
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      color: "border-amber-500",
    },
  ];

  return (
    <div className="w-full min-w-0 p-3 sm:p-4 lg:p-6 space-y-5 sm:space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
          Admin Analytics Dashboard
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Overview of your healthcare platform.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">

        {statCards.map((card) => (
          <div
            key={card.title}
            className={`bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-slate-100 border-l-4 ${card.color} min-w-0`}
          >
            <p className="text-slate-500 text-sm font-medium">
              {card.title}
            </p>

            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 break-words">
              {card.value}
            </h3>
          </div>
        ))}

      </div>

      {/* Chart */}
      <div className="bg-white p-3 sm:p-5 lg:p-6 rounded-xl shadow-sm border border-slate-100 min-w-0">

        <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-5">
          Platform Growth Overview
        </h3>

        <div className="w-full h-[280px] sm:h-[340px] lg:h-[380px] min-w-0">

          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: -15,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                interval={0}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11 }}
                width={40}
              />

              <Tooltip />

              <Bar
                dataKey="count"
                fill="#0284c7"
                radius={[6, 6, 0, 0]}
                maxBarSize={65}
              />
            </BarChart>
          </ResponsiveContainer>

        </div>
      </div>

    </div>
  );
}
