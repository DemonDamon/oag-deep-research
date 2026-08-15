import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CapabilityKind } from "@shared/domain";
import { ArrowUpRight, CircleDot, Loader2 } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
      <div className="max-w-3xl">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-300">
          <span className="h-px w-8 bg-gradient-to-r from-teal-300 to-transparent" />
          {eyebrow}
        </div>
        <h1 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </header>
  );
}

export function Panel({
  children,
  className,
  title,
  eyebrow,
  action,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  eyebrow?: string;
  action?: React.ReactNode;
}) {
  return (
    <section className={cn("glass-panel rounded-2xl", className)}>
      {title ? (
        <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-4">
          <div>
            {eyebrow ? <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-300">{eyebrow}</p> : null}
            <h2 className="mt-1 text-sm font-semibold text-slate-100">{title}</h2>
          </div>
          {action}
        </div>
      ) : null}
      <div className={cn(title ? "p-5" : "p-5")}>{children}</div>
    </section>
  );
}

export function MetricCard({
  label,
  value,
  delta,
  tone = "teal",
  icon,
}: {
  label: string;
  value: string | number;
  delta: string;
  tone?: "teal" | "orange" | "red" | "slate";
  icon: React.ReactNode;
}) {
  const tones = {
    teal: "from-teal-300/20 via-teal-300/[0.03] text-teal-200",
    orange: "from-orange-400/20 via-orange-300/[0.03] text-orange-200",
    red: "from-red-400/20 via-red-300/[0.03] text-red-200",
    slate: "from-slate-400/15 via-white/[0.02] text-slate-200",
  };
  return (
    <div className={cn("glass-panel relative overflow-hidden rounded-2xl bg-gradient-to-br to-transparent p-5", tones[tone])}>
      <div className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-current opacity-[0.06] blur-2xl" />
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <span className="rounded-xl border border-white/[0.07] bg-black/20 p-2">{icon}</span>
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{delta}</p>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const positive = ["在线", "已发布", "已批准", "已验证", "启用", "完成", "通过", "已生成"].some(item =>
    status.includes(item),
  );
  const warning = ["降级", "待", "评审", "观察", "关注", "需", "受限", "草稿"].some(item => status.includes(item));
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium",
        positive && "border-teal-300/20 bg-teal-300/10 text-teal-200",
        warning && "border-orange-300/20 bg-orange-300/10 text-orange-200",
        !positive && !warning && "border-red-300/20 bg-red-300/10 text-red-200",
      )}
    >
      <CircleDot className="mr-1 h-2.5 w-2.5" />
      {status}
    </Badge>
  );
}

export function CapabilityBadge({ kind }: { kind: CapabilityKind | string }) {
  const styles: Record<string, string> = {
    Query: "border-cyan-300/20 bg-cyan-300/10 text-cyan-200",
    Function: "border-violet-300/20 bg-violet-300/10 text-violet-200",
    Proposal: "border-orange-300/20 bg-orange-300/10 text-orange-200",
    Action: "border-red-300/20 bg-red-300/10 text-red-200",
    Event: "border-teal-300/20 bg-teal-300/10 text-teal-200",
  };
  return <span className={cn("rounded-md border px-2 py-1 font-mono text-[10px]", styles[kind] ?? styles.Query)}>{kind}</span>;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/10 px-6 text-center">
      <ArrowUpRight className="mb-3 h-5 w-5 text-teal-300" />
      <p className="font-medium text-slate-200">{title}</p>
      <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}

export function LoadingPanel({ label = "正在读取企业语义层" }: { label?: string }) {
  return (
    <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-slate-400">
      <Loader2 className="h-4 w-4 animate-spin text-teal-300" />
      {label}
    </div>
  );
}
