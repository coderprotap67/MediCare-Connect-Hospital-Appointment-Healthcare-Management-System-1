export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">MediCare <span className="text-teal-400">Connect</span></h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Providing high-quality healthcare connections for patients and certified specialist doctors worldwide.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            <li><a href="/" className="hover:text-teal-400 transition-colors">Home</a></li>
            <li><a href="/doctors" className="hover:text-teal-400 transition-colors">Find Doctors</a></li>
            <li><a href="/login" className="hover:text-teal-400 transition-colors">Patient Portal</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Specialties</h4>
          <ul className="space-y-2.5 text-sm">
            <li className="hover:text-teal-400 transition-colors">Cardiology</li>
            <li className="hover:text-teal-400 transition-colors">Neurology</li>
            <li className="hover:text-teal-400 transition-colors">Pediatrics</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Support</h4>
          <p className="text-sm text-slate-400">Emergency: +1 800 234 5678</p>
          <p className="text-sm text-slate-400 mt-2">Email: support@medicareconnect.com</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} MediCare Connect. All rights reserved.
      </div>
    </footer>
  );
}