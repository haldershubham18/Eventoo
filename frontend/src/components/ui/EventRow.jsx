import React from "react";
import { MapPin } from "lucide-react";
import { BRAND, CATEGORY_STYLE } from "../../data/seed";
import { Pill } from "./Primitives";

export default function EventRow({ ev, registered, onClick }) {
  const st = CATEGORY_STYLE[ev.category];
  const Icon = st.Icon;
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white border hover:shadow-md transition active:scale-[0.99] text-left"
      style={{ borderColor: BRAND.line }}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${st.bg} ${st.text}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm truncate" style={{ color: BRAND.ink }}>{ev.title}</p>
        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
          <MapPin size={11} /> {ev.location}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs font-bold text-slate-500">{ev.date.split(",")[0]}</p>
        {registered ? (
          <Pill className="bg-emerald-100 text-emerald-700 mt-1">Going</Pill>
        ) : (
          <p className="text-xs font-bold mt-1" style={{ color: BRAND.magenta }}>+{ev.points} pts</p>
        )}
      </div>
    </button>
  );
}
