"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  LayoutGrid,
  List,
} from "lucide-react";
import Link from "next/link";

const audits = [
  {
    id: 1,
    name: "Q2 Compliance Audit",
    organization: "Manufacturing Dept",
    status: "Completed",
    date: "Jun 15, 2025",
    auditor: "John Doe",
    completionRate: 100,
  },
  {
    id: 2,
    name: "Safety & Health Assessment",
    organization: "Production Facility",
    status: "In Progress",
    date: "Jun 20, 2025",
    auditor: "Jane Smith",
    completionRate: 65,
  },
  {
    id: 3,
    name: "Financial Controls Review",
    organization: "Finance Team",
    status: "In Progress",
    date: "Jun 18, 2025",
    auditor: "Mike Johnson",
    completionRate: 48,
  },
  {
    id: 4,
    name: "ISO 9001 Internal Audit",
    organization: "Quality Assurance",
    status: "Pending",
    date: "Jun 25, 2025",
    auditor: "Sarah Wilson",
    completionRate: 0,
  },
  {
    id: 5,
    name: "Data Security Audit",
    organization: "IT Department",
    status: "Completed",
    date: "Jun 10, 2025",
    auditor: "Tom Brown",
    completionRate: 100,
  },
];

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

export default function AuditsPage() {
  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Audit Registry
          </h1>
          <p className="text-sm font-bold text-slate-400">
            Total of 148 audits managed across 12 departments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/audits/new">
            <Button className="h-12 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xl shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95">
              <Plus className="w-5 h-5" />
              New Audit Session
            </Button>
          </Link>
        </div>
      </div>

      {/* Snapshot Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Active Audits", value: "12", icon: Clock, color: "blue" },
          {
            label: "Completion Rate",
            value: "94.2%",
            icon: CheckCircle2,
            color: "emerald",
          },
          {
            label: "NCR Resolution",
            value: "88%",
            icon: AlertCircle,
            color: "rose",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="p-6 border-none shadow-sm bg-white rounded-3xl flex items-center gap-5"
          >
            <div
              className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center`}
            >
              <stat.icon className={`w-7 h-7 text-${stat.color}-600`} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-4 rounded-3xl shadow-sm border border-slate-50">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by name, ID or auditor..."
              className="w-full h-12 pl-11 pr-4 rounded-2xl bg-slate-50 border-none text-sm font-bold text-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <Button
            variant="outline"
            className="h-12 px-5 rounded-2xl border-slate-100 text-slate-500 font-bold flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Advanced
          </Button>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm text-blue-600">
            <List className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600">
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <Card className="border-none shadow-sm bg-white overflow-hidden rounded-[2.5rem]">
        <div className="overflow-x-auto">
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
                  Operational Status
                </th>
                <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Completion
                </th>
                <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Timeline
                </th>
                <th className="px-10 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Manage
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {audits.map((audit) => (
                <tr
                  key={audit.id}
                  className="group hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {audit.name}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          ID: {audit.id.toString().padStart(4, "0")}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-sm font-bold text-slate-500">
                    {audit.organization}
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
                    <div className="flex flex-col gap-1.5 w-32">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {audit.completionRate}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            audit.completionRate === 100
                              ? "bg-emerald-500"
                              : "bg-blue-600"
                          }`}
                          style={{ width: `${audit.completionRate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-sm font-bold text-slate-500">
                    {audit.date}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <Link href={`/dashboard/audits/${audit.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-4 rounded-xl border-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-50 hover:text-blue-600 transition-all"
                      >
                        {audit.status === "In Progress" ? "Resume" : "Review"}
                      </Button>
                    </Link>
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
