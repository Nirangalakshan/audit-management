"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Calendar,
  BarChart3,
  FileCheck,
  ClipboardList,
  LineChart,
  ChevronRight,
  FileDown,
  Search,
  Filter,
} from "lucide-react";

const completedAudits = [
  {
    id: 1,
    name: "Q2 Compliance Audit",
    date: "Jun 15, 2025",
    organization: "Manufacturing Dept",
    complianceScore: 88,
    status: "Completed",
  },
  {
    id: 2,
    name: "Data Security Audit",
    date: "Jun 10, 2025",
    organization: "IT Department",
    complianceScore: 92,
    status: "Completed",
  },
  {
    id: 3,
    name: "Financial Controls Review",
    date: "Jun 05, 2025",
    organization: "Finance Team",
    complianceScore: 78,
    status: "Completed",
  },
  {
    id: 4,
    name: "Quality Management Audit",
    date: "May 28, 2025",
    organization: "Quality Assurance",
    complianceScore: 95,
    status: "Completed",
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Analytics Center
          </h1>
          <p className="text-sm font-bold text-slate-400">
            Transform raw audit data into actionable business intelligence
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="h-12 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xl shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95">
            <FileDown className="w-5 h-5" />
            Export Raw Data
          </Button>
        </div>
      </div>

      {/* Report Templates */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            Intelligence Blueprints
          </h3>
          <div className="h-px bg-slate-100 flex-1" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Compliance Summary",
              description:
                "High-level overview of compliance status across all audits",
              icon: BarChart3,
              color: "blue",
            },
            {
              title: "NCR Action Plan",
              description:
                "Detailed list of issues with corrective actions and timelines",
              icon: FileCheck,
              color: "emerald",
            },
            {
              title: "Audit Evidence",
              description:
                "Comprehensive report with supporting evidence and findings",
              icon: ClipboardList,
              color: "amber",
            },
            {
              title: "Trend Analysis",
              description:
                "Historical compliance trends and improvement metrics",
              icon: LineChart,
              color: "violet",
            },
          ].map((template, idx) => (
            <Card
              key={idx}
              className="p-8 border-none shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 bg-white group rounded-4xl flex flex-col"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-${template.color}-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <template.icon
                  className={`w-7 h-7 text-${template.color}-600`}
                />
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                {template.title}
              </h4>
              <p className="text-xs font-bold text-slate-400 leading-relaxed mb-8 flex-1">
                {template.description}
              </p>
              <Button className="w-full h-10 rounded-xl bg-slate-50 hover:bg-blue-600 text-slate-600 hover:text-white font-bold text-xs uppercase tracking-widest transition-all">
                Config & Build
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Audit Reports Table */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            Publication Ledger
          </h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Find session report..."
                className="h-10 pl-10 pr-4 rounded-xl bg-white border border-slate-100 text-xs font-bold text-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <Button
              variant="outline"
              className="h-10 px-4 rounded-xl border-slate-100 text-slate-500 font-bold text-xs flex items-center gap-2"
            >
              <Filter className="w-3.5 h-3.5" />
              Period
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-sm bg-white overflow-hidden rounded-4xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Formal Identity
                  </th>
                  <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Organization
                  </th>
                  <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Issue Date
                  </th>
                  <th className="px-10 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Efficiency Score
                  </th>
                  <th className="px-10 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Download
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {completedAudits.map((audit) => (
                  <tr
                    key={audit.id}
                    className="group hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-10 py-6">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {audit.name}
                      </p>
                      <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">
                        PDF • 2.4 MB
                      </p>
                    </td>
                    <td className="px-10 py-6 text-sm font-bold text-slate-500">
                      {audit.organization}
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-300" />
                        {audit.date}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col items-center gap-2">
                        <span
                          className={`text-lg font-black ${
                            audit.complianceScore >= 85
                              ? "text-emerald-500"
                              : audit.complianceScore >= 75
                              ? "text-blue-500"
                              : "text-rose-500"
                          }`}
                        >
                          {audit.complianceScore}%
                        </span>
                        <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              audit.complianceScore >= 85
                                ? "bg-emerald-500"
                                : audit.complianceScore >= 75
                                ? "bg-blue-500"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${audit.complianceScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-4 rounded-xl border-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-50 hover:text-blue-600 transition-all flex items-center gap-2"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Get Report
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-8 bg-slate-50/30 text-center">
            <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
              Access Archives
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
