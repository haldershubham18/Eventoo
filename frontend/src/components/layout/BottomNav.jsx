import React from "react";
import { Home, CalendarDays, ScanLine, Award, User } from "lucide-react";
import { BRAND } from "../../data/seed";

const ITEMS = [
  { key: "home", icon: Home, label: "Home" },
  { key: "events", icon: CalendarDays, label: "Events" },
  { key: "attendance", icon: ScanLine, label: "Attendance" },
  { key: "certificates", icon: Award, label: "Certs" },
  { key: "profile", icon: User, label: "Profile" },
];

export default function BottomNav({ tab, setTab }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center py-2 border-t backdrop-blur lg:hidden"
      style={{ borderColor: BRAND.line, background: "rgba(250,248,255,0.95)" }}
    >
      {ITEMS.map(({ key, icon: Icon, label }) => {
        const active = tab === key;
        return (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`tab-hover-bottom flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full active:scale-90 ${active ? "" : "text-slate-400"}`}
            style={active ? { background: BRAND.primarySoft, color: BRAND.primary } : {}}
          >
            <Icon size={20} />
            <span className="text-[10px] font-semibold">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
