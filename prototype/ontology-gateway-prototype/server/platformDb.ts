import { randomUUID } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import {
  actionProposals,
  approvals,
  auditEvents,
  type User,
} from "../drizzle/schema";
import { getDb } from "./db";

type CreateProposalInput = {
  objectId: string;
  optionId: string;
  capabilityKey: string;
  title: string;
  expectedObjectVersion: number;
  rollbackPlan: string;
  simulationSummary: string;
};

const proposalStatusLabels = {
  draft: "草稿",
  simulated: "已模拟",
  pending_approval: "待审批",
  approved: "已批准",
  rejected: "已拒绝",
  executed: "已执行",
  rolled_back: "已回滚",
} as const;

export async function getStoredGovernanceCenter() {
  const db = await getDb();
  if (!db) return { proposals: [], auditEvents: [] };

  const [proposalRows, auditRows] = await Promise.all([
    db
      .select({
        id: actionProposals.proposalId,
        title: actionProposals.title,
        objectId: actionProposals.objectId,
        capabilityKey: actionProposals.capabilityKey,
        status: actionProposals.status,
        requester: actionProposals.requestedByOpenId,
        idempotencyKey: actionProposals.idempotencyKey,
        expectedObjectVersion: actionProposals.expectedObjectVersion,
        simulationSummary: actionProposals.simulationSummary,
        rollbackPlan: actionProposals.rollbackPlan,
        createdAt: actionProposals.createdAt,
      })
      .from(actionProposals)
      .orderBy(desc(actionProposals.createdAt))
      .limit(20),
    db
      .select({
        id: auditEvents.eventId,
        correlationId: auditEvents.correlationId,
        actor: auditEvents.actorId,
        event: auditEvents.eventType,
        object: auditEvents.objectId,
        summary: auditEvents.summary,
        createdAt: auditEvents.createdAt,
      })
      .from(auditEvents)
      .orderBy(desc(auditEvents.createdAt))
      .limit(50),
  ]);

  return {
    proposals: proposalRows.map(row => ({
      ...row,
      status: proposalStatusLabels[row.status],
      risk: "高" as const,
      approver:
        row.status === "pending_approval"
          ? "主管 / 开发/治理人员"
          : "企业治理策略",
      age: null,
    })),
    auditEvents: auditRows.map(row => ({
      ...row,
      object: row.object ?? "—",
      time: null,
    })),
  };
}

export async function createStoredProposal(input: CreateProposalInput, user: User) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const proposalId = `ACT-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${randomUUID().slice(0, 8)}`;
  const idempotencyKey = `${input.objectId}:${input.capabilityKey}:v${input.expectedObjectVersion}:${input.optionId}`;

  await db.transaction(async tx => {
    await tx.insert(actionProposals).values({
      proposalId,
      objectId: input.objectId,
      capabilityKey: input.capabilityKey,
      title: input.title,
      status: "pending_approval",
      requestedByOpenId: user.openId,
      idempotencyKey,
      expectedObjectVersion: input.expectedObjectVersion,
      parameters: { optionId: input.optionId },
      simulationSummary: input.simulationSummary,
      rollbackPlan: input.rollbackPlan,
    });

    await tx.insert(auditEvents).values({
      eventId: `AUD-${randomUUID()}`,
      correlationId: proposalId,
      actorType: "user",
      actorId: user.openId,
      eventType: "ACTION_PROPOSAL_CREATED",
      objectId: input.objectId,
      summary: `${input.title} 已提交审批`,
      payload: { optionId: input.optionId, idempotencyKey, expectedObjectVersion: input.expectedObjectVersion },
    });
  });

  return { proposalId, idempotencyKey, status: "待审批" as const };
}

type DecideProposalInput = {
  proposalId: string;
  decision: "approved" | "rejected";
  comment?: string;
};

export async function decideStoredProposal(input: DecideProposalInput, user: User) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const [proposal] = await db
    .select({ proposalId: actionProposals.proposalId, objectId: actionProposals.objectId })
    .from(actionProposals)
    .where(eq(actionProposals.proposalId, input.proposalId))
    .limit(1);

  if (!proposal) return null;

  await db.transaction(async tx => {
    await tx
      .update(actionProposals)
      .set({ status: input.decision })
      .where(eq(actionProposals.proposalId, input.proposalId));

    await tx.insert(approvals).values({
      proposalId: input.proposalId,
      approverOpenId: user.openId,
      approverRole: user.enterpriseRole,
      decision: input.decision,
      comment: input.comment,
      decidedAt: new Date(),
    });

    await tx.insert(auditEvents).values({
      eventId: `AUD-${randomUUID()}`,
      correlationId: input.proposalId,
      actorType: "user",
      actorId: user.openId,
      eventType: input.decision === "approved" ? "ACTION_PROPOSAL_APPROVED" : "ACTION_PROPOSAL_REJECTED",
      objectId: proposal.objectId,
      summary: `提案 ${input.proposalId} 已${input.decision === "approved" ? "批准" : "拒绝"}`,
      payload: { comment: input.comment ?? "" },
    });
  });

  return { proposalId: input.proposalId, status: input.decision === "approved" ? "已批准" : "已拒绝" };
}
