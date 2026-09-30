"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { X, CreditCard } from "lucide-react";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
function CheckoutForm({ appointment, onSuccess, onClose }) {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");
    try {
      const amount = appointment.consultationFee || appointment.doctor?.consultationFee || appointment.fee || 50;
            const res = await api.post("/api/create-payment-intent", {
        amount: amount * 100,
        appointmentId: appointment._id,
      });

      const clientSecret = res.data.clientSecret;
      const cardElement = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.displayName || "Patient",
            email: user?.email,
          },
        },
      });

      if (paymentResult.error) {
        setError(paymentResult.error.message);
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        await api.post("/api/payments/confirm", {
          appointmentId: appointment._id,
          transactionId: paymentResult.paymentIntent.id,
          userEmail: user?.email,
        });

        alert("Payment Successful!");
        onSuccess();
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment processing failed. Please check backend integration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
        <CardElement options={{ style: { base: { fontSize: "15px", color: "#1e293b" } } }} />
      </div>

      {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition disabled:opacity-50 flex items-center gap-2"
        >
          <CreditCard size={16} />
          {loading ? "Processing..." : `Pay $${appointment.consultationFee || appointment.fee || 50}`}
        </button>
      </div>
    </form>
  );
}

export default function CheckoutModal({ appointment, onClose, onSuccess }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-150">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-slate-900 mb-1">Complete Payment</h2>
        <p className="text-xs text-slate-500 mb-6">
          Doctor: <span className="font-semibold text-slate-800">{appointment.doctorName || appointment.doctor?.doctorName}</span> | Fee: <span className="font-semibold text-teal-600">${appointment.consultationFee || appointment.fee || 50}</span>
        </p>

        <Elements stripe={stripePromise}>
          <CheckoutForm appointment={appointment} onSuccess={onSuccess} onClose={onClose} />
        </Elements>
      </div>
    </div>
  );
}