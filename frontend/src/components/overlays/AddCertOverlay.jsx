import React, { useState } from "react";
import { X, UploadCloud } from "lucide-react";
import { BRAND, CATEGORY_STYLE } from "../../data/seed";

export default function AddCertOverlay({ onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [cat, setCat] = useState("Workshop");
  const [date, setDate] = useState("");

  return (
    <div className="fixed inset-0 z-[70] flex justify-center lg:items-center lg:p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full lg:max-w-md self-end lg:self-auto rounded-t-3xl lg:rounded-3xl p-6 lg:shadow-2xl" style={{ background: BRAND.paper }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold text-lg font-display" style={{ color: BRAND.ink }}>Add certificate</h2>
          <button onClick={onClose} className="p-1"><X size={20} className="text-slate-400" /></button>
        </div>
        <div className="border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-2 mb-4" style={{ borderColor: BRAND.line }}>
          <UploadCloud size={28} style={{ color: BRAND.primary }} />
          <p className="text-sm font-semibold text-slate-600">Click to upload (demo)</p>
          <p className="text-xs text-slate-400">PDF, PNG, JPG</p>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">Event title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Google UX Design" className="w-full h-11 px-3 rounded-xl border text-sm outline-none focus:ring-2" style={{ borderColor: BRAND.line }} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">Category</label>
            <select value={cat} onChange={(e) => setCat(e.target.value)} className="w-full h-11 px-3 rounded-xl border text-sm outline-none" style={{ borderColor: BRAND.line }}>
              {Object.keys(CATEGORY_STYLE).map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">Date</label>
            <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="e.g. Nov 2024" className="w-full h-11 px-3 rounded-xl border text-sm outline-none focus:ring-2" style={{ borderColor: BRAND.line }} />
          </div>
        </div>
        <button
          onClick={() => title.trim() && date.trim() && onSubmit(title, cat, date)}
          disabled={!title.trim() || !date.trim()}
          className="w-full h-12 rounded-xl font-bold text-white mt-5 disabled:opacity-40 active:scale-[0.98] transition"
          style={{ background: BRAND.primary }}
        >
          Submit for verification
        </button>
      </div>
    </div>
  );
}
