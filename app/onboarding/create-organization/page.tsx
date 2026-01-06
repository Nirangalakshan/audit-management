"use client";

import type React from "react";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Upload,
  Shield,
  CheckCircle2,
  Building2,
  Globe,
  Users2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CreateOrganizationPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    businessType: "",
    industry: "",
    companySize: "",
    country: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please log in to continue");
        router.push("/login");
        return;
      }

      // Step 1: Create the organization record and get its ID
      const { data: orgData, error: orgError } = await supabase
        .from("organization_profile")
        .insert([
          {
            company_name: formData.companyName,
            business_type: formData.businessType,
            industry: formData.industry,
            company_size: formData.companySize,
            region: formData.country,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (orgError) throw orgError;

      // Step 2: Save the organization_id to the user's metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          organization_id: orgData.id,
        },
      });

      if (updateError) throw updateError;

      toast.success("Organization created successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to create organization");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <nav className="border-b border-gray-200/50 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Shield className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              AuditFlow
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
              <span>Step 1 of 1</span>
              <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-full h-full bg-blue-600 rounded-full" />
              </div>
            </div>
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="font-bold text-slate-600 hover:text-primary"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        {/* Intro */}
        <div className="max-w-2xl mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Let's set up your <br />
            <span className="text-blue-600">organization.</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            Configure your workspace to match your industry standards and team
            structure.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-4xl border border-slate-200 shadow-sm p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                      Company Name
                    </label>
                    <Input
                      required
                      type="text"
                      name="companyName"
                      placeholder="e.g. Acme Corp"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="h-12 bg-slate-50 border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                      Business Type
                    </label>
                    <select
                      required
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                    >
                      <option value="">Select type...</option>
                      <option value="factory">Enterprise</option>
                      <option value="hospital">Government</option>
                      <option value="school">Small Business</option>
                      <option value="audit-firm">Audit Firm</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                      Industry
                    </label>
                    <Input
                      required
                      type="text"
                      name="industry"
                      placeholder="e.g. Manufacturing"
                      value={formData.industry}
                      onChange={handleChange}
                      className="h-12 bg-slate-50 border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                      Company Size
                    </label>
                    <select
                      required
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleChange}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                    >
                      <option value="">Select size...</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="200+">200+ employees</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Country / Region
                  </label>
                  <Input
                    required
                    type="text"
                    name="country"
                    placeholder="e.g. United States"
                    value={formData.country}
                    onChange={handleChange}
                    className="h-12 bg-slate-50 border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        Initialize Workspace
                        <ArrowRight className="w-6 h-6" />
                      </>
                    )}
                  </Button>
                  <p className="text-center text-slate-400 text-xs mt-6 font-medium">
                    By clicking initialize, you agree to our Terms of Service
                    and Privacy Policy.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar / Logo Upload */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-4xl border border-slate-200 shadow-sm p-10">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-6">
                Logo Configuration
              </h3>

              <div className="relative group cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-upload-main"
                />
                <label
                  htmlFor="logo-upload-main"
                  className="block w-full border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center group-hover:border-blue-500 group-hover:bg-blue-50/10 transition-all cursor-pointer"
                >
                  {logoFile ? (
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border border-white mb-4 bg-white">
                        <img
                          src={
                            URL.createObjectURL(logoFile) || "/placeholder.svg"
                          }
                          alt="Logo preview"
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <p className="text-sm font-bold text-slate-900 mb-1">
                        {logoFile.name}
                      </p>
                      <p className="text-xs text-blue-600 font-black uppercase tracking-widest">
                        Click to Change
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-10 h-10 text-slate-300 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <p className="text-sm font-bold text-slate-900 mb-1">
                        Upload Brand Logo
                      </p>
                      <p className="text-xs text-slate-400 font-medium">
                        SVG, PNG, or JPG (max 2MB)
                      </p>
                    </div>
                  )}
                </label>
              </div>
              <p className="text-xs text-slate-400 mt-6 leading-relaxed font-medium">
                This logo will represent your organization in all generated
                audit reports and team communications.
              </p>
            </div>

            {/* Why AuditFlow */}
            <div className="bg-blue-600 rounded-4xl p-10 text-white shadow-xl shadow-blue-500/20">
              <h4 className="text-lg font-bold mb-6">What to expect:</h4>
              <div className="space-y-5">
                {[
                  { icon: Building2, text: "Organization-wide standards" },
                  { icon: Users2, text: "Seamless team onboarding" },
                  { icon: CheckCircle2, text: "Pre-configured audit engine" },
                  { icon: Globe, text: "Global regulatory compliance" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-sm tracking-tight">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
