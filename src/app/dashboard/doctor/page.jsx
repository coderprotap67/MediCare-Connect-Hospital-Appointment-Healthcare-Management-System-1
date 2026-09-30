"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";
export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchAppointments = async () => {
    try {
      const res = await api.get("/doctor/appointments");
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status });
      setAppointments((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, appointmentStatus: status } : app
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Status update failed!");
    }
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Doctor Appointment Requests</h1>
      {loading ? (
        <p>Loading appointments...</p>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No appointment requests found.
                  </td>
                </tr>
              ) : (
                appointments.map((app) => (
                  <tr key={app._id}>
                    <td>{app.patientName || app.patientEmail}</td>
                    <td>{app.appointmentDate}</td>
                    <td>
                      <span
                        className={`badge ${
                          app.appointmentStatus === "approved" || app.appointmentStatus === "accepted"
                            ? "badge-success text-white"
                            : app.appointmentStatus === "rejected"
                            ? "badge-error text-white"
                            : "badge-info"
                        }`}
                      >
                        {app.appointmentStatus}
                      </span>
                    </td>
                    <td className="flex gap-2">
                      {app.appointmentStatus === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(app._id, "approved")}
                            className="btn btn-xs btn-success text-white"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(app._id, "rejected")}
                            className="btn btn-xs btn-error text-white"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}