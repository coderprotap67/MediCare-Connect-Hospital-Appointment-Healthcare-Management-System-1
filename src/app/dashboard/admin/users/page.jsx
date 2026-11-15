
"use client";

import { useState, useEffect } from "react";
import api from "@/utils/api";
import {
  Users,
  Ban,
  CheckCircle,
  Search,
  UserCheck,
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Fixed API URL
      const res = await api.get("/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, {
        role: newRole,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, role: newRole } : u
        )
      );

      alert(`User role updated to ${newRole}`);
    } catch (err) {
      console.error("Failed to update role:", err);
      alert("Failed to update user role.");
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus =
      currentStatus === "blocked" ? "active" : "blocked";

    try {
      await api.patch(`/admin/users/${userId}/status`, {
        status: newStatus,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, status: newStatus } : u
        )
      );

      alert(`User status changed to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status.");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-5 sm:py-8 min-w-0">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 sm:mb-8">

        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="text-sky-600 shrink-0" />
            <span>User Management</span>
          </h1>

          <p className="text-slate-500 text-sm mt-2">
            Manage registered users, update roles, or restrict access.
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
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Mobile User Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">

        {filteredUsers.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-8 text-center text-slate-400 border">
            No users found.
          </div>
        ) : (
          filteredUsers.map((u) => (
            <div
              key={u._id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 min-w-0"
            >
              <div className="mb-4 min-w-0">
                <h3 className="font-bold text-slate-800 text-base break-words">
                  {u.name || "No Name"}
                </h3>

                <p className="text-xs text-slate-400 mt-1 break-all">
                  {u.email}
                </p>
              </div>

              {/* Role */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-500 mb-2">
                  User Role
                </label>

                <select
                  value={u.role || "patient"}
                  onChange={(e) =>
                    handleRoleChange(u._id, e.target.value)
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-semibold text-slate-500">
                  Account Status
                </span>

                <span
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
                    u.status === "blocked"
                      ? "bg-rose-50 text-rose-600"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {u.status === "blocked" ? (
                    <>
                      <Ban size={12} />
                      Blocked
                    </>
                  ) : (
                    <>
                      <CheckCircle size={12} />
                      Active
                    </>
                  )}
                </span>
              </div>

              {/* Action */}
              <button
                onClick={() =>
                  handleStatusToggle(u._id, u.status)
                }
                className={`w-full px-3 py-2.5 rounded-xl font-semibold text-sm transition inline-flex items-center justify-center gap-2 ${
                  u.status === "blocked"
                    ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                }`}
              >
                {u.status === "blocked" ? (
                  <>
                    <UserCheck size={16} />
                    Unblock User
                  </>
                ) : (
                  <>
                    <Ban size={16} />
                    Block User
                  </>
                )}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Tablet and Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl lg:rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">

            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-4 lg:px-6 py-4">User Details</th>
                <th className="px-4 lg:px-6 py-4">Role</th>
                <th className="px-4 lg:px-6 py-4">Status</th>
                <th className="px-4 lg:px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-8 text-slate-400"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-slate-50/50 transition"
                  >
                    <td className="px-4 lg:px-6 py-4">
                      <div className="font-bold text-slate-800 break-words">
                        {u.name || "No Name"}
                      </div>

                      <div className="text-xs text-slate-400 break-all">
                        {u.email}
                      </div>
                    </td>

                    <td className="px-4 lg:px-6 py-4">
                      <select
                        value={u.role || "patient"}
                        onChange={(e) =>
                          handleRoleChange(u._id, e.target.value)
                        }
                        className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td className="px-4 lg:px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          u.status === "blocked"
                            ? "bg-rose-50 text-rose-600"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {u.status === "blocked" ? (
                          <>
                            <Ban size={12} />
                            Blocked
                          </>
                        ) : (
                          <>
                            <CheckCircle size={12} />
                            Active
                          </>
                        )}
                      </span>
                    </td>

                    <td className="px-4 lg:px-6 py-4 text-right">
                      <button
                        onClick={() =>
                          handleStatusToggle(u._id, u.status)
                        }
                        className={`px-3 py-2 rounded-xl font-medium text-xs transition inline-flex items-center gap-1 ${
                          u.status === "blocked"
                            ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                        }`}
                      >
                        {u.status === "blocked" ? (
                          <>
                            <UserCheck size={14} />
                            Unblock
                          </>
                        ) : (
                          <>
                            <Ban size={14} />
                            Block
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* User Count */}
      <p className="text-xs text-slate-500 mt-4 text-right">
        Total Users: {filteredUsers.length}
      </p>

    </div>
  );
}
