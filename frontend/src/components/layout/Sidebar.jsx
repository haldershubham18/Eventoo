import React from "react";
import { Home, CalendarDays, ScanLine, Award, User, Rocket, Trophy, LogOut } from "lucide-react";
import { BRAND } from "../../data/seed";

const ITEMS = [
  { key: "home", icon: Home, label: "Home" },
  { key: "events", icon: CalendarDays, label: "Events" },
  { key: "attendance", icon: ScanLine, label: "Attendance" },
  { key: "certificates", icon: Award, label: "Certificates" },
  { key: "profile", icon: User, label: "Profile" },
];

export default function Sidebar({ tab, setTab, points, rank, onOpenRewards, onSignOut }) {
  return (
    <aside
      className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r px-5 py-6"
      style={{ borderColor: BRAND.line, background: "rgba(250,248,255,0.6)" }}
    >
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: BRAND.primary }}>
          <Rocket size={17} />
        </div>
        <span className="font-extrabold font-display text-lg tracking-tight" style={{ color: BRAND.primary }}>
          CampusConnect
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {ITEMS.map(({ key, icon: Icon, label }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="tab-hover-side flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-left"
              style={active ? { background: BRAND.primarySoft, color: BRAND.primary } : { color: "#64748b" }}
            >
              <Icon size={18} />
              {label}
            </button>
          );
        })}
      </nav>

      <button
        onClick={onOpenRewards}
        className="mt-6 w-full text-left rounded-2xl p-4 relative overflow-hidden shadow-md active:scale-[0.99] transition"
        style={{ background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.magenta})` }}
      >
        <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10 blur-xl" />
        <div className="relative z-10 text-white">
          <p className="text-[10px] uppercase tracking-widest opacity-80 font-semibold">Total points</p>
          <p className="text-2xl font-extrabold mt-1">{points.toLocaleString()}</p>
          <p className="text-xs mt-1.5 opacity-90 flex items-center gap-1">
            <Trophy size={11} /> Rank #{rank} &middot; View rewards
          </p>
        </div>
      </button>

      <div className="flex-1" />

      <button
        onClick={onSignOut}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
      >
        <LogOut size={18} />
        Sign out
      </button>
    </aside>
  );
}
