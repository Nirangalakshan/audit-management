"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, AlertCircle, CheckCircle2, BarChart3, ArrowUp, ArrowDown } from "lucide-react"
import Link from "next/link"

const complianceTrendData = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 72 },
  { month: "Mar", score: 68 },
  { month: "Apr", score: 78 },
  { month: "May", score: 85 },
  { month: "Jun", score: 88 },
]

const auditComparisonData = [
  { name: "Completed", value: 24 },
  { name: "In Progress", value: 8 },
  { name: "Pending", value: 5 },
]

const recentAudits = [
  {
    id: 1,
    name: "Q2 Compliance Audit",
    organization: "Manufacturing Dept",
    status: "Completed",
    date: "2025-06-15",
    auditor: "John Doe",
  },
  {
    id: 2,
    name: "Safety & Health Assessment",
    organization: "Production Facility",
    status: "In Progress",
    date: "2025-06-20",
    auditor: "Jane Smith",
  },
  {
    id: 3,
    name: "Financial Controls Review",
    organization: "Finance Team",
    status: "In Progress",
    date: "2025-06-18",
    auditor: "Mike Johnson",
  },
  {
    id: 4,
    name: "ISO 9001 Internal Audit",
    organization: "Quality Assurance",
    status: "Pending",
    date: "2025-06-25",
    auditor: "Sarah Wilson",
  },
  {
    id: 5,
    name: "Data Security Audit",
    organization: "IT Department",
    status: "Completed",
    date: "2025-06-10",
    auditor: "Tom Brown",
  },
]

export default function DashboardPage() {
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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-foreground/70 mt-1">Welcome back, John. Here's your audit overview.</p>
        </div>
        <Link href="/dashboard/audits">
          <Button className="bg-blue-600 hover:bg-blue-700">New Audit</Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Audits */}
        <Card className="p-6 border-border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-foreground/70 font-medium">Total Audits</p>
              <p className="text-3xl font-bold text-foreground mt-2">37</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-600 font-medium">12% this month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        {/* Compliance Score */}
        <Card className="p-6 border-border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-foreground/70 font-medium">Compliance Score</p>
              <p className="text-3xl font-bold text-foreground mt-2">88%</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-600 font-medium">+5% this month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        {/* Open Non-Compliances */}
        <Card className="p-6 border-border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-foreground/70 font-medium">Open Non-Compliances</p>
              <p className="text-3xl font-bold text-foreground mt-2">12</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowDown className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-600 font-medium">-3 this month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        {/* Closed Issues */}
        <Card className="p-6 border-border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-foreground/70 font-medium">Closed Issues</p>
              <p className="text-3xl font-bold text-foreground mt-2">24</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-600 font-medium">8 this month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Compliance Trend Chart */}
        <Card className="p-6 border-border lg:col-span-2">
          <h3 className="text-lg font-semibold text-foreground mb-6">Compliance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={complianceTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--foreground)" opacity={0.7} />
              <YAxis stroke="var(--foreground)" opacity={0.7} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "var(--foreground)" }}
              />
              <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={2} dot={{ fill: "#2563eb", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Audit Status Distribution */}
        <Card className="p-6 border-border">
          <h3 className="text-lg font-semibold text-foreground mb-6">Audit Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={auditComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--foreground)" opacity={0.7} />
              <YAxis stroke="var(--foreground)" opacity={0.7} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "var(--foreground)" }}
              />
              <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Audits Table */}
      <Card className="border-border overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent Audits</h3>
          <Link href="/dashboard/audits">
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
              View All
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Audit Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Auditor</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentAudits.map((audit) => (
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
                  <td className="px-6 py-4 text-sm text-foreground/70">{audit.date}</td>
                  <td className="px-6 py-4 text-sm text-foreground/70">{audit.auditor}</td>
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
