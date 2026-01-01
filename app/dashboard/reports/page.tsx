"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"

const completedAudits = [
  {
    id: 1,
    name: "Q2 Compliance Audit",
    date: "2025-06-15",
    organization: "Manufacturing Dept",
    complianceScore: 88,
    status: "Completed",
  },
  {
    id: 2,
    name: "Data Security Audit",
    date: "2025-06-10",
    organization: "IT Department",
    complianceScore: 92,
    status: "Completed",
  },
  {
    id: 3,
    name: "Financial Controls Review",
    date: "2025-06-05",
    organization: "Finance Team",
    complianceScore: 78,
    status: "Completed",
  },
  {
    id: 4,
    name: "Quality Management Audit",
    date: "2025-05-28",
    organization: "Quality Assurance",
    complianceScore: 95,
    status: "Completed",
  },
]

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports</h1>
        <p className="text-foreground/70 mt-1">Generate and download audit reports</p>
      </div>

      {/* Report Templates */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-6">Generate New Report</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: "Compliance Summary Report",
              description: "High-level overview of compliance status across all audits",
              icon: "📊",
            },
            {
              title: "Non-Compliance Action Plan",
              description: "Detailed list of issues with corrective actions and timelines",
              icon: "✓",
            },
            {
              title: "Audit Evidence Report",
              description: "Comprehensive report with supporting evidence and findings",
              icon: "📎",
            },
            {
              title: "Trend Analysis Report",
              description: "Historical compliance trends and improvement metrics",
              icon: "📈",
            },
          ].map((template, idx) => (
            <Card key={idx} className="p-6 border-border hover:shadow-lg transition">
              <div className="text-4xl mb-4">{template.icon}</div>
              <h4 className="text-lg font-semibold text-foreground mb-2">{template.title}</h4>
              <p className="text-sm text-foreground/70 mb-6">{template.description}</p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Generate</Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Completed Audits */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-6">Audit Reports</h3>
        <Card className="border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Audit Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Organization</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">
                    Compliance Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {completedAudits.map((audit) => (
                  <tr key={audit.id} className="border-b border-border hover:bg-secondary/30 transition">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{audit.name}</td>
                    <td className="px-6 py-4 text-sm text-foreground/70">{audit.organization}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-foreground/70">
                        <Calendar className="w-4 h-4" />
                        {audit.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <span className="text-lg font-bold text-green-600">{audit.complianceScore}%</span>
                        </div>
                        <div className="w-20 bg-secondary rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${audit.complianceScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
