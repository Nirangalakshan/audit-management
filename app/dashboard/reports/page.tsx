"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Calendar,
  BarChart3,
  FileCheck,
  ClipboardList,
  LineChart,
  Search,
  Filter,
  Sparkles,
  Loader2,
  X,
  FileText,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { jsPDF } from "jspdf";

interface AuditSession {
  id: string;
  template_name: string;
  created_at: string;
  department: string;
  status: string;
  auditor_name: string;
  progress: number;
  compliance_score?: number;
}

export default function ReportsPage() {
  const supabase = createClient();
  const [sessions, setSessions] = useState<AuditSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportContent, setReportContent] = useState("");
  const [selectedAuditName, setSelectedAuditName] = useState("");

  useEffect(() => {
    fetchCompletedSessions();
  }, []);

  const fetchCompletedSessions = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const orgId = (user as any)?.user_metadata?.organization_id;

      let query = supabase
        .from("audit_sessions")
        .select("*")
        .eq("status", "Completed")
        .order("created_at", { ascending: false });

      if (orgId) {
        query = query.eq("organization_id", orgId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching reports:", error);
        toast.error("Failed to fetch reports");
      } else {
        setSessions(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (session: AuditSession) => {
    try {
      setGeneratingId(session.id);

      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate report");
      }

      setReportContent(data.report);
      setSelectedAuditName(session.template_name);
      setReportModalOpen(true);
      toast.success("AI Report Generated Successfully");
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(error.message || "Failed to generate report");
    } finally {
      setGeneratingId(null);
    }
  };

  // Helper to format markdown-like text to simple HTML elements
  const formatReportText = (text: string) => {
    if (!text) return null;
    return text.split("\n").map((line, i) => {
      if (line.trim().startsWith("### ")) {
        return (
          <h3 key={i} className="text-lg font-bold text-slate-800 mt-4 mb-2">
            {line.replace("### ", "")}
          </h3>
        );
      }
      if (line.trim().startsWith("## ")) {
        return (
          <h2
            key={i}
            className="text-xl font-black text-slate-900 mt-6 mb-3 border-b border-slate-100 pb-2"
          >
            {line.replace("## ", "")}
          </h2>
        );
      }
      if (line.trim().startsWith("**") && line.trim().endsWith("**")) {
        return (
          <p key={i} className="font-bold text-slate-900 mb-2 mt-4">
            {line.replace(/\*\*/g, "")}
          </p>
        );
      }
      if (line.trim().startsWith("- ")) {
        return (
          <div key={i} className="flex gap-2 ml-2 mb-2">
            <span className="text-blue-500 font-bold">•</span>
            <p className="text-slate-600 leading-relaxed text-sm">
              {line.replace("- ", "").replace(/\*\*/g, "")}
            </p>
          </div>
        );
      }
      if (line.trim() === "") return <br key={i} />;

      // Handle Bold text within paragraph
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className="text-slate-600 mb-2 leading-relaxed text-sm">
          {parts.map((part, j) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={j} className="text-slate-900 font-bold">
                  {part.replace(/\*\*/g, "")}
                </strong>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  const handleExportReport = () => {
    const doc = new jsPDF();
    doc.text(reportContent, 10, 10);
    doc.save(`${selectedAuditName}.pdf`);
  };

  return (
    <div className="space-y-12 pb-20 relative">
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
            <FileText className="w-5 h-5" />
            Export Raw Data
          </Button>
        </div>
      </div>

      {/* Report Templates shortcuts */}
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
          ].map((template, idx) => {
            const Icon = template.icon;
            return (
              <Card
                key={idx}
                className="p-8 border-none shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 bg-white group rounded-4xl flex flex-col"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-${template.color}-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-7 h-7 text-${template.color}-600`} />
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
            );
          })}
        </div>
      </div>

      {/* Audit Reports Table */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            Completed Audit Reports
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

        <Card className="border-none shadow-sm bg-white overflow-hidden rounded-4xl min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                Loading Reports...
              </p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center">
                <FileText className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-400 font-bold">
                No completed audits found.
              </p>
              <p className="text-xs text-slate-300 max-w-xs">
                Complete an audit in the Registry to generate reports.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Audit Identity
                    </th>
                    <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Organization
                    </th>
                    <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Completed Date
                    </th>
                    <th className="px-10 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-10 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Actions
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
                        <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">
                          ID: {audit.id.slice(0, 8)}
                        </p>
                      </td>
                      <td className="px-10 py-6 text-sm font-bold text-slate-500">
                        {audit.department}
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-300" />
                          {new Date(audit.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <span className="inline-flex px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                          Completed
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            onClick={() => handleGenerateReport(audit)}
                            disabled={generatingId === audit.id}
                            className="h-9 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-lg shadow-violet-500/20 active:scale-95 transition-all flex items-center gap-2"
                          >
                            {generatingId === audit.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Sparkles className="w-3.5 h-3.5" />
                            )}
                            AI Report
                          </Button>
                          <Button
                            onClick={handleExportReport}
                            variant="outline"
                            size="sm"
                            title="Coming Soon"
                            className="h-9 px-4 rounded-xl border-slate-100 text-slate-300 font-bold text-xs flex items-center gap-2"
                          >
                            <Download className="w-3.5 h-3.5" />
                            PDF
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {selectedAuditName}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    AI Generated Insight Report
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReportModalOpen(false)}
                className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-10 bg-slate-50/30">
              <div className="max-w-3xl mx-auto space-y-2">
                {formatReportText(reportContent)}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 z-10">
              <Button
                variant="ghost"
                onClick={() => setReportModalOpen(false)}
                className="rounded-xl font-bold text-slate-500 hover:text-slate-700"
              >
                Close Preview
              </Button>
              {/* Placeholder for future PDF export */}
              <Button
                onClick={handleExportReport}
                className="rounded-xl bg-slate-100 text-slate-300 font-bold"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
