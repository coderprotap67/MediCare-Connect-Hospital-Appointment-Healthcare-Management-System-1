"use client";
import { useState } from "react";
import api from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { Plus, Trash2, FileText, Send, User, Stethoscope } from "lucide-react";
export default function DoctorPrescriptionPage() {
  const { user } = useAuth();
  const [patientEmail, setPatientEmail] = useState("");
  const [patientName, setPatientName] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [advice, setAdvice] = useState("");
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "1-0-1", duration: "7 days" },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "1-0-1", duration: "7 days" }]);
  };
  const handleRemoveMedicine = (index) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((_, i) => i !== index));
  };
  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientEmail || !patientName) {
      alert("Please enter patient details.");
      return;
    }
    try {
      setSubmitting(true);
      const prescriptionData = {
        doctorEmail: user?.email,
        doctorName: user?.displayName || "Doctor",
        patientEmail,
        patientName,
        diagnosis,
        advice,
        medicines,
        date: new Date(),
      };
      await api.post("/api/prescriptions", prescriptionData);
      alert("Prescription created successfully!");
      setPatientEmail("");
      setPatientName("");
      setDiagnosis("");
      setAdvice("");
      setMedicines([{ name: "", dosage: "1-0-1", duration: "7 days" }]);
    } catch (err) {
      console.error("Failed to create prescription:", err);
      alert("Failed to create prescription.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <FileText className="text-sky-600" /> Create Prescription
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Issue digital prescriptions for your patients with detailed dosage and advice.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-6">
          <h2 className="text-md font-bold text-slate-800 mb-4 flex items-center gap-2">
            <User size={18} className="text-sky-600" /> Patient Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Patient Name</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Patient Email</label>
              <input
                type="email"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                placeholder="patient@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
          </div>
        </div>
        <div className="border-b border-slate-100 pb-6">
          <h2 className="text-md font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Stethoscope size={18} className="text-sky-600" /> Medical Diagnosis
          </h2>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Diagnosis / Symptoms</label>
            <textarea
              rows={2}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. High fever, Mild cough"
              className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
        </div>
        <div className="border-b border-slate-100 pb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-md font-bold text-slate-800">Prescribed Medicines (Rx)</h2>
            <button
              type="button"
              onClick={handleAddMedicine}
              className="px-3 py-1.5 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-xl font-medium text-xs flex items-center gap-1 transition"
            >
              <Plus size={14} /> Add Medicine
            </button>
          </div>

          <div className="space-y-3">
            {medicines.map((med, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <input
                  type="text"
                  placeholder="Medicine Name (e.g. Napa Extra)"
                  value={med.name}
                  onChange={(e) => handleMedicineChange(index, "name", e.target.value)}
                  className="flex-2 w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Dosage (1-0-1)"
                  value={med.dosage}
                  onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)}
                  className="flex-1 w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Duration (7 days)"
                  value={med.duration}
                  onChange={(e) => handleMedicineChange(index, "duration", e.target.value)}
                  className="flex-1 w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none"
                  required
                />
                {medicines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMedicine(index)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Advice */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Doctor's Advice / Notes</label>
          <textarea
            rows={3}
            value={advice}
            onChange={(e) => setAdvice(e.target.value)}
            placeholder="Drink warm water, Rest properly..."
            className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl text-sm transition shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send size={16} /> {submitting ? "Saving..." : "Issue Prescription"}
        </button>
      </form>
    </div>
  );
}