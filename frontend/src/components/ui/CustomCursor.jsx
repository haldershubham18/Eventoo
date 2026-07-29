import React, { useEffect, useRef } from "react";

// Custom cursor: a tight dot glued to the pointer, plus a soft ring that
// eases toward it. Both scale up and invert color over any clickable
// element (button, link, [role="button"], input). Disabled automatically
// on touch devices via the CSS in index.css.
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const wrapRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    // Skip entirely on touch/coarse-pointer devices
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const isInteractive = (el) =>
      !!el?.closest?.('a, button, [role="button"], input, textarea, select, label');

    function onMove(e) {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
      const hovering = isInteractive(e.target);
      wrapRef.current?.classList.toggle("cc-hovering", hovering);
    }
    function onDown() {
      wrapRef.current?.classList.add("cc-clicking");
    }
    function onUp() {
      wrapRef.current?.classList.remove("cc-clicking");
    }
    function onLeave() {
      if (wrapRef.current) wrapRef.current.style.opacity = "0";
    }
    function onEnter() {
      if (wrapRef.current) wrapRef.current.style.opacity = "1";
    }

    function tick() {
      ring.current.x += (pos.current.x - ring.current.x) * 0.18;
      ring.current.y += (pos.current.y - ring.current.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`;
      }
      raf.current = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div ref={wrapRef} style={{ opacity: 0, transition: "opacity 0.2s ease" }}>
      <div ref={ringRef} className="cc-ring" />
      <div ref={dotRef} className="cc-dot" />
    </div>
  );
}
