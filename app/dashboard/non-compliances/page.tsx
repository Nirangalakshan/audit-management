"use client";

import { useState, useEffect } from "react";
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
  Loader2,
  FileText,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";

interface NCRFinding {
  id: string; // The session ID
  respId: string; // The response ID
  questionId: string;
  issue: string; // The question text
  severity: "High" | "Medium" | "Low";
  status: "Open" | "Resolved";
  assignee: string;
  auditName: string;
  department: string;
  dateFound: string;
  notes?: string;
}

export default function NonCompliancesPage() {
  const supabase = createClient();
  const [findings, setFindings] = useState<NCRFinding[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchFindings();

    // Set up real-time subscription
    const channel = supabase
      .channel("non-compliances-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "audit_sessions",
        },
        () => {
          // Re-fetch findings silently when any change occurs in audit_sessions
          fetchFindings(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchFindings = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const orgId = (user as any)?.user_metadata?.organization_id;

      let query = supabase
        .from("audit_responses")
        .select(
          `
          *,
          audit_sessions (
            template_name,
            auditor_name,
            department,
            created_at,
            audit_templates (
              sections
            )
          )
        `
        )
        .in("status", ["non-compliance", "warning"]);

      if (orgId) {
        query = query.eq("organization_id", orgId);
      }

      const { data: responses, error } = await query;

      if (error) throw error;

      const allFindings: NCRFinding[] = [];

      responses?.forEach((resp: any) => {
        const session = resp.audit_sessions;
        const template = session?.audit_templates;

        // Find question text in template sections
        let questionText = "Question text not found";
        template?.sections?.forEach((s: any) => {
          const q = s.questions?.find((q: any) => q.id === resp.question_id);
          if (q) questionText = q.text;
        });

        allFindings.push({
          id: resp.session_id,
          respId: resp.id,
          questionId: resp.question_id,
          issue: questionText,
          severity: resp.status === "non-compliance" ? "High" : "Medium",
          status: resp.resolution_status === "resolved" ? "Resolved" : "Open",
          assignee: session?.auditor_name || "Unknown",
          auditName: session?.template_name || "Unknown Audit",
          department: session?.department || "Unknown Department",
          dateFound: resp.created_at,
          notes: resp.notes,
        } as any);
      });

      setFindings(allFindings);
    } catch (error: any) {
      console.error("Error fetching findings:", error);
      toast.error("Failed to load non-compliances");
    } finally {
      setLoading(false);
    }
  };

  const toggleResolution = async (finding: NCRFinding) => {
    const newStatus = finding.status === "Open" ? "resolved" : "open";
    try {
      const { error } = await supabase
        .from("audit_responses")
        .update({ resolution_status: newStatus })
        .eq("id", finding.respId);

      if (error) throw error;

      toast.success(`Marked as ${newStatus}`);
      setFindings(
        findings.map((f) =>
          f.respId === finding.respId
            ? { ...f, status: newStatus === "resolved" ? "Resolved" : "Open" }
            : f
        )
      );
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const filteredFindings = findings.filter((finding) => {
    const matchesSearch =
      finding.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      finding.auditName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus ? finding.status === filterStatus : true;

    return matchesSearch && matchesStatus;
  });

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
      case "Open":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Non-Compliance Hub
          </h1>
          <p className="text-sm font-bold text-slate-400">
            Real-time tracking of failed audit points across organization
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            label: "Open Findings",
            value: findings
              .filter((f) => f.status === "Open")
              .length.toString()
              .padStart(2, "0"),
            icon: ShieldAlert,
            color: "rose",
          },
          {
            label: "Total findings",
            value: findings.length.toString().padStart(2, "0"),
            icon: FileText,
            color: "blue",
          },
          {
            label: "Resolution Rate",
            value:
              findings.length > 0
                ? `${Math.round(
                    (findings.filter((f) => f.status === "Resolved").length /
                      findings.length) *
                      100
                  )}%`
                : "0%",
            icon: CheckCircle2,
            color: "emerald",
          },
        ].map((stat, idx) => (
          <Card
            key={idx}
            className="p-8 border-none shadow-sm bg-white rounded-4xl flex items-center gap-6"
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
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
                {stat.value}
              </h3>
            </div>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <Card className="p-6 border-none shadow-sm bg-white rounded-4xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search issues or audit context..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-xl bg-slate-50 border-none text-sm font-bold text-slate-600 focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="h-8 w-px bg-slate-100 hidden lg:block" />
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Filter Status:
              </span>
              <div className="flex gap-2">
                {["Open", "Resolved"].map((status) => (
                  <button
                    key={status}
                    onClick={() =>
                      setFilterStatus(filterStatus === status ? null : status)
                    }
                    className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
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
        </div>
      </Card>

      {/* Findings List */}
      <Card className="border-none shadow-sm bg-white overflow-hidden rounded-[2.5rem]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              Scanning audit records...
            </p>
          </div>
        ) : filteredFindings.length === 0 ? (
          <div className="p-20 text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-100 mx-auto mb-6" />
            <h3 className="text-lg font-black text-slate-900">
              Zero Non-Compliances
            </h3>
            <p className="text-sm font-bold text-slate-400 mt-2">
              All scanned audit controls are currently compliant.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Finding Details
                  </th>
                  <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Context
                  </th>
                  <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Identified By
                  </th>
                  <th className="px-10 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Manage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredFindings.map((finding: any, idx) => (
                  <tr
                    key={`${finding.id}-${idx}`}
                    className="group hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-10 py-6 max-w-lg">
                      <div className="flex items-start gap-4">
                        <div
                          className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${
                            finding.severity === "High"
                              ? "bg-rose-500 animate-pulse"
                              : "bg-amber-500"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900 leading-relaxed group-hover:text-blue-600 transition-colors">
                            {finding.issue}
                          </p>
                          {finding.notes && (
                            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 italic text-slate-500 text-xs">
                              "{finding.notes}"
                            </div>
                          )}
                          <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">
                            Ref: NCR-{finding.id.slice(0, 4)} • Discovered{" "}
                            {new Date(finding.dateFound).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          {finding.auditName}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {finding.department}
                        </p>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span
                        className={`inline-flex px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${getStatusColor(
                          finding.status
                        )}`}
                      >
                        {finding.status}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 border border-white uppercase">
                          {finding.assignee
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </div>
                        <span className="text-xs font-bold text-slate-600">
                          {finding.assignee}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleResolution(finding)}
                          className={`h-9 px-4 rounded-xl font-bold text-xs transition-all ${
                            finding.status === "Resolved"
                              ? "border-emerald-100 text-emerald-600 hover:bg-emerald-50"
                              : "border-slate-100 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {finding.status === "Resolved"
                            ? "Re-open"
                            : "Mark Resolved"}
                        </Button>
                        <Link href={`/execute/${finding.id}`} target="_blank">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl text-slate-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
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
  );
}
