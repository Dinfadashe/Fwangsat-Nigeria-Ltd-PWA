"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CountdownRingProps {
  /** ISO date the tenancy started */
  startedAt: string;
  /** ISO date the tenancy ends */
  endsAt: string;
  size?: number;
  className?: string;
}

/**
 * The platform's signature element: a live tenancy countdown ring.
 * Every rented unit on the admin dashboard and property card wears one of
 * these — the fraction of the ring still lit is the fraction of the lease
 * still remaining, so the shape itself communicates the number before the
 * label does.
 */
export function CountdownRing({ startedAt, endsAt, size = 96, className }: CountdownRingProps) {
  const { pct, months, days, isExpired } = useMemo(() => {
    const start = new Date(startedAt).getTime();
    const end = new Date(endsAt).getTime();
    const now = Date.now();
    const total = end - start;
    const remaining = Math.max(0, end - now);
    const fraction = total > 0 ? remaining / total : 0;
    const totalDays = Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24)));
    return {
      pct: Math.min(1, Math.max(0, fraction)),
      months: Math.floor(totalDays / 30),
      days: totalDays % 30,
      isExpired: remaining <= 0,
    };
  }, [startedAt, endsAt]);

  const radius = size / 2 - 6;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * pct;
  const color = isExpired ? "#FF5470" : pct < 0.15 ? "#F0B429" : "#C8FF4D";

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={5}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={5}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${circumference}`}
          style={{
            transition: "stroke-dasharray 0.6s ease, stroke 0.6s ease",
            filter: `drop-shadow(0 0 6px ${color}80)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
        {isExpired ? (
          <span className="text-[11px] font-semibold text-danger">ENDED</span>
        ) : (
          <>
            <span className="text-sm font-semibold leading-none text-white">{months}mo</span>
            <span className="text-[10px] text-white/50 leading-none mt-1">{days}d left</span>
          </>
        )}
      </div>
    </div>
  );
}
