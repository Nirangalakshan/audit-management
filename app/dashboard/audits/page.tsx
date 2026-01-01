"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

const audits = [
  {
    id: 1,
    name: "Q2 Compliance Audit",
    organization: "Manufacturing Dept",
    status: "Completed",
    date: "2025-06-15",
    auditor: "John Doe",
    completionRate: 100,
  },
  {
    id: 2,
    name: "Safety & Health Assessment",
    organization: "Production Facility",
    status: "In Progress",
    date: "2025-06-20",
    auditor: "Jane Smith",
    completionRate: 65,
  },
  {
    id: 3,
    name: "Financial Controls Review",
    organization: "Finance Team",
    status: "In Progress",
    date: "2025-06-18",
    auditor: "Mike Johnson",
    completionRate: 48,
  },
  {
    id: 4,
    name: "ISO 9001 Internal Audit",
    organization: "Quality Assurance",
    status: "Pending",
    date: "2025-06-25",
    auditor: "Sarah Wilson",
    completionRate: 0,
  },
  {
    id: 5,
    name: "Data Security Audit",
    organization: "IT Department",
    status: "Completed",
    date: "2025-06-10",
    auditor: "Tom Brown",
    completionRate: 100,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800"
    case "In Progress":
      return "bg-blue-100 text-blue-800"
    case "Pending":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function AuditsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audits</h1>
          <p className="text-foreground/70 mt-1">Manage and track all your audits</p>
        </div>
        <Link href="/dashboard/audits/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Audit
          </Button>
        </Link>
      </div>

      <Card className="border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Audit Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Auditor</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {audits.map((audit) => (
                <tr key={audit.id} className="border-b border-border hover:bg-secondary/30 transition">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{audit.name}</td>
                  <td className="px-6 py-4 text-sm text-foreground/70">{audit.organization}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(audit.status)}`}
                    >
                      {audit.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground/70">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-secondary rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition"
                          style={{ width: `${audit.completionRate}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{audit.completionRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground/70">{audit.date}</td>
                  <td className="px-6 py-4 text-sm text-foreground/70">{audit.auditor}</td>
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/audits/${audit.id}`}>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        {audit.status === "In Progress" ? "Continue" : "View"}
                      </Button>
                    </Link>
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
