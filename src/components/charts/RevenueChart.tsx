"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export interface MonthlyPoint {
  month: string;
  revenue: number;
  expenses: number;
}

export function RevenueChart({ data, accent = "#C8FF4D" }: { data: MonthlyPoint[]; accent?: string }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ left: -20, right: 10, top: 10 }}>
        <defs>
          <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={accent} stopOpacity={0.35} />
            <stop offset="95%" stopColor={accent} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF5470" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#FF5470" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="month" stroke="rgba(255,255,255,0.35)" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="rgba(255,255,255,0.35)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
        <Tooltip
          contentStyle={{
            background: "#0A1019",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            fontSize: 12,
          }}
          labelStyle={{ color: "white" }}
        />
        <Area type="monotone" dataKey="revenue" stroke={accent} fill="url(#revFill)" strokeWidth={2} />
        <Area type="monotone" dataKey="expenses" stroke="#FF5470" fill="url(#expFill)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
