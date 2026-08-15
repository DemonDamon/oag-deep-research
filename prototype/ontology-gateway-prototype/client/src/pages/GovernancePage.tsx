import { useAuth } from "@/_core/hooks/useAuth";
import {
  CapabilityBadge,
  LoadingPanel,
  PageHeader,
  Panel,
  StatusBadge,
} from "@/components/PlatformUI";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  FileCheck2,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

function formatMoment(createdAt: Date | null, fallback?: string | null) {
  if (createdAt) {
    return new Date(createdAt).toLocaleString("zh-CN", {
      hour12: false,
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return fallback ?? "演示记录";
}

export function Governance() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const { data, isLoading, isFetching } = trpc.platform.governance.center.useQuery();
  const [evidenceId, setEvidenceId] = useState<string | null>(null);

  const decide = trpc.platform.governance.decideProposal.useMutation({
    onSuccess: async result => {
      toast.success(`提案 ${result.proposalId} ${result.status}`);
      setEvidenceId(result.proposalId);
      await utils.platform.governance.center.invalidate();
      await utils.platform.overview.invalidate();
    },
    onError: error => {
      const code = error.data?.code;
      if (code === "UNAUTHORIZED") {
        toast.error("请先登录，再执行审批决策");
      } else if (code === "FORBIDDEN") {
        toast.error("当前企业角色没有审批权限，请切换为主管或开发/治理人员");
      } else if (code === "NOT_FOUND") {
        toast.error("该提案不是数据库中的待审批记录，可能已处理或属于演示数据");
      } else {
        toast.error(error.message || "审批失败，请稍后重试");
      }
    },
  });

  const selectedEvidence = useMemo(
    () => data?.proposals.find(item => item.id === evidenceId) ?? null,
    [data?.proposals, evidenceId],
  );

  if (isLoading || !data) return <LoadingPanel label="正在汇聚提案、策略与审计轨迹" />;

  const requestDecision = (proposalId: string, decision: "approved" | "rejected") => {
    if (!user) {
      toast.error("请先通过右下角账户入口登录，再执行审批决策");
      return;
    }
    decide.mutate({
      proposalId,
      decision,
      comment:
        decision === "approved"
          ? "已核验对象版本、跨系统影响、权限与回滚计划。"
          : "当前证据或影响评估不足，退回补充。",
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Approval & control plane"
        title="审批与治理中心"
        description="将 Action 审批、权限策略、审计事件和工具白名单集中在同一治理视图中。数据库提案的审批结果会立即回流队列与审计轨迹。"
        actions={
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 text-[10px] text-slate-500 sm:flex">
              <span className={`h-1.5 w-1.5 rounded-full ${isFetching ? "bg-orange-300" : "bg-teal-300"}`} />
              {isFetching ? "同步中" : "治理读模型已同步"}
            </span>
            <Button
              onClick={() => setLocation("/decision")}
              className="rounded-xl bg-teal-300 text-[#061718] hover:bg-teal-200"
            >
              创建提案 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <Panel title="Action 审批队列" eyebrow="Human-in-the-loop">
          <div className="space-y-3">
            {data.proposals.map(item => {
              const isStored = item.createdAt !== null;
              const isPending = item.status === "待审批";
              const isActive = evidenceId === item.id;
              const mutatingThis = decide.isPending && decide.variables?.proposalId === item.id;
              return (
                <div
                  key={item.id}
                  className={`rounded-xl border bg-black/10 p-4 transition-colors ${
                    isActive ? "border-teal-300/25" : "border-white/[0.05]"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <CapabilityBadge kind="Proposal" />
                      <span className="font-mono text-[9px] text-slate-600">{item.id}</span>
                      {isStored ? (
                        <span className="rounded-full border border-teal-300/15 bg-teal-300/[0.06] px-2 py-1 text-[8px] text-teal-200">
                          数据库记录
                        </span>
                      ) : (
                        <span className="rounded-full border border-white/[0.06] px-2 py-1 text-[8px] text-slate-600">
                          演示记录
                        </span>
                      )}
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-3 text-sm font-medium text-white">{item.title}</p>
                  <p className="mt-2 text-[9px] text-slate-600">
                    {item.objectId} · {item.requester} → {item.approver} · {formatMoment(item.createdAt, item.age)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-lg border-white/10 bg-white/[0.03] text-[10px]"
                      onClick={() => setEvidenceId(isActive ? null : item.id)}
                    >
                      {isActive ? <ChevronUp className="mr-1.5 h-3 w-3" /> : <ChevronDown className="mr-1.5 h-3 w-3" />}
                      {isActive ? "收起证据" : "查看证据"}
                    </Button>
                    <Button
                      size="sm"
                      disabled={!isStored || !isPending || mutatingThis}
                      className="h-8 rounded-lg bg-teal-300 text-[10px] text-[#061718] hover:bg-teal-200"
                      onClick={() => requestDecision(item.id, "approved")}
                    >
                      <Check className="mr-1.5 h-3 w-3" />
                      {mutatingThis && decide.variables?.decision === "approved" ? "批准中" : "批准"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!isStored || !isPending || mutatingThis}
                      className="h-8 rounded-lg border-red-300/15 bg-red-300/[0.03] text-[10px] text-red-200 hover:bg-red-300/[0.08]"
                      onClick={() => requestDecision(item.id, "rejected")}
                    >
                      <X className="mr-1.5 h-3 w-3" />
                      {mutatingThis && decide.variables?.decision === "rejected" ? "退回中" : "退回"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel title="提案证据包" eyebrow="Decision evidence">
            {selectedEvidence ? (
              <div className="space-y-3">
                <div className="rounded-xl border border-teal-300/10 bg-teal-300/[0.04] p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] text-teal-200">{selectedEvidence.capabilityKey}</span>
                    <StatusBadge status={selectedEvidence.status} />
                  </div>
                  <p className="mt-3 text-xs font-medium text-white">{selectedEvidence.title}</p>
                  <p className="mt-2 font-mono text-[9px] text-slate-600">
                    version {selectedEvidence.expectedObjectVersion} · {selectedEvidence.idempotencyKey}
                  </p>
                </div>
                <div className="rounded-xl border border-white/[0.05] bg-black/10 p-4">
                  <p className="flex items-center gap-2 text-[10px] font-medium text-slate-300">
                    <FileCheck2 className="h-3.5 w-3.5 text-teal-300" />模拟摘要
                  </p>
                  <p className="mt-2 text-[9px] leading-5 text-slate-600">
                    {selectedEvidence.simulationSummary ?? "演示证据：已完成版本、影响与策略检查。"}
                  </p>
                </div>
                <div className="rounded-xl border border-orange-300/10 bg-orange-300/[0.04] p-4">
                  <p className="flex items-center gap-2 text-[10px] font-medium text-orange-200">
                    <RotateCcw className="h-3.5 w-3.5" />回滚计划
                  </p>
                  <p className="mt-2 text-[9px] leading-5 text-slate-600">
                    {selectedEvidence.rollbackPlan ?? "执行失败时恢复原业务状态并写入补偿审计事件。"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid min-h-52 place-items-center rounded-xl border border-dashed border-white/[0.08] px-8 text-center">
                <div>
                  <ShieldCheck className="mx-auto h-6 w-6 text-slate-700" />
                  <p className="mt-3 text-xs text-slate-500">选择提案查看版本、幂等键、模拟摘要与回滚计划</p>
                </div>
              </div>
            )}
          </Panel>

          <Panel title="策略配置" eyebrow="Policy-as-code">
            <div className="space-y-3">
              {data.policies.map(policy => (
                <div key={policy.id} className="rounded-xl border border-white/[0.05] bg-black/10 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] text-teal-300">{policy.id}</span>
                    <StatusBadge status={policy.effect} />
                  </div>
                  <p className="mt-3 text-xs font-medium text-white">{policy.name}</p>
                  <p className="mt-2 text-[9px] text-slate-600">
                    {policy.role} · {policy.resource} · {policy.permission}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_430px]">
        <Panel title="审计事件" eyebrow="Append-only trail">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-[9px] uppercase tracking-wider text-slate-600">
                  <th className="pb-3">时间</th>
                  <th className="pb-3">Actor</th>
                  <th className="pb-3">Event</th>
                  <th className="pb-3">Object</th>
                  <th className="pb-3">摘要</th>
                </tr>
              </thead>
              <tbody>
                {data.auditEvents.map(item => (
                  <tr key={item.id} className="border-b border-white/[0.04]">
                    <td className="py-4 font-mono text-[9px] text-slate-500">
                      {formatMoment(item.createdAt, item.time)}
                    </td>
                    <td className="py-4 text-slate-300">{item.actor}</td>
                    <td className="py-4 font-mono text-[9px] text-teal-300">{item.event}</td>
                    <td className="py-4 font-mono text-[9px] text-slate-500">{item.object}</td>
                    <td className="py-4 text-slate-500">{item.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="工具白名单" eyebrow="Agent governance">
          <div className="space-y-3">
            {data.toolWhitelist.map(tool => (
              <div key={tool.key} className="rounded-xl border border-white/[0.05] bg-black/10 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[9px] text-teal-200">{tool.key}</p>
                  <StatusBadge status={tool.status} />
                </div>
                <p className="mt-2 text-[9px] text-slate-600">{tool.access} · {tool.callers.join(" / ")}</p>
              </div>
            ))}
            <div className="rounded-xl border border-orange-300/10 bg-orange-300/[0.04] p-4">
              <p className="flex items-center gap-2 text-[10px] text-orange-200">
                <LockKeyhole className="h-3.5 w-3.5" />审批写路径
              </p>
              <p className="mt-2 text-[9px] leading-5 text-slate-600">
                仅数据库提案可执行审批；演示记录保持只读。审批会写入 approvals 与 auditEvents。
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}
