import React, { useState } from "react";
import { X, QrCode, CreditCard, Check } from "lucide-react";
import { BRAND } from "../../data/seed";

export default function PaymentOverlay({ ev, onCancel, onPaid }) {
  const [stage, setStage] = useState("form"); // form -> processing -> success
  const [agree, setAgree] = useState(false);

  const pay = () => {
    if (!agree) return;
    setStage("processing");
    setTimeout(() => setStage("success"), 1200);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end lg:items-center justify-center lg:p-6">
      <div className="absolute inset-0 bg-black/50" onClick={stage === "form" ? onCancel : undefined} />
      <div className="relative w-full lg:max-w-md rounded-t-3xl lg:rounded-3xl p-6 lg:shadow-2xl" style={{ background: BRAND.paper }}>
        {stage === "form" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-extrabold text-lg font-display" style={{ color: BRAND.ink }}>Confirm & pay</h2>
              <button onClick={onCancel} className="p-1"><X size={20} className="text-slate-400" /></button>
            </div>
            <div className="rounded-2xl p-4 mb-4" style={{ background: BRAND.paperDim }}>
              <p className="font-bold text-sm" style={{ color: BRAND.ink }}>{ev.title}</p>
              <div className="flex justify-between mt-3 text-sm text-slate-500">
                <span>Event pass</span><span>${ev.fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-1 text-sm text-slate-500">
                <span>Processing fee</span><span>$1.00</span>
              </div>
              <div className="flex justify-between mt-2 pt-2 border-t font-extrabold" style={{ borderColor: BRAND.line, color: BRAND.ink }}>
                <span>Total</span><span>${(ev.fee + 1).toFixed(2)}</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 h-28 rounded-2xl border-2 border-dashed mb-4" style={{ borderColor: BRAND.line, background: "#fff" }}>
              <QrCode size={28} style={{ color: BRAND.primary }} />
              <span className="text-sm text-slate-500 font-medium">Scan to pay via UPI (demo)</span>
            </div>
            <label className="flex items-start gap-2 text-xs text-slate-500 mb-4">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5" />
              I agree to the event terms and refund policy.
            </label>
            <button
              onClick={pay}
              disabled={!agree}
              className="w-full h-12 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40 transition active:scale-[0.98]"
              style={{ background: BRAND.primary }}
            >
              <CreditCard size={18} /> Pay ${(ev.fee + 1).toFixed(2)}
            </button>
          </>
        )}

        {stage === "processing" && (
          <div className="py-14 flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-slate-200 animate-spin" style={{ borderTopColor: BRAND.primary }} />
            <p className="font-semibold text-sm text-slate-500">Processing payment...</p>
          </div>
        )}

        {stage === "success" && (
          <div className="py-8 flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600">
              <Check size={32} />
            </div>
            <p className="font-extrabold text-lg font-display" style={{ color: BRAND.ink }}>Payment verified!</p>
            <p className="text-sm text-slate-500">You're registered for {ev.title}.</p>
            <button onClick={onPaid} className="mt-3 px-6 h-11 rounded-xl font-bold text-white active:scale-95 transition" style={{ background: BRAND.primary }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
