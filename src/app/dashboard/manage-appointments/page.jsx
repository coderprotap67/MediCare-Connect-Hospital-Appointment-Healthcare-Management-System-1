
"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/utils/api";

import {
  Calendar,
  Clock,
  UserCheck,
  Mail,
  AlertCircle,
  Loader2,
  XCircle,
  RefreshCw,
} from "lucide-react";

export default function ManageAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch Patient Appointments
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Fixed API URL: baseURL already contains /api
      const res = await api.get("/patient/appointments");

      const data = res.data;

      setAppointments(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.appointments)
          ? data.appointments
          : Array.isArray(data?.data)
          ? data.data
          : []
      );
    } catch (err) {
      console.error(
        "Fetch Appointments Error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to fetch appointments."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Cancel Appointment
  const handleCancelAppointment = async (id) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      setActionLoading(id);

      // Fixed API URL
      const res = await api.patch(`/appointments/${id}/cancel`);

      if (res.status === 200) {
        setAppointments((prev) =>
          prev.map((item) =>
            item._id === id
              ? {
                  ...item,
                  appointmentStatus:
                    res.data?.appointmentStatus || "cancelled",
                }
              : item
          )
        );
      }
    } catch (err) {
      console.error(
        "Cancel Appointment Error:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message ||
          "Failed to cancel appointment."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Status Badge
  const getStatusClass = (status) => {
    if (status === "accepted") {
      return "bg-sky-50 text-sky-600";
    }

    if (status === "completed") {
      return "bg-emerald-50 text-emerald-600";
    }

    if (status === "rejected" || status === "cancelled") {
      return "bg-red-50 text-red-600";
    }

    return "bg-amber-50 text-amber-600";
  };

  const getPaymentClass = (status) => {
    return status === "paid"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-amber-50 text-amber-600";
  };

  return (
    <div className="min-h-screen w-full min-w-0 bg-slate-50 text-slate-900 px-3 py-6 sm:px-5 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex flex-wrap justify-between items-start gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              My Appointments
            </h1>

            <p className="text-slate-500 text-sm mt-2">
              View and track all your booked doctor appointments.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchAppointments}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-sm font-medium disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>

            <button
              type="button"
              onClick={fetchAppointments}
              className="text-sm font-semibold underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2
              size={32}
              className="animate-spin text-sky-600"
            />
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center text-slate-500 shadow-sm">
            No appointments found.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {appointments.map((item) => (
                <div
                  key={item._id}
                  className="p-4 sm:p-5 space-y-4"
                >

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-sky-50 text-sky-600 rounded-full shrink-0">
                      <UserCheck size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800 break-words">
                        {item.doctorName || "Doctor"}
                      </p>

                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 break-all">
                        <Mail size={12} className="shrink-0" />
                        {item.doctorEmail || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">

                    <div className="flex items-center gap-2 text-slate-700">
                      <Calendar size={15} className="text-slate-400 shrink-0" />

                      <span>
                        {item.appointmentDate || item.date || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock size={15} className="text-slate-400 shrink-0" />

                      <span>
                        {item.appointmentTime || item.slot || "N/A"}
                      </span>
                    </div>

                  </div>

                  <div className="flex flex-wrap items-center gap-2">

                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getPaymentClass(
                        item.paymentStatus
                      )}`}
                    >
                      {item.paymentStatus || "unpaid"}
                    </span>

                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${getStatusClass(
                        item.appointmentStatus
                      )}`}
                    >
                      {item.appointmentStatus || "pending"}
                    </span>

                  </div>

                  {item.appointmentStatus === "pending" && (
                    <button
                      type="button"
                      onClick={() => handleCancelAppointment(item._id)}
                      disabled={actionLoading === item._id}
                      className="w-full sm:w-auto px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading === item._id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <XCircle size={16} />
                      )}

                      Cancel Appointment
                    </button>
                  )}

                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[750px] text-left border-collapse">

                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-4 px-5 lg:px-6">Doctor</th>
                    <th className="py-4 px-5 lg:px-6">Date & Time</th>
                    <th className="py-4 px-5 lg:px-6">Payment</th>
                    <th className="py-4 px-5 lg:px-6">Status</th>
                    <th className="py-4 px-5 lg:px-6 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">

                  {appointments.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50 transition"
                    >

                      <td className="py-4 px-5 lg:px-6">
                        <div className="flex items-center gap-3">

                          <div className="p-2 bg-sky-50 text-sky-600 rounded-full">
                            <UserCheck size={18} />
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {item.doctorName || "Doctor"}
                            </p>

                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                              <Mail size={12} />
                              {item.doctorEmail || "N/A"}
                            </p>
                          </div>

                        </div>
                      </td>

                      <td className="py-4 px-5 lg:px-6">
                        <div className="flex flex-col gap-1">

                          <span className="flex items-center gap-1.5 text-slate-700">
                            <Calendar size={14} className="text-slate-400" />
                            {item.appointmentDate || item.date || "N/A"}
                          </span>

                          <span className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Clock size={12} />
                            {item.appointmentTime || item.slot || "N/A"}
                          </span>

                        </div>
                      </td>

                      <td className="py-4 px-5 lg:px-6">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getPaymentClass(
                            item.paymentStatus
                          )}`}
                        >
                          {item.paymentStatus || "unpaid"}
                        </span>
                      </td>

                      <td className="py-4 px-5 lg:px-6">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full capitalize ${getStatusClass(
                            item.appointmentStatus
                          )}`}
                        >
                          {item.appointmentStatus || "pending"}
                        </span>
                      </td>

                      <td className="py-4 px-5 lg:px-6 text-right">
                        {actionLoading === item._id ? (
                          <Loader2
                            size={18}
                            className="animate-spin text-sky-600 inline-block"
                          />
                        ) : (
                          item.appointmentStatus === "pending" && (
                            <button
                              type="button"
                              onClick={() => handleCancelAppointment(item._id)}
                              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs rounded-lg transition inline-flex items-center gap-1"
                            >
                              <XCircle size={14} />
                              Cancel
                            </button>
                          )
                        )}
                      </td>

                    </tr>
                  ))}

                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
