"use client";
import { useState, useEffect } from "react";
import api from "@/utils/api";
import { UserCheck, Check, X, Search } from "lucide-react";

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/doctors");
      setDoctors(res.data || []);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleVerify = async (doctorId, status) => {
    try {
      await api.patch(`/api/admin/doctors/${doctorId}/verify`, { status });
      setDoctors((prev) =>
        prev.map((doc) => (doc._id === doctorId ? { ...doc, verificationStatus: status } : doc))
      );
      alert(`Doctor status changed to ${status}`);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update doctor verification status.");
    }
  };

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <UserCheck className="text-sky-600" /> Doctor Verification
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Review applicant documents, verify credentials, or reject requests.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search doctor or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Doctor Details</th>
                <th className="px-6 py-4">Specialization</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-400">
                    No doctors found for verification.
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{doc.name || "Dr. Name"}</div>
                      <div className="text-xs text-slate-400">{doc.email}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">
                      {doc.specialization || "General"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          doc.verificationStatus === "verified"
                            ? "bg-emerald-50 text-emerald-600"
                            : doc.verificationStatus === "rejected"
                            ? "bg-rose-50 text-rose-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {doc.verificationStatus || "pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleVerify(doc._id, "verified")}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-medium text-xs transition inline-flex items-center gap-1"
                      >
                        <Check size={14} /> Verify
                      </button>
                      <button
                        onClick={() => handleVerify(doc._id, "rejected")}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-medium text-xs transition inline-flex items-center gap-1"
                      >
                        <X size={14} /> Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}