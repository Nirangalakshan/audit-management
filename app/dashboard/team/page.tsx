"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Mail,
  Trash2,
  Shield,
  UserPlus,
  Search,
  Filter,
  ShieldCheck,
  UserCog,
  ClipboardCheck,
  MoreHorizontal,
  X,
} from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Auditor" | "Reviewer";
  status: "Active" | "Pending";
  joinDate: string;
}

const initialMembers: TeamMember[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@auditflow.io",
    role: "Admin",
    status: "Active",
    joinDate: "Jan 15, 2025",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@auditflow.io",
    role: "Auditor",
    status: "Active",
    joinDate: "Feb 20, 2025",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@auditflow.io",
    role: "Auditor",
    status: "Active",
    joinDate: "Mar 10, 2025",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@auditflow.io",
    role: "Reviewer",
    status: "Pending",
    joinDate: "Jun 18, 2025",
  },
];

const getRoleColor = (role: string) => {
  switch (role) {
    case "Admin":
      return "bg-violet-50 text-violet-700 border-violet-100";
    case "Auditor":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "Reviewer":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    default:
      return "bg-slate-50 text-slate-700 border-slate-100";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-100";
    default:
      return "bg-slate-50 text-slate-700 border-slate-100";
  }
};

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Auditor");

  const handleInvite = () => {
    if (inviteEmail) {
      const newMember: TeamMember = {
        id: Math.max(...members.map((m) => m.id), 0) + 1,
        name: inviteEmail.split("@")[0],
        email: inviteEmail,
        role: inviteRole as "Admin" | "Auditor" | "Reviewer",
        status: "Pending",
        joinDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };
      setMembers([...members, newMember]);
      setInviteEmail("");
      setShowInvite(false);
    }
  };

  const removeMember = (id: number) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Team Governance
          </h1>
          <p className="text-sm font-bold text-slate-400">
            Manage organizational access and permission structures
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            className="h-12 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xl shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95"
            onClick={() => setShowInvite(!showInvite)}
          >
            <UserPlus className="w-5 h-5" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Invite Form Modal-like Card */}
      {showInvite && (
        <Card className="p-8 border-none shadow-2xl shadow-slate-200 bg-white rounded-[2.5rem] animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Access Invitation
            </h3>
            <button
              onClick={() => setShowInvite(false)}
              className="p-2 hover:bg-slate-50 rounded-xl transition"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <div className="grid md:grid-cols-12 gap-6">
            <div className="md:col-span-6">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="name@auditflow.io"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="h-12 pl-12 rounded-xl bg-slate-50 border-none text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                Assigned Role
              </label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-slate-50 border-none text-sm font-bold text-slate-600 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option value="Admin">Administrator</option>
                <option value="Auditor">Field Auditor</option>
                <option value="Reviewer">Session Reviewer</option>
              </select>
            </div>
            <div className="md:col-span-3 flex items-end gap-2">
              <Button
                className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg"
                onClick={handleInvite}
              >
                Send Invitation
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-4 rounded-4xl shadow-sm border border-slate-50">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full h-11 pl-11 pr-4 rounded-xl bg-slate-50 border-none text-sm font-bold text-slate-600 focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-11 px-5 rounded-xl border-slate-100 text-slate-500 font-bold text-xs flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Roles
          </Button>
        </div>
      </div>

      {/* Team Members List */}
      <Card className="border-none shadow-sm bg-white overflow-hidden rounded-4xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Active Member
                </th>
                <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Permission Role
                </th>
                <th className="px-10 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Operational Status
                </th>
                <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Onboarding Date
                </th>
                <th className="px-10 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Manage
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="group hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400 border-2 border-white shadow-sm transition-transform group-hover:scale-110">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {member.name}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span
                      className={`inline-flex px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${getRoleColor(
                        member.role
                      )}`}
                    >
                      <Shield className="w-3 h-3 mr-1.5" />
                      {member.role}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span
                      className={`inline-flex px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${getStatusColor(
                        member.status
                      )}`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-sm font-bold text-slate-500">
                    {member.joinDate}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button
                      onClick={() => removeMember(member.id)}
                      className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Role Structure Breakdown */}
      <div className="space-y-8">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">
          Authority Matrix
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              role: "Administrator",
              description: "Complete strategic control over the organization.",
              icon: ShieldCheck,
              color: "violet",
              permissions: [
                "Infrastructure management",
                "Billing & Subscriptions",
                "Global user control",
              ],
            },
            {
              role: "Field Auditor",
              description: "Execution of audit sessions and data collection.",
              icon: UserCog,
              color: "blue",
              permissions: [
                "Session execution",
                "Evidence gathering",
                "NCR reporting",
              ],
            },
            {
              role: "Compliance Reviewer",
              description: "Verification of evidence and final approval.",
              icon: ClipboardCheck,
              color: "emerald",
              permissions: [
                "Evidence validation",
                "NCR closure approval",
                "Report certification",
              ],
            },
          ].map((info, idx) => (
            <Card
              key={idx}
              className="p-8 border-none shadow-sm bg-white rounded-4xl group hover:shadow-xl hover:shadow-slate-200/50 transition-all"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-${info.color}-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <info.icon className={`w-7 h-7 text-${info.color}-600`} />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">
                {info.role}
              </h4>
              <p className="text-sm font-bold text-slate-400 mb-6 leading-relaxed">
                {info.description}
              </p>
              <div className="space-y-3">
                {info.permissions.map((perm, pidx) => (
                  <div key={pidx} className="flex items-center gap-3">
                    <div
                      className={`w-1.5 h-1.5 rounded-full bg-${info.color}-400`}
                    />
                    <span className="text-xs font-bold text-slate-600">
                      {perm}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
