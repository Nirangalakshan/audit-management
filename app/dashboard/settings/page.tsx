"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Lock, Palette } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    organizationName: "Acme Manufacturing Inc.",
    email: "admin@company.com",
    notificationEmail: true,
    notificationAuditComplete: true,
    notificationNonCompliance: true,
    theme: "light",
  })

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-foreground/70 mt-1">Manage your organization and preferences</p>
      </div>

      {/* Organization Settings */}
      <Card className="p-8 border-border">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-foreground">Organization Settings</h3>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Organization Name</label>
            <Input
              type="text"
              value={settings.organizationName}
              onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
              className="bg-secondary/50 border-border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Admin Email</label>
            <Input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="bg-secondary/50 border-border"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-8 border-border">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
        </div>
        <div className="space-y-4">
          {[
            {
              label: "Email Notifications",
              description: "Receive email updates about audits and compliance",
              key: "notificationEmail",
            },
            {
              label: "Audit Completion",
              description: "Get notified when audits are completed",
              key: "notificationAuditComplete",
            },
            {
              label: "Non-Compliance Issues",
              description: "Alert me about new non-compliance findings",
              key: "notificationNonCompliance",
            },
          ].map((setting, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
              <div>
                <p className="font-medium text-foreground">{setting.label}</p>
                <p className="text-sm text-foreground/70">{setting.description}</p>
              </div>
              <input
                type="checkbox"
                checked={settings[setting.key as keyof typeof settings] as boolean}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    [setting.key]: e.target.checked,
                  })
                }
                className="rounded border-border w-5 h-5 cursor-pointer"
              />
            </div>
          ))}
          <Button className="bg-blue-600 hover:bg-blue-700">Save Preferences</Button>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-8 border-border">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-foreground">Security</h3>
        </div>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-foreground mb-3">Change Password</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
                <Input type="password" placeholder="••••••••" className="bg-secondary/50 border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
                <Input type="password" placeholder="••••••••" className="bg-secondary/50 border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                <Input type="password" placeholder="••••••••" className="bg-secondary/50 border-border" />
              </div>
            </div>
            <Button className="mt-6 bg-blue-600 hover:bg-blue-700">Update Password</Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-8 border-border border-destructive">
        <h3 className="text-lg font-semibold text-destructive mb-6">Danger Zone</h3>
        <p className="text-foreground/70 mb-6">
          Deleting your account is permanent and cannot be undone. All data will be lost.
        </p>
        <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
          Delete Account
        </Button>
      </Card>
    </div>
  )
}
