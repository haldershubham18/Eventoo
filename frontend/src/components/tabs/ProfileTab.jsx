import React from "react";
import { Trophy, ChevronRight, Award, User, Bell, Settings, HelpCircle, LogOut } from "lucide-react";
import { BRAND, initials } from "../../data/seed";
import { IconCircle } from "../ui/Primitives";
import { StatBlock, EmptyState, SettingsRow } from "../ui/Blocks";

export default function ProfileTab({ user, points, registeredCount, attendedCount, certificates, pointsLog, subTab, setSubTab, onOpenCert, onOpenRewards, onSignOut }) {
  const displayName = user?.name || "Jordan Rivera";
  const displayInitials = initials(displayName);

  return (
    <div className="px-4 lg:px-8 pt-4 lg:pt-8 pb-6">
      <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8 lg:items-start">
        {/* Left summary card */}
        <div className="space-y-5">
          <div className="rounded-3xl p-6 flex flex-col items-center text-center" style={{ background: BRAND.paperDim }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-extrabold shadow-lg" style={{ background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.magenta})` }}>
              {displayInitials}
            </div>
            <h2 className="font-extrabold text-lg mt-3 font-display" style={{ color: BRAND.ink }}>{displayName}</h2>
            <p className="text-xs text-slate-400 font-semibold tracking-wide">{user?.email || "ID: 2024-CC-8819"}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <StatBlock label="Registered" value={registeredCount} />
            <StatBlock label="Attended" value={attendedCount} />
            <StatBlock label="Points" value={points} />
          </div>

          <button onClick={onOpenRewards} className="w-full flex items-center gap-3 p-4 rounded-2xl border bg-white active:scale-[0.99] transition hover:shadow-sm" style={{ borderColor: BRAND.line }}>
            <IconCircle Icon={Trophy} className="w-11 h-11 bg-amber-100 text-amber-600" />
            <div className="flex-1 text-left">
              <p className="font-bold text-sm" style={{ color: BRAND.ink }}>Rewards & leaderboard</p>
              <p className="text-xs text-slate-500">See your rank and badges</p>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </button>

          {/* Sign out lives here on desktop too (sidebar also has it, this stays for parity on narrower desktop widths) */}
          <button onClick={onSignOut} className="hidden lg:flex w-full items-center justify-center gap-2 p-3.5 rounded-2xl font-bold bg-rose-50 text-rose-600 active:scale-[0.98] transition">
            <LogOut size={16} /> Sign out
          </button>
        </div>

        {/* Right: sub tabs */}
        <div className="mt-6 lg:mt-0 space-y-4">
          <div className="flex gap-2">
            {["certificates", "points", "settings"].map((t) => (
              <button
                key={t}
                onClick={() => setSubTab(t)}
                className={`tab-hover-pill px-4 py-1.5 rounded-full text-xs font-bold capitalize ${subTab === t ? "text-white" : "text-slate-600 bg-white border"}`}
                style={subTab === t ? { background: BRAND.primary } : { borderColor: BRAND.line }}
              >
                {t === "points" ? "Points history" : t}
              </button>
            ))}
          </div>

          {subTab === "certificates" && (
            <div className="space-y-2 lg:grid lg:grid-cols-2 lg:gap-2 lg:space-y-0">
              {certificates.length === 0 && <EmptyState text="No certificates yet." />}
              {certificates.map((c) => (
                <button key={c.id} onClick={() => onOpenCert(c)} className="w-full flex items-center gap-3 p-3 rounded-2xl border bg-white text-left active:scale-[0.99] transition hover:shadow-sm" style={{ borderColor: BRAND.line }}>
                  <IconCircle Icon={Award} className="w-10 h-10 bg-violet-100 text-violet-700" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color: BRAND.ink }}>{c.title}</p>
                    <p className="text-xs text-slate-500">{c.date}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-400" />
                </button>
              ))}
            </div>
          )}

          {subTab === "points" && (
            <div className="space-y-2">
              {pointsLog.slice().reverse().map((p, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-2xl border bg-white" style={{ borderColor: BRAND.line }}>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: BRAND.ink }}>{p.label}</p>
                    <p className="text-xs text-slate-400">{p.date}</p>
                  </div>
                  <p className="font-extrabold text-sm" style={{ color: BRAND.magenta }}>+{p.points}</p>
                </div>
              ))}
            </div>
          )}

          {subTab === "settings" && (
            <div className="space-y-2">
              <SettingsRow Icon={User} label="Account information" />
              <SettingsRow Icon={Bell} label="Notification preferences" />
              <SettingsRow Icon={Settings} label="Privacy & security" />
              <SettingsRow Icon={HelpCircle} label="Help & support" />
              <button onClick={onSignOut} className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl font-bold bg-rose-50 text-rose-600 mt-4 active:scale-[0.98] transition lg:hidden">
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
