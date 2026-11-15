
"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import {
  CalendarDays,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    try {
      setError("");
      const res = await api.get("/doctor/appointments");
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setError("Failed to load appointment requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      setUpdatingId(id);

      await api.patch(`/appointments/${id}/status`, { status });

      setAppointments((prev) =>
        prev.map((app) =>
          app._id === id
            ? { ...app, appointmentStatus: status }
            : app
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Status update failed!");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "approved" || status === "accepted") {
      return "bg-green-100 text-green-700";
    }

    if (status === "rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="w-full min-w-0 p-3 sm:p-5 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Doctor Appointment Requests
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          View and manage your patient appointment requests.
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Appointments</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {appointments.length}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Pending Requests</p>
          <h2 className="mt-2 text-2xl font-bold text-yellow-600">
            {
              appointments.filter(
                (app) => app.appointmentStatus === "pending"
              ).length
            }
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Approved</p>
          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {
              appointments.filter(
                (app) =>
                  app.appointmentStatus === "approved" ||
                  app.appointmentStatus === "accepted"
              ).length
            }
          </h2>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-48 items-center justify-center rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center gap-3 text-gray-600">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading appointments...</span>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
          <button
            onClick={fetchAppointments}
            className="ml-auto rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && appointments.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center shadow-sm">
          <CalendarDays className="mx-auto mb-3 h-12 w-12 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-800">
            No Appointment Requests
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            You don't have any appointment requests yet.
          </p>
        </div>
      )}

      {/* Appointment Cards - Mobile */}
      {!loading && !error && appointments.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {appointments.map((app) => (
              <div
                key={app._id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-full bg-blue-100 p-2">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-gray-900">
                        {app.patientName || app.patientEmail || "Unknown Patient"}
                      </h3>
                      <p className="truncate text-xs text-gray-500">
                        {app.patientEmail}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                      app.appointmentStatus
                    )}`}
                  >
                    {app.appointmentStatus || "pending"}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <CalendarDays className="h-4 w-4 text-blue-600" />
                  <span>{app.appointmentDate || "Date not available"}</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                  {app.appointmentStatus === "pending" && (
                    <>
                      <button
                        disabled={updatingId === app._id}
                        onClick={() =>
                          handleStatusUpdate(app._id, "approved")
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Accept
                      </button>

                      <button
                        disabled={updatingId === app._id}
                        onClick={() =>
                          handleStatusUpdate(app._id, "rejected")
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </>
                  )}

                  {updatingId === app._id && (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Appointment Table - Desktop */}
          <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                      Patient
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {appointments.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">
                          {app.patientName || app.patientEmail || "Unknown Patient"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {app.patientEmail}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {app.appointmentDate || "Date not available"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                            app.appointmentStatus
                          )}`}
                        >
                          {app.appointmentStatus || "pending"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {app.appointmentStatus === "pending" ? (
                          <div className="flex items-center gap-2">
                            <button
                              disabled={updatingId === app._id}
                              onClick={() =>
                                handleStatusUpdate(app._id, "approved")
                              }
                              className="rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                            >
                              Accept
                            </button>

                            <button
                              disabled={updatingId === app._id}
                              onClick={() =>
                                handleStatusUpdate(app._id, "rejected")
                              }
                              className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">
                            No actions
                          </span>
                        )}

                        {updatingId === app._id && (
                          <Loader2 className="ml-2 inline h-4 w-4 animate-spin text-blue-600" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
