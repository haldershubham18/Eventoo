import React, { useState } from "react";
import { QrCode, ScanLine, Clock, Check } from "lucide-react";
import { BRAND } from "../../data/seed";
import { Pill } from "../ui/Primitives";
import { StatBlock, EmptyState } from "../ui/Blocks";

export default function AttendanceTab({ upcoming, attended, onScan, points, certCount }) {
  const [scanning, setScanning] = useState(false);
  const [justScanned, setJustScanned] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setJustScanned(true);
      onScan();
      setTimeout(() => setJustScanned(false), 1600);
    }, 900);
  };

  return (
    <div className="px-4 lg:px-8 pt-4 lg:pt-8 pb-6">
      <div>
        <h1 className="text-xl font-extrabold font-display" style={{ color: BRAND.ink }}>Check in</h1>
        <p className="text-sm text-slate-500">
          {upcoming.length > 0 ? `Next up: ${upcoming[0].title}` : "No pending check-ins right now."}
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-[320px_1fr] lg:gap-8 lg:mt-6">
        {/* Scanner column */}
        <div className="space-y-5 mt-5 lg:mt-0">
          <div className="relative aspect-square max-w-[280px] mx-auto lg:mx-0 lg:max-w-none rounded-3xl overflow-hidden border-4" style={{ borderColor: BRAND.line, background: BRAND.ink }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[75%] h-[75%] relative">
                <div className="absolute top-0 left-0 w-7 h-7 border-t-4 border-l-4 rounded-tl-md" style={{ borderColor: BRAND.amber }} />
                <div className="absolute top-0 right-0 w-7 h-7 border-t-4 border-r-4 rounded-tr-md" style={{ borderColor: BRAND.amber }} />
                <div className="absolute bottom-0 left-0 w-7 h-7 border-b-4 border-l-4 rounded-bl-md" style={{ borderColor: BRAND.amber }} />
                <div className="absolute bottom-0 right-0 w-7 h-7 border-b-4 border-r-4 rounded-br-md" style={{ borderColor: BRAND.amber }} />
                <QrCode size={110} className="absolute inset-0 m-auto text-white/70" />
                {scanning && (
                  <div className="absolute left-0 right-0 h-1 rounded-full animate-[scan_0.9s_ease-in-out]" style={{ background: BRAND.amber, boxShadow: `0 0 12px ${BRAND.amber}` }} />
                )}
              </div>
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: justScanned ? "#8CF2C4" : BRAND.amber }} />
              {justScanned ? "Checked in!" : scanning ? "Scanning..." : "Ready to scan"}
            </div>
          </div>

          <button
            onClick={handleScan}
            disabled={scanning || upcoming.length === 0}
            className="w-full h-12 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40 active:scale-[0.98] transition shadow-lg"
            style={{ background: BRAND.primary }}
          >
            <ScanLine size={18} /> {upcoming.length === 0 ? "Nothing to check in" : "Simulate QR scan"}
          </button>

          <div className="grid grid-cols-3 gap-3">
            <StatBlock label="Check-ins" value={attended.length} />
            <StatBlock label="Certificates" value={certCount} />
            <StatBlock label="Points" value={points} />
          </div>
        </div>

        {/* Lists column */}
        <div className="space-y-6 mt-6 lg:mt-0">
          <div>
            <h2 className="font-bold text-sm mb-3 font-display" style={{ color: BRAND.ink }}>Awaiting check-in</h2>
            {upcoming.length === 0 ? (
              <EmptyState text="Register for an event to see it here." />
            ) : (
              <div className="space-y-2 lg:grid lg:grid-cols-2 lg:gap-2 lg:space-y-0">
                {upcoming.map((e) => (
                  <div key={e.id} className="flex items-center gap-3 p-3 rounded-2xl border bg-white" style={{ borderColor: BRAND.line }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: BRAND.paperDim, color: BRAND.primary }}>
                      <Clock size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate" style={{ color: BRAND.ink }}>{e.title}</p>
                      <p className="text-xs text-slate-500">{e.date} • {e.location}</p>
                    </div>
                    <Pill className="bg-amber-100 text-amber-700">Pending</Pill>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="font-bold text-sm mb-3 font-display" style={{ color: BRAND.ink }}>Attendance history</h2>
            {attended.length === 0 ? (
              <EmptyState text="Checked-in events will show up here." />
            ) : (
              <div className="space-y-2 lg:grid lg:grid-cols-2 lg:gap-2 lg:space-y-0">
                {attended.map((e) => (
                  <div key={e.id} className="flex items-center gap-3 p-3 rounded-2xl border bg-white" style={{ borderColor: BRAND.line }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600">
                      <Check size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate" style={{ color: BRAND.ink }}>{e.title}</p>
                      <p className="text-xs text-slate-500">{e.date}</p>
                    </div>
                    <span className="text-xs font-bold" style={{ color: BRAND.magenta }}>+{e.points} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
