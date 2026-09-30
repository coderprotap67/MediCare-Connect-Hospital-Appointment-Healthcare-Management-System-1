"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, ShieldCheck, Calendar, Award, Star, ArrowRight } from "lucide-react";
export default function HomePage() {
  return (
    <div className="space-y-16 py-8">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-linear-to-r from-sky-600 to-indigo-600 rounded-3xl p-8 md:p-16 text-white text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl"
        >
          <div className="max-w-2xl space-y-4">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Your Health, Our Priority – Book Expert Doctors Instantly
            </h1>
            <p className="text-sky-100 text-sm md:text-base">
              MediCare Connect brings top specialist doctors and medical services right to your fingertips. Safe, fast, and reliable.
            </p>
            <div className="pt-2">
              <Link
                href="/doctors"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-sky-700 font-bold rounded-xl shadow-lg hover:bg-slate-100 transition"
              >
                <Search size={18} /> Find Doctors Now
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="w-48 h-48 md:w-64 md:h-64 bg-white/10 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-md">
              <ShieldCheck size={96} className="text-white opacity-90" />
            </div>
          </div>
        </motion.div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">Medical Specializations</h2>
          <p className="text-slate-500 text-sm mt-1">Explore doctors across various departments</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: "Cardiology", desc: "Heart Specialists" },
            { name: "Neurology", desc: "Brain & Nerve" },
            { name: "Orthopedics", desc: "Bone & Joint" },
            { name: "Pediatrics", desc: "Child Health" },
            { name: "Dermatology", desc: "Skin Care" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center hover:shadow-md transition"
            >
              <h3 className="font-bold text-slate-800 text-base">{item.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-md"
        >
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">Why Choose MediCare Connect?</h2>
            <p className="text-slate-400 text-sm mt-2">
              We streamline healthcare access with modern tech and reliable doctor booking.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50">
              <Calendar className="text-sky-400 mb-3" size={28} />
              <h3 className="font-bold text-lg mb-1">Easy Scheduling</h3>
              <p className="text-slate-400 text-xs">Book appointments online without standing in long hospital queues.</p>
            </div>
            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50">
              <Award className="text-sky-400 mb-3" size={28} />
              <h3 className="font-bold text-lg mb-1">Verified Doctors</h3>
              <p className="text-slate-400 text-xs">All doctors are thoroughly verified by our admin team before listing.</p>
            </div>
            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50">
              <Star className="text-sky-400 mb-3" size={28} />
              <h3 className="font-bold text-lg mb-1">Real Reviews</h3>
              <p className="text-slate-400 text-xs">Read genuine patient ratings and feedback before choosing your doctor.</p>
            </div>
          </div>
        </motion.div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-sky-50 rounded-2xl p-6 border border-sky-100 text-center">
          <div>
            <div className="text-3xl font-extrabold text-sky-700">50+</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Verified Doctors</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-sky-700">1,200+</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Total Patients</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-sky-700">3,400+</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Appointments</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-sky-700">4.9★</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Average Rating</div>
          </div>
        </div>
      </section>
    </div>
  );
}