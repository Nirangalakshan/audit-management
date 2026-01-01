"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"

interface Question {
  id: string
  text: string
  type: "yes-no" | "text" | "score" | "file"
}

interface Section {
  id: string
  name: string
  questions: Question[]
  expanded: boolean
}

export default function CreateTemplatePage() {
  const [templateName, setTemplateName] = useState("")
  const [category, setCategory] = useState("")
  const [sections, setSections] = useState<Section[]>([
    {
      id: "1",
      name: "General Questions",
      questions: [],
      expanded: true,
    },
  ])

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: Math.random().toString(),
        name: `Section ${sections.length + 1}`,
        questions: [],
        expanded: true,
      },
    ])
  }

  const addQuestion = (sectionId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: [
                ...section.questions,
                {
                  id: Math.random().toString(),
                  text: "",
                  type: "yes-no" as const,
                },
              ],
            }
          : section,
      ),
    )
  }

  const deleteQuestion = (sectionId: string, questionId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.filter((q) => q.id !== questionId),
            }
          : section,
      ),
    )
  }

  const toggleSection = (sectionId: string) => {
    setSections(
      sections.map((section) => (section.id === sectionId ? { ...section, expanded: !section.expanded } : section)),
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create Audit Template</h1>
        <p className="text-foreground/70 mt-1">Build a custom audit template for your organization</p>
      </div>

      {/* Template Info */}
      <Card className="p-6 border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6">Template Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Template Name</label>
            <Input
              type="text"
              placeholder="e.g., ISO 9001 Quality Management"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="bg-secondary/50 border-border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-secondary/50 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select category</option>
              <option value="Quality">Quality</option>
              <option value="Safety">Safety</option>
              <option value="Finance">Finance</option>
              <option value="Security">Security</option>
              <option value="Environment">Environment</option>
              <option value="HR">HR</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Sections and Questions */}
      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.id} className="border-border overflow-hidden">
            <div
              className="p-6 bg-secondary/30 flex items-center justify-between cursor-pointer hover:bg-secondary/50 transition"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center gap-3 flex-1">
                {section.expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                <h4 className="font-semibold text-foreground">{section.name}</h4>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded ml-auto">
                  {section.questions.length} Questions
                </span>
              </div>
            </div>

            {section.expanded && (
              <div className="p-6 space-y-4">
                {section.questions.map((question) => (
                  <div key={question.id} className="flex gap-4 items-start pb-4 border-b border-border last:border-0">
                    <Input
                      type="text"
                      placeholder="Enter question text..."
                      value={question.text}
                      className="flex-1 bg-secondary/50 border-border"
                    />
                    <select className="px-3 py-2 rounded-lg border border-border bg-secondary/50 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600">
                      <option value="yes-no">Yes / No</option>
                      <option value="text">Text</option>
                      <option value="score">Score</option>
                      <option value="file">File Upload</option>
                    </select>
                    <button
                      onClick={() => deleteQuestion(section.id, question.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                ))}

                <Button
                  variant="ghost"
                  className="w-full text-blue-600 hover:text-blue-700 justify-center"
                  onClick={() => addQuestion(section.id)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Add Section Button */}
      <Button variant="outline" className="w-full border-border bg-transparent" onClick={addSection}>
        <Plus className="w-4 h-4 mr-2" />
        Add Section
      </Button>

      {/* Actions */}
      <div className="flex gap-4 pt-6">
        <Button variant="outline" className="flex-1 border-border bg-transparent">
          Save as Draft
        </Button>
        <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Create Template</Button>
      </div>
    </div>
  )
}
