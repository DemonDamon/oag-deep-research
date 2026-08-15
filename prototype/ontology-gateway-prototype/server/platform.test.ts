import type { TrpcContext } from "./_core/context";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { createStoredProposalMock, decideStoredProposalMock, getStoredGovernanceCenterMock } = vi.hoisted(() => ({
  createStoredProposalMock: vi.fn(),
  decideStoredProposalMock: vi.fn(),
  getStoredGovernanceCenterMock: vi.fn(),
}));

vi.mock("./platformDb", () => ({
  createStoredProposal: createStoredProposalMock,
  decideStoredProposal: decideStoredProposalMock,
  getStoredGovernanceCenter: getStoredGovernanceCenterMock,
}));

import { appRouter } from "./routers";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(
  authenticated = false,
  enterpriseRole: AuthenticatedUser["enterpriseRole"] = "supervisor",
): TrpcContext {
  const user: AuthenticatedUser | null = authenticated
    ? {
        id: 7,
        openId: "supervisor-user",
        email: "supervisor@example.com",
        name: "测试主管",
        loginMethod: "manus",
        role: "user",
        enterpriseRole,
        createdAt: new Date("2026-08-14T00:00:00.000Z"),
        updatedAt: new Date("2026-08-14T00:00:00.000Z"),
        lastSignedIn: new Date("2026-08-14T00:00:00.000Z"),
      }
    : null;

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("platform public contracts", () => {
  it("returns the enterprise operating overview", async () => {
    const caller = appRouter.createCaller(createContext());

    const overview = await caller.platform.overview();

    expect(overview.pendingApprovals).toBe(1);
    expect(overview.alerts).toHaveLength(3);
    expect(overview.serviceHealth.map(item => item.name)).toEqual([
      "CRM Hub",
      "ERP Core",
      "MES Edge",
    ]);
    expect(overview.objectPulse.some(item => item.id === "OBJ-O-4021")).toBe(true);
  });

  it("returns an ontology-grounded answer with an inspectable tool trace", async () => {
    const caller = appRouter.createCaller(createContext());

    const result = await caller.platform.oag.ask({
      question: "订单 SO-4021 为什么延期？",
      objectId: "OBJ-O-4021",
    });

    expect(result.answer).toContain("SO-4021");
    expect(result.trace.map(step => step.kind)).toEqual([
      "Query",
      "Query",
      "Function",
      "Function",
    ]);
    expect(result.trace.every(step => step.status === "完成")).toBe(true);
    expect(result.citations).toHaveLength(4);
    expect(result.confidence).toBeGreaterThanOrEqual(90);
  });

  it("only creates a non-persistent preview before an authenticated submission", async () => {
    const caller = appRouter.createCaller(createContext());

    const preview = await caller.platform.action.previewProposal({
      optionId: "OPT-B",
      objectId: "OBJ-O-4021",
    });

    expect(preview.status).toBe("演示预览");
    expect(preview.approvalRequired).toBe(true);
    expect(preview.idempotencyKey).toContain("SO-4021");
    expect(createStoredProposalMock).not.toHaveBeenCalled();
  });
});

describe("platform governed write paths", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getStoredGovernanceCenterMock.mockResolvedValue({ proposals: [], auditEvents: [] });
  });

  it("persists an Action proposal with actor context and an idempotency key", async () => {
    createStoredProposalMock.mockResolvedValue({
      proposalId: "PROP-240814-001",
      status: "待审批",
      idempotencyKey: "OBJ-O-4021:erp.schedule.action:v17:OPT-B",
    });
    const caller = appRouter.createCaller(createContext(true));

    const result = await caller.platform.action.submitProposal({
      optionId: "OPT-B",
      objectId: "OBJ-O-4021",
    });

    expect(createStoredProposalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        optionId: "OPT-B",
        objectId: "OBJ-O-4021",
      }),
      expect.objectContaining({ id: 7, name: "测试主管", enterpriseRole: "supervisor" }),
    );
    expect(result.status).toBe("待审批");
    expect(result.idempotencyKey).toContain("OBJ-O-4021");
  });

  it("rejects proposal persistence for an unauthenticated caller", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.platform.action.submitProposal({
        optionId: "OPT-B",
        objectId: "OBJ-O-4021",
      }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    expect(createStoredProposalMock).not.toHaveBeenCalled();
  });

  it("records an approval decision through the governance contract", async () => {
    decideStoredProposalMock.mockResolvedValue({
      proposalId: "PROP-240814-001",
      status: "已批准",
    });
    const caller = appRouter.createCaller(createContext(true));

    const result = await caller.platform.governance.decideProposal({
      proposalId: "PROP-240814-001",
      decision: "approved",
      comment: "证据、影响和回滚计划均已核验。",
    });

    expect(decideStoredProposalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        proposalId: "PROP-240814-001",
        decision: "approved",
      }),
      expect.objectContaining({ id: 7, name: "测试主管", enterpriseRole: "supervisor" }),
    );
    expect(result.status).toBe("已批准");
  });

  it("rejects approval for a business employee even when authenticated", async () => {
    const caller = appRouter.createCaller(createContext(true, "business_employee"));

    await expect(
      caller.platform.governance.decideProposal({
        proposalId: "PROP-240814-001",
        decision: "approved",
        comment: "无审批权限的测试请求。",
      }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(decideStoredProposalMock).not.toHaveBeenCalled();
  });

  it("completes the object-to-audit governed decision contract", async () => {
    createStoredProposalMock.mockResolvedValue({
      proposalId: "PROP-240814-FLOW",
      status: "待审批",
      idempotencyKey: "OBJ-O-4021:erp.schedule.action:v17:OPT-B",
    });
    decideStoredProposalMock.mockResolvedValue({
      proposalId: "PROP-240814-FLOW",
      status: "已批准",
    });
    const caller = appRouter.createCaller(createContext(true));

    const graph = await caller.platform.objects.graph({ objectId: "OBJ-O-4021" });
    expect(graph.focus.id).toBe("OBJ-O-4021");
    expect(graph.edges.length).toBeGreaterThan(0);

    const analysis = await caller.platform.oag.ask({
      question: "分析订单 SO-4021 的延期风险与证据",
      objectId: graph.focus.id,
    });
    expect(analysis.citations.length).toBeGreaterThan(0);
    expect(analysis.trace.every(step => step.status === "完成")).toBe(true);

    const simulation = await caller.platform.decision.simulate({ optionId: "OPT-B" });
    expect(simulation.option?.id).toBe("OPT-B");
    expect(simulation.checks.some(check => check.name === "回滚计划" && check.status === "已生成")).toBe(true);

    const proposal = await caller.platform.action.submitProposal({
      optionId: "OPT-B",
      objectId: graph.focus.id,
    });
    expect(proposal.status).toBe("待审批");

    const approval = await caller.platform.governance.decideProposal({
      proposalId: proposal.proposalId,
      decision: "approved",
      comment: "闭环测试：证据、影响和回滚计划均已核验。",
    });
    expect(approval.status).toBe("已批准");
    expect(createStoredProposalMock).toHaveBeenCalledOnce();
    expect(decideStoredProposalMock).toHaveBeenCalledOnce();

    getStoredGovernanceCenterMock.mockResolvedValue({
      proposals: [
        {
          id: proposal.proposalId,
          title: "调整 SO-4021 排产优先级",
          objectId: graph.focus.id,
          capabilityKey: "erp.schedule.action",
          status: "已批准",
          requester: "supervisor-user",
          idempotencyKey: proposal.idempotencyKey,
          expectedObjectVersion: 17,
          simulationSummary: "已完成对象版本、跨系统影响、权限和回滚检查。",
          rollbackPlan: "恢复原排产并转入外协方案评审。",
          createdAt: new Date("2026-08-14T09:35:00.000Z"),
          risk: "高",
          approver: "企业治理策略",
          age: null,
        },
      ],
      auditEvents: [
        {
          id: "AUD-FLOW-APPROVED",
          correlationId: proposal.proposalId,
          actor: "supervisor-user",
          event: "ACTION_PROPOSAL_APPROVED",
          object: graph.focus.id,
          summary: `提案 ${proposal.proposalId} 已批准`,
          createdAt: new Date("2026-08-14T09:36:00.000Z"),
          time: null,
        },
      ],
    });

    const governance = await caller.platform.governance.center();
    expect(
      governance.proposals.some(
        item => item.id === proposal.proposalId && item.status === "已批准",
      ),
    ).toBe(true);
    expect(
      governance.auditEvents.some(
        event =>
          event.correlationId === proposal.proposalId &&
          event.event === "ACTION_PROPOSAL_APPROVED",
      ),
    ).toBe(true);
  });
});
