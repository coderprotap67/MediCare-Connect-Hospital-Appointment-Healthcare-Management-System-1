"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import api from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import CheckoutModal from "@/components/CheckoutModal";
import {
  Calendar,
  Clock,
  AlertCircle,
  CalendarPlus,
  Trash2,
  User,
  LayoutDashboard,
  CheckCircle2,
  Hourglass,
  CreditCard,
} from "lucide-react";
export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("appointments");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const fetchAppointments = useCallback(async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/api/patient/appointments");
      const rawData = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];
      const activeAppointments = rawData.filter(
        (appointment) =>
          (appointment.appointmentStatus || appointment.status || "")
            .toLowerCase() !== "rejected"
      );
      setAppointments(activeAppointments);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(
        err?.response?.data?.message ||
          "Failed to load appointments. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) {
      fetchAppointments();
    }
  }, [user?.email, fetchAppointments]);

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }
    try {
      await api.patch(`/api/appointments/${id}/cancel`);
      setAppointments((prev) =>
        prev.filter((appointment) => appointment._id !== id)
      );
    } catch (err) {
      console.error("Cancel appointment error:", err);
      alert(
        err?.response?.data?.message ||
          "Failed to cancel appointment. Please try again."
      );
    }
  };
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter((appointment) => {
    const status = (
      appointment.appointmentStatus ||
      appointment.status ||
      "pending"
    ).toLowerCase();
    return status === "pending";
  }).length;
  const completedAppointments = appointments.filter((appointment) => {
    const status = (
      appointment.appointmentStatus ||
      appointment.status ||
      ""
    ).toLowerCase();
    return (
      status === "accepted" ||
      status === "completed" ||
      status === "approved"
    );
  }).length;
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600"></div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Patient Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your booked appointments and profile details
          </p>
        </div>
        <Link
          href="/doctors"
          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold shadow-md transition flex items-center gap-2 text-sm"
        >
          <CalendarPlus size={18} />
          Book New Appointment
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm h-fit space-y-2">
          <button
            onClick={() => setActiveTab("appointments")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
              activeTab === "appointments"
                ? "bg-sky-50 text-sky-600 font-semibold"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <LayoutDashboard size={18} />
            My Appointments
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
              activeTab === "profile"
                ? "bg-sky-50 text-sky-600 font-semibold"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <User size={18} />
            My Profile
          </button>
        </div>
        <div className="lg:col-span-3 space-y-6">
          {activeTab === "appointments" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
                    <Calendar size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase">
                      Total Bookings
                    </p>
                    <p className="text-2xl font-bold text-slate-800">
                      {totalAppointments}
                    </p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <Hourglass size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase">
                      Pending
                    </p>
                    <p className="text-2xl font-bold text-slate-800">
                      {pendingAppointments}
                    </p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase">
                      Approved
                    </p>
                    <p className="text-2xl font-bold text-slate-800">
                      {completedAppointments}
                    </p>
                  </div>
                </div>
              </div>
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}
              {appointments.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
                  <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    No Appointments Scheduled
                  </h3>
                  <p className="text-slate-500 text-sm mb-6">
                    You have not booked any doctor appointments yet.
                  </p>
                  <Link
                    href="/doctors"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition shadow-md"
                  >
                    Find Doctors
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase font-semibold">
                          <th className="py-4 px-6">Doctor</th>
                          <th className="py-4 px-6">Specialization</th>
                          <th className="py-4 px-6">Date & Time</th>
                          <th className="py-4 px-6">Fee</th>
                          <th className="py-4 px-6">Payment</th>
                          <th className="py-4 px-6">Status</th>
                          <th className="py-4 px-6 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {appointments.map((appointment) => {
                          const currentStatus =
                            appointment.appointmentStatus ||
                            appointment.status ||
                            "pending";
                          const isPaid =
                            appointment.paymentStatus === "paid" ||
                            appointment.isPaid;
                          return (
                            <tr
                              key={appointment._id}
                              className="hover:bg-slate-50/50 transition"
                            >
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={
                                      appointment.doctorImage ||
                                      appointment.doctor?.profileImage ||
                                      appointment.doctorId?.image ||
                                      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500"
                                    }
                                    onError={(e) => {
                                      e.target.src = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500";
                                    }}
                                    alt={
                                      appointment.doctorName ||
                                      appointment.doctor?.doctorName ||
                                      "Doctor"
                                    }
                                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                                  />
                                  <div>
                                    <div className="font-bold text-slate-900">
                                      {appointment.doctorName ||
                                        appointment.doctor?.doctorName ||
                                        appointment.doctorId?.name ||
                                        "Doctor"}
                                    </div>
                                    <div className="text-xs text-slate-400">
                                      {appointment.hospitalName ||
                                        appointment.doctor?.hospitalName ||
                                        "Hospital"}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6 font-medium text-slate-700">
                                {appointment.specialization ||
                                  appointment.doctor?.specialization ||
                                  "General"}
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                                  <Calendar
                                    size={14}
                                    className="text-sky-500"
                                  />
                                  {appointment.appointmentDate ||
                                    appointment.date ||
                                    "N/A"}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                                  <Clock size={12} />
                                  {appointment.appointmentTime ||
                                    appointment.time ||
                                    "10:00 AM"}
                                </div>
                              </td>
                              <td className="py-4 px-6 font-bold text-teal-600">
                                $
                                {appointment.consultationFee ||
                                  appointment.doctor?.consultationFee ||
                                  appointment.fee ||
                                  50}
                              </td>
                              <td className="py-4 px-6">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                    isPaid
                                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                      : "bg-rose-50 text-rose-600 border border-rose-200"
                                  }`}
                                >
                                  {isPaid ? "paid" : "unpaid"}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                    currentStatus === "accepted" ||
                                    currentStatus === "completed" ||
                                    currentStatus === "approved"
                                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                      : "bg-amber-50 text-amber-600 border border-amber-200"
                                  }`}
                                >
                                  {currentStatus}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {!isPaid &&
                                    currentStatus !== "cancelled" && (
                                      <button
                                        onClick={() =>
                                          setSelectedAppointment(appointment)
                                        }
                                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition shadow-sm flex items-center gap-1"
                                      >
                                        <CreditCard size={14} />
                                        Pay Now
                                      </button>
                                    )}
                                  {currentStatus === "pending" && (
                                    <button
                                      onClick={() =>
                                        handleCancel(appointment._id)
                                      }
                                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                      title="Cancel Appointment"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
          {activeTab === "profile" && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">
                Patient Profile Information
              </h3>
              <div className="flex items-center gap-5">
                <img
                  src={
                    user?.photoURL ||
                    user?.photo ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500"
                  }
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500";
                  }}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-sky-500"
                />
                <div>
                  <h4 className="text-lg font-bold text-slate-900">
                    {user?.displayName || user?.name || "Patient User"}
                  </h4>
                  <p className="text-sm text-slate-500">
                    {user?.email || "N/A"}
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 bg-sky-50 text-sky-600 text-xs font-semibold rounded-full capitalize">
                    Role: {user?.role || "Patient"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {selectedAppointment && (
        <CheckoutModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onSuccess={() => {
            setSelectedAppointment(null);
            fetchAppointments();
          }}
        />
      )}
    </div>
  );
}