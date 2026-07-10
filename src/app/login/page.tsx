"use client";
import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { SITE } from "@/lib/constants";

function LoginForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setLoading(false);
      setError("Incorrect email or password.");
      return;
    }
    window.location.href = params.get("next") || "/admin";
  }

  return (
    <div className="min-h-screen bg-ink-950 bg-mesh-emerald relative flex items-center justify-center px-5">
      <div className="absolute inset-0 bg-grid-lines bg-grid opacity-40 pointer-events-none" />
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Back to site
      </Link>
      <div className="relative w-full max-w-md glass-panel p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <span className="h-14 w-14 rounded-2xl bg-white/95 grid place-items-center mb-4">
            <Image src="/logo-icon.png" alt={SITE.name} width={38} height={38} className="object-contain" />
          </span>
          <h1 className="font-display text-xl font-semibold text-white">Staff sign in</h1>
          <p className="text-sm text-white/45 mt-1">Admin · Agent · Sales Rep access</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="login-email" className="label-field">Email</label>
            <input
              id="login-email"
              required
              type="email"
              autoComplete="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@fwangsatventures.com"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="label-field">Password</label>
            <div className="relative">
              <input
                id="login-password"
                required
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="input-field pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff size={17} aria-hidden="true" />
                ) : (
                  <Eye size={17} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : "Sign in"}
          </button>
        </form>
        <p className="text-xs text-white/35 text-center mt-6">
          Accounts are created by an administrator. Contact {SITE.phone} for access.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}