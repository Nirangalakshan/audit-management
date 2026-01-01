"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Mail, Trash2, Shield } from "lucide-react"

interface TeamMember {
  id: number
  name: string
  email: string
  role: "Admin" | "Auditor" | "Reviewer"
  status: "Active" | "Pending"
  joinDate: string
}

const initialMembers: TeamMember[] = [
  { id: 1, name: "John Doe", email: "john@company.com", role: "Admin", status: "Active", joinDate: "2025-01-15" },
  { id: 2, name: "Jane Smith", email: "jane@company.com", role: "Auditor", status: "Active", joinDate: "2025-02-20" },
  { id: 3, name: "Mike Johnson", email: "mike@company.com", role: "Auditor", status: "Active", joinDate: "2025-03-10" },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@company.com",
    role: "Reviewer",
    status: "Pending",
    joinDate: "2025-06-18",
  },
]

const getRoleColor = (role: string) => {
  switch (role) {
    case "Admin":
      return "bg-purple-100 text-purple-800"
    case "Auditor":
      return "bg-blue-100 text-blue-800"
    case "Reviewer":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800"
    case "Pending":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers)
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("Auditor")

  const handleInvite = () => {
    if (inviteEmail) {
      const newMember: TeamMember = {
        id: Math.max(...members.map((m) => m.id), 0) + 1,
        name: inviteEmail.split("@")[0],
        email: inviteEmail,
        role: inviteRole as "Admin" | "Auditor" | "Reviewer",
        status: "Pending",
        joinDate: new Date().toISOString().split("T")[0],
      }
      setMembers([...members, newMember])
      setInviteEmail("")
      setShowInvite(false)
    }
  }

  const removeMember = (id: number) => {
    setMembers(members.filter((m) => m.id !== id))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Team Management</h1>
          <p className="text-foreground/70 mt-1">Manage team members and their roles</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowInvite(!showInvite)}>
          <Plus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Invite Form */}
      {showInvite && (
        <Card className="p-6 border-border">
          <h3 className="text-lg font-semibold text-foreground mb-6">Invite Team Member</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input
                type="email"
                placeholder="member@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="bg-secondary/50 border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-secondary/50 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Admin">Admin</option>
                <option value="Auditor">Auditor</option>
                <option value="Reviewer">Reviewer</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleInvite}>
                Send Invite
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-border bg-transparent"
                onClick={() => setShowInvite(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Team Members */}
      <Card className="border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-border hover:bg-secondary/30 transition">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{member.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                      <Mail className="w-4 h-4" />
                      {member.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(member.role)}`}
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(member.status)}`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground/70">{member.joinDate}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => removeMember(member.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Role Information */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            role: "Admin",
            description: "Full access to all features and settings",
            permissions: ["Manage team", "Configure settings", "View all audits"],
          },
          {
            role: "Auditor",
            description: "Can conduct audits and manage templates",
            permissions: ["Create audits", "Manage templates", "View reports"],
          },
          {
            role: "Reviewer",
            description: "Can review and approve audit results",
            permissions: ["Review audits", "Approve findings", "View reports"],
          },
        ].map((info, idx) => (
          <Card key={idx} className="p-6 border-border">
            <h4 className="text-lg font-semibold text-foreground mb-2">{info.role}</h4>
            <p className="text-sm text-foreground/70 mb-4">{info.description}</p>
            <ul className="space-y-2">
              {info.permissions.map((perm, pidx) => (
                <li key={pidx} className="text-xs text-foreground/70 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  {perm}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  )
}
