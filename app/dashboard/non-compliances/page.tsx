"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Filter, Plus } from "lucide-react"

interface NonCompliance {
  id: number
  issue: string
  severity: "Low" | "Medium" | "High"
  dueDateDays: number
  dueDate: string
  status: "Open" | "In Progress" | "Resolved"
  assignee: string
  audit: string
}

const nonCompliances: NonCompliance[] = [
  {
    id: 1,
    issue: "Missing documentation for safety procedures",
    severity: "High",
    dueDateDays: 5,
    dueDate: "2025-06-25",
    status: "Open",
    assignee: "Jane Smith",
    audit: "Safety & Health Assessment",
  },
  {
    id: 2,
    issue: "Inadequate training records",
    severity: "High",
    dueDateDays: 8,
    dueDate: "2025-06-28",
    status: "In Progress",
    assignee: "Mike Johnson",
    audit: "ISO 9001 Internal Audit",
  },
  {
    id: 3,
    issue: "Financial control process needs review",
    severity: "Medium",
    dueDateDays: 12,
    dueDate: "2025-07-02",
    status: "Open",
    assignee: "Sarah Wilson",
    audit: "Financial Controls Review",
  },
  {
    id: 4,
    issue: "Backup procedures not tested",
    severity: "High",
    dueDateDays: 3,
    dueDate: "2025-06-23",
    status: "In Progress",
    assignee: "Tom Brown",
    audit: "Data Security Audit",
  },
  {
    id: 5,
    issue: "Employee handbook outdated",
    severity: "Low",
    dueDateDays: 20,
    dueDate: "2025-07-10",
    status: "Open",
    assignee: "Lisa Anderson",
    audit: "HR Compliance Audit",
  },
]

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "High":
      return "bg-red-100 text-red-800"
    case "Medium":
      return "bg-yellow-100 text-yellow-800"
    case "Low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Resolved":
      return "bg-green-100 text-green-800"
    case "In Progress":
      return "bg-blue-100 text-blue-800"
    case "Open":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function NonCompliancesPage() {
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  const filteredItems = nonCompliances.filter((item) => {
    if (filterSeverity && item.severity !== filterSeverity) return false
    if (filterStatus && item.status !== filterStatus) return false
    return true
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Non-Compliances</h1>
          <p className="text-foreground/70 mt-1">Track and manage compliance issues and corrective actions</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Issue
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: "Total Issues", value: "12", color: "bg-red-100 text-red-600" },
          { label: "High Severity", value: "3", color: "bg-red-100 text-red-600" },
          { label: "Medium Severity", value: "5", color: "bg-yellow-100 text-yellow-600" },
          { label: "Low Severity", value: "4", color: "bg-green-100 text-green-600" },
        ].map((stat, idx) => (
          <Card key={idx} className="p-6 border-border">
            <p className="text-sm text-foreground/70 font-medium">{stat.label}</p>
            <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-6 border-border">
        <div className="flex items-center gap-4 flex-wrap">
          <Filter className="w-5 h-5 text-foreground/70" />
          <div className="flex gap-2">
            {["High", "Medium", "Low"].map((severity) => (
              <button
                key={severity}
                onClick={() => setFilterSeverity(filterSeverity === severity ? null : severity)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  filterSeverity === severity
                    ? getSeverityColor(severity)
                    : "bg-secondary/50 text-foreground/70 hover:bg-secondary"
                }`}
              >
                {severity}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {["Open", "In Progress", "Resolved"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(filterStatus === status ? null : status)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  filterStatus === status
                    ? getStatusColor(status)
                    : "bg-secondary/50 text-foreground/70 hover:bg-secondary"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Issues Table */}
      <Card className="border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Issue</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Assignee</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Audit</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((issue) => (
                <tr key={issue.id} className="border-b border-border hover:bg-secondary/30 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{issue.issue}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(issue.severity)}`}
                    >
                      {issue.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(issue.status)}`}
                    >
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-foreground/70">
                      {issue.dueDate}
                      <p
                        className={`text-xs font-semibold ${issue.dueDateDays <= 5 ? "text-red-600" : "text-foreground/60"}`}
                      >
                        {issue.dueDateDays} days left
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground/70">{issue.assignee}</td>
                  <td className="px-6 py-4 text-sm text-foreground/70">{issue.audit}</td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
