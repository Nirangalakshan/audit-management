"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  AlertCircle,
  BarChart3,
  Users,
  Settings,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Shield,
  Bell,
  Search,
  User,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Audits",
    href: "/dashboard/audits",
    icon: CheckSquare,
  },
  {
    label: "Templates",
    href: "/dashboard/templates",
    icon: FileText,
  },
  {
    label: "Non-Compliances",
    href: "/dashboard/non-compliances",
    icon: AlertCircle,
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    label: "Team",
    href: "/dashboard/team",
    icon: Users,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [companyName, setCompanyName] = useState<string>("Loading...");
  const [userName, setUserName] = useState<string>("");

  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUserAndOrg = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserName(user.email?.split("@")[0] || "User");

      const { data: org, error } = await supabase
        .from("organization_profile")
        .select("company_name")
        .eq("user_id", user.id)
        .single();

      if (!org && pathname !== "/onboarding/create-organization") {
        router.push("/onboarding/create-organization");
      } else if (org) {
        setCompanyName(org.company_name);
      }
    };

    checkUserAndOrg();
  }, [pathname, router, supabase]);

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen bg-[#fafafa]">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 ${
          isCollapsed ? "w-24" : "w-72"
        } bg-slate-900 transition-all duration-300 md:static md:translate-x-0 flex flex-col shadow-2xl shadow-slate-900/20`}
      >
        {/* Logo & Collapse Toggle */}
        <div
          className={`p-8 flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Shield className="text-white w-6 h-6" />
            </div>
            {!isCollapsed && (
              <span className="font-black text-xl tracking-tight text-white italic animate-in fade-in slide-in-from-left-2 duration-300">
                AuditFlow
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex absolute -right-4 top-10 w-8 h-8 bg-slate-800 border-4 border-[#fafafa] rounded-full items-center justify-center text-slate-400 hover:text-white transition-all shadow-lg z-50 group"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 group-hover:scale-110" />
            ) : (
              <ChevronLeft className="w-4 h-4 group-hover:scale-110" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto overflow-x-hidden">
          {!isCollapsed && (
            <div className="px-4 mb-4 animate-in fade-in duration-300">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Main Menu
              </span>
            </div>
          )}
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.label : ""}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 shrink-0 ${
                    active ? "scale-110" : "group-hover:scale-110"
                  }`}
                />
                {!isCollapsed && (
                  <span className="text-sm font-bold tracking-tight animate-in fade-in slide-in-from-left-2 duration-300">
                    {item.label}
                  </span>
                )}
                {active && !isCollapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
                {active && isCollapsed && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-l-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Pro Plan Indicator */}
        {!isCollapsed ? (
          <div className="p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="p-5 bg-linear-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-3xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-4 h-4 text-blue-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                    Enterprise Plan
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed mb-4">
                  You're using 82% of your audit quota for June.
                </p>
                <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-blue-600/10">
                  Upgrade Now
                </button>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
            </div>
          </div>
        ) : (
          <div className="p-4 flex justify-center">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
        )}

        {/* Settings at bottom */}
        <div className="p-4 bg-slate-950/50">
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative ${
              isActive("/dashboard/settings")
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            } ${isCollapsed ? "justify-center" : ""}`}
            title={isCollapsed ? "Settings" : ""}
          >
            <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform shrink-0" />
            {!isCollapsed && (
              <span className="text-sm font-bold tracking-tight animate-in fade-in slide-in-from-left-2 duration-300">
                System Settings
              </span>
            )}
            {isActive("/dashboard/settings") && isCollapsed && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/50 rounded-l-full" />
            )}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-6 flex-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <div className="hidden md:flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 w-full max-w-sm group focus-within:bg-white focus-within:border-blue-200 transition-all">
              <Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
              <input
                type="text"
                placeholder="Search audits, teams, or reports..."
                className="bg-transparent border-none outline-none px-3 text-sm font-medium w-full text-slate-600 placeholder:text-slate-400"
              />
              <kbd className="hidden lg:flex items-center gap-1 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-black text-slate-400 shadow-sm">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>

            <div className="w-px h-6 bg-slate-200 mx-2" />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className={`flex items-center gap-3 p-1 rounded-2xl transition-all ${
                  profileOpen ? "bg-slate-50" : "hover:bg-slate-50"
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-blue-500/20">
                  {companyName.substring(0, 2).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left mr-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">
                    ADMIN
                  </p>
                  <p className="text-sm font-bold text-slate-900 leading-none capitalize">
                    {companyName}
                  </p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-100 rounded-3xl shadow-2xl shadow-slate-200/50 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-50 mb-1">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                      {companyName}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-2xl transition-all">
                      <User className="w-4 h-4 text-slate-400" />
                      View Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-2xl transition-all">
                      <Settings className="w-4 h-4 text-slate-400" />
                      Preferences
                    </button>
                    <div className="h-px bg-slate-50 mx-2" />
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Background Elements */}
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-50/50 blur-[120px] -z-10 pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-indigo-50/50 blur-[120px] -z-10 pointer-events-none rounded-full" />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 relative z-10 scroll-smooth">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
