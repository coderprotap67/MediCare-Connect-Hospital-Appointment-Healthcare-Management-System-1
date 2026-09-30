"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import { User, Mail, Phone, MapPin, Camera, Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";
const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500";
export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phone: "",
    address: "",
    photoURL: DEFAULT_AVATAR,
  });
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        photoURL: user.photoURL || user.photo || user.image || DEFAULT_AVATAR,
      });
    }
  }, [user]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    const userEmail = user?.email || formData.email;
    if (!userEmail) {
      setError("User email is missing. Please log in again.");
      setLoading(false);
      return;
    }
    try {
      const payload = {
        displayName: formData.displayName,
        phone: formData.phone,
        address: formData.address,
        photoURL: formData.photoURL?.trim() || DEFAULT_AVATAR,
      };
      const res = await api.put("/api/users/profile", payload);
      setSuccess("Profile updated successfully!");
      if (setUser) {
        setUser({ ...user, ...payload, name: payload.displayName, photo: payload.photoURL });
      }
    } catch (err) {
      console.error("Profile Update Error:", err);
      setError(
        err.response?.data?.message ||
        "Failed to update profile. Please check backend connection."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">View and update your personal information</p>
      </div>
      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center gap-2">
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header & Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
            <div className="relative">
              <img
                src={formData.photoURL && formData.photoURL.trim() !== "" ? formData.photoURL : DEFAULT_AVATAR}
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-md"
              />
              <div className="absolute bottom-0 right-0 p-1.5 bg-sky-600 text-white rounded-full shadow-lg">
                <Camera size={16} />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-slate-800">
                {formData.displayName || "Patient User"}
              </h2>
              <p className="text-sm text-slate-500">{formData.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-sky-50 text-sky-600 text-xs font-semibold rounded-full capitalize">
                {user?.role || "Patient"}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 text-sm font-medium transition"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="w-full pl-11 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-sm font-medium cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+880 1700-000000"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 text-sm font-medium transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Image URL</label>
              <div className="relative">
                <Camera size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  name="photoURL"
                  value={formData.photoURL}
                  onChange={handleChange}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 text-sm font-medium transition"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your present address"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 text-sm font-medium transition"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold shadow-md transition flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Saving Changes...
                </>
              ) : (
                <>
                  <Save size={18} /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}