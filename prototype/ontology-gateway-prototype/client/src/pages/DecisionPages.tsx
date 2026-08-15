import { CapabilityBadge, LoadingPanel, PageHeader, Panel, StatusBadge } from "@/components/PlatformUI";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { ArrowRight, Check, ClipboardCheck, GitCompareArrows, History, LockKeyhole, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export function OagAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [result, setResult] = useState<ReturnType<typeof trpc.platform.oag.ask.useMutation>["data"]>();
  const ask = trpc.platform.oag.ask.useMutation({ onSuccess: data => { setResult(data); setMessages(current => [...current, { role: "assistant", content: data.answer }]); } });
  const handleSend = (content: string) => { setMessages(current => [...current, { role: "user", content }]); ask.mutate({ question: content, objectId: "OBJ-O-4021" }); };
  return <><PageHeader eyebrow="Ontology-augmented intelligence" title="OAG 智能助手" description="回答被统一企业对象、确定性规则和证据来源约束。每一步工具调用均可检查，并且不能从聊天直接绕过 Action 门控。" />
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_430px]">
      <AIChatBox messages={messages} onSendMessage={handleSend} isLoading={ask.isPending} placeholder="询问对象、关系、风险或决策依据…" height="690px" emptyStateMessage="从企业对象出发，而不是从一段无来源文本出发" suggestedPrompts={["订单 SO-4021 为什么延期？", "设备 EQ-4401 会影响哪些客户订单？", "比较三个交付风险处置方案"]} className="glass-panel border-white/[0.07] bg-transparent" />
      <div className="space-y-5"><Panel title="工具调用轨迹" eyebrow="Trace">{result ? <div className="space-y-3">{result.trace.map(step => <div key={step.step} className="rounded-xl border border-white/[0.05] bg-black/10 p-4"><div className="flex items-center justify-between"><CapabilityBadge kind={step.kind} /><StatusBadge status={step.status} /></div><p className="mt-3 font-mono text-[10px] text-teal-200">{step.tool}</p><p className="mt-2 text-[9px] leading-4 text-slate-600">{step.detail}</p></div>)}</div> : <p className="py-10 text-center text-xs text-slate-600">提交问题后显示可审计工具轨迹</p>}</Panel><Panel title="规则计算" eyebrow="Deterministic logic">{result ? <><p className="font-mono text-[10px] leading-5 text-orange-200">{result.ruleResult}</p><div className="mt-4 flex items-center justify-between"><span className="text-[10px] text-slate-600">结论置信度</span><span className="text-lg font-semibold text-white">{result.confidence}%</span></div></> : <p className="text-xs text-slate-600">等待对象查询与 Function 完成</p>}</Panel><Panel title="来源引用" eyebrow="Evidence">{result ? <div className="space-y-3">{result.citations.map(item => <div key={item.ref} className="border-l border-teal-300/30 pl-3"><p className="text-[10px] font-medium text-slate-300">{item.source}</p><p className="mt-1 font-mono text-[9px] text-slate-600">{item.ref}</p><p className="mt-1 text-[8px] text-slate-700">{item.observedAt}</p></div>)}</div> : <p className="text-xs text-slate-600">来源将绑定对象字段与观察时间</p>}</Panel></div>
    </div></>;
}

