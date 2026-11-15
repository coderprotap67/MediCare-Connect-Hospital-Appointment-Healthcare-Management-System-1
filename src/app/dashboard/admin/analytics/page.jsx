
"use client";

import { useEffect, useState, useCallback } from "react";
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

import {
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function AdminAnalytics() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // IMPORTANT: baseURL already contains /api
      const res = await api.get("/admin/analytics");

      const data = res.data?.stats || res.data;

      setStats({
        totalRevenue: Number(data?.totalRevenue) || 0,
        totalDoctors: Number(data?.totalDoctors) || 0,
        totalPatients: Number(data?.totalPatients) || 0,
        totalAppointments: Number(data?.totalAppointments) || 0,
      });
    } catch (err) {
      console.error(
        "Error fetching analytics:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to load analytics. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const chartData = [
    { name: "Doctors", count: stats.totalDoctors },
    { name: "Patients", count: stats.totalPatients },
    { name: "Appointments", count: stats.totalAppointments },
  ];

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      color: "border-blue-500",
    },
    {
      title: "Total Doctors",
      value: stats.totalDoctors.toLocaleString(),
      color: "border-green-500",
    },
    {
      title: "Total Patients",
      value: stats.totalPatients.toLocaleString(),
      color: "border-purple-500",
    },
    {
      title: "Total Appointments",
      value: stats.totalAppointments.toLocaleString(),
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

      {/* Loading */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2
            className="animate-spin text-sky-600"
            size={40}
          />

          <p className="text-sm text-slate-500">
            Loading analytics...
          </p>
        </div>
      ) : error ? (

        /* Error */
        <div className="bg-white rounded-xl border border-red-100 p-8 text-center">

          <AlertCircle
            size={40}
            className="text-red-500 mx-auto mb-3"
          />

          <h3 className="font-bold text-slate-800 mb-2">
            Unable to Load Analytics
          </h3>

          <p className="text-sm text-slate-500 mb-5">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchAnalytics}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold"
          >
            <RefreshCw size={16} />
            Try Again
          </button>

        </div>
      ) : (

        <>

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

          {/* Refresh Button */}
          <div className="flex justify-end">

            <button
              type="button"
              onClick={fetchAnalytics}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold"
            >
              <RefreshCw size={16} />
              Refresh Analytics
            </button>

          </div>

        </>

      )}

    </div>
  );
}
