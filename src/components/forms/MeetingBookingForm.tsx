"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function MeetingBookingForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [topic, setTopic] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const supabase = createClient();
    const { error: insertError } = await supabase.from("meetings").insert({
      full_name: name,
      phone,
      email: email || null,
      preferred_date: date,
      preferred_time: time || null,
      topic: topic || null,
    });
    setSubmitting(false);
    if (insertError) {
      setError("Something went wrong. Please try again.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="glass-panel p-10 flex flex-col items-center text-center gap-3">
        <CheckCircle2 className="text-signal" size={44} />
        <h2 className="font-display text-xl font-semibold text-white">Meeting request received</h2>
        <p className="text-white/50 text-sm max-w-md">
          Our team will call {phone} to confirm your appointment for {date}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 md:p-8 flex flex-col gap-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="label-field">Full name</label>
          <input required className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="label-field">Phone number</label>
          <input required type="tel" className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="label-field">Email (optional)</label>
          <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label-field">Preferred date</label>
          <input required type="date" className="input-field" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className="label-field">Preferred time</label>
          <input type="time" className="input-field" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="label-field">What would you like to discuss?</label>
          <textarea rows={3} className="input-field resize-none" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Investing in a build-to-sell property" />
        </div>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? <Loader2 className="animate-spin" size={16} /> : "Request meeting"}
      </button>
    </form>
  );
}
