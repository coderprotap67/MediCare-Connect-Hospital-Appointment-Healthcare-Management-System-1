"use client";
import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import api from "@/utils/api";

export default function AppointmentModal({ doctor, isOpen, onClose }) {
  const { user } = useContext(AuthContext);
  const [symptoms, setSymptoms] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/appointments", {
        doctorId: doctor._id,
        doctorName: doctor.doctorName,
        doctorEmail: doctor.email,
        patientName: user.name,
        patientEmail: user.email,
        appointmentDate: date,
        appointmentTime: time,
        symptoms,
        fee: doctor.consultationFee
      });
      alert("Appointment Requested Successfully!");
      onClose();
    } catch (err) {
      alert("Failed to create appointment.");
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Book Appointment with {doctor.doctorName}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Preferred Date</label>
            <input type="date" required className="input input-bordered w-full" onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="label">Preferred Time</label>
            <input type="time" required className="input input-bordered w-full" onChange={(e) => setTime(e.target.value)} />
          </div>
          <div>
            <label className="label">Symptoms Description</label>
            <textarea required className="textarea textarea-bordered w-full" placeholder="Describe symptoms..." onChange={(e) => setSymptoms(e.target.value)}></textarea>
          </div>
          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn">Cancel</button>
            <button type="submit" className="btn btn-primary text-white">Submit Request</button>
          </div>
        </form>
      </div>
    </div>
  );
}