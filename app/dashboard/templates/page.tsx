"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  MoreVertical,
  Search,
  Filter,
  ShieldCheck,
  HardHat,
  Landmark,
  Lock,
  Globe,
  Users,
  PenSquare,
  Play,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const templates = [
  {
    id: 1,
    name: "ISO 9001 Quality Management",
    category: "Quality",
    questions: 45,
    description:
      "Standard quality management audit template for global operations.",
    icon: ShieldCheck,
    color: "blue",
  },
  {
    id: 2,
    name: "Safety & Health Assessment",
    category: "Safety",
    questions: 38,
    description:
      "Comprehensive workplace safety and structural integrity assessment.",
    icon: HardHat,
    color: "amber",
  },
  {
    id: 3,
    name: "Financial Controls Review",
    category: "Finance",
    questions: 52,
    description:
      "Internal financial controls and regulatory compliance assessment.",
    icon: Landmark,
    color: "emerald",
  },
  {
    id: 4,
    name: "Data Security Audit",
    category: "Security",
    questions: 41,
    description:
      "IT infrastructure, protocols and data protection strategy audit.",
    icon: Lock,
    color: "rose",
  },
  {
    id: 5,
    name: "Environmental Compliance",
    category: "Environment",
    questions: 35,
    description:
      "Environmental regulations and footprint compliance assessment.",
    icon: Globe,
    color: "teal",
  },
  {
    id: 6,
    name: "HR Compliance Audit",
    category: "HR",
    questions: 48,
    description: "Human resources policies, ethics and governance audit.",
    icon: Users,
    color: "indigo",
  },
];

export default function TemplatesPage() {
  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Audit Library
          </h1>
          <p className="text-sm font-bold text-slate-400">
            Standardized frameworks for organizational excellence
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/templates/create">
            <Button className="h-12 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xl shadow-slate-200 flex items-center gap-2 transition-all active:scale-95">
              <Plus className="w-5 h-5" />
              Design New Template
            </Button>
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search within library..."
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white border border-slate-100 text-sm font-bold text-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {["All", "Quality", "Safety", "Finance", "Security", "HR"].map(
            (cat) => (
              <button
                key={cat}
                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  cat === "All"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="border-none shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 bg-white group rounded-[2.5rem] flex flex-col overflow-hidden"
          >
            <div className="p-8 flex-1">
              <div className="flex items-start justify-between mb-8">
                <div
                  className={`w-14 h-14 rounded-2xl bg-${template.color}-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <template.icon
                    className={`w-7 h-7 text-${template.color}-600`}
                  />
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black uppercase tracking-[0.2em] text-${template.color}-600`}
                  >
                    {template.category}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-slate-200" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    {template.questions} Modules
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                  {template.name}
                </h3>
                <p className="text-sm font-bold text-slate-400 leading-relaxed line-clamp-2">
                  {template.description}
                </p>
              </div>
            </div>

            <div className="p-8 pt-0 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl border-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <PenSquare className="w-4 h-4" />
                Edit
              </Button>
              <Button className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/10 transition-all flex items-center gap-2">
                <Play className="w-4 h-4 fill-current" />
                Launch
              </Button>
            </div>
          </Card>
        ))}

        {/* Create Card */}
        <button className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center gap-4 group hover:border-blue-300 hover:bg-blue-50/30 transition-all min-h-[300px]">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-white transition-all shadow-sm">
            <Plus className="w-8 h-8 text-slate-400 group-hover:text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-black text-slate-900">Custom Template</p>
            <p className="text-sm font-bold text-slate-400 max-w-[200px] mt-1">
              Design a tailored framework for your needs
            </p>
          </div>
          <div className="mt-2 text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            AI Generator Helper
          </div>
        </button>
      </div>
    </div>
  );
}
