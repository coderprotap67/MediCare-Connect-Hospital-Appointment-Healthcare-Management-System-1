"use client";
import { useState, useEffect } from "react";
import api from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { Star, Edit3, Trash2, MessageSquare, AlertCircle } from "lucide-react";
export default function MyReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const fetchMyReviews = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const res = await api.get(`/api/reviews/user/${user.email}`);
      setReviews(res.data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMyReviews();
  }, [user]);
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/api/reviews/${id}`);
      setReviews((prev) => prev.filter((rev) => rev._id !== id));
      alert("Review deleted successfully!");
    } catch (err) {
      console.error("Failed to delete review:", err);
      alert("Failed to delete review.");
    }
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingReview) return;

    try {
      await api.patch(`/api/reviews/${editingReview._id}`, {
        rating: Number(editRating),
        comment: editComment,
      });

      alert("Review updated successfully!");
      setEditingReview(null);
      fetchMyReviews();
    } catch (err) {
      console.error("Failed to update review:", err);
      alert("Failed to update review.");
    }
  };

  const openEditModal = (review) => {
    setEditingReview(review);
    setEditRating(review.rating || 5);
    setEditComment(review.comment || "");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">My Reviews & Ratings</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage the feedback and ratings you have submitted for doctors
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">No Reviews Found</h3>
          <p className="text-slate-500 text-sm">You haven't reviewed any doctors yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">
                      {rev.doctorName || "Doctor"}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {new Date(rev.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg text-amber-700 font-bold text-sm">
                    <Star size={14} fill="currentColor" className="text-amber-400" />
                    <span>{rev.rating}</span>
                  </div>
                </div>

                <p className="text-slate-600 text-sm italic bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex justify-end items-center gap-2 mt-5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => openEditModal(rev)}
                  className="px-3 py-1.5 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-xl font-medium text-xs flex items-center gap-1.5 transition"
                >
                  <Edit3 size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(rev._id)}
                  className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl font-medium text-xs flex items-center gap-1.5 transition"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editingReview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Edit Review</h2>
            <p className="text-xs text-slate-500 mb-4">
              Doctor: <span className="font-semibold text-slate-800">{editingReview.doctorName}</span>
            </p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Rating (1 to 5)</label>
                <select
                  value={editRating}
                  onChange={(e) => setEditRating(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Very Good</option>
                  <option value={3}>3 - Good</option>
                  <option value={2}>2 - Fair</option>
                  <option value={1}>1 - Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Feedback Comment</label>
                <textarea
                  rows={4}
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-sm transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}