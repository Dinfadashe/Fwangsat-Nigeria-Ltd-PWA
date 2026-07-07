"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ArrowLeft } from "lucide-react";
import { SITE } from "@/lib/constants";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError("Incorrect email or password.");
      return;
    }
    router.push(params.get("next") || "/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-ink-950 bg-mesh-emerald relative flex items-center justify-center px-5">
      <div className="absolute inset-0 bg-grid-lines bg-grid opacity-40 pointer-events-none" />
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} /> Back to site
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
            <label className="label-field">Email</label>
            <input
              required
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@fwangsatventures.com"
            />
          </div>
          <div>
            <label className="label-field">Password</label>
            <input
              required
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Sign in"}
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
