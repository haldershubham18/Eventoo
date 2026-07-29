import React from "react";
import { BRAND } from "../../data/seed";

export default function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
  rightSlot,
}) {
  return (
    <div>
      <label className="text-xs font-bold text-slate-500 mb-1 block" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          className="w-full h-11 px-3 rounded-xl border text-sm outline-none focus:ring-2 transition"
          style={{ borderColor: error ? "#fda4af" : BRAND.line, background: "#fff" }}
        />
        {rightSlot}
      </div>
      {error && <p className="text-xs font-semibold text-rose-500 mt-1">{error}</p>}
    </div>
  );
}
