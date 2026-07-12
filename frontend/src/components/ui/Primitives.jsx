import React from "react";

export function Pill({ children, className = "", style }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}

export function IconCircle({ Icon, className = "", size = 20 }) {
  return (
    <div className={`flex items-center justify-center rounded-full ${className}`}>
      <Icon size={size} />
    </div>
  );
}
