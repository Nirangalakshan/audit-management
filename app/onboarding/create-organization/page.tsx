"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowRight, Upload } from "lucide-react"
import Link from "next/link"

export default function CreateOrganizationPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    businessType: "",
    industry: "",
    companySize: "",
    country: "",
  })

  const [logoFile, setLogoFile] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setLogoFile(e.target.files[0])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-lg text-foreground">AuditFlow</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-foreground/70">Step 1 of 1</span>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Existing Organization? Login
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Create your organization</h1>
          <p className="text-lg text-foreground/70">
            Tell us about your organization so we can customize AuditFlow for your needs
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 border-border">
              <form className="space-y-6">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Company Name</label>
                  <Input
                    type="text"
                    name="companyName"
                    placeholder="Your Company Inc."
                    value={formData.companyName}
                    onChange={handleChange}
                    className="bg-secondary/50 border-border"
                  />
                  <p className="text-xs text-foreground/60 mt-1">The official name of your organization</p>
                </div>

                {/* Business Type */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Business Type</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-secondary/50 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Select business type</option>
                    <option value="factory">Factory</option>
                    <option value="hospital">Hospital</option>
                    <option value="school">School</option>
                    <option value="construction">Construction</option>
                    <option value="audit-firm">Audit Firm</option>
                  </select>
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Industry</label>
                  <Input
                    type="text"
                    name="industry"
                    placeholder="e.g., Manufacturing, Healthcare, Education"
                    value={formData.industry}
                    onChange={handleChange}
                    className="bg-secondary/50 border-border"
                  />
                </div>

                {/* Company Size */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Company Size</label>
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-secondary/50 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="200+">200+ employees</option>
                  </select>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Country</label>
                  <Input
                    type="text"
                    name="country"
                    placeholder="United States"
                    value={formData.country}
                    onChange={handleChange}
                    className="bg-secondary/50 border-border"
                  />
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-8">
                  Create Organization
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </Card>
          </div>

          {/* Logo Upload */}
          <div>
            <Card className="p-8 border-border sticky top-32">
              <h3 className="font-semibold text-foreground mb-4">Organization Logo</h3>

              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer group">
                <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" id="logo-upload" />
                <label htmlFor="logo-upload" className="cursor-pointer block">
                  {logoFile ? (
                    <div className="text-center">
                      <img
                        src={URL.createObjectURL(logoFile) || "/placeholder.svg"}
                        alt="Logo preview"
                        className="w-full h-24 object-contain mb-2"
                      />
                      <p className="text-sm text-foreground/70">{logoFile.name}</p>
                      <p className="text-xs text-foreground/50 mt-2">Click to change</p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-foreground/40 mx-auto mb-2 group-hover:text-blue-600 transition" />
                      <p className="text-sm font-medium text-foreground mb-1">Upload logo</p>
                      <p className="text-xs text-foreground/60">PNG, JPG, or GIF</p>
                    </div>
                  )}
                </label>
              </div>

              <p className="text-xs text-foreground/60 mt-4">
                Your logo will appear in your audit reports and team dashboard. Recommended size: 200x200px
              </p>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[
            {
              title: "Customized Templates",
              description: "Industry-specific audit templates tailored to your organization",
            },
            {
              title: "Team Collaboration",
              description: "Invite team members and assign roles for seamless workflows",
            },
            {
              title: "Automated Reports",
              description: "Generate professional reports with your branding automatically",
            },
          ].map((feature, idx) => (
            <Card key={idx} className="p-6 border-border bg-secondary/30">
              <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
              <p className="text-sm text-foreground/70">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
