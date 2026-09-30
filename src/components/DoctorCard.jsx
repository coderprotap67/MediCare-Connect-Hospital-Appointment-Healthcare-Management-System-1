import Link from "next/link";
import { Star, MapPin, Stethoscope, ChevronRight } from "lucide-react";
export default function DoctorCard({ doctor }) {
  const fallbackImage = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop";
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-100/60 hover:shadow-2xl hover:shadow-sky-500/10 transition-all overflow-hidden flex flex-col group">
      <div className="relative h-52 bg-slate-100 overflow-hidden">
        <img 
          src={doctor.profileImage || fallbackImage} 
          alt={doctor.doctorName || "Doctor"} 
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-sky-700 font-semibold text-xs px-3 py-1.5 rounded-full shadow-sm border border-slate-100 flex items-center gap-1">
          <Stethoscope size={12} /> {doctor.specialization}
        </span>
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
            {doctor.doctorName}
          </h3>
          <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1.5 font-medium">
            <MapPin size={15} className="text-sky-500" /> {doctor.hospitalName || "Central Hospital"}
          </p>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-slate-100">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Consultation Fee</span>
            <span className="text-xl font-extrabold text-teal-600">${doctor.consultationFee}</span>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg text-amber-700 font-bold text-sm">
            <Star size={14} fill="currentColor" className="text-amber-400" /> 
            <span>{doctor.rating || 4.9}</span>
          </div>
        </div>
        <Link 
          href={`/doctors/${doctor._id}`} 
          className="w-full py-3 bg-sky-50 hover:bg-sky-600 text-sky-600 hover:text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all group-hover:shadow-md group-hover:shadow-sky-500/20"
        >
          View Profile <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}