import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { BRAND } from "../../data/seed";
import AuthShell from "./AuthShell";
import FormField from "./FormField";
import { loginUser } from "../../lib/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage({ onLogin, onNavigateSignUp }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
    setFormError("");
  }

  function validate() {
    const next = {};
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!EMAIL_RE.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setFormError("");
    try {
      const session = await loginUser({ email: form.email.trim(), password: form.password });
      onLogin(session);
    } catch (err) {
      setFormError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to keep track of your campus events, points, and certificates."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <button type="button" onClick={onNavigateSignUp} className="font-bold" style={{ color: BRAND.primary }}>
            Sign up
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@campus.edu"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          error={errors.email}
        />
        <FormField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          error={errors.password}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        {formError && (
          <div className="rounded-xl px-3 py-2 text-sm font-semibold bg-rose-50 text-rose-600">{formError}</div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full h-12 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98] transition"
          style={{ background: BRAND.primary }}
        >
          {submitting && <Loader2 size={18} className="animate-spin" />}
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
}
