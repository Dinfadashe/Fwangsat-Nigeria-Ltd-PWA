"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

export function AddStaffForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"agent" | "sales_rep">("agent");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/admin/create-staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, phone, password, role }),
    });
    const json = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(json.error ?? "Could not create account.");
      return;
    }
    setOpen(false);
    setFullName("");
    setEmail("");
    setPhone("");
    setPassword("");
    router.refresh();
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary !py-2.5 !px-5 text-sm">
        <UserPlus size={16} /> Add team member
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add a team member">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="label-field">Role</label>
            <div className="flex gap-2">
              {(["agent", "sales_rep"] as const).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 rounded-xl py-2.5 text-sm font-medium border transition-colors ${
                    role === r ? "bg-signal text-ink-950 border-signal" : "border-white/15 text-white/60"
                  }`}
                >
                  {r === "agent" ? "Agent" : "Sales Rep"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label-field">Full name</label>
            <input required className="input-field" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <label className="label-field">Email</label>
            <input required type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label-field">Phone</label>
            <input className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="label-field">Temporary password</label>
            <input required type="text" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? <Loader2 className="animate-spin" size={16} /> : "Create account"}
          </button>
        </form>
      </Modal>
    </>
  );
}
