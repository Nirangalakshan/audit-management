"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, ArrowRight, Github, Chrome, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        toast.success("Welcome back!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid login credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || `Failed to sign in with ${provider}`);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Visual/Marketing */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/login_background_abstract.png"
            className="w-full h-full object-cover opacity-60"
            alt="Login Background"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-linear-to-br from-blue-900/40 via-transparent to-slate-900/80" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <Link href="/" className="flex items-center gap-2.5 group w-fit">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Shield className="text-blue-600 w-6 h-6" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">
              AuditFlow
            </span>
          </Link>

          <div>
            <div className="max-w-md">
              <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                Empowering the next generation of audit management.
              </h2>
              <div className="h-1 w-20 bg-blue-500 rounded-full mb-8" />
              <p className="text-lg text-slate-300 mb-10 leading-relaxed font-medium">
                "AuditFlow has completely transformed how we handle our annual
                compliance reviews. It's not just a tool; it's a strategic
                advantage."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-white font-bold">
                  SK
                </div>
                <div>
                  <p className="text-white font-bold">Sarah Jenkins</p>
                  <p className="text-slate-400 text-sm italic">
                    Head of Compliance at GlobalTech
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-slate-500 text-sm font-medium italic">
            © 2025 AuditFlow. Secure. Intelligent. Precise.
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 sm:px-12 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <Link
              href="/"
              className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg mb-6"
            >
              <Shield className="text-white w-6 h-6" />
            </Link>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-500 font-medium">
              Please enter your details to sign in.
            </p>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => handleOAuthLogin("google")}
              className="h-12 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-bold transition-all"
            >
              <Chrome className="w-5 h-5 mr-3" />
              Sign in with Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthLogin("github")}
              className="h-12 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-bold transition-all"
            >
              <Github className="w-5 h-5 mr-3" />
              Sign in with GitHub
            </Button>
          </div>

          <div className="relative mb-8 text-center">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <span className="relative z-10 bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
              Or continue with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Email Address
              </label>
              <Input
                type="email"
                name="email"
                placeholder="m@company.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-12 bg-slate-50/50 border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 transition"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="h-12 bg-slate-50/50 border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-lg shadow-xl shadow-slate-200 transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>
          </form>

          <p className="mt-10 text-center text-slate-500 font-medium">
            Don't have an organization yet?{" "}
            <Link
              href="/onboarding/create-organization"
              className="text-blue-600 hover:text-blue-700 font-bold decoration-2 underline-offset-4 hover:underline transition-all"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
