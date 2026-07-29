import React from "react";
import { Rocket } from "lucide-react";
import { BRAND } from "../../data/seed";

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-10"
      style={{ background: `linear-gradient(180deg, ${BRAND.paperDim}, #EDE6F9)` }}
    >
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg mb-3"
            style={{ background: BRAND.primary }}
          >
            <Rocket size={22} />
          </div>
          <span
            className="font-extrabold font-display text-2xl tracking-tight"
            style={{ color: BRAND.primary }}
          >
            CampusConnect
          </span>
        </div>

        <div
          className="rounded-3xl p-6 sm:p-8 shadow-xl border"
          style={{ background: BRAND.paper, borderColor: BRAND.line }}
        >
          <h1 className="font-extrabold text-xl font-display mb-1" style={{ color: BRAND.ink }}>
            {title}
          </h1>
          {subtitle && <p className="text-sm text-slate-500 mb-6">{subtitle}</p>}
          {children}
        </div>

        {footer && <div className="text-center mt-5 text-sm text-slate-500">{footer}</div>}
      </div>
    </div>
  );
}
