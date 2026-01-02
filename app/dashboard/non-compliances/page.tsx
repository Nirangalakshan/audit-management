"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Filter,
  Plus,
  Search,
  Calendar,
  User,
  MoreHorizontal,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface NonCompliance {
  id: number;
  issue: string;
  severity: "Low" | "Medium" | "High";
  dueDateDays: number;
  dueDate: string;
  status: "Open" | "In Progress" | "Resolved";
  assignee: string;
  audit: string;
}

const nonCompliances: NonCompliance[] = [
  {
    id: 1,
    issue: "Missing documentation for safety procedures",
    severity: "High",
    dueDateDays: 5,
    dueDate: "Jun 25, 2025",
    status: "Open",
    assignee: "Jane Smith",
    audit: "Safety & Health Assessment",
  },
  {
    id: 2,
    issue: "Inadequate training records",
    severity: "High",
    dueDateDays: 8,
    dueDate: "Jun 28, 2025",
    status: "In Progress",
    assignee: "Mike Johnson",
    audit: "ISO 9001 Internal Audit",
  },
  {
    id: 3,
    issue: "Financial control process needs review",
    severity: "Medium",
    dueDateDays: 12,
    dueDate: "Jul 02, 2025",
    status: "Open",
    assignee: "Sarah Wilson",
    audit: "Financial Controls Review",
  },
  {
    id: 4,
    issue: "Backup procedures not tested",
    severity: "High",
    dueDateDays: 3,
    dueDate: "Jun 23, 2025",
    status: "In Progress",
    assignee: "Tom Brown",
    audit: "Data Security Audit",
  },
  {
    id: 5,
    issue: "Employee handbook outdated",
    severity: "Low",
    dueDateDays: 20,
    dueDate: "Jul 10, 2025",
    status: "Open",
    assignee: "Lisa Anderson",
    audit: "HR Compliance Audit",
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "High":
      return "bg-rose-50 text-rose-700 border-rose-100";
    case "Medium":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "Low":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    default:
      return "bg-slate-50 text-slate-700 border-slate-100";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Resolved":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "In Progress":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "Open":
      return "bg-rose-50 text-rose-700 border-rose-100";
    default:
      return "bg-slate-50 text-slate-700 border-slate-100";
  }
};

export default function NonCompliancesPage() {
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredItems = nonCompliances.filter((item) => {
    if (filterSeverity && item.severity !== filterSeverity) return false;
    if (filterStatus && item.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Resolution Hub
          </h1>
          <p className="text-sm font-bold text-slate-400">
            Track and manage non-compliances and corrective actions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="h-12 px-8 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xl shadow-rose-500/20 flex items-center gap-2 transition-all active:scale-95">
            <Plus className="w-5 h-5" />
            Report New Finding
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Active Findings",
            value: "12",
            icon: ShieldAlert,
            color: "rose",
            gradient: "from-rose-500/10 to-transparent",
          },
          {
            label: "High Priority",
            value: "03",
            icon: AlertCircle,
            color: "orange",
            gradient: "from-orange-500/10 to-transparent",
          },
          {
            label: "Resolved Month",
            value: "28",
            icon: CheckCircle2,
            color: "emerald",
            gradient: "from-emerald-500/10 to-transparent",
          },
          {
            label: "Avg. Resolution",
            value: "4.2d",
            icon: Clock,
            color: "blue",
            gradient: "from-blue-500/10 to-transparent",
          },
        ].map((stat, idx) => (
          <Card
            key={idx}
            className="relative p-6 border-none shadow-sm bg-white overflow-hidden rounded-3xl group"
          >
            <div
              className={`absolute inset-0 bg-linear-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />
            <div className="relative z-10">
              <div
                className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center mb-4`}
              >
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                {stat.label}
              </p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
                {stat.value}
              </h3>
            </div>
          </Card>
        ))}
      </div>

      {/* Toolbar & Filters */}
      <Card className="p-6 border-none shadow-sm bg-white rounded-4xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search findings ID or description..."
                className="w-full h-11 pl-11 pr-4 rounded-xl bg-slate-50 border-none text-sm font-bold text-slate-600 focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="h-8 w-px bg-slate-100 hidden lg:block" />
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Severity:
              </span>
              <div className="flex gap-2">
                {["High", "Medium", "Low"].map((severity) => (
                  <button
                    key={severity}
                    onClick={() =>
                      setFilterSeverity(
                        filterSeverity === severity ? null : severity
                      )
                    }
                    className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      filterSeverity === severity
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50"
                    }`}
                  >
                    {severity}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Status:
            </span>
            <div className="flex gap-2 text-nowrap overflow-x-auto scrollbar-hide">
              {["Open", "In Progress", "Resolved"].map((status) => (
                <button
                  key={status}
                  onClick={() =>
                    setFilterStatus(filterStatus === status ? null : status)
                  }
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    filterStatus === status
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Issues List */}
      <Card className="border-none shadow-sm bg-white overflow-hidden rounded-[2.5rem]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Finding Details
                </th>
                <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Severity
                </th>
                <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Critical Dates
                </th>
                <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Assignee
                </th>
                <th className="px-10 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredItems.map((issue) => (
                <tr
                  key={issue.id}
                  className="group hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-10 py-6 max-w-md">
                    <div className="flex items-start gap-4">
                      <div
                        className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                          issue.severity === "High"
                            ? "bg-rose-500 animate-pulse"
                            : "bg-slate-300"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-relaxed group-hover:text-blue-600 transition-colors">
                          {issue.issue}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                          Ref: NCR-{issue.id.toString().padStart(4, "0")} •{" "}
                          {issue.audit}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span
                      className={`inline-flex px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${getSeverityColor(
                        issue.severity
                      )}`}
                    >
                      {issue.severity}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <span
                      className={`inline-flex px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${getStatusColor(
                        issue.status
                      )}`}
                    >
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {issue.dueDate}
                      </div>
                      <p
                        className={`text-[10px] font-black uppercase tracking-widest ${
                          issue.dueDateDays <= 5
                            ? "text-rose-600"
                            : "text-slate-400"
                        }`}
                      >
                        {issue.dueDateDays} days remaining
                      </p>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 border border-white">
                        {issue.assignee
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="text-sm font-bold text-slate-500">
                        {issue.assignee}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="h-9 px-4 rounded-xl border border-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all flex items-center gap-2">
                        View Details
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
