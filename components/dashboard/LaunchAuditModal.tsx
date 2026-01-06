"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  X,
  Calendar as CalendarIcon,
  User,
  Building2,
  Rocket,
  ShieldCheck,
  HardHat,
  Landmark,
  Lock,
  Globe,
  Users,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  sections: any[];
}

interface LaunchAuditModalProps {
  template: Template;
  onClose: () => void;
}

export default function LaunchAuditModal({
  template,
  onClose,
}: LaunchAuditModalProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    auditorId: "",
    department: "",
    dueDate: "",
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const orgId = (user as any)?.user_metadata?.organization_id;

      let query = supabase
        .from("team_members")
        .select("id, name, role, email")
        .eq("status", "Active");

      if (orgId) {
        query = query.eq("organization_id", orgId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTeam(data || []);
    } catch (error) {
      console.error("Error fetching team:", error);
      toast.error("Failed to load auditor list");
    }
  };

  const handleLaunch = async () => {
    if (!formData.auditorId || !formData.department || !formData.dueDate) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const selectedAuditor = team.find((t) => t.id === formData.auditorId);
      const orgId = (user as any)?.user_metadata?.organization_id;
      const isValidUuid = (id: string) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          id
        );

      const { data, error } = await supabase
        .from("audit_sessions")
        .insert({
          template_id: template.id,
          template_name: template.name,
          auditor_id: formData.auditorId,
          auditor_name: selectedAuditor?.name,
          department: formData.department,
          due_date: formData.dueDate,
          status: "Pending",
          progress: 0,
          created_by: user?.id,
          organization_id: isValidUuid(orgId) ? orgId : null,
        })
        .select()
        .single();

      if (error) throw error;

      // generate the direct access link for the focused execution page
      const accessLink = `${window.location.origin}/execute/${data.id}`;

      // Send email using Nodemailer API
      try {
        const response = await fetch("/api/send-audit-link", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: selectedAuditor?.email,
            auditorName: selectedAuditor?.name,
            templateName: template.name,
            accessLink: accessLink,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Email API Error:", errorData);
          throw new Error("Email dispatch failed");
        }
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // We don't throw here to ensure the audit launch itself is considered successful
        toast.warning(
          "Audit launched, but email notification failed. Please check SMTP settings."
        );
      }

      toast.success(
        `Audit launched! Notification sent to ${selectedAuditor?.email}`
      );
      router.push("/dashboard/audits");
      onClose();
    } catch (error: any) {
      console.error("Error launching audit:", error);
      toast.error(error.message || "Failed to launch audit session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-lg border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Rocket className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Launch Audit
                </h3>
                <p className="text-sm font-bold text-slate-400">
                  Initialize a new assessment session
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Selected Template
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {template.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                  Assign Lead Auditor
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={formData.auditorId}
                    onChange={(e) =>
                      setFormData({ ...formData, auditorId: e.target.value })
                    }
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border-none text-sm font-bold text-slate-600 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer appearance-none"
                  >
                    <option value="">Select Auditor</option>
                    {team.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                  Target Department / Site
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="e.g., Manufacturing Floor A"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="h-12 pl-12 rounded-xl bg-slate-50 border-none text-sm font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                  Deadline Date
                </Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className="h-12 pl-12 rounded-xl bg-slate-50 border-none text-sm font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-10">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl border-slate-100 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLaunch}
              disabled={loading}
              className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20"
            >
              {loading ? "Launching..." : "Confirm Launch"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
