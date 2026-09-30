"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/utils/api";
import {Search,Loader2,Star,Clock,DollarSign,ChevronLeft,ChevronRight,LayoutGrid, List,} from "lucide-react";
export default function FindDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [sortBy, setSortBy] = useState(""); 
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const limit = 6;
  useEffect(() => {
    fetchDoctors();
  }, [search, specialization, sortBy, page]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/doctors", {
        params: {
          search,
          specialization,
          sortBy,
          page,
          limit,
        },
      });

      // Response format check
      if (res.data?.doctors) {
        setDoctors(res.data.doctors);
        setTotalPages(res.data.totalPages || 1);
      } else if (Array.isArray(res.data)) {
        setDoctors(res.data);
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
            Find Your Doctor
          </h1>
          <p className="text-slate-500">
            Book appointments with top verified specialists easily.
          </p>
        </div>

        {/* Layout Switcher Buttons (Grid / Table) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 w-fit">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
              viewMode === "grid"
                ? "bg-white text-sky-600 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
            title="Grid View"
          >
            <LayoutGrid size={18} /> Grid
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
              viewMode === "table"
                ? "bg-white text-sky-600 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
            title="Table View"
          >
            <List size={18} /> Table
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative col-span-1 md:col-span-1">
          <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by doctor name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
          />
        </div>

        {/* Specialization Filter */}
        <div>
          <select
            value={specialization}
            onChange={(e) => {
              setSpecialization(e.target.value);
              setPage(1);
            }}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm bg-white"
          >
            <option value="">All Specializations</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Dermatology">Dermatology</option>
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm bg-white"
          >
            <option value="">Sort By</option>
            <option value="fee-low">Fee: Low to High</option>
            <option value="fee-high">Fee: High to Low</option>
            <option value="experience">Experience (Highest First)</option>
            <option value="rating">Rating (Highest First)</option>
          </select>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => {
            setSearch("");
            setSpecialization("");
            setSortBy("");
            setPage(1);
          }}
          className="btn bg-slate-100 hover:bg-slate-200 text-slate-700 border-none rounded-xl text-sm"
        >
          Reset Filters
        </button>
      </div>

      {/* Main Content Render */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-sky-600" size={40} />
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-500 text-lg">
            No doctors found matching your criteria.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc._id}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={doc.profileImage || "/default-avatar.png"}
                    alt={doc.doctorName}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-100"
                  />
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">
                      {doc.doctorName}
                    </h3>
                    <p className="text-xs font-semibold text-sky-600 uppercase tracking-wide">
                      {doc.specialization}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 mb-6">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" />
                    <span>Experience: {doc.experience} Years</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} className="text-slate-400" />
                    <span>Fee: ${doc.consultationFee}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span>Rating: {doc.rating || 4.8} / 5.0</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/doctors/${doc._id}`}
                className="w-full btn bg-sky-600 hover:bg-sky-700 text-white border-none rounded-xl"
              >
                View Profile & Book
              </Link>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-4 px-6">Doctor</th>
                  <th className="py-4 px-6">Specialization</th>
                  <th className="py-4 px-6">Experience</th>
                  <th className="py-4 px-6">Consultation Fee</th>
                  <th className="py-4 px-6">Rating</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doctors.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={doc.profileImage || "/default-avatar.png"}
                          alt={doc.doctorName}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                        <span className="font-bold text-slate-800">
                          {doc.doctorName}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">
                      {doc.specialization}
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {doc.experience} Years
                    </td>
                    <td className="py-4 px-6 font-bold text-sky-600">
                      ${doc.consultationFee}
                    </td>
                    <td className="py-4 px-6">
                      <span className="flex items-center gap-1 font-semibold text-amber-500">
                        <Star size={14} className="fill-amber-400" />
                        {doc.rating || 4.8}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/doctors/${doc._id}`}
                        className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold inline-block transition"
                      >
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-12">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="p-2 rounded-xl border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="text-sm font-medium text-slate-600">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="p-2 rounded-xl border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}