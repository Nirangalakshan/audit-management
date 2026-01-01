"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, ChevronLeft } from "lucide-react"
import Link from "next/link"

interface Question {
  id: number
  text: string
  type: "yes-no" | "text" | "score" | "file"
  section: string
}

const questions: Question[] = [
  { id: 1, text: "Is the audit scope clearly defined?", type: "yes-no", section: "General" },
  { id: 2, text: "Are all relevant records available?", type: "yes-no", section: "General" },
  { id: 3, text: "Describe any findings or observations", type: "text", section: "General" },
  { id: 4, text: "Rate the overall compliance level (1-5)", type: "score", section: "Compliance" },
  { id: 5, text: "Upload supporting evidence", type: "file", section: "Compliance" },
]

export default function PerformAuditPage({ params }: { params: { id: string } }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [evidence, setEvidence] = useState<Record<number, File | null>>({})

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers({ ...answers, [questionId]: value })
  }

  const handleEvidenceUpload = (questionId: number, file: File) => {
    setEvidence({ ...evidence, [questionId]: file })
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link href="/dashboard/audits">
          <Button variant="ghost" className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Q2 Compliance Audit</h1>
        <p className="text-foreground/70 mt-1">Manufacturing Dept - Audit ID: {params.id}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress */}
          <Card className="p-6 border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">Progress</h3>
              <span className="text-sm text-foreground/70">
                {currentQuestion + 1} of {questions.length}
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition" style={{ width: `${progress}%` }} />
            </div>
          </Card>

          {/* Question Card */}
          <Card className="p-8 border-border">
            <div className="mb-6">
              <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">{question.section}</h3>
              <h2 className="text-2xl font-bold text-foreground">{question.text}</h2>
            </div>

            {/* Answer Input based on type */}
            <div className="space-y-4">
              {question.type === "yes-no" && (
                <div className="flex gap-4">
                  <Button
                    variant={answers[question.id] === "yes" ? "default" : "outline"}
                    className={`flex-1 ${answers[question.id] === "yes" ? "bg-green-600 hover:bg-green-700" : "border-border"}`}
                    onClick={() => handleAnswer(question.id, "yes")}
                  >
                    Yes
                  </Button>
                  <Button
                    variant={answers[question.id] === "no" ? "default" : "outline"}
                    className={`flex-1 ${answers[question.id] === "no" ? "bg-red-600 hover:bg-red-700" : "border-border"}`}
                    onClick={() => handleAnswer(question.id, "no")}
                  >
                    No
                  </Button>
                </div>
              )}

              {question.type === "text" && (
                <textarea
                  placeholder="Enter your remarks or findings..."
                  value={answers[question.id] || ""}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-secondary/50 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  rows={5}
                />
              )}

              {question.type === "score" && (
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      onClick={() => handleAnswer(question.id, String(score))}
                      className={`flex-1 py-3 rounded-lg font-semibold transition ${
                        answers[question.id] === String(score)
                          ? "bg-blue-600 text-white"
                          : "bg-secondary/50 text-foreground hover:bg-secondary"
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              )}

              {question.type === "file" && (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer group">
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleEvidenceUpload(question.id, e.target.files[0])
                      }
                    }}
                    className="hidden"
                    id={`file-${question.id}`}
                  />
                  <label htmlFor={`file-${question.id}`} className="cursor-pointer block">
                    {evidence[question.id] ? (
                      <div className="text-center">
                        <p className="text-sm text-foreground/70 font-medium">{evidence[question.id]?.name}</p>
                        <p className="text-xs text-foreground/50 mt-1">Click to change</p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-8 h-8 text-foreground/40 mx-auto mb-2 group-hover:text-blue-600 transition" />
                        <p className="text-sm font-medium text-foreground mb-1">Upload evidence</p>
                        <p className="text-xs text-foreground/60">PDF, Image, or Document</p>
                      </div>
                    )}
                  </label>
                </div>
              )}

              <div className="mt-8">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-sm text-foreground/70">Add remarks to this question</span>
                </label>
              </div>
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1 border-border bg-transparent"
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
            >
              Previous
            </Button>
            {currentQuestion < questions.length - 1 ? (
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
              >
                Next
              </Button>
            ) : (
              <Button className="flex-1 bg-green-600 hover:bg-green-700">Submit Audit</Button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Questions List */}
          <Card className="border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Questions</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    currentQuestion === idx ? "bg-blue-600 text-white" : "hover:bg-secondary/50 text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {answers[q.id] && <div className="w-2 h-2 bg-green-600 rounded-full" />}
                    <span className="text-xs">{q.text.substring(0, 30)}...</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Audit Info */}
          <Card className="border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Audit Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-foreground/70">Status</p>
                <p className="font-medium text-foreground">In Progress</p>
              </div>
              <div>
                <p className="text-foreground/70">Auditor</p>
                <p className="font-medium text-foreground">John Doe</p>
              </div>
              <div>
                <p className="text-foreground/70">Start Date</p>
                <p className="font-medium text-foreground">2025-06-20</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
