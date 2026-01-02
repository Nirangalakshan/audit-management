"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle2,
  BarChart3,
  FileText,
  Shield,
  Globe,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Background Mesh Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/30 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="border-b border-gray-200/50 sticky top-0 z-50 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Shield className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              AuditFlow
            </span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {["Features", "Solutions", "Pricing", "Resources"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-slate-600 hover:text-primary font-medium"
              >
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-blue-500/10 px-6 rounded-full">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 md:pt-32 md:pb-48">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
              <Zap className="w-3.5 h-3.5" />
              <span>Version 2.0 is now live</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-[1.1]">
              Audit management <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
                reimagined for speed.
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              The only compliance platform that scales with your growth. Build,
              track, and report on your audits across the entire organization in
              minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="h-14 px-10 text-lg bg-slate-900 hover:bg-slate-800 text-white w-full rounded-full shadow-2xl shadow-slate-200"
                >
                  Start your journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 text-lg hover:bg-white bg-transparent border-gray-200 text-slate-700 w-full rounded-full"
              >
                Watch dynamic demo
              </Button>
            </div>

            {/* Trusted By */}
            <div className="mt-20">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">
                Trusted by industry leaders
              </p>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Replace with actual logos in a real app */}
                {["Acme Corp", "GlobalTech", "Nexus", "Stellar", "Wave"].map(
                  (name) => (
                    <span
                      key={name}
                      className="text-xl font-black text-slate-800 tracking-tighter italic"
                    >
                      {name}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Dashboard Preview Overlay */}
          <div className="relative max-w-6xl mx-auto mt-8">
            <div className="absolute inset-0 bg-blue-500/20 blur-[120px] -z-10 rounded-full scale-95 opacity-50" />
            <div className="rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm p-2 shadow-2xl overflow-hidden group">
              <div className="rounded-xl overflow-hidden border border-gray-100 shadow-inner relative aspect-video">
                <div className="absolute inset-0 bg-linear-to-br from-slate-100 to-slate-200 animate-pulse" />
                {/* Image component would go here */}
                <img
                  src="/assets/audit_dashboard_hero.png" // Placeholder for the actual image path
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  alt="AuditFlow Dashboard"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.parentElement!.classList.add(
                      "flex",
                      "items-center",
                      "justify-center"
                    );
                    target.parentElement!.innerHTML = `<p class="text-slate-400 font-medium">Dashboard Preview</p>`;
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
              <div className="max-w-2xl text-left">
                <h2 className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-4">
                  Core Capabilities
                </h2>
                <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                  Everything you need to stay compliant.
                </h3>
                <p className="text-lg text-slate-600 font-medium">
                  No more spreadsheets. Just high-quality audit workflows
                  designed to save your team hundreds of hours per year.
                </p>
              </div>
              <div className="mt-8 md:mt-0">
                <Button
                  variant="link"
                  className="text-primary font-bold px-0 text-lg group"
                >
                  See all features{" "}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: FileText,
                  title: "Smart Checklists",
                  description:
                    "Dynamic templates that adapt to your business type and industry regulations automatically.",
                  color: "bg-blue-500",
                },
                {
                  icon: Shield,
                  title: "Bank-grade Security",
                  description:
                    "End-to-end encryption for all your audit evidence and sensitive organizational data.",
                  color: "bg-indigo-500",
                },
                {
                  icon: BarChart3,
                  title: "Real-time Analytics",
                  description:
                    "Visualize compliance gaps and risks before they become issues with our proprietary AI engine.",
                  color: "bg-violet-500",
                },
                {
                  icon: Globe,
                  title: "Global Standards",
                  description:
                    "Pre-built frameworks for ISO 27001, SOC2, HIPAA, and custom local regulations.",
                  color: "bg-emerald-500",
                },
                {
                  icon: Users,
                  title: "Team Collaboration",
                  description:
                    "Assign auditors, reviewers, and stakeholders with granular permissions and workflows.",
                  color: "bg-amber-500",
                },
                {
                  icon: Zap,
                  title: "Instant Reporting",
                  description:
                    "Generate boardroom-ready PDFs and CSVs in one click with customizable branding.",
                  color: "bg-rose-500",
                },
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={idx}
                    className="p-10 border-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] bg-[#fdfdfd] hover:bg-white hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 group rounded-3xl"
                  >
                    <div
                      className={`w-14 h-14 ${feature.color} text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-base">
                      {feature.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                Simple, transparent pricing.
              </h2>
              <p className="text-slate-400 text-xl max-w-xl mx-auto">
                Choose the scale that fits your organization today.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Grow",
                  price: "$149",
                  period: "/mo",
                  description: "Ideal for small audit teams.",
                  features: [
                    "Up to 10 audits/month",
                    "Full compliance engine",
                    "Basic report templates",
                    "Email support",
                  ],
                  cta: "Start Growing",
                },
                {
                  name: "Scale",
                  price: "$499",
                  period: "/mo",
                  description: "Our most popular choice.",
                  features: [
                    "Unlimited audits",
                    "AI risk predictions",
                    "Custom branding",
                    "Priority 24/7 support",
                    "API access",
                  ],
                  cta: "Start Scaling",
                  highlighted: true,
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  period: "",
                  description: "For global operations.",
                  features: [
                    "SAML SSO & SCIM",
                    "Dedicated manager",
                    "On-premise deployments",
                    "Unlimited users",
                    "Security assessment",
                  ],
                  cta: "Contact Sales",
                },
              ].map((plan, idx) => (
                <div
                  key={idx}
                  className={`relative p-10 rounded-[2.5rem] flex flex-col h-full ${
                    plan.highlighted
                      ? "bg-white shadow-2xl scale-105 z-10"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] uppercase font-black tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-blue-500/20">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-8">
                    <h3
                      className={`text-2xl font-bold mb-2 ${
                        plan.highlighted ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {plan.name}
                    </h3>
                    <p
                      className={`text-sm ${
                        plan.highlighted ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-10">
                    <span
                      className={`text-5xl font-black ${
                        plan.highlighted ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={`text-sm font-medium ml-1 ${
                        plan.highlighted ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {plan.period}
                    </span>
                  </div>

                  <div className="space-y-4 mb-12 flex-1">
                    {plan.features.map((feature, fdx) => (
                      <div key={fdx} className="flex items-center gap-3">
                        <CheckCircle2
                          className={`w-5 h-5 flex-shrink-0 ${
                            plan.highlighted
                              ? "text-blue-500"
                              : "text-blue-400/60"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            plan.highlighted
                              ? "text-slate-600"
                              : "text-slate-300"
                          }`}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full h-14 rounded-2xl text-lg font-bold transition-all duration-300 ${
                      plan.highlighted
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600" />
          <div className="absolute top-0 right-0 w-[50%] h-full bg-indigo-500 mix-blend-multiply opacity-50 blur-[100px] rounded-full translate-x-1/4" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
              Ready to transform your audits?
            </h2>
            <p className="text-blue-100 text-xl mb-12 max-w-2xl mx-auto font-medium opacity-90">
              Join 500+ compliance teams who replaced their spreadsheets with
              AuditFlow.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="h-16 px-12 text-lg bg-white text-blue-600 hover:bg-blue-50 w-full rounded-2xl font-bold shadow-2xl"
                >
                  Get Started for Free
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="h-16 px-12 text-lg border-white/20 text-white hover:bg-white/10 w-full rounded-2xl font-bold backdrop-blur-sm"
              >
                Book a Strategy Call
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="text-white w-4 h-4" />
                </div>
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  AuditFlow
                </span>
              </div>
              <p className="text-slate-500 leading-relaxed mb-6">
                Redefining precision in audit and compliance management.
              </p>
              <div className="flex gap-4">
                {[Globe, Users, Zap].map((Icon, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all cursor-pointer"
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                ))}
              </div>
            </div>

            {["Product", "Company", "Legal"].map((cat) => (
              <div key={cat}>
                <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-[10px]">
                  {cat}
                </h4>
                <ul className="space-y-4">
                  {["Link One", "Link Two", "Link Three", "Link Four"].map(
                    (link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-slate-500 hover:text-primary text-sm font-medium transition-colors"
                        >
                          {link}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-slate-400 text-sm font-medium italic">
              © 2025 AuditFlow. Precision & Excellence.
            </p>
            <div className="flex gap-8">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-slate-400 hover:text-slate-600 text-sm font-medium"
                  >
                    {item}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
