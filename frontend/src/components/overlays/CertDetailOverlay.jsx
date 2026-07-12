import React from "react";
import { X, ShieldCheck, Download, Share2 } from "lucide-react";
import { BRAND, CATEGORY_STYLE } from "../../data/seed";
import { Pill } from "../ui/Primitives";

export default function CertDetailOverlay({ cert, onClose, showToast }) {
  const st = CATEGORY_STYLE[cert.category] || CATEGORY_STYLE.Workshop;
  const Icon = st.Icon;
  return (
    <div className="fixed inset-0 z-[70] flex justify-center lg:items-center lg:p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full self-end lg:self-auto lg:max-w-md rounded-t-3xl lg:rounded-3xl p-6 lg:shadow-2xl" style={{ background: BRAND.paper }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold text-lg font-display" style={{ color: BRAND.ink }}>Certificate details</h2>
          <button onClick={onClose} className="p-1"><X size={20} className="text-slate-400" /></button>
        </div>
        <div className={`rounded-2xl h-36 flex items-center justify-center mb-4 ${st.bg}`}>
          <Icon size={48} className={st.text} />
        </div>
        <Pill className={`${st.bg} ${st.text} mb-2`}>{cert.category}</Pill>
        <h3 className="font-extrabold text-lg font-display" style={{ color: BRAND.ink }}>{cert.title}</h3>
        <p className="text-sm text-slate-500">Issued {cert.date}</p>
        <div className="mt-4 p-3 rounded-xl flex items-center gap-2 text-sm" style={{ background: BRAND.paperDim }}>
          <ShieldCheck size={16} style={{ color: BRAND.magenta }} />
          <span className="text-slate-600">Verified by {cert.verifiedBy}</span>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={() => showToast("Downloading certificate (demo)")} className="flex-1 h-12 rounded-xl font-bold text-white flex items-center justify-center gap-2 active:scale-95 transition" style={{ background: BRAND.primary }}>
            <Download size={18} /> Download
          </button>
          <button onClick={() => showToast("Link copied to clipboard")} className="w-12 h-12 rounded-xl border flex items-center justify-center active:scale-95 transition" style={{ borderColor: BRAND.line }}>
            <Share2 size={18} style={{ color: BRAND.primary }} />
          </button>
        </div>
      </div>
    </div>
  );
}
