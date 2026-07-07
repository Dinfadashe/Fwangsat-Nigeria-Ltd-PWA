import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNaira(amount: number | null | undefined): string {
  const value = amount ?? 0;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(n: number | null | undefined): string {
  return new Intl.NumberFormat("en-NG").format(n ?? 0);
}

export function formatDate(date: string | Date | null | undefined, opts?: Intl.DateTimeFormatOptions): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...opts,
  }).format(new Date(date));
}

export function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

/** Returns countdown parts for a rented property's remaining tenancy. */
export function getRentCountdown(rentEndsAt: string | null) {
  if (!rentEndsAt) return null;
  const end = new Date(rentEndsAt).getTime();
  const now = Date.now();
  const diffMs = end - now;
  const isExpired = diffMs <= 0;
  const totalDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;
  return { totalDays, months, days, isExpired };
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SW-${year}-${rand}`;
}

export function bytesToMB(bytes: number): number {
  return Math.round((bytes / (1024 * 1024)) * 10) / 10;
}

export const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50MB per brief
