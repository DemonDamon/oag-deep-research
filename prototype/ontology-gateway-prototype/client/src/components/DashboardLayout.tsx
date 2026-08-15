import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { useEnterpriseRole } from "@/contexts/RoleContext";
import { cn } from "@/lib/utils";
import type { EnterpriseRole } from "@shared/domain";
import {
  Activity,
  Boxes,
  ChevronLeft,
  Fingerprint,
  GitCompareArrows,
  KeyRound,
  LogIn,
  LogOut,
  Menu,
  Network,
  PlugZap,
  RadioTower,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const menuItems = [
  { icon: Activity, label: "运营首页", path: "/" },
  { icon: Network, label: "对象与关系", path: "/objects" },
  { icon: Boxes, label: "本体工作室", path: "/ontology" },
  { icon: PlugZap, label: "连接器管理", path: "/connectors" },
  { icon: Sparkles, label: "OAG 智能助手", path: "/oag" },
  { icon: GitCompareArrows, label: "决策工作台", path: "/decision" },
  { icon: ShieldCheck, label: "审批与治理", path: "/governance" },
  { icon: Fingerprint, label: "身份映射", path: "/identity" },
  { icon: RadioTower, label: "MCP/API 网关", path: "/gateway" },
  { icon: KeyRound, label: "角色权限", path: "/access" },
] as const;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { role, roles, setRole } = useEnterpriseRole();

  useEffect(() => setMobileOpen(false), [location]);

  const activeItem = menuItems.find(item => item.path === location) ?? menuItems[0];

  return (
    <div className="cinematic-shell min-h-screen text-slate-100">
      <div className="ambient-orb ambient-orb-teal" />
      <div className="ambient-orb ambient-orb-orange" />
      <div className="signal-grid fixed inset-0 pointer-events-none opacity-30" />

      {mobileOpen ? <button className="fixed inset-0 z-40 bg-black/65 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="关闭导航" /> : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/[0.07] bg-[#061719]/95 shadow-[24px_0_80px_rgba(0,0,0,.28)] backdrop-blur-2xl transition-[width,transform] duration-200",
          collapsed ? "w-[78px]" : "w-[260px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-[78px] items-center gap-3 border-b border-white/[0.06] px-5">
          <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-teal-300 to-teal-600 text-[#041315] shadow-[0_0_32px_rgba(94,234,212,.18)]">
            <Network className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#061719] bg-orange-400" />
          </div>
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold tracking-[0.18em] text-white">ORION</p>
              <p className="truncate text-[10px] uppercase tracking-[0.14em] text-slate-500">Ontology Command</p>
            </div>
          ) : null}
          <button className="ml-auto rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-white lg:hidden" onClick={() => setMobileOpen(false)} aria-label="关闭侧边导航">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {!collapsed ? <p className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-600">Enterprise surfaces</p> : null}
          {menuItems.map(item => {
            const active = item.path === location;
            return (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs transition-all duration-150",
                  active
                    ? "bg-gradient-to-r from-teal-300/15 to-teal-300/[0.03] font-medium text-teal-100 shadow-[inset_0_0_0_1px_rgba(94,234,212,.1)]"
                    : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200",
                  collapsed && "justify-center px-0",
                )}
              >
                {active ? <span className="absolute -left-3 h-5 w-0.5 rounded-r-full bg-teal-300 shadow-[0_0_14px_rgba(94,234,212,.7)]" /> : null}
                <item.icon className={cn("h-4 w-4 shrink-0", active && "text-teal-300")} />
                {!collapsed ? <span>{item.label}</span> : null}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/[0.06] p-3">
          {!collapsed ? (
            <div className="mb-3 rounded-xl border border-orange-300/10 bg-orange-300/[0.04] p-3">
              <div className="flex items-center gap-2 text-[10px] font-medium text-orange-200">
                <RadioTower className="h-3.5 w-3.5" />
                MCP/API 网关
              </div>
              <p className="mt-1.5 text-[9px] leading-4 text-slate-500">AgenticX · Near 终端智能体</p>
            </div>
          ) : null}
          <div className={cn("flex items-center gap-3 rounded-xl p-2", collapsed && "justify-center")}> 
            <Avatar className="h-8 w-8 border border-white/10 bg-teal-300/10">
              <AvatarFallback className="bg-transparent text-xs text-teal-200">{user?.name?.slice(0, 1) ?? "演"}</AvatarFallback>
            </Avatar>
            {!collapsed ? (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-slate-200">{user?.name ?? "企业演示模式"}</p>
                <p className="truncate text-[9px] text-slate-600">{role}</p>
              </div>
            ) : null}
            {!collapsed ? (
              user ? (
                <button onClick={logout} className="rounded-lg p-2 text-slate-600 hover:bg-white/5 hover:text-white" aria-label="退出登录"><LogOut className="h-3.5 w-3.5" /></button>
              ) : (
                <button onClick={() => startLogin()} className="rounded-lg p-2 text-slate-600 hover:bg-white/5 hover:text-white" aria-label="登录"><LogIn className="h-3.5 w-3.5" /></button>
              )
            ) : null}
          </div>
        </div>
      </aside>

      <div className={cn("min-h-screen transition-[padding] duration-200", collapsed ? "lg:pl-[78px]" : "lg:pl-[260px]")}>
        <header className="sticky top-0 z-30 flex h-[78px] items-center gap-4 border-b border-white/[0.06] bg-[#071719]/80 px-4 backdrop-blur-2xl md:px-7">
          <button className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-2.5 text-slate-400 hover:text-white lg:hidden" onClick={() => setMobileOpen(true)} aria-label="打开侧边导航"><Menu className="h-4 w-4" /></button>
          <button className="hidden rounded-xl border border-white/[0.06] bg-white/[0.03] p-2.5 text-slate-500 hover:text-white lg:block" onClick={() => setCollapsed(value => !value)} aria-label="折叠导航">
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </button>
          <div className="hidden min-w-0 flex-1 items-center md:flex">
            <Search className="mr-3 h-4 w-4 text-slate-600" />
            <span className="text-xs text-slate-500">搜索对象、关系、Action 或审计事件</span>
            <kbd className="ml-auto rounded-md border border-white/[0.06] bg-black/20 px-2 py-1 font-mono text-[9px] text-slate-600">⌘ K</kbd>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-teal-300/10 bg-teal-300/[0.05] px-3 py-2 text-[10px] text-teal-200 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-300 shadow-[0_0_10px_rgba(94,234,212,.8)]" />
              企业语义层在线
            </div>
            <label className="relative">
              <span className="sr-only">切换演示角色</span>
              <select
                value={role}
                onChange={event => setRole(event.target.value as EnterpriseRole)}
                className="h-9 appearance-none rounded-xl border border-white/[0.07] bg-[#0a2426] py-0 pl-3 pr-8 text-[10px] font-medium text-slate-200 outline-none ring-teal-300/30 focus:ring-2"
              >
                {roles.map(item => <option key={item} value={item}>{item}</option>)}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[8px] text-slate-500">▼</span>
            </label>
          </div>
        </header>

        <div className="border-b border-white/[0.04] bg-black/10 px-4 py-2 md:px-7">
          <div className="flex items-center justify-between gap-4 text-[9px] uppercase tracking-[0.13em] text-slate-600">
            <span>{activeItem.label}</span>
            <span>曜石制造集团 · Ontology v2.4.1 · CN-East</span>
          </div>
        </div>

        <main className="relative mx-auto w-full max-w-[1680px] px-4 py-7 md:px-7 lg:py-9">{children}</main>
      </div>
    </div>
  );
}
