
"use client";

import { useState, useEffect } from "react";
import api from "@/utils/api";
import {
  UserCheck,
  Check,
  X,
  Search,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  // Fetch Doctors
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/admin/doctors");

      // Supports both direct array and object response
      const doctorData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.doctors)
        ? res.data.doctors
        : [];

      setDoctors(doctorData);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load doctors. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Verify or Reject Doctor
  const handleVerify = async (doctorId, status) => {
    try {
      setUpdatingId(doctorId);

      await api.patch(`/admin/doctors/${doctorId}/verify`, {
        status,
      });

      setDoctors((prev) =>
        prev.map((doc) =>
          doc._id === doctorId
            ? { ...doc, verificationStatus: status }
            : doc
        )
      );

      alert(`Doctor status changed to ${status}.`);
    } catch (err) {
      console.error("Failed to update doctor status:", err);

      alert(
        err.response?.data?.message ||
          "Failed to update doctor verification status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Search Filter
  const filteredDoctors = doctors.filter((doc) => {
    const doctorName = (
      doc.doctorName ||
      doc.name ||
      ""
    ).toLowerCase();

    const specialization = (
      doc.specialization || ""
    ).toLowerCase();

    const email = (doc.email || "").toLowerCase();

    const search = searchTerm.trim().toLowerCase();

    return (
      doctorName.includes(search) ||
      specialization.includes(search) ||
      email.includes(search)
    );
  });

  // Status Styling
  const getStatusStyle = (status) => {
    if (status === "verified") {
      return "bg-emerald-50 text-emerald-600";
    }

    if (status === "rejected") {
      return "bg-rose-50 text-rose-600";
    }

    return "bg-amber-50 text-amber-600";
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-sky-600">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="font-medium">
            Loading doctors...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto min-w-0 px-3 sm:px-4 py-5 sm:py-8">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 sm:mb-8">

        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <UserCheck className="text-sky-600 shrink-0" />
            <span>Doctor Verification</span>
          </h1>

          <p className="text-slate-500 text-sm mt-2">
            Review applicant documents, verify credentials, or reject requests.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search
            size={18}
            className="absolute left-3.5 top-3 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search doctor or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />

          <p className="text-sm flex-1">{error}</p>

          <button
            onClick={fetchDoctors}
            className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            <RefreshCw size={15} />
            Retry
          </button>
        </div>
      )}

      {/* Mobile Doctor Cards */}
      {!error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">

          {filteredDoctors.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl border p-8 text-center text-slate-400">
              No doctors found.
            </div>
          ) : (
            filteredDoctors.map((doc) => {
              const status =
                doc.verificationStatus || "unverified";

              const isUpdating = updatingId === doc._id;

              return (
                <div
                  key={doc._id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 min-w-0"
                >
                  <div className="mb-4 min-w-0">
                    <h3 className="font-bold text-slate-800 text-base break-words">
                      {doc.doctorName || doc.name || "Dr. Name"}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1 break-all">
                      {doc.email || "No email available"}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-slate-500 mb-1">
                      Specialization
                    </p>

                    <p className="text-sm font-medium text-slate-700 break-words">
                      {doc.specialization || "General"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-semibold text-slate-500">
                      Verification Status
                    </span>

                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${getStatusStyle(status)}`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">

                    <button
                      disabled={isUpdating || status === "verified"}
                      onClick={() =>
                        handleVerify(doc._id, "verified")
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-semibold text-sm transition inline-flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Check size={16} />
                      )}
                      Verify
                    </button>

                    <button
                      disabled={isUpdating || status === "rejected"}
                      onClick={() =>
                        handleVerify(doc._id, "rejected")
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold text-sm transition inline-flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <X size={16} />
                      )}
                      Reject
                    </button>

                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tablet and Desktop Table */}
      {!error && (
        <div className="hidden md:block bg-white rounded-2xl lg:rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">

              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-4 lg:px-6 py-4">
                    Doctor Details
                  </th>

                  <th className="px-4 lg:px-6 py-4">
                    Specialization
                  </th>

                  <th className="px-4 lg:px-6 py-4">
                    Status
                  </th>

                  <th className="px-4 lg:px-6 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredDoctors.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-8 text-slate-400"
                    >
                      No doctors found.
                    </td>
                  </tr>
                ) : (
                  filteredDoctors.map((doc) => {
                    const status =
                      doc.verificationStatus || "unverified";

                    const isUpdating = updatingId === doc._id;

                    return (
                      <tr
                        key={doc._id}
                        className="hover:bg-slate-50/50 transition"
                      >
                        <td className="px-4 lg:px-6 py-4">
                          <div className="font-bold text-slate-800 break-words">
                            {doc.doctorName || doc.name || "Dr. Name"}
                          </div>

                          <div className="text-xs text-slate-400 break-all">
                            {doc.email}
                          </div>
                        </td>

                        <td className="px-4 lg:px-6 py-4 font-medium text-slate-600">
                          {doc.specialization || "General"}
                        </td>

                        <td className="px-4 lg:px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(status)}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="px-4 lg:px-6 py-4 text-right">
                          <div className="flex justify-end flex-wrap gap-2">

                            <button
                              disabled={isUpdating || status === "verified"}
                              onClick={() =>
                                handleVerify(doc._id, "verified")
                              }
                              className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-medium text-xs transition inline-flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isUpdating ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Check size={14} />
                              )}
                              Verify
                            </button>

                            <button
                              disabled={isUpdating || status === "rejected"}
                              onClick={() =>
                                handleVerify(doc._id, "rejected")
                              }
                              className="px-3 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-medium text-xs transition inline-flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isUpdating ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <X size={14} />
                              )}
                              Reject
                            </button>

                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}

              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Total Doctors */}
      {!error && (
        <p className="text-xs text-slate-500 mt-4 text-right">
          Showing: {filteredDoctors.length} / Total Doctors: {doctors.length}
        </p>
      )}

    </div>
  );
}
