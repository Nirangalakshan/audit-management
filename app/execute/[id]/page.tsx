"use client";

import { useState, useEffect, use } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Upload,
  ClipboardList,
  ShieldAlert,
  PanelRightClose,
  ChevronRight,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  text: string;
  type: "yes-no" | "text" | "score" | "file";
  section: string;
}

interface AuditSession {
  id: string;
  template_name: string;
  department: string;
  status: string;
  auditor_name: string;
  responses: Record<string, any>;
  progress: number;
}

export default function AuditorExecutionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();

  const [session, setSession] = useState<AuditSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showFindings, setShowFindings] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: sessionData, error: sErr } = await supabase
        .from("audit_sessions")
        .select("*")
        .eq("id", id)
        .single();

      if (sErr) throw sErr;

      // Fetch existing responses from the new dedicated table
      const { data: respData, error: rErr } = await supabase
        .from("audit_responses")
        .select("*")
        .eq("session_id", id);

      if (rErr) throw rErr;

      const { data: tData, error: tErr } = await supabase
        .from("audit_templates")
        .select("*")
        .eq("id", sessionData.template_id)
        .single();

      if (tErr) throw tErr;

      const allQs: Question[] = [];
      tData.sections?.forEach((s: any) => {
        s.questions?.forEach((q: any) => {
          allQs.push({ ...q, section: s.name });
        });
      });

      // Convert array of responses to a dictionary for the UI
      const responsesDict: Record<string, any> = {};
      respData?.forEach((r) => {
        responsesDict[r.question_id] = { status: r.status, notes: r.notes };
      });

      setSession({ ...sessionData, responses: responsesDict });
      setQuestions(allQs);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load audit session");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateResponse = async (qId: string, updates: any) => {
    if (!session) return;
    const currentResponse = session.responses[qId] || {};
    const merged = { ...currentResponse, ...updates };
    const newResponses = { ...session.responses, [qId]: merged };

    // Calculate progress based on local memory for speed
    const answeredCount = Object.values(newResponses).filter(
      (r: any) => r.status
    ).length;
    const progress = Math.round((answeredCount / questions.length) * 100);

    setSession({ ...session, responses: newResponses, progress });

    try {
      // 1. Save to dedicated responses table (source of truth)
      await supabase.from("audit_responses").upsert(
        {
          session_id: id,
          question_id: qId,
          status: merged.status,
          notes: merged.notes,
          organization_id: (session as any).organization_id,
        },
        { onConflict: "session_id,question_id" }
      );

      // 2. Keep the main session progress updated
      await supabase
        .from("audit_sessions")
        .update({
          progress,
          status: progress === 100 ? "Completed" : "In Progress",
        })
        .eq("id", id);
    } catch (e) {
      console.error("Save error", e);
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await supabase
        .from("audit_sessions")
        .update({
          status: "Completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", id);
      toast.success("Audit submitted successfully!");
      setSession((prev) => (prev ? { ...prev, status: "Completed" } : null));
    } catch (e) {
      toast.error("Submission failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
          Initializing Assessment Interface...
        </p>
      </div>
    );

  if (!session)
    return <div className="p-20 text-center font-bold">Session not found</div>;

  const isReadOnly = session.status === "Completed";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col min-w-screen">
      <header className="bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
              {session.template_name}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {session.department}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="bg-blue-50 px-4 py-2 rounded-xl">
            <span className="text-sm font-black text-blue-600">
              {session?.progress || 0}%
            </span>
          </div>

          <button
            onClick={() => setShowFindings(!showFindings)}
            className={`relative p-2.5 rounded-xl transition-all ${
              showFindings
                ? "bg-rose-600 text-white shadow-lg shadow-rose-200"
                : "bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
            }`}
          >
            <ShieldAlert className="w-5 h-5" />
            {(session?.responses
              ? Object.values(session.responses)
              : []
            ).filter((r: any) => r.status === "non-compliance").length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center">
                {
                  Object.values(session?.responses || {}).filter(
                    (r: any) => r.status === "non-compliance"
                  ).length
                }
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <main
          className={`flex-1 overflow-y-auto transition-all duration-500 ${
            showFindings ? "mr-0" : ""
          }`}
        >
          <div className="max-w-7xl mx-auto p-10 pb-32 space-y-12">
            <div className="flex flex-col gap-2 mb-10 text-center">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">
                {isReadOnly
                  ? "Audit Results (Review Mode)"
                  : "Active Assessment"}
              </span>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Quality & Safety Checklist
              </h1>
              <p className="text-sm font-bold text-slate-400 text-center">
                {isReadOnly
                  ? "This audit is completed and locked for records. Inputs are disabled."
                  : "Evaluate each module below. Changes are saved automatically."}
              </p>
            </div>

            {questions.map((q, qIdx) => {
              const response = session.responses[q.id] || {};
              return (
                <div key={q.id} id={`q-${qIdx}`} className="scroll-mt-32">
                  <Card className="w-full p-8 md:p-12 border-none shadow-sm bg-white rounded-[2.5rem] relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                    <div
                      className={`absolute top-0 left-0 w-2 h-full transition-colors duration-500 ${
                        response.status === "compliance"
                          ? "bg-emerald-500"
                          : response.status === "warning"
                          ? "bg-amber-500"
                          : response.status === "non-compliance"
                          ? "bg-rose-500"
                          : "bg-slate-100"
                      }`}
                    />

                    <div className="flex flex-col lg:flex-row gap-10">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-6">
                          <span className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xs font-black text-slate-400 border border-slate-100">
                            {qIdx + 1}
                          </span>
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                            {q.section}
                          </span>
                        </div>

                        <h3 className="text-2xl font-black text-slate-900 mb-8 leading-tight">
                          {q.text}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {[
                            {
                              id: "compliance",
                              label: "Compliance",
                              icon: CheckCircle2,
                              color: "emerald",
                            },
                            {
                              id: "warning",
                              label: "Warning",
                              icon: AlertTriangle,
                              color: "amber",
                            },
                            {
                              id: "non-compliance",
                              label: "Non-Compliance",
                              icon: ShieldAlert,
                              color: "rose",
                            },
                          ].map((s) => (
                            <button
                              key={s.id}
                              disabled={isReadOnly}
                              onClick={() =>
                                handleUpdateResponse(q.id, { status: s.id })
                              }
                              className={`h-14 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest transition-all ${
                                response.status === s.id
                                  ? `bg-${s.color}-600 text-white shadow-lg shadow-${s.color}-200 scale-[1.02]`
                                  : isReadOnly
                                  ? "bg-slate-50 text-slate-200 cursor-not-allowed"
                                  : `bg-slate-50 text-slate-400 hover:bg-${s.color}-50 hover:text-${s.color}-600 hover:border-${s.color}-100 border border-transparent`
                              }`}
                            >
                              <s.icon className="w-4 h-4" />
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="lg:w-80 flex flex-col gap-4">
                        <div className="relative group/textarea">
                          <div className="absolute top-4 left-4">
                            <MessageSquare className="w-4 h-4 text-slate-300 group-focus-within/textarea:text-blue-500 transition-colors" />
                          </div>
                          <textarea
                            value={response.notes || ""}
                            disabled={isReadOnly}
                            onChange={(e) =>
                              handleUpdateResponse(q.id, {
                                notes: e.target.value,
                              })
                            }
                            placeholder={
                              isReadOnly
                                ? "No notes recorded."
                                : "Add findings, notes or observations..."
                            }
                            className={`w-full h-40 rounded-3xl p-6 pl-12 text-sm font-bold border-none transition-all resize-none ${
                              isReadOnly
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-slate-50 text-slate-600 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500"
                            }`}
                          />
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                            <Upload className="w-4 h-4 text-slate-400" />
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Evidence Attachment
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}

            {/* Final Submit Area (Hidden in Review mode) */}
            {!isReadOnly && (
              <div className="pt-20 border-t border-slate-100 flex flex-col items-center">
                <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-blue-500/10 text-center max-w-md w-full border border-slate-50">
                  <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <ClipboardList className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">
                    Complete Assessment
                  </h3>
                  <p className="text-sm font-bold text-slate-400 mb-10 leading-relaxed">
                    You have completed{" "}
                    <span className="text-blue-600">{session.progress}%</span>{" "}
                    of the checklist. Review all findings before submission.
                  </p>
                  <Button
                    onClick={handleFinish}
                    disabled={saving || session.progress < 100}
                    className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-xl disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none transition-all"
                  >
                    {saving ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      "Finalize Checklist"
                    )}
                  </Button>
                  {session.progress < 100 && (
                    <p className="mt-4 text-[10px] font-black text-rose-400 uppercase tracking-widest">
                      Complete all modules to enable
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>

        <aside
          className={`bg-white border-l border-slate-100 transition-all duration-500 ease-in-out flex flex-col ${
            showFindings ? "w-96" : "w-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                Findings Tracker
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Active Issues
              </p>
            </div>
            <button
              onClick={() => setShowFindings(false)}
              className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <PanelRightClose className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {Object.entries(session?.responses || {})
              .filter(
                ([_, r]) =>
                  r.status === "non-compliance" || r.status === "warning"
              )
              .map(([qId]) => {
                const question = questions.find((q) => q.id === qId);
                const qIndex = questions.findIndex((q) => q.id === qId);
                const response = session?.responses[qId];
                return (
                  <button
                    key={qId}
                    onClick={() => {
                      const element = document.getElementById(`q-${qIndex}`);
                      element?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`w-full p-4 rounded-2xl text-left group transition-all border ${
                      response.status === "non-compliance"
                        ? "bg-rose-50 border-rose-100 hover:bg-rose-100"
                        : "bg-amber-50 border-amber-100 hover:bg-amber-100"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest ${
                          response.status === "non-compliance"
                            ? "text-rose-600"
                            : "text-amber-600"
                        }`}
                      >
                        Module {qIndex + 1} • {response.status}
                      </span>
                      <ChevronRight className="w-3 h-3 text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-xs font-bold text-slate-900 leading-relaxed">
                      {question?.text}
                    </p>
                  </button>
                );
              })}

            {Object.values(session?.responses || {}).filter(
              (r: any) =>
                r.status === "non-compliance" || r.status === "warning"
            ).length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-40">
                <CheckCircle2 className="w-12 h-12 text-slate-200 mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  No issues found
                </p>
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Risk assessment
              </span>
              <span className="text-xs font-black text-rose-600">
                -
                {Object.values(session?.responses || {}).filter(
                  (r: any) => r.status === "non-compliance"
                ).length * 10}
                %
              </span>
            </div>
            <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full transition-all duration-500"
                style={{
                  width: `${
                    (Object.values(session?.responses || {}).filter(
                      (r: any) => r.status === "non-compliance"
                    ).length /
                      (questions.length || 1)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </aside>
      </div>

      <footer className="p-6 text-center bg-white border-t border-slate-50 z-10">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
          Digital Audit Certificate • Managed by AuditFlow Governance Engine
        </p>
      </footer>
    </div>
  );
}
