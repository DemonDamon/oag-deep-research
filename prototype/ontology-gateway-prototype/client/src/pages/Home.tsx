import { MetricCard, PageHeader, Panel, StatusBadge, LoadingPanel } from "@/components/PlatformUI";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Activity, AlertTriangle, ArrowRight, ClipboardCheck, Network, RadioTower } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();
  const { data, isLoading } = trpc.platform.overview.useQuery(undefined, { refetchInterval: 10000 });
  if (isLoading || !data) return <LoadingPanel label="正在汇聚跨系统运营脉冲" />;

  return (
    <>
      <PageHeader
        eyebrow="Live enterprise pulse"
        title="把企业运行态势，收敛成可治理的决策闭环"
        description="实时聚合异常、待办、审批与对象变化。每个信号都能回到统一企业对象、证据来源和受控 Action。"
        actions={<Button onClick={() => setLocation("/decision")} className="rounded-xl bg-orange-400 text-[#1a0d06] hover:bg-orange-300">进入决策工作台 <ArrowRight className="ml-2 h-4 w-4" /></Button>}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="活跃异常" value={data.alerts.length} delta="过去 30 分钟新增 2 条" tone="red" icon={<AlertTriangle className="h-4 w-4" />} />
        <MetricCard label="待办任务" value={data.tasks.length} delta="1 项将在 2 小时内到期" tone="orange" icon={<ClipboardCheck className="h-4 w-4" />} />
        <MetricCard label="待审批提案" value={data.pendingApprovals} delta="高风险 Action 需双签" tone="teal" icon={<Activity className="h-4 w-4" />} />
        <MetricCard label="在线连接器" value={`${data.serviceHealth.filter(item => item.status === "在线").length}/${data.serviceHealth.length}`} delta="MES Edge 当前处于降级态" tone="slate" icon={<RadioTower className="h-4 w-4" />} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <Panel title="异常事件流" eyebrow="Signals" action={<span className="flex items-center gap-2 text-[10px] text-teal-300"><span className="pulse-soft h-1.5 w-1.5 rounded-full bg-teal-300" />10 秒刷新</span>}>
          <div className="space-y-3">
            {data.alerts.map((alert, index) => (
              <button key={alert.id} onClick={() => setLocation(index === 0 ? "/decision" : "/objects")} className="group flex w-full items-start gap-4 rounded-xl border border-white/[0.05] bg-black/10 p-4 text-left hover:border-teal-300/15 hover:bg-white/[0.03]">
                <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-red-400/10 text-red-300"><AlertTriangle className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><StatusBadge status={alert.severity} /><span className="font-mono text-[9px] text-slate-600">{alert.id}</span></div>
                  <p className="mt-2 text-sm font-medium text-slate-200">{alert.title}</p>
                  <p className="mt-1 text-[10px] text-slate-500">{alert.system} · {alert.objectId} · {alert.age}</p>
                </div>
                <ArrowRight className="mt-2 h-4 w-4 text-slate-700 transition-transform group-hover:translate-x-1 group-hover:text-teal-300" />
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="服务健康度" eyebrow="Distributed fabric">
          <div className="space-y-4">
            {data.serviceHealth.map(item => (
              <div key={item.key} className="rounded-xl border border-white/[0.05] bg-black/10 p-4">
                <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Network className="h-3.5 w-3.5 text-teal-300" /><span className="text-xs font-medium text-slate-200">{item.name}</span></div><StatusBadge status={item.status} /></div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.04]"><div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-300" style={{ width: `${Math.max(34, 100 - item.latency / 4)}%` }} /></div>
                <p className="mt-2 text-[9px] text-slate-600">P95 latency · {item.latency} ms</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel title="我的任务" eyebrow="Work queue">
          <div className="divide-y divide-white/[0.05]">
            {data.tasks.map(task => <div key={task.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"><div className="h-2 w-2 rounded-full bg-orange-400" /><div className="min-w-0 flex-1"><p className="text-xs text-slate-200">{task.title}</p><p className="mt-1 text-[9px] text-slate-600">{task.owner} · {task.due}</p></div><StatusBadge status={task.status} /></div>)}
          </div>
        </Panel>
        <Panel title="关键对象变化" eyebrow="Object pulse">
          <div className="grid gap-3 sm:grid-cols-2">
            {data.objectPulse.map(item => <button key={item.id} onClick={() => setLocation("/objects")} className="rounded-xl border border-white/[0.05] bg-black/10 p-4 text-left hover:bg-white/[0.03]"><p className="font-mono text-[9px] text-teal-300">{item.id}</p><p className="mt-2 truncate text-xs font-medium text-slate-200">{item.name}</p><div className="mt-3 flex items-center justify-between"><StatusBadge status={item.status} /><span className="text-[9px] text-slate-600">{item.updated}</span></div></button>)}
          </div>
        </Panel>
      </div>
    </>
  );
}
