"use client";

import { useState, useEffect, use } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, ChevronLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
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
  template_id: string;
  template_name: string;
  department: string;
  status: string;
  auditor_name: string;
  due_date: string;
  responses: Record<string, any>;
  progress: number;
}

export default function PerformAuditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const supabase = createClient();
  const [session, setSession] = useState<AuditSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAuditData();
    }
  }, [id]);

  const fetchAuditData = async () => {
    try {
      setLoading(true);
      // Fetch session
      const { data: sessionData, error: sessionError } = await supabase
        .from("audit_sessions")
        .select("*")
        .eq("id", id)
        .single();

      if (sessionError) throw sessionError;

      // Fetch template for questions
      const { data: templateData, error: templateError } = await supabase
        .from("audit_templates")
        .select("*")
        .eq("id", sessionData.template_id)
        .single();

      if (templateError) throw templateError;

      // Flatten questions from sections
      const allQuestions: Question[] = [];
      templateData.sections?.forEach((section: any) => {
        section.questions?.forEach((q: any) => {
          allQuestions.push({
            ...q,
            section: section.name,
          });
        });
      });

      setSession({
        ...sessionData,
        responses: sessionData.responses || {},
      });
      setQuestions(allQuestions);
    } catch (error: any) {
      console.error("Error fetching audit data:", error);
      toast.error("Failed to load audit session");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (questionId: string, value: any) => {
    if (!session) return;

    const newResponses = {
      ...session.responses,
      [questionId]: value,
    };

    // Calculate progress
    const answeredCount = Object.keys(newResponses).length;
    const progress = Math.round((answeredCount / questions.length) * 100);

    setSession({
      ...session,
      responses: newResponses,
      progress,
    });

    // Auto-save to Supabase
    try {
      await supabase
        .from("audit_sessions")
        .update({
          responses: newResponses,
          progress,
          status: progress === 100 ? "Completed" : "In Progress",
        })
        .eq("id", session.id);
    } catch (error) {
      console.error("Error auto-saving:", error);
    }
  };

  const handleSubmit = async () => {
    if (!session) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("audit_sessions")
        .update({
          status: "Completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", session.id);

      if (error) throw error;
      toast.success("Audit submitted successfully!");
      router.push("/dashboard/audits");
    } catch (error: any) {
      toast.error("Failed to submit audit");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
          Loading Session Data...
        </p>
      </div>
    );
  }

  if (!session || questions.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900">
          Audit session not found
        </h2>
        <Link href="/dashboard/audits" className="text-blue-600 mt-4 block">
          Return to Registry
        </Link>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIdx];
  const progress = session.progress;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link href="/dashboard/audits">
            <Button
              variant="ghost"
              className="mb-4 -ml-2 text-slate-500 hover:text-slate-900 font-bold"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Registry
            </Button>
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {session.template_name}
          </h1>
          <p className="text-sm font-bold text-slate-400 mt-1">
            {session.department} <span className="mx-2">•</span> Session ID:{" "}
            {session.id.slice(0, 8)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
              session.status === "Completed"
                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                : "bg-blue-50 text-blue-600 border-blue-100"
            }`}
          >
            {session.status}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Card */}
          <Card className="p-8 border-none shadow-sm bg-white rounded-4xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-black text-slate-900 tracking-tight">
                  Session Progress
                </h3>
                <p className="text-xs font-bold text-slate-400">
                  {Object.keys(session.responses).length} of {questions.length}{" "}
                  modules completed
                </p>
              </div>
              <span className="text-2xl font-black text-blue-600">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-slate-50 rounded-full h-3 overflow-hidden border border-slate-100">
              <div
                className="bg-linear-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </Card>

          {/* Question Card */}
          <Card className="p-10 border-none shadow-sm bg-white rounded-4xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                  {currentQuestion.section}
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                {currentQuestion.text}
              </h2>
            </div>

            {/* Answer Input based on type */}
            <div className="space-y-6">
              {currentQuestion.type === "yes-no" && (
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={
                      session.responses[currentQuestion.id] === "yes"
                        ? "default"
                        : "outline"
                    }
                    className={`h-16 rounded-2xl text-base font-black transition-all ${
                      session.responses[currentQuestion.id] === "yes"
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                        : "border-slate-100 text-slate-600 hover:bg-slate-50"
                    }`}
                    onClick={() => handleAnswer(currentQuestion.id, "yes")}
                  >
                    Yes, Compliant
                  </Button>
                  <Button
                    variant={
                      session.responses[currentQuestion.id] === "no"
                        ? "default"
                        : "outline"
                    }
                    className={`h-16 rounded-2xl text-base font-black transition-all ${
                      session.responses[currentQuestion.id] === "no"
                        ? "bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-200"
                        : "border-slate-100 text-slate-600 hover:bg-slate-50"
                    }`}
                    onClick={() => handleAnswer(currentQuestion.id, "no")}
                  >
                    No, Non-Compliant
                  </Button>
                </div>
              )}

              {currentQuestion.type === "text" && (
                <textarea
                  placeholder="Enter detailed observation or findings..."
                  value={session.responses[currentQuestion.id] || ""}
                  onChange={(e) =>
                    handleAnswer(currentQuestion.id, e.target.value)
                  }
                  className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none min-h-[150px] transition-all"
                />
              )}

              {currentQuestion.type === "score" && (
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      onClick={() =>
                        handleAnswer(currentQuestion.id, String(score))
                      }
                      className={`flex-1 h-14 rounded-xl font-black transition-all ${
                        session.responses[currentQuestion.id] === String(score)
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
                          : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === "file" && (
                <div className="border-2 border-dashed border-slate-200 rounded-4xl p-10 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group">
                  <input
                    type="file"
                    className="hidden"
                    id={`file-${currentQuestion.id}`}
                  />
                  <label
                    htmlFor={`file-${currentQuestion.id}`}
                    className="cursor-pointer block"
                  >
                    <Upload className="w-10 h-10 text-slate-300 mx-auto mb-4 group-hover:text-blue-600 transition-colors" />
                    <p className="text-sm font-black text-slate-900 mb-1">
                      Upload supporting evidence
                    </p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                      PDF, PNG or JPG (Max 10MB)
                    </p>
                  </label>
                </div>
              )}
            </div>
          </Card>

          {/* Navigation Controls */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl border-slate-100 text-slate-600 font-bold hover:bg-white"
              disabled={currentQuestionIdx === 0}
              onClick={() => setCurrentQuestionIdx(currentQuestionIdx - 1)}
            >
              Previous Module
            </Button>
            {currentQuestionIdx < questions.length - 1 ? (
              <Button
                className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all active:scale-95"
                onClick={() => setCurrentQuestionIdx(currentQuestionIdx + 1)}
              >
                Next Module
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                {saving ? "Finalizing..." : "Submit Final Audit"}
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Module Navigation */}
          <Card className="border-none shadow-sm bg-white p-8 rounded-4xl">
            <h3 className="font-black text-slate-900 tracking-tight mb-6">
              Module Navigator
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIdx(idx)}
                  className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-3 border ${
                    currentQuestionIdx === idx
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100"
                      : "hover:bg-slate-50 border-transparent text-slate-600"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      session.responses[q.id]
                        ? "bg-emerald-400"
                        : currentQuestionIdx === idx
                        ? "bg-white/50"
                        : "bg-slate-200"
                    }`}
                  />
                  <span className="text-xs font-bold truncate">{q.text}</span>
                  {session.responses[q.id] && (
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ml-auto ${
                        currentQuestionIdx === idx
                          ? "text-white"
                          : "text-emerald-500"
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Audit Meta */}
          <Card className="border-none shadow-sm bg-white p-8 rounded-4xl">
            <h3 className="font-black text-slate-900 tracking-tight mb-6">
              Session Details
            </h3>
            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  Assigned Auditor
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                    {session.auditor_name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    {session.auditor_name}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  Operational Site
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {session.department}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  Filing Deadline
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {new Date(session.due_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
