import React from "react";
import { Search, ShieldCheck, MapPin, Check } from "lucide-react";
import { BRAND, CATEGORY_STYLE } from "../../data/seed";
import { Pill } from "../ui/Primitives";

export default function EventsTab({ events, search, setSearch, category, setCategory, categories, registeredIds, onOpenEvent, onRegister }) {
  return (
    <div className="px-4 lg:px-8 pt-4 lg:pt-8 space-y-4 pb-6">
      <h1 className="text-xl font-extrabold font-display" style={{ color: BRAND.ink }}>Discover events</h1>

      <div className="relative lg:hidden">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events or organizers..."
          className="w-full h-11 pl-9 pr-3 rounded-full border text-sm outline-none focus:ring-2"
          style={{ borderColor: BRAND.line, background: "#fff" }}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${category === c ? "text-white" : "text-slate-600 bg-white border"}`}
            style={category === c ? { background: BRAND.primary } : { borderColor: BRAND.line }}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-400 font-semibold">{events.length} event{events.length !== 1 ? "s" : ""} found</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 pb-4">
        {events.map((ev) => {
          const st = CATEGORY_STYLE[ev.category];
          const Icon = st.Icon;
          const registered = registeredIds.includes(ev.id);
          return (
            <div key={ev.id} className="rounded-2xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition flex flex-col" style={{ borderColor: BRAND.line }}>
              <button onClick={() => onOpenEvent(ev)} className="w-full text-left p-4 flex gap-3 flex-1">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${st.bg} ${st.text}`}>
                  <Icon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-sm leading-tight" style={{ color: BRAND.ink }}>{ev.title}</p>
                    {ev.certificateEligible && (
                      <ShieldCheck size={16} style={{ color: BRAND.magenta }} className="shrink-0 mt-0.5" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{ev.date} • {ev.time}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={11} /> {ev.location}</p>
                </div>
              </button>
              <div className="px-4 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                  <span>{ev.fee > 0 ? `$${ev.fee.toFixed(2)}` : "Free"}</span>
                  <span style={{ color: BRAND.magenta }}>+{ev.points} pts</span>
                  <span>{ev.seatsLeft} seats left</span>
                </div>
                {registered ? (
                  <Pill className="bg-emerald-100 text-emerald-700"><Check size={11} /> Going</Pill>
                ) : (
                  <button
                    onClick={() => onRegister(ev)}
                    className="px-4 py-1.5 rounded-full text-xs font-bold text-white active:scale-95 transition"
                    style={{ background: BRAND.primary }}
                  >
                    Register
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {events.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-10 lg:col-span-3">No events match your search.</p>
        )}
      </div>
    </div>
  );
}
