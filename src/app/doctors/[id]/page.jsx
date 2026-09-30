"use client";

import { useState, useEffect, use } from "react";
import api from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Calendar, MapPin, Star, CheckCircle2 } from "lucide-react";

export default function DoctorDetailsPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Appointment Booking States
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/doctors/${id}`);
        setDoctor(res.data);
      } catch (err) {
        console.error("Error fetching doctor:", err);
        setError("Failed to load doctor details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDoctorDetails();
    }
  }, [id]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first to book an appointment.");
      return;
    }

    try {
      setBookingLoading(true);

      await api.post("/api/appointments", {
        doctorId: doctor._id,
        doctorName: doctor.doctorName || doctor.name,
        doctorEmail: doctor.email,
        doctorImage: doctor.profileImage || doctor.image,
        specialization: doctor.specialization,
        hospitalName: doctor.hospitalName || doctor.location,
        consultationFee: doctor.consultationFee,
        appointmentDate,
        appointmentTime,
        symptoms,
        patientEmail: user.email,
        patientName: user.displayName || user.name,
        appointmentStatus: "pending",
        paymentStatus: "unpaid",
      });

      setBookingSuccess(true);
      setAppointmentDate("");
      setAppointmentTime("");
      setSymptoms("");
    } catch (err) {
      console.error("Error booking appointment:", err);
      alert(err.response?.data?.message || "Failed to book appointment. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-sky-600" size={40} />
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="max-w-3xl mx-auto my-12 p-8 bg-white border border-slate-100 rounded-3xl text-center shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Doctor Not Found</h2>
        <p className="text-slate-500 text-sm">{error || "Unable to retrieve doctor details."}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Doctor Information Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <img
              src={doctor.profileImage || doctor.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500"}
              alt={doctor.doctorName || doctor.name}
              className="w-full sm:w-48 h-48 rounded-2xl object-cover border border-slate-200"
            />

            <div className="space-y-3">
              <span className="px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-xs font-semibold">
                {doctor.specialization || "General Physician"}
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900">
                {doctor.doctorName || doctor.name}
              </h1>
              <p className="text-slate-500 text-sm flex items-center gap-1">
                <MapPin size={16} className="text-slate-400" />
                {doctor.hospitalName || doctor.location || "Hospital Details N/A"}
              </p>
              <div className="flex items-center gap-4 text-sm font-semibold">
                <span className="text-teal-600">${doctor.consultationFee || 0} Fee</span>
                <span className="text-amber-500 flex items-center gap-1">
                  <Star size={16} fill="currentColor" /> {doctor.rating || "4.9"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h3 className="font-bold text-slate-800 mb-2">About Doctor</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {doctor.bio || doctor.about || "Experienced specialist dedicated to providing top-quality healthcare services."}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm h-fit">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar className="text-sky-600" size={20} />
            Book Appointment
          </h3>

          {bookingSuccess ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="text-emerald-600 mx-auto" size={40} />
              <h4 className="font-bold text-emerald-900">Appointment Requested!</h4>
              <p className="text-xs text-emerald-700">
                Your appointment request has been submitted successfully. Check your dashboard for status.
              </p>
              <button
                onClick={() => setBookingSuccess(false)}
                className="text-xs text-sky-600 font-semibold underline mt-2"
              >
                Book another appointment
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Select Date</label>
                <input
                  type="date"
                  required
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Select Time Slot</label>
                <select
                  required
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">Select Time</option>
                  {doctor?.availableSlots && doctor.availableSlots.length > 0 ? (
                    doctor.availableSlots.map((slot, index) => (
                      <option key={index} value={slot}>
                        {slot}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="02:30 PM">02:30 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Symptoms / Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your health problem briefly..."
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold shadow-md transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {bookingLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "Confirm Appointment"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}