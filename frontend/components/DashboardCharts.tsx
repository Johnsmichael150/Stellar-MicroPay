/**
 * components/DashboardCharts.tsx
 * Isolated chart components using Recharts for the Dashboard.
 * Extracted so recharts can be lazily loaded via next/dynamic with { ssr: false },
 * keeping the heavy charting library out of the initial bundle.
 */

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useTranslation } from "@/contexts/I18nContext";

export interface MonthlySpendingData {
  month: string;
  sent: number;
  received: number;
  label?: string;
}

export interface MonthlySpendingChartProps {
  data: MonthlySpendingData[];
  loading: boolean;
  onBarClick: (data: any) => void;
}

export function MonthlySpendingChart({
  data,
  loading,
  onBarClick,
}: MonthlySpendingChartProps) {
  const { t } = useTranslation();

  if (loading && data.length === 0) {
    return (
      <div className="card mb-6 h-[350px] animate-pulse bg-white/[0.03] border-white/10" />
    );
  }

  return (
    <div className="card mb-6 overflow-hidden">
      <h2 className="font-display text-lg font-semibold text-white mb-6">
        {t("dashboard.monthlySpending")}
      </h2>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            onClick={(state: any) =>
              state &&
              state.activePayload &&
              onBarClick(state.activePayload[0].payload)
            }
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickFormatter={(value: any) => `${value}`}
            />
            <Tooltip
              cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
              }}
              itemStyle={{ color: "#38bdf8" }}
            />
            <Bar dataKey="sent" fill="#38bdf8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export interface ThirtyDayVolumeData {
  day: string;
  sent: number;
  received: number;
  [key: string]: any;
}

export interface ThirtyDayVolumeChartProps {
  data: ThirtyDayVolumeData[];
  loading: boolean;
}

export function ThirtyDayVolumeChart({ data, loading }: ThirtyDayVolumeChartProps) {
  const { t } = useTranslation();
  if (loading && data.length === 0) {
    return <div className="card mb-6 h-[280px] animate-pulse bg-white/[0.03] border-white/10" />;
  }
  const visibleData = data.filter((_: any, i: number) => i % 5 === 0 || i === data.length - 1);
  return (
    <div className="card mb-6 overflow-hidden">
      <h2 className="font-display text-lg font-semibold text-white mb-6">{t("dashboard.thirtyDayVolumeTitle")}</h2>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              ticks={visibleData.map((d: any) => d.day)}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
              itemStyle={{ color: "#38bdf8" }}
            />
            <Bar dataKey="sent" fill="#38bdf8" name={t("dashboard.sent")} radius={[3, 3, 0, 0]} />
            <Bar dataKey="received" fill="#34d399" name={t("dashboard.received")} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export interface BalanceHistoryDataPoint {
  date: string;
  balance: number;
  timestamp: number;
}

export interface BalanceHistoryChartProps {
  data: BalanceHistoryDataPoint[];
  loading: boolean;
}

export function BalanceHistoryChart({ data, loading }: BalanceHistoryChartProps) {
  if (loading && data.length === 0) {
    return (
      <div className="card mb-6 h-[350px] animate-pulse bg-white/[0.03] border-white/10" />
    );
  }

  if (data.length < 2) {
    return (
      <div className="card mb-6 overflow-hidden">
        <h2 className="font-display text-lg font-semibold text-white mb-4">
          Balance History (Past 30 Days)
        </h2>
        <div className="flex flex-col items-center justify-center h-[200px] text-center border border-dashed border-white/10 rounded-xl bg-white/[0.02] p-4">
          <p className="text-slate-300 font-medium text-sm">Insufficient history</p>
          <p className="text-slate-500 text-xs mt-1">
            At least 2 payment events in the last 30 days are required to render the balance chart.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-lg font-semibold text-white">
          Balance History (Past 30 Days)
        </h2>
        <span className="text-xs text-stellar-400 font-medium">
          {data.length} payment events
        </span>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickFormatter={(value: any) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
              }}
              formatter={(val: any) => [`${val} XLM`, "Balance"]}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={{ fill: "#38bdf8", r: 3 }}
              activeDot={{ r: 5, fill: "#0284c7" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
