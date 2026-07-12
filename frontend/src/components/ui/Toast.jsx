import React from "react";
import { CheckCircle2 } from "lucide-react";
import { BRAND } from "../../data/seed";

export default function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 bottom-24 lg:bottom-8 z-[80] px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold text-white animate-fadeIn"
      style={{ background: BRAND.ink }}
    >
      <CheckCircle2 size={16} style={{ color: "#8CF2C4" }} />
      {toast}
    </div>
  );
}