export function Decision() {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.platform.decision.workspace.useQuery();
  const simulate = trpc.platform.decision.simulate.useMutation();
  const preview = trpc.platform.action.previewProposal.useMutation();
  const submit = trpc.platform.action.submitProposal.useMutation({
    onSuccess: async result => {
      await utils.platform.governance.center.invalidate();
      await utils.platform.overview.invalidate();
      toast.success(`提案 ${result.proposalId} 已进入审批队列`);
      setLocation("/governance");
    },
    onError: error => toast.error(error.message || "提案提交失败，请稍后重试"),
  });
  const { user } = useAuth();
  const [selected, setSelected] = useState<"OPT-A" | "OPT-B" | "OPT-C">("OPT-B");
  if (isLoading || !data) return <LoadingPanel />;
  const selectedOption = data.options.find(item => item.id === selected)!;
  const createProposal = async () => { const result = await preview.mutateAsync({ optionId: selected, objectId: data.objectId }); toast.success(`已生成 ${result.status}：${result.proposalId}`); };
  const submitProposal = () => {
    if (!user) {
      toast("请先登录，再将演示提案提交到企业审批队列");
      return;
    }
    submit.mutate({ optionId: selected, objectId: data.objectId });
  };
  return <><PageHeader eyebrow="Governed decision loop" title="决策工作台" description="比较方案、运行确定性模拟并检查跨系统影响。任何 Action 都先生成提案和回滚计划，再进入人工审批。" actions={<Button variant="outline" className="rounded-xl border-white/10 bg-white/[0.03]" onClick={() => simulate.mutate({ optionId: selected })}><Sparkles className="mr-2 h-4 w-4" />运行模拟</Button>} />
    <div className="grid gap-5 xl:grid-cols-[340px_1fr_360px]">
      <Panel title="对象基线" eyebrow="Decision context"><p className="font-mono text-[10px] text-teal-300">{data.objectId}</p><h3 className="mt-2 text-base font-semibold text-white">{data.title}</h3><div className="mt-5 space-y-2">{Object.entries(data.baseline).map(([key,value]) => <div key={key} className="flex items-center justify-between rounded-xl bg-black/10 p-3 text-xs"><span className="text-slate-500">{key}</span><span className="font-medium text-slate-200">{value}</span></div>)}</div><div className="mt-5 rounded-xl border border-orange-300/10 bg-orange-300/[0.04] p-4"><p className="flex items-center gap-2 text-[10px] font-medium text-orange-200"><RotateCcw className="h-3.5 w-3.5" />回滚边界</p><p className="mt-2 text-[9px] leading-5 text-slate-600">{data.rollback}</p></div></Panel>
      <Panel title="方案比较" eyebrow="Scenario simulation"><div className="grid gap-3 lg:grid-cols-3">{data.options.map(option => <button key={option.id} onClick={() => setSelected(option.id as typeof selected)} className={`rounded-2xl border p-4 text-left ${selected === option.id ? "border-teal-300/30 bg-teal-300/[0.07] shadow-[0_0_40px_rgba(94,234,212,.06)]" : "border-white/[0.05] bg-black/10"}`}><div className="flex items-center justify-between"><span className="font-mono text-[9px] text-slate-600">{option.id}</span>{data.recommended === option.id ? <StatusBadge status="推荐" /> : null}</div><p className="mt-4 min-h-10 text-sm font-semibold text-white">{option.name}</p><div className="mt-4 space-y-2 text-[10px]"><p className="flex justify-between"><span className="text-slate-600">预计交付</span><span className="text-slate-300">{option.delivery}</span></p><p className="flex justify-between"><span className="text-slate-600">增量成本</span><span className="text-slate-300">{option.cost}</span></p><p className="flex justify-between"><span className="text-slate-600">风险</span><span className="text-orange-200">{option.risk}</span></p></div><p className="mt-4 border-t border-white/[0.05] pt-3 text-[9px] leading-4 text-slate-600">{option.impact}</p></button>)}</div>{simulate.data ? <div className="mt-5 grid gap-3 md:grid-cols-2">{simulate.data.checks.map(check => <div key={check.name} className="rounded-xl border border-white/[0.05] bg-black/10 p-4"><div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-200">{check.name}</span><StatusBadge status={check.status} /></div><p className="mt-2 text-[9px] leading-4 text-slate-600">{check.detail}</p></div>)}</div> : <div className="mt-5 rounded-xl border border-dashed border-white/[0.08] p-6 text-center text-xs text-slate-600">选择方案并运行模拟，检查对象版本、跨系统影响、权限和回滚计划</div>}</Panel>
      <Panel title="Action 提案" eyebrow="Controlled writeback"><div className="rounded-xl border border-white/[0.05] bg-black/10 p-4"><div className="flex items-center justify-between"><CapabilityBadge kind="Action" /><StatusBadge status="需审批" /></div><h3 className="mt-4 text-sm font-semibold text-white">{selectedOption.name}</h3><p className="mt-2 text-[9px] leading-4 text-slate-600">目标对象 {data.objectId} · 期望版本 17</p></div><div className="mt-4 space-y-3">{["幂等键锁定", "对象版本检查", "跨系统影响检查", "回滚计划生成", "主管双签审批"].map((item,index) => <div key={item} className="flex items-center gap-3 text-xs text-slate-400"><span className={`grid h-6 w-6 place-items-center rounded-full ${index < 4 && simulate.data ? "bg-teal-300/10 text-teal-300" : "bg-white/[0.04] text-slate-700"}`}>{index < 4 && simulate.data ? <Check className="h-3 w-3" /> : <LockKeyhole className="h-3 w-3" />}</span>{item}</div>)}</div><Button onClick={createProposal} disabled={!simulate.data || preview.isPending} className="mt-6 w-full rounded-xl bg-orange-400 text-[#1a0d06] hover:bg-orange-300">生成受控提案 <ArrowRight className="ml-2 h-4 w-4" /></Button><Button onClick={submitProposal} disabled={!preview.data || submit.isPending} variant="outline" className="mt-3 w-full rounded-xl border-white/10 bg-white/[0.03]">提交审批队列</Button><p className="mt-3 text-center text-[8px] leading-4 text-slate-700">演示模式生成预览；登录后才会持久化提案与审计事件。</p></Panel>
    </div></>;
}

export function Governance() {
  const { data, isLoading } = trpc.platform.governance.center.useQuery();
  if (isLoading || !data) return <LoadingPanel />;
  return <><PageHeader eyebrow="Approval & control plane" title="审批与治理中心" description="将 Action 审批、权限策略、审计事件和工具白名单集中在同一治理视图中，阻断无证据、无授权和不可回滚的操作。" />
    <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]"><Panel title="Action 审批队列" eyebrow="Human-in-the-loop"><div className="space-y-3">{data.proposals.map(item => <div key={item.id} className="rounded-xl border border-white/[0.05] bg-black/10 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><CapabilityBadge kind="Proposal" /><span className="font-mono text-[9px] text-slate-600">{item.id}</span></div><StatusBadge status={item.status} /></div><p className="mt-3 text-sm font-medium text-white">{item.title}</p><p className="mt-2 text-[9px] text-slate-600">{item.objectId} · {item.requester} → {item.approver} · {item.age}</p><div className="mt-4 flex gap-2"><Button size="sm" variant="outline" className="h-8 rounded-lg border-white/10 bg-white/[0.03] text-[10px]" onClick={() => toast("已打开提案证据包（演示）")}>查看证据</Button><Button size="sm" className="h-8 rounded-lg bg-teal-300 text-[10px] text-[#061718] hover:bg-teal-200" onClick={() => toast("审批写操作需要登录且服务端角色为主管或开发/治理人员")}>审批</Button></div></div>)}</div></Panel><Panel title="策略配置" eyebrow="Policy-as-code"><div className="space-y-3">{data.policies.map(policy => <div key={policy.id} className="rounded-xl border border-white/[0.05] bg-black/10 p-4"><div className="flex items-center justify-between"><span className="font-mono text-[9px] text-teal-300">{policy.id}</span><StatusBadge status={policy.effect} /></div><p className="mt-3 text-xs font-medium text-white">{policy.name}</p><p className="mt-2 text-[9px] text-slate-600">{policy.role} · {policy.resource} · {policy.permission}</p></div>)}</div></Panel></div>
    <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_430px]"><Panel title="审计事件" eyebrow="Append-only trail"><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-xs"><thead><tr className="border-b border-white/[0.06] text-[9px] uppercase tracking-wider text-slate-600"><th className="pb-3">时间</th><th className="pb-3">Actor</th><th className="pb-3">Event</th><th className="pb-3">Object</th><th className="pb-3">摘要</th></tr></thead><tbody>{data.auditEvents.map(item => <tr key={item.id} className="border-b border-white/[0.04]"><td className="py-4 font-mono text-[9px] text-slate-500">{item.time}</td><td className="py-4 text-slate-300">{item.actor}</td><td className="py-4 font-mono text-[9px] text-teal-300">{item.event}</td><td className="py-4 font-mono text-[9px] text-slate-500">{item.object}</td><td className="py-4 text-slate-500">{item.summary}</td></tr>)}</tbody></table></div></Panel><Panel title="工具白名单" eyebrow="Agent governance"><div className="space-y-3">{data.toolWhitelist.map(tool => <div key={tool.key} className="rounded-xl border border-white/[0.05] bg-black/10 p-3"><div className="flex items-center justify-between"><p className="font-mono text-[9px] text-teal-200">{tool.key}</p><StatusBadge status={tool.status} /></div><p className="mt-2 text-[9px] text-slate-600">{tool.access} · {tool.callers.join(" / ")}</p></div>)}</div></Panel></div>
  </>;
}
