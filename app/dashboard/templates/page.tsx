"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, MoreVertical } from "lucide-react"
import Link from "next/link"

const templates = [
  {
    id: 1,
    name: "ISO 9001 Quality Management",
    category: "Quality",
    questions: 45,
    description: "Standard quality management audit template",
  },
  {
    id: 2,
    name: "Safety & Health Assessment",
    category: "Safety",
    questions: 38,
    description: "Comprehensive workplace safety audit",
  },
  {
    id: 3,
    name: "Financial Controls Review",
    category: "Finance",
    questions: 52,
    description: "Internal financial controls assessment",
  },
  {
    id: 4,
    name: "Data Security Audit",
    category: "Security",
    questions: 41,
    description: "IT security and data protection audit",
  },
  {
    id: 5,
    name: "Environmental Compliance",
    category: "Environment",
    questions: 35,
    description: "Environmental regulations compliance check",
  },
  {
    id: 6,
    name: "HR Compliance Audit",
    category: "HR",
    questions: 48,
    description: "Human resources policies and compliance",
  },
]

export default function TemplatesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Templates</h1>
          <p className="text-foreground/70 mt-1">Create and manage audit templates for your organization</p>
        </div>
        <Link href="/dashboard/templates/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="border-border hover:shadow-lg transition flex flex-col">
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{template.name}</h3>
                  <p className="text-sm text-blue-600 font-medium mt-1">{template.category}</p>
                </div>
                <button className="p-2 hover:bg-secondary/50 rounded-lg transition">
                  <MoreVertical className="w-4 h-4 text-foreground/70" />
                </button>
              </div>
              <p className="text-sm text-foreground/70 mb-4">{template.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {template.questions} Questions
                </span>
              </div>
            </div>
            <div className="p-6 border-t border-border flex gap-2">
              <Button variant="outline" className="flex-1 border-border bg-transparent">
                Edit
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Use</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
