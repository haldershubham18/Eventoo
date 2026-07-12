import React from "react";
import { ChevronRight } from "lucide-react";
import { BRAND } from "../../data/seed";

export function StatBlock({ label, value }) {
  return (
    <div className="rounded-2xl border p-3 text-center bg-white" style={{ borderColor: BRAND.line }}>
      <p className="text-xl font-extrabold" style={{ color: BRAND.primary }}>{value}</p>
      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide mt-0.5">{label}</p>
    </div>
  );
}

export function EmptyState({ text }) {
  return (
    <div className="rounded-2xl border-2 border-dashed p-6 text-center" style={{ borderColor: BRAND.line }}>
      <p className="text-sm text-slate-400">{text}</p>
    </div>
  );
}

export function InfoTile({ Icon, label, value }) {
  return (
    <div className="rounded-xl border p-3" style={{ borderColor: BRAND.line, background: "#fff" }}>
      <Icon size={16} style={{ color: BRAND.primary }} />
      <p className="text-[10px] uppercase font-bold text-slate-400 mt-2 tracking-wide">{label}</p>
      <p className="font-bold text-sm mt-0.5 truncate" style={{ color: BRAND.ink }}>{value}</p>
    </div>
  );
}

export function SettingsRow({ Icon, label }) {
  return (
    <button className="w-full flex items-center gap-3 p-3.5 rounded-2xl border bg-white hover:shadow-sm active:scale-[0.99] transition" style={{ borderColor: BRAND.line }}>
      <Icon size={18} className="text-slate-500" />
      <span className="flex-1 text-left text-sm font-semibold" style={{ color: BRAND.ink }}>{label}</span>
      <ChevronRight size={16} className="text-slate-400" />
    </button>
  );
}
