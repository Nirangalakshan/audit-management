"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Shield,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Chrome,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.user) {
        setIsSent(true);
        toast.success("Verification link sent to your email!");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up with Google");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
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
          <Link href="/login">
            <Button variant="ghost" className="font-bold text-slate-600">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 md:p-10 relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-50 rounded-full blur-2xl opacity-50" />

            <div className="relative">
              {!isSent ? (
                <>
                  <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                      Create your <span className="text-blue-600">account</span>
                    </h1>
                    <p className="text-slate-500 font-medium">
                      Start your journey with AuditFlow today.
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    <Button
                      onClick={handleGoogleSignup}
                      className="w-full h-14 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all"
                    >
                      <Chrome className="w-5 h-5" />
                      Continue with Google
                    </Button>
                  </div>

                  <div className="relative mb-8 text-center">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-slate-100"></div>
                    </div>
                    <span className="relative z-10 bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                      Or use email
                    </span>
                  </div>

                  <form onSubmit={handleSignup} className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-xs font-bold uppercase tracking-widest text-slate-500"
                      >
                        Work Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@company.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-xs font-bold uppercase tracking-widest text-slate-500"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Must be at least 8 characters.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <Mail className="w-10 h-10" />
                  </div>
                  <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                    Check your <span className="text-blue-600">email</span>
                  </h1>
                  <p className="text-slate-600 font-medium leading-relaxed mb-8">
                    We've sent a verification link to <br />
                    <span className="text-slate-900 font-bold">{email}</span>. <br />
                    Please click the link to activate your account.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsSent(false)}
                    className="h-12 rounded-xl border-slate-200 font-bold text-slate-600"
                  >
                    Use a different email
                  </Button>
                </div>
              )}
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500 font-medium">
            Protected by AuditFlow Secure™ •{" "}
            <Link href="/terms" className="text-slate-900 hover:underline">
              Terms
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
