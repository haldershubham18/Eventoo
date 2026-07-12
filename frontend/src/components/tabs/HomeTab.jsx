import React from "react";
import { ChevronRight, Check, Clock, Trophy, Gift } from "lucide-react";
import { BRAND, CATEGORY_STYLE } from "../../data/seed";
import { Pill, IconCircle } from "../ui/Primitives";
import EventRow from "../ui/EventRow";

export default function HomeTab({ events, points, rank, registeredIds, setCategory, onOpenEvent, onOpenRewards }) {
  const featured = events.filter((e) => e.featured);
  const upcoming = events.slice(0, 4);

  return (
    <div className="px-4 lg:px-8 pt-4 lg:pt-8 pb-6">
      <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:items-start">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between lg:hidden">
            <div>
              <h1 className="text-xl font-extrabold font-display" style={{ color: BRAND.ink }}>Hey, Jordan 👋</h1>
              <p className="text-sm text-slate-500">Here's what's happening this week.</p>
            </div>
          </div>

          {/* Points hero — mobile only, desktop shows it in the sidebar instead */}
          <button
            onClick={onOpenRewards}
            className="w-full text-left rounded-3xl p-5 relative overflow-hidden shadow-lg active:scale-[0.99] transition lg:hidden"
            style={{ background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.magenta})` }}
          >
            <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
            <div className="relative z-10 flex items-center justify-between text-white">
              <div>
                <p className="text-xs uppercase tracking-widest opacity-80 font-semibold">Total points</p>
                <p className="text-4xl font-extrabold mt-1">{points.toLocaleString()}</p>
                <p className="text-xs mt-2 opacity-90 flex items-center gap-1"><Trophy size={12} /> Rank #{rank} on campus</p>
              </div>
              <div className="flex flex-col items-center">
                <IconCircle Icon={Gift} size={22} className="bg-white/20 text-white w-12 h-12" />
                <span className="text-[10px] mt-1 font-semibold opacity-90">View rewards</span>
              </div>
            </div>
          </button>

          {/* Categories */}
          <div>
            <h2 className="font-bold text-sm mb-3 font-display" style={{ color: BRAND.ink }}>Browse categories</h2>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 lg:flex-wrap lg:gap-4">
              {Object.entries(CATEGORY_STYLE).map(([name, style]) => {
                const Icon = style.Icon;
                return (
                  <button
                    key={name}
                    onClick={() => setCategory(name)}
                    className="flex flex-col items-center gap-1.5 shrink-0 active:scale-95 transition"
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${style.bg} ${style.text}`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-[11px] font-medium text-slate-600">{name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-sm font-display" style={{ color: BRAND.ink }}>Featured for you</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x lg:grid lg:grid-cols-3 lg:overflow-visible">
              {featured.map((ev) => {
                const st = CATEGORY_STYLE[ev.category];
                const Icon = st.Icon;
                const registered = registeredIds.includes(ev.id);
                return (
                  <button
                    key={ev.id}
                    onClick={() => onOpenEvent(ev)}
                    className="min-w-[260px] lg:min-w-0 rounded-2xl overflow-hidden border text-left snap-start active:scale-[0.98] transition bg-white shadow-sm hover:shadow-md"
                    style={{ borderColor: BRAND.line }}
                  >
                    <div className={`h-28 flex items-center justify-center relative ${st.bg}`}>
                      <Icon size={40} className={st.text} />
                      {registered && (
                        <span className="absolute top-2 right-2 bg-white/90 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1" style={{ color: BRAND.primary }}>
                          <Check size={11} /> Going
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-sm leading-tight line-clamp-2" style={{ color: BRAND.ink }}>{ev.title}</p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Clock size={12} /> {ev.date} • {ev.time}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Pill className={`${st.bg} ${st.text}`}>{ev.category}</Pill>
                        <span className="text-xs font-bold" style={{ color: BRAND.magenta }}>+{ev.points} pts</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upcoming list */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-sm font-display" style={{ color: BRAND.ink }}>Upcoming this week</h2>
              <button onClick={() => setCategory("All")} className="text-xs font-bold flex items-center gap-0.5" style={{ color: BRAND.primary }}>
                See all <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
              {upcoming.map((ev) => (
                <EventRow key={ev.id} ev={ev} registered={registeredIds.includes(ev.id)} onClick={() => onOpenEvent(ev)} />
              ))}
            </div>
          </div>
        </div>

        {/* Right rail — desktop only */}
        <div className="hidden lg:block space-y-4 sticky top-24">
          <div className="rounded-2xl border bg-white p-5" style={{ borderColor: BRAND.line }}>
            <h3 className="font-bold text-sm font-display mb-1" style={{ color: BRAND.ink }}>Registration deadlines</h3>
            <p className="text-xs text-slate-500 mb-3">Don't miss these closing soon.</p>
            <div className="space-y-2">
              {events
                .filter((e) => e.deadline === "Today" || e.deadline.startsWith("1 ") || e.deadline.startsWith("2 "))
                .slice(0, 3)
                .map((e) => (
                  <button
                    key={e.id}
                    onClick={() => onOpenEvent(e)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-violet-50 transition text-left"
                  >
                    <span className="text-xs font-semibold truncate pr-2" style={{ color: BRAND.ink }}>{e.title}</span>
                    <Pill className="bg-amber-100 text-amber-700 shrink-0">{e.deadline}</Pill>
                  </button>
                ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5" style={{ borderColor: BRAND.line }}>
            <h3 className="font-bold text-sm font-display mb-3" style={{ color: BRAND.ink }}>Quick stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-2xl font-extrabold" style={{ color: BRAND.primary }}>{registeredIds.length}</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Registered</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-extrabold" style={{ color: BRAND.primary }}>#{rank}</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Campus rank</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
