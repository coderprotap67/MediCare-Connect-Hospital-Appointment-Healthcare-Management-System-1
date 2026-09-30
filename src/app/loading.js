import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-sky-600 mb-3" size={48} />
      <p className="text-slate-500 font-medium text-sm">Loading MediCare Connect...</p>
    </div>
  );
}