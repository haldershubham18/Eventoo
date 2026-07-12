import React from "react";
import { Award, Plus, ShieldCheck } from "lucide-react";
import { BRAND, CATEGORY_STYLE } from "../../data/seed";
import { Pill } from "../ui/Primitives";
import { EmptyState } from "../ui/Blocks";

export default function CertificatesTab({ certificates, onOpenCert, onAdd }) {
  return (
    <div className="px-4 lg:px-8 pt-4 lg:pt-8 space-y-4 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold font-display" style={{ color: BRAND.ink }}>Certificates</h1>
          <p className="text-sm text-slate-500">{certificates.length} earned so far</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {certificates.map((c) => {
          const st = CATEGORY_STYLE[c.category] || CATEGORY_STYLE.Workshop;
          const Icon = st.Icon;
          return (
            <button key={c.id} onClick={() => onOpenCert(c)} className="rounded-2xl border bg-white overflow-hidden text-left active:scale-[0.98] transition shadow-sm hover:shadow-md" style={{ borderColor: BRAND.line }}>
              <div className={`h-20 flex items-center justify-center ${st.bg}`}>
                <Award size={30} className={st.text} />
              </div>
              <div className="p-3">
                <Pill className={`${st.bg} ${st.text} mb-2`}>{c.category}</Pill>
                <p className="font-bold text-xs leading-snug line-clamp-2" style={{ color: BRAND.ink }}>{c.title}</p>
                <p className="text-[10px] text-slate-400 mt-1">{c.date}</p>
                {c.external ? (
                  <p className="text-[10px] font-bold mt-1 text-amber-600">Pending verification</p>
                ) : (
                  <p className="text-[10px] font-bold mt-1 flex items-center gap-1" style={{ color: BRAND.magenta }}><ShieldCheck size={10} /> Verified</p>
                )}
              </div>
            </button>
          );
        })}

        <button onClick={onAdd} className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 p-6 min-h-[168px] active:scale-[0.98] transition hover:bg-violet-50" style={{ borderColor: BRAND.line }}>
          <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: BRAND.primarySoft, color: BRAND.primary }}>
            <Plus size={22} />
          </div>
          <p className="text-xs font-bold text-center text-slate-500">Add external certificate</p>
        </button>
      </div>

      {certificates.length === 0 && (
        <EmptyState text="Attend certificate-eligible events to start earning." />
      )}
    </div>
  );
}
