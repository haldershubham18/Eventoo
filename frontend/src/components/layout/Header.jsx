import React, { useState } from "react";
import { Rocket, Search, Bell } from "lucide-react";
import { BRAND } from "../../data/seed";

export default function Header({ onSearchClick, name = "Jordan" }) {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 lg:px-8 h-16 lg:h-20 border-b backdrop-blur"
      style={{ borderColor: BRAND.line, background: "rgba(250,248,255,0.9)" }}
    >
      <div className="flex items-center gap-2 lg:hidden">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: BRAND.primary }}>
          <Rocket size={16} />
        </div>
        <span className="font-extrabold font-display text-lg tracking-tight" style={{ color: BRAND.primary }}>
          CampusConnect
        </span>
      </div>

      {/* Desktop: page greeting instead of repeating the logo (already in sidebar) */}
      <div className="hidden lg:block">
        <p className="font-display font-extrabold text-lg" style={{ color: BRAND.ink }}>
          Welcome back, {name}
        </p>
        <p className="text-xs text-slate-500">Let's see what's happening on campus today.</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden lg:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            onFocus={onSearchClick}
            placeholder="Search events, organizers..."
            className="w-72 h-10 pl-9 pr-3 rounded-full border text-sm outline-none focus:ring-2"
            style={{ borderColor: BRAND.line, background: "#fff" }}
            readOnly
          />
        </div>
        <button
          onClick={onSearchClick}
          className="p-2 rounded-full hover:bg-violet-100 active:scale-95 transition lg:hidden"
          aria-label="Search"
        >
          <Search size={20} style={{ color: BRAND.primary }} />
        </button>
        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="p-2 rounded-full hover:bg-violet-100 active:scale-95 transition relative"
            aria-label="Notifications"
          >
            <Bell size={20} style={{ color: BRAND.primary }} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
          </button>
          {notifOpen && (
            <div
              className="absolute right-0 mt-2 w-72 rounded-2xl shadow-xl border p-3 z-50"
              style={{ background: "#fff", borderColor: BRAND.line }}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">Notifications</p>
              <div className="space-y-2 text-sm">
                <div className="p-2 rounded-xl bg-violet-50">
                  <p className="font-semibold text-slate-800">Seats filling up fast</p>
                  <p className="text-slate-500 text-xs">HackCampus 2024 has 88 seats left.</p>
                </div>
                <div className="p-2 rounded-xl bg-violet-50">
                  <p className="font-semibold text-slate-800">Registration deadline</p>
                  <p className="text-slate-500 text-xs">Web3 Masterclass closes today.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
