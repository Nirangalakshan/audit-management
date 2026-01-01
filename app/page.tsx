"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, CheckCircle2, BarChart3, FileText, Shield } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-lg text-foreground">AuditFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-foreground/80 hover:text-foreground transition">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-foreground/80 hover:text-foreground transition">
              How it works
            </a>
            <a href="#pricing" className="text-sm text-foreground/80 hover:text-foreground transition">
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/onboarding/create-organization">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Simplify Compliance. Digitize Audits.
            </h1>
            <p className="text-lg text-foreground/70 mb-8 text-pretty">
              Streamline your audit and compliance management with an intelligent, easy-to-use platform designed for
              modern enterprises.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/onboarding/create-organization">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Book a Demo
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-gradient-to-br from-blue-100/50 to-blue-50/30 rounded-2xl p-8 h-96 flex items-center justify-center border border-blue-100/50">
              <div className="text-center">
                <BarChart3 className="w-32 h-32 text-blue-400 mx-auto mb-4 opacity-50" />
                <p className="text-foreground/50 font-medium">Audit Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-secondary/30 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              Everything you need to manage audits, track compliance, and streamline your audit operations
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FileText,
                title: "Digital Audits",
                description: "Create and conduct audits with customizable templates and checklists",
              },
              {
                icon: Shield,
                title: "Evidence Management",
                description: "Securely store and organize audit evidence and documentation",
              },
              {
                icon: BarChart3,
                title: "Compliance Tracking",
                description: "Monitor compliance status and identify non-conformances in real-time",
              },
              {
                icon: FileText,
                title: "Auto Reports",
                description: "Generate professional audit reports automatically with one click",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Card key={idx} className="p-6 bg-card border-border hover:shadow-lg transition">
                  <Icon className="w-8 h-8 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-foreground/70 text-sm">{feature.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How it Works</h2>
          <p className="text-foreground/70 text-lg">Get started in three simple steps</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Create Organization",
              description: "Set up your organization and configure audit templates tailored to your industry",
            },
            {
              step: "2",
              title: "Conduct Audits",
              description: "Execute audits using pre-built templates or custom questionnaires",
            },
            {
              step: "3",
              title: "Track & Report",
              description: "Monitor compliance, track non-conformances, and generate reports automatically",
            },
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-foreground/70">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-secondary/30 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Simple Pricing</h2>
            <p className="text-foreground/70 text-lg">Choose the perfect plan for your organization</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "$99",
                period: "/month",
                description: "Perfect for small teams",
                features: ["Up to 3 audits/month", "5 team members", "Basic templates", "Email support"],
              },
              {
                name: "Business",
                price: "$299",
                period: "/month",
                description: "For growing organizations",
                features: [
                  "Unlimited audits",
                  "25 team members",
                  "Advanced templates",
                  "Priority support",
                  "Custom branding",
                ],
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "pricing",
                description: "For large enterprises",
                features: [
                  "Unlimited everything",
                  "Dedicated support",
                  "SSO & advanced security",
                  "API access",
                  "Custom integrations",
                ],
              },
            ].map((plan, idx) => (
              <Card
                key={idx}
                className={`p-8 border-border ${plan.highlighted ? "ring-2 ring-blue-600 shadow-xl" : ""}`}
              >
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-foreground/70 text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-foreground/70 ml-2">{plan.period}</span>
                </div>
                <Button className="w-full mb-8 bg-blue-600 hover:bg-blue-700">Get Started</Button>
                <div className="space-y-4">
                  {plan.features.map((feature, fdx) => (
                    <div key={fdx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/80 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to simplify compliance?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Join hundreds of organizations using AuditFlow to streamline their audit operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding/create-organization">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50">
                Start Free Trial
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-white text-white hover:bg-blue-700 bg-transparent"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <span className="font-bold text-foreground">AuditFlow</span>
              </div>
              <p className="text-foreground/70 text-sm">Simplifying compliance management for enterprises worldwide</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-foreground/70 text-sm">© 2025 AuditFlow. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-foreground/70 hover:text-foreground transition text-sm">
                Twitter
              </a>
              <a href="#" className="text-foreground/70 hover:text-foreground transition text-sm">
                LinkedIn
              </a>
              <a href="#" className="text-foreground/70 hover:text-foreground transition text-sm">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
