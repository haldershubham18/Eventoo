import React from "react";
import { ArrowLeft, ShieldCheck, CalendarDays, Clock, MapPin, Users, Check, ChevronRight } from "lucide-react";
import { BRAND, CATEGORY_STYLE } from "../../data/seed";
import { Pill } from "../ui/Primitives";
import { InfoTile } from "../ui/Blocks";

export default function EventDetailOverlay({ ev, isRegistered, onClose, onRegister }) {
  const st = CATEGORY_STYLE[ev.category];
  const Icon = st.Icon;
  return (
    <div className="fixed inset-0 z-[60] flex justify-center lg:items-center lg:p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative w-full flex flex-col lg:max-w-2xl lg:rounded-3xl lg:max-h-[90vh] lg:shadow-2xl overflow-hidden"
        style={{ background: BRAND.paper }}
      >
        <div className={`h-52 lg:h-56 flex items-center justify-center relative shrink-0 ${st.bg}`}>
          <Icon size={64} className={st.text} />
          <button onClick={onClose} className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow active:scale-90 transition">
            <ArrowLeft size={18} style={{ color: BRAND.ink }} />
          </button>
          {ev.certificateEligible && (
            <Pill className="absolute top-4 right-4 bg-white/90" style={{ color: BRAND.magenta }}>
              <ShieldCheck size={12} /> Certificate eligible
            </Pill>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-5 lg:px-8 pt-5 pb-28 lg:pb-8">
          <Pill className={`${st.bg} ${st.text} mb-3`}>{ev.category}</Pill>
          <h1 className="text-2xl font-extrabold font-display leading-tight" style={{ color: BRAND.ink }}>{ev.title}</h1>
          <p className="text-sm text-slate-500 mt-1">{ev.org}</p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
            <InfoTile Icon={CalendarDays} label="Date" value={`${ev.date}`} />
            <InfoTile Icon={Clock} label="Time" value={ev.time} />
            <InfoTile Icon={MapPin} label="Location" value={ev.location} />
            <InfoTile Icon={Users} label="Seats left" value={`${ev.seatsLeft} / ${ev.seatsTotal}`} />
          </div>

          <div className="mt-5 p-4 rounded-2xl flex items-center gap-3" style={{ background: BRAND.paperDim }}>
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold" style={{ background: BRAND.primary }}>
              {ev.organizer.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Organizer</p>
              <p className="font-bold text-sm" style={{ color: BRAND.ink }}>{ev.organizer}</p>
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div>
              <h2 className="font-bold text-sm mt-6 mb-2 font-display" style={{ color: BRAND.ink }}>About this event</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{ev.blurb}</p>
            </div>

            <div>
              <h2 className="font-bold text-sm mt-6 mb-3 font-display" style={{ color: BRAND.ink }}>Schedule</h2>
              <div className="relative pl-5 space-y-4">
                <div className="absolute left-1.5 top-1 bottom-1 w-0.5" style={{ background: BRAND.line }} />
                {ev.schedule.map((s, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[19px] top-1 w-3 h-3 rounded-full" style={{ background: BRAND.primary }} />
                    <p className="text-xs font-bold" style={{ color: BRAND.primary }}>{s.time}</p>
                    <p className="font-bold text-sm mt-0.5" style={{ color: BRAND.ink }}>{s.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute lg:relative bottom-0 left-0 right-0 p-4 lg:p-6 border-t flex items-center gap-3" style={{ background: "rgba(250,248,255,0.97)", borderColor: BRAND.line }}>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Price</p>
            <p className="font-extrabold text-lg" style={{ color: BRAND.ink }}>{ev.fee > 0 ? `$${ev.fee.toFixed(2)}` : "Free"}</p>
          </div>
          {isRegistered ? (
            <button disabled className="flex-1 h-12 rounded-xl font-bold flex items-center justify-center gap-2 bg-emerald-100 text-emerald-700">
              <Check size={18} /> You're registered
            </button>
          ) : (
            <button
              onClick={() => onRegister(ev)}
              className="flex-1 h-12 rounded-xl font-bold text-white flex items-center justify-center gap-2 active:scale-[0.98] transition shadow-lg"
              style={{ background: BRAND.primary }}
            >
              Register now <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
