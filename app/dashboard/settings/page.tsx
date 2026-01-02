"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Lock,
  Palette,
  Building2,
  UserCircle,
  Mail,
  ShieldAlert,
  Globe,
  ChevronRight,
} from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    organizationName: "AuditFlow Enterprise",
    email: "admin@auditflow.io",
    notificationEmail: true,
    notificationAuditComplete: true,
    notificationNonCompliance: true,
    theme: "light",
  });

  return (
    <div className="space-y-12 max-w-5xl pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Configurations
          </h1>
          <p className="text-sm font-bold text-slate-400">
            Personalize your environment and workspace preferences
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Navigation Sidebar-ish (Optional, for now just a summary) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-8 border-none shadow-sm bg-blue-600 rounded-[2.5rem] text-white">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
              <UserCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-black mb-1">AuditFlow Cloud</h3>
            <p className="text-blue-100 text-sm font-bold mb-6">
              Enterprise Instance • Active
            </p>
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">
                  Organization
                </span>
                <span className="text-xs font-bold text-white">AuditFlow</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">
                  License
                </span>
                <span className="text-xs font-bold text-white">
                  Full Access
                </span>
              </div>
            </div>
          </Card>

          <div className="space-y-2 p-2">
            {[
              "Profile",
              "Organization",
              "Notifications",
              "Security",
              "Integrations",
            ].map((item, i) => (
              <button
                key={i}
                className={`w-full flex items-center justify-between p-4 rounded-2xl text-sm font-bold transition-all ${
                  i === 0
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                {item}
                <ChevronRight
                  className={`w-4 h-4 ${
                    i === 0 ? "text-blue-600" : "text-slate-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-8 space-y-12">
          {/* Organization Settings */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 ml-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h3 className="font-black text-slate-900 tracking-tight">
                Organization Identity
              </h3>
            </div>
            <Card className="p-8 border-none shadow-sm bg-white rounded-[2.5rem] space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Entity Name
                  </label>
                  <Input
                    type="text"
                    value={settings.organizationName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        organizationName: e.target.value,
                      })
                    }
                    className="h-12 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Administrative Email
                  </label>
                  <Input
                    type="email"
                    value={settings.email}
                    onChange={(e) =>
                      setSettings({ ...settings, email: e.target.value })
                    }
                    className="h-12 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
              <Button className="h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all active:scale-95">
                Update Core Records
              </Button>
            </Card>
          </section>

          {/* Notification Settings */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 ml-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <h3 className="font-black text-slate-900 tracking-tight">
                Transmission Alerts
              </h3>
            </div>
            <Card className="p-8 border-none shadow-sm bg-white rounded-[2.5rem] space-y-6">
              {[
                {
                  label: "Executive Briefings",
                  description:
                    "Receive weekly summary email of organization compliance.",
                  key: "notificationEmail",
                },
                {
                  label: "Session Closure Alerts",
                  description:
                    "Instant notification when an audit session is finalized.",
                  key: "notificationAuditComplete",
                },
                {
                  label: "Non-Compliance Escalation",
                  description: "Alert me when high-severity finds are logged.",
                  key: "notificationNonCompliance",
                },
              ].map((setting, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl group border border-transparent hover:border-blue-100 hover:bg-white transition-all"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900">{setting.label}</p>
                    <p className="text-xs font-bold text-slate-400 max-w-[300px] leading-relaxed">
                      {setting.description}
                    </p>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        settings[
                          setting.key as keyof typeof settings
                        ] as boolean
                      }
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          [setting.key]: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                </div>
              ))}
            </Card>
          </section>

          {/* Security & Access */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 ml-2">
              <Lock className="w-5 h-5 text-blue-600" />
              <h3 className="font-black text-slate-900 tracking-tight">
                Security Credentials
              </h3>
            </div>
            <Card className="p-8 border-none shadow-sm bg-white rounded-[2.5rem] space-y-8">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-12 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      New Security Phrase
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-12 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Confirm Identity
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-12 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
              <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all">
                Rotate Access Key
              </Button>
            </Card>
          </section>

          {/* Danger Zone */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 ml-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <h3 className="font-black text-rose-600 tracking-tight">
                Termination Protocol
              </h3>
            </div>
            <Card className="p-8 border-none shadow-sm bg-rose-50/50 rounded-[2.5rem] border border-rose-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <p className="font-black text-rose-900">Instance Deletion</p>
                  <p className="text-xs font-bold text-rose-600/70 max-w-[400px]">
                    Once initiated, all audit records, team data, and compliance
                    history will be permanently erased. This action is
                    irreversible.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  className="h-12 px-8 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all shrink-0"
                >
                  Delete AuditFlow Instance
                </Button>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
