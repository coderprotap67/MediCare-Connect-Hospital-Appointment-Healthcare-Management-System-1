export default function ContactUsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2 text-center">Contact Us</h1>
      <p className="text-slate-500 text-sm text-center mb-8">Have questions or feedback? Get in touch with our team.</p>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-md space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
          <input type="text" placeholder="John Doe" className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
          <input type="email" placeholder="john@example.com" className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
          <textarea rows={4} placeholder="Type your message here..." className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
        </div>
        <button className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow transition">
          Send Message
        </button>
      </div>
    </div>
  );
}