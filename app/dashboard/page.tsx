"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Plus,
  MoreHorizontal,
  Filter,
  Calendar,
  Loader2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const complianceTrendData = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 72 },
  { month: "Mar", score: 68 },
  { month: "Apr", score: 78 },
  { month: "May", score: 85 },
  { month: "Jun", score: 88 },
];

export default function DashboardPage() {
  const supabase = createClient();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const orgId = (user as any)?.user_metadata?.organization_id;

      let query = supabase
        .from("audit_sessions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (orgId) {
        query = query.eq("organization_id", orgId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching dashboard data:", error);
        setSessions([]);
      } else {
        setSessions(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  const kpis = [
    {
      label: "Total Audits",
      value: sessions.length.toString(),
      change: "+12.5%",
      increasing: true,
      icon: BarChart3,
      color: "blue",
      gradient: "from-blue-500/10 to-indigo-500/10",
    },
    {
      label: "Avg. Progress",
      value:
        sessions.length > 0
          ? `${Math.round(
              sessions.reduce((acc, s) => acc + (s.progress || 0), 0) /
                sessions.length
            )}%`
          : "0%",
      change: "+4.1%",
      increasing: true,
      icon: CheckCircle2,
      color: "emerald",
      gradient: "from-emerald-500/10 to-teal-500/10",
    },
    {
      label: "Open Sessions",
      value: sessions
        .filter((s) => s.status !== "Completed")
        .length.toString()
        .padStart(2, "0"),
      change: "-2 issues",
      increasing: false,
      icon: AlertCircle,
      color: "rose",
      gradient: "from-rose-500/10 to-orange-500/10",
    },
    {
      label: "Team Activity",
      value: "Active",
      change: "+18%",
      increasing: true,
      icon: TrendingUp,
      color: "violet",
      gradient: "from-violet-500/10 to-purple-500/10",
    },
  ];

  const auditComparisonData = [
    {
      name: "Completed",
      value: sessions.filter((s) => s.status === "Completed").length || 1,
    },
    {
      name: "In Progress",
      value: sessions.filter((s) => s.status === "In Progress").length || 1,
    },
    {
      name: "Pending",
      value: sessions.filter((s) => s.status === "Pending").length || 1,
    },
  ];

  const handleDeleteSession = async (id: string) => {
    toast.warning("Delete Audit Session?", {
      description:
        "Are you sure you want to delete this audit session? This will remove all associated responses.",
      action: {
        label: "Confirm Delete",
        onClick: async () => {
          try {
            const { error } = await supabase
              .from("audit_sessions")
              .delete()
              .eq("id", id);

            if (error) throw error;

            toast.success("Audit session deleted successfully");
            setSessions(sessions.filter((s) => s.id !== id));
          } catch (error) {
            toast.error("Failed to delete session");
          }
        },
      },
    });
  };

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Workspace Overview
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"
                />
              ))}
            </div>
            <p className="text-sm font-bold text-slate-400">
              <span className="text-blue-600">8 team members</span> active now
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-12 px-6 rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </Button>
          <Link href="/dashboard/templates">
            <Button className="h-12 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xl shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95">
              <Plus className="w-5 h-5" />
              Initiate New Audit
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <Card
            key={idx}
            className="relative p-7 border-none shadow-sm bg-white overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 rounded-4xl"
          >
            <div
              className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${kpi.gradient} blur-2xl rounded-full translate-x-12 -translate-y-12 opacity-50 group-hover:scale-150 transition-transform duration-700`}
            />

            <div className="relative z-10 flex flex-col h-full">
              <div
                className={`w-12 h-12 rounded-2xl bg-${kpi.color}-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-${kpi.color}-500/10`}
              >
                <kpi.icon className={`w-6 h-6 text-${kpi.color}-600`} />
              </div>

              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-1">
                {kpi.label}
              </p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
                  {kpi.value}
                </h3>
                <div
                  className={`flex items-center gap-1 pb-1 text-emerald-600`}
                >
                  {kpi.increasing ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowDown className="w-3 h-3" />
                  )}
                  <span className="text-xs font-black">{kpi.change}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Stats Section */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Compliance Trend Chart */}
        <Card className="lg:col-span-8 p-10 border-none shadow-sm bg-white rounded-4xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Compliance Trajectory
              </h3>
              <p className="text-sm font-bold text-slate-400 leading-relaxed">
                Performance monitoring across all sectors
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
              <div className="w-3 h-3 rounded-full bg-blue-600" />
              <span>Standard Goal</span>
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={complianceTrendData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                  dx={-10}
                />
                <Tooltip
                  cursor={{
                    stroke: "#2563eb",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "16px",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    padding: "12px",
                  }}
                  itemStyle={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "12px",
                  }}
                  labelStyle={{
                    color: "#94a3b8",
                    fontWeight: 800,
                    fontSize: "10px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Audit Status Distribution */}
        <Card className="lg:col-span-4 p-10 border-none shadow-sm bg-white rounded-4xl flex flex-col">
          <div className="mb-10">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Audit Distribution
            </h3>
            <p className="text-sm font-bold text-slate-400">
              Lifecycle status breakdown
            </p>
          </div>

          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={auditComparisonData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 10,
                    fontWeight: 800,
                  }}
                  dy={10}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "16px",
                    padding: "12px",
                  }}
                  itemStyle={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "12px",
                  }}
                  labelStyle={{ display: "none" }}
                />
                <Bar
                  dataKey="value"
                  fill="#2563eb"
                  radius={[12, 12, 12, 12]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-slate-50 rounded-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Efficiency
              </p>
              <p className="text-lg font-black text-slate-900">94%</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                MTTR
              </p>
              <p className="text-lg font-black text-slate-900">2.4d</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Audits Table */}
      <Card className="border-none shadow-sm bg-white overflow-hidden rounded-4xl">
        <div className="px-10 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Operational Ledger
            </h3>
            <p className="text-sm font-bold text-slate-400">
              Real-time audit session tracking
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="h-10 px-4 rounded-xl border-slate-100 text-slate-600 font-bold text-xs flex items-center gap-2"
            >
              <Filter className="w-3 h-3" />
              Filter
            </Button>
            <Link href="/dashboard/audits">
              <Button
                variant="ghost"
                className="h-10 px-4 rounded-xl text-blue-600 font-black text-xs uppercase tracking-widest hover:bg-blue-50"
              >
                View All Records
              </Button>
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                Updating Ledger...
              </p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-slate-400 font-bold">
                No active sessions found.
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Audit Profile
                  </th>
                  <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Department
                  </th>
                  <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Session Status
                  </th>
                  <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Schedule
                  </th>
                  <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Assignee
                  </th>
                  <th className="px-10 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Manage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sessions.map((audit) => (
                  <tr
                    key={audit.id}
                    className="group hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-10 py-6">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {audit.template_name}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                        ID: {audit.id.slice(0, 8).toUpperCase()}
                      </p>
                    </td>
                    <td className="px-10 py-6 text-sm font-bold text-slate-500">
                      {audit.department}
                    </td>
                    <td className="px-10 py-6">
                      <span
                        className={`inline-flex px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${getStatusColor(
                          audit.status
                        )}`}
                      >
                        {audit.status}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-300" />
                        {new Date(audit.due_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 border border-white shadow-sm">
                          {audit.auditor_name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </div>
                        <span className="text-sm font-bold text-slate-500">
                          {audit.auditor_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/execute/${audit.id}`} target="_blank">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-4 rounded-xl border-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-50 hover:text-blue-600 transition-all"
                          >
                            {audit.status === "Completed"
                              ? "Review"
                              : "Continue"}
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSession(audit.id)}
                          className="h-9 w-9 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-10 py-6 bg-slate-50/30 border-t border-slate-50 flex items-center justify-center">
          <Link href="/dashboard/audits">
            <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
              View All Records
            </button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
