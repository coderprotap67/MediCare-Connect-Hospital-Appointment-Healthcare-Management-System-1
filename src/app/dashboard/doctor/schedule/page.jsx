
"use client";

import { useState, useEffect } from "react";
import api from "@/utils/api";
import {
  CalendarDays,
  Clock,
  Plus,
  Trash2,
  Edit,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function ScheduleManagerPage() {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  // Fetch existing schedule
  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/api/doctor/schedule");

      setAvailableSlots(
        Array.isArray(res.data?.availableSlots)
          ? res.data.availableSlots
          : []
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load schedule."
      );
    } finally {
      setLoading(false);
    }
  };

  // Add or update a time slot
  const handleAddSlot = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedDay || !startTime || !endTime) {
      setError("Please select a day and time.");
      return;
    }

    if (startTime >= endTime) {
      setError("End time must be later than start time.");
      return;
    }

    const newSlot = {
      day: selectedDay,
      startTime,
      endTime,
    };

    const duplicate = availableSlots.some(
      (slot, index) =>
        index !== editIndex &&
        slot.day === selectedDay &&
        slot.startTime === startTime &&
        slot.endTime === endTime
    );

    if (duplicate) {
      setError("This schedule already exists.");
      return;
    }

    if (editIndex !== null) {
      setAvailableSlots((prev) =>
        prev.map((slot, index) =>
          index === editIndex ? newSlot : slot
        )
      );
      setEditIndex(null);
      setSuccess("Schedule updated. Please save your changes.");
    } else {
      setAvailableSlots((prev) => [...prev, newSlot]);
      setSuccess("Time slot added. Please save your changes.");
    }

    setStartTime("09:00");
    setEndTime("17:00");
    setSelectedDay("Monday");
  };

  // Edit slot
  const handleEdit = (index) => {
    const slot = availableSlots[index];

    setSelectedDay(slot.day);
    setStartTime(slot.startTime);
    setEndTime(slot.endTime);
    setEditIndex(index);
    setError("");
    setSuccess("");
  };

  // Delete slot
  const handleDelete = (index) => {
    if (!confirm("Are you sure you want to delete this time slot?")) {
      return;
    }

    setAvailableSlots((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setEditIndex(null);
    setSuccess("Slot removed. Please save your changes.");
  };

  // Save schedule to backend
  const handleSaveSchedule = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.post("/api/doctor/schedule", {
        availableSlots,
      });

      setSuccess("Your schedule has been saved successfully!");
      setEditIndex(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save schedule."
      );
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setSelectedDay("Monday");
    setStartTime("09:00");
    setEndTime("17:00");
  };

  return (
    <div className="min-h-screen w-full min-w-0 bg-slate-50 text-slate-900 px-3 py-6 sm:px-5 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-sky-100 text-sky-600 rounded-xl">
              <CalendarDays size={25} />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Schedule Manager
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage your available days and appointment times.
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        {/* Add Schedule Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 mb-7">

          <h2 className="text-lg font-bold text-slate-800 mb-5">
            {editIndex !== null ? "Edit Schedule" : "Add Available Time"}
          </h2>

          <form onSubmit={handleAddSlot}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

              {/* Day */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Available Day
                </label>

                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Start Time
                </label>

                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  End Time
                </label>

                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                type="submit"
                className="px-5 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold text-sm flex items-center gap-2 transition"
              >
                {editIndex !== null ? (
                  <>
                    <Edit size={17} /> Update Slot
                  </>
                ) : (
                  <>
                    <Plus size={18} /> Add Time Slot
                  </>
                )}
              </button>

              {editIndex !== null && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm flex items-center gap-2"
                >
                  <X size={17} /> Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Schedule List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Your Available Schedule
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {availableSlots.length} time slot(s) added
              </p>
            </div>

            <span className="px-3 py-1.5 bg-sky-50 text-sky-600 rounded-full text-xs font-semibold">
              {availableSlots.length} Slots
            </span>
          </div>

          {loading ? (
            <div className="py-16 flex justify-center">
              <Loader2 size={32} className="animate-spin text-sky-600" />
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="py-16 px-5 text-center">
              <CalendarDays
                size={45}
                className="mx-auto text-slate-300 mb-4"
              />

              <h3 className="text-lg font-semibold text-slate-700">
                No Schedule Available
              </h3>

              <p className="text-sm text-slate-400 mt-2">
                Add your available days and working hours above.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {availableSlots.map((slot, index) => (
                <div
                  key={`${slot.day}-${slot.startTime}-${index}`}
                  className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
                      <CalendarDays size={21} />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-800">
                        {slot.day}
                      </h3>

                      <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                        <Clock size={14} />
                        {slot.startTime} - {slot.endTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      <Edit size={15} /> Edit
                    </button>

                    <button
                      onClick={() => handleDelete(index)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Save Button */}
          {!loading && (
            <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleSaveSchedule}
                disabled={saving}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Schedule
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
