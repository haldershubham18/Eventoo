import React from "react";
import { X, Lock } from "lucide-react";
import { BRAND, BADGE_DEFS, initials } from "../../data/seed";

export default function RewardsOverlay({ leaderboard, myRank, points, badgeState, onClose }) {
  return (
    <div className="fixed inset-0 z-[70] flex justify-center lg:items-center lg:p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative w-full flex flex-col lg:max-w-2xl lg:rounded-3xl lg:shadow-2xl"
        style={{ background: BRAND.paper, maxHeight: "92vh", marginTop: "auto", borderRadius: "28px 28px 0 0" }}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="font-extrabold text-lg font-display" style={{ color: BRAND.ink }}>Rewards</h2>
          <button onClick={onClose} className="p-1"><X size={20} className="text-slate-400" /></button>
        </div>
        <div className="overflow-y-auto px-6 pb-8">
          <div className="rounded-3xl p-5 text-white relative overflow-hidden mb-6" style={{ background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.magenta})` }}>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider opacity-80 font-bold">Your rank</p>
                <p className="text-3xl font-extrabold mt-1">#{myRank}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider opacity-80 font-bold">Points</p>
                <p className="text-3xl font-extrabold mt-1">{points.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div>
              <h3 className="font-bold text-sm mb-3 font-display" style={{ color: BRAND.ink }}>Badges</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {BADGE_DEFS.map((b) => {
                  const unlocked = b.unlocked(badgeState);
                  const Icon = b.Icon;
                  return (
                    <div key={b.id} className={`rounded-2xl p-4 flex flex-col items-center text-center border ${unlocked ? "bg-white" : "bg-slate-50"}`} style={{ borderColor: BRAND.line }}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${unlocked ? "" : "grayscale opacity-50"}`}
                        style={{ background: unlocked ? BRAND.primarySoft : "#E7E7EE", color: unlocked ? BRAND.primary : "#94a3b8" }}>
                        {unlocked ? <Icon size={20} /> : <Lock size={18} />}
                      </div>
                      <p className={`text-xs font-bold ${unlocked ? "" : "text-slate-400"}`} style={unlocked ? { color: BRAND.ink } : {}}>{b.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{b.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm mb-3 font-display" style={{ color: BRAND.ink }}>Leaderboard</h3>
              <div className="space-y-2">
                {leaderboard.map((l, i) => (
                  <div key={l.name} className={`flex items-center gap-3 p-3 rounded-2xl border ${l.isMe ? "" : "bg-white"}`}
                    style={{ borderColor: l.isMe ? BRAND.primary : BRAND.line, background: l.isMe ? BRAND.primarySoft : "#fff" }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs text-white shrink-0"
                      style={{ background: i === 0 ? BRAND.amber : i === 1 ? "#94a3b8" : i === 2 ? "#c2703c" : BRAND.primary }}>
                      {i + 1}
                    </div>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0" style={{ background: BRAND.paperDim, color: BRAND.primary }}>
                      {initials(l.name)}
                    </div>
                    <p className={`flex-1 font-bold text-sm ${l.isMe ? "" : "text-slate-700"}`} style={l.isMe ? { color: BRAND.primary } : {}}>{l.name}</p>
                    <p className="font-extrabold text-sm" style={{ color: BRAND.ink }}>{l.points.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
