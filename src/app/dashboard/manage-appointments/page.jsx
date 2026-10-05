"use client";
import { useState, useEffect } from "react";
import api from "@/utils/api";
import { Calendar, Clock, UserCheck, Mail, AlertCircle, Loader2, XCircle } from "lucide-react";
export default function ManageAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  useEffect(() => {
    fetchAppointments();
  }, []);
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/patient/appointments");
      setAppointments(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch appointments.");
    } finally {
      setLoading(false);
    }
  };
  const handleCancelAppointment = async (id) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      setActionLoading(id);
      const res = await api.patch(`/api/appointments/${id}/cancel`);
      if (res.status === 200 || res.data) {
        setAppointments((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, appointmentStatus: "rejected" } : item
          )
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel appointment.");
    } finally {
      setActionLoading(null);
    }
  };
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">My Appointments</h1>
        <p className="text-slate-500 text-sm mt-1">
          View and track all your booked doctor appointments.
        </p>
      </div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={32} className="animate-spin text-sky-600" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center text-slate-500 shadow-sm">
          No appointments found.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Doctor</th>
                  <th className="py-4 px-6">Date & Time</th>
                  <th className="py-4 px-6">Payment</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {appointments.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-sky-50 text-sky-600 rounded-full">
                          <UserCheck size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{item.doctorName || "Doctor"}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Mail size={12} /> {item.doctorEmail || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-slate-700">
                          <Calendar size={14} className="text-slate-400" /> {item.appointmentDate || item.date || "N/A"}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock size={12} /> {item.appointmentTime || item.slot || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                          item.paymentStatus === "paid"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {item.paymentStatus || "unpaid"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                          item.appointmentStatus === "accepted"
                            ? "bg-sky-50 text-sky-600"
                            : item.appointmentStatus === "completed"
                            ? "bg-emerald-50 text-emerald-600"
                            : item.appointmentStatus === "rejected" || item.appointmentStatus === "cancelled"
                            ? "bg-red-50 text-red-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {item.appointmentStatus || "pending"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {actionLoading === item._id ? (
                        <Loader2 size={18} className="animate-spin text-sky-600 inline-block" />
                      ) : (
                        item.appointmentStatus === "pending" && (
                          <button
                            onClick={() => handleCancelAppointment(item._id)}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs rounded-lg transition flex items-center gap-1 ml-auto"
                          >
                            <XCircle size={14} /> Cancel
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
  );
}