"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type AuthTab = "login" | "otp" | "reset" | "register";

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNextPath = searchParams.get("next") || "/admin";
  const nextPath =
    rawNextPath.startsWith("/") && !rawNextPath.startsWith("//")
      ? rawNextPath
      : "/admin";
  const supabaseFlowEnabled = process.env.NEXT_PUBLIC_ENABLE_ADMIN_SUPABASE_AUTH === "true";

  const [tab, setTab] = useState<AuthTab>("login");

  // Login state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP state
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Reset password state
  const [resetEmail, setResetEmail] = useState("");

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  // ── Login with username/password ──────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push(nextPath);
      } else {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error || "Invalid credentials. Please try again.");
      }
    } catch {
      setError("Connection error. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Google OAuth ───────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    if (!supabase) {
      setError("Google login is not available in this environment.");
      return;
    }
    clearMessages();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${nextPath}` },
    });
    if (oauthError) setError(oauthError.message);
  };

  // ── OTP – send code ────────────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    if (!supabase) {
      setError("OTP login requires Supabase configuration.");
      setLoading(false);
      return;
    }

    const { error: otpError } = await supabase.auth.signInWithOtp({ email: otpEmail });
    if (otpError) {
      setError(otpError.message);
    } else {
      setOtpSent(true);
      setSuccess("OTP sent! Check your email and enter the 6-digit code below.");
    }
    setLoading(false);
  };

  // ── OTP – verify code ──────────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    if (!supabase) {
      setError("OTP verification requires Supabase configuration.");
      setLoading(false);
      return;
    }

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: otpEmail,
      token: otpCode,
      type: "email",
    });

    if (verifyError) {
      setError(verifyError.message);
    } else {
      router.push(nextPath);
    }
    setLoading(false);
  };

  // ── Reset password ─────────────────────────────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    if (!supabase) {
      setError("Password reset requires Supabase configuration.");
      setLoading(false);
      return;
    }

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/admin/login`,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setSuccess("Reset link sent! Check your email to complete the process.");
    }
    setLoading(false);
  };

  // ── Create account ─────────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    if (!supabase) {
      setError("Account creation requires Supabase configuration.");
      setLoading(false);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email: regEmail,
      password: regPassword,
      options: { data: { full_name: regName } },
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setSuccess("Account created! Please check your email to verify your address, then log in.");
      setTab("login");
    }
    setLoading(false);
  };

  const tabs: { id: AuthTab; label: string; icon: string }[] = supabaseFlowEnabled
    ? [
        { id: "login", label: "Login", icon: "🔐" },
        { id: "otp", label: "OTP", icon: "📱" },
        { id: "reset", label: "Reset", icon: "🔑" },
        { id: "register", label: "Register", icon: "👤" },
      ]
    : [{ id: "login", label: "Login", icon: "🔐" }];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-700 text-2xl font-bold text-white shadow-xl shadow-teal-900/50">
            C
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Clothify Admin</h1>
          <p className="mt-1 text-sm text-slate-400">Secure admin access portal</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-1 backdrop-blur-xl shadow-2xl">
          {/* Tab bar */}
          <div
            className={`grid gap-1 rounded-2xl bg-white/5 p-1 ${
              tabs.length > 1 ? "grid-cols-4" : "grid-cols-1"
            }`}
          >
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => { setTab(t.id); clearMessages(); }}
                className={`rounded-xl py-2 text-xs font-semibold transition-all duration-200 ${
                  tab === t.id
                    ? "bg-teal-600 text-white shadow-lg shadow-teal-900/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="block text-sm">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Error / Success messages */}
            {error && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                ✅ {success}
              </div>
            )}

            {/* ── LOGIN TAB ───────────────────────────────────────────────── */}
            {tab === "login" && (
              <div>
                <div className="mb-5 flex items-center gap-2 text-white">
                  <LockIcon />
                  <h2 className="text-lg font-bold">Admin Login</h2>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <UserIcon />
                      </span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter admin username"
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <KeyIcon />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter admin password"
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-12 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/40 transition hover:from-teal-500 hover:to-cyan-500 disabled:opacity-60"
                  >
                    {loading ? "Signing in…" : "🔐 Sign In"}
                  </button>
                </form>

                {supabaseFlowEnabled ? (
                  <>
                    <div className="my-5 flex items-center gap-3">
                      <div className="h-px flex-1 bg-white/10" />
                      <span className="text-xs text-slate-500">or continue with</span>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      <GoogleIcon />
                      Continue with Google
                    </button>

                    <div className="mt-4 flex justify-between text-xs text-slate-500">
                      <button
                        type="button"
                        onClick={() => { setTab("reset"); clearMessages(); }}
                        className="hover:text-teal-400 transition"
                      >
                        Forgot password?
                      </button>
                      <button
                        type="button"
                        onClick={() => { setTab("register"); clearMessages(); }}
                        className="hover:text-teal-400 transition"
                      >
                        Create account →
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="mt-4 rounded-xl border border-slate-600 bg-slate-900/50 px-4 py-3 text-xs text-slate-300">
                    Username/password admin login is active. Supabase auth methods are disabled.
                    Set <code className="ml-1">NEXT_PUBLIC_ENABLE_ADMIN_SUPABASE_AUTH=true</code> to enable extra methods.
                  </p>
                )}
              </div>
            )}

            {/* ── OTP TAB ─────────────────────────────────────────────────── */}
            {supabaseFlowEnabled && tab === "otp" && (
              <div>
                <div className="mb-5 flex items-center gap-2 text-white">
                  <ShieldIcon />
                  <h2 className="text-lg font-bold">OTP Verification</h2>
                </div>
                <p className="mb-4 text-xs text-slate-400">
                  Enter your email to receive a one-time password. Check your inbox and enter the code below.
                </p>

                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                          <MailIcon />
                        </span>
                        <input
                          type="email"
                          value={otpEmail}
                          onChange={(e) => setOtpEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                          className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/40 transition hover:from-teal-500 hover:to-cyan-500 disabled:opacity-60"
                    >
                      {loading ? "Sending…" : "📱 Send OTP Code"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                        6-Digit OTP Code
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="000000"
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] text-white placeholder-slate-600 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading || otpCode.length < 6}
                      className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/40 transition hover:from-teal-500 hover:to-cyan-500 disabled:opacity-60"
                    >
                      {loading ? "Verifying…" : "✅ Verify Code"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setOtpSent(false); setOtpCode(""); clearMessages(); }}
                      className="w-full text-xs text-slate-500 hover:text-slate-300 transition"
                    >
                      ← Back to send new code
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ── RESET PASSWORD TAB ──────────────────────────────────────── */}
            {supabaseFlowEnabled && tab === "reset" && (
              <div>
                <div className="mb-5 flex items-center gap-2 text-white">
                  <KeyIcon />
                  <h2 className="text-lg font-bold">Reset Password</h2>
                </div>
                <p className="mb-4 text-xs text-slate-400">
                  Enter the email address associated with your account and we&apos;ll send you a password reset link.
                </p>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <MailIcon />
                      </span>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="admin@example.com"
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/40 transition hover:from-teal-500 hover:to-cyan-500 disabled:opacity-60"
                  >
                    {loading ? "Sending…" : "🔑 Send Reset Link"}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => { setTab("login"); clearMessages(); }}
                  className="mt-4 w-full text-center text-xs text-slate-500 hover:text-slate-300 transition"
                >
                  ← Back to Login
                </button>
              </div>
            )}

            {/* ── REGISTER TAB ────────────────────────────────────────────── */}
            {supabaseFlowEnabled && tab === "register" && (
              <div>
                <div className="mb-5 flex items-center gap-2 text-white">
                  <UserIcon />
                  <h2 className="text-lg font-bold">Create Account</h2>
                </div>
                <p className="mb-4 text-xs text-slate-400">
                  Register a new admin account. Your account will be activated after email verification.
                </p>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <UserIcon />
                      </span>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Your full name"
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <MailIcon />
                      </span>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="admin@example.com"
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <KeyIcon />
                      </span>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Create a strong password"
                        required
                        minLength={8}
                        className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/40 transition hover:from-teal-500 hover:to-cyan-500 disabled:opacity-60"
                  >
                    {loading ? "Creating…" : "👤 Create Account"}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => { setTab("login"); clearMessages(); }}
                  className="mt-4 w-full text-center text-xs text-slate-500 hover:text-slate-300 transition"
                >
                  ← Already have an account? Sign in
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Back to store */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <Link href="/" className="hover:text-teal-400 transition">
            ← Back to Clothify Store
          </Link>
        </div>
      </div>
    </div>
  );
}
