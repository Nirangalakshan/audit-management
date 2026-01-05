"use client";

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import LaunchAuditModal from "@/components/dashboard/LaunchAuditModal";

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  version: string;
  is_active: boolean;
  sections: any[];
  created_at: string;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Quality":
      return ShieldCheck;
    case "Safety":
      return HardHat;
    case "Finance":
      return Landmark;
    case "Security":
      return Lock;
    case "Environment":
      return Globe;
    case "HR":
      return Users;
    default:
      return ShieldCheck;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Quality":
      return "blue";
    case "Safety":
      return "amber";
    case "Finance":
      return "emerald";
    case "Security":
      return "rose";
    case "Environment":
      return "teal";
    case "HR":
      return "indigo";
    default:
      return "blue";
  }
};

export default function TemplatesPage() {
  const supabase = createClient();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [launchingTemplate, setLaunchingTemplate] = useState<Template | null>(
    null
  );

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("audit_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      console.error("Error fetching templates:", error);
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "All",
    "Quality",
    "Safety",
    "Finance",
    "Security",
    "Environment",
    "HR",
  ];

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Audit Library
          </h1>
          <p className="text-sm font-bold text-slate-400">
            {templates.length} Standardized frameworks for organizational
            excellence
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white border border-slate-100 text-sm font-bold text-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            Loading frameworks...
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => {
            const Icon = getCategoryIcon(template.category);
            const color = getCategoryColor(template.category);
            const questionCount =
              template.sections?.reduce(
                (acc: number, section: any) =>
                  acc + (section.questions?.length || 0),
                0
              ) || 0;

            return (
              <Card
                key={template.id}
                className="border-none shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 bg-white group rounded-[2.5rem] flex flex-col overflow-hidden"
              >
                <div className="p-8 flex-1">
                  <div className="flex items-start justify-between mb-8">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-${color}-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className={`w-7 h-7 text-${color}-600`} />
                    </div>
                    <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black uppercase tracking-[0.2em] text-${color}-600`}
                      >
                        {template.category}
                      </span>
                      <div className="w-1 h-1 rounded-full bg-slate-200" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        {questionCount} Modules
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
                  <Button
                    onClick={() => setLaunchingTemplate(template)}
                    className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/10 transition-all flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Launch
                  </Button>
                </div>
              </Card>
            );
          })}

          {/* Create Card */}
          <Link href="/dashboard/templates/create">
            <button className="w-full h-full border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center gap-4 group hover:border-blue-300 hover:bg-blue-50/30 transition-all min-h-[350px]">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-white transition-all shadow-sm">
                <Plus className="w-8 h-8 text-slate-400 group-hover:text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-black text-slate-900">
                  Custom Template
                </p>
                <p className="text-sm font-bold text-slate-400 max-w-[200px] mt-1">
                  Design a tailored framework for your needs
                </p>
              </div>
              <div className="mt-2 text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                AI Generator Helper
              </div>
            </button>
          </Link>
        </div>
      )}

      {launchingTemplate && (
        <LaunchAuditModal
          template={launchingTemplate}
          onClose={() => setLaunchingTemplate(null)}
        />
      )}
    </div>
  );
}
