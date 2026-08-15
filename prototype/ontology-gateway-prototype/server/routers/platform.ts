import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { enterpriseRoles } from "../../shared/domain";
import {
  accessMatrix,
  alerts,
  auditEvents,
  connectors,
  createOagAnswer,
  decisionWorkspace,
  gatewayManifest,
  getObjectGraph,
  identityMappings,
  objectTypes,
  objects,
  ontologyVersions,
  platformMeta,
  policies,
  proposals,
  tasks,
  toolWhitelist,
} from "../demoData";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  createStoredProposal,
  decideStoredProposal,
  getStoredGovernanceCenter,
} from "../platformDb";

export const platformRouter = router({
  overview: publicProcedure.query(() => ({
    meta: platformMeta,
    alerts,
    tasks,
    pendingApprovals: proposals.filter(item => item.status === "待审批").length,
    objectPulse: objects.map(item => ({ id: item.id, name: item.name, status: item.status, updated: item.updated })),
    serviceHealth: connectors.map(item => ({ key: item.key, name: item.name, status: item.status, latency: item.latency })),
  })),
  objects: router({
    list: publicProcedure.query(() => objects),
    graph: publicProcedure
      .input(z.object({ objectId: z.string().default("OBJ-O-4021") }))
      .query(({ input }) => getObjectGraph(input.objectId)),
  }),
  ontology: router({
    workspace: publicProcedure.query(() => ({ objectTypes, versions: ontologyVersions })),
  }),
  connectors: router({
    list: publicProcedure.query(() => connectors),
  }),
  identity: router({
    mappings: publicProcedure.query(() => identityMappings),
  }),
  oag: router({
    ask: publicProcedure
      .input(z.object({ question: z.string().min(4).max(500), objectId: z.string().optional() }))
      .mutation(({ input }) => createOagAnswer(input.question, input.objectId)),
  }),
  decision: router({
    workspace: publicProcedure.query(() => decisionWorkspace),
    simulate: publicProcedure
      .input(z.object({ optionId: z.enum(["OPT-A", "OPT-B", "OPT-C"]) }))
      .mutation(({ input }) => ({
        simulatedAt: new Date(),
        option: decisionWorkspace.options.find(option => option.id === input.optionId),
        checks: [
          { name: "对象版本", status: "通过", detail: "OBJ-O-4021 version 17" },
          { name: "跨系统影响", status: "通过", detail: "ERP、MES 共 3 个受影响对象" },
          { name: "权限策略", status: "需审批", detail: "高风险 Action 需要主管双签" },
          { name: "回滚计划", status: "已生成", detail: decisionWorkspace.rollback },
        ],
      })),
  }),
  action: router({
    previewProposal: publicProcedure
      .input(z.object({ optionId: z.string(), objectId: z.string() }))
      .mutation(({ input }) => ({
        proposalId: "PREVIEW-ACT-0814",
        title: "调整 SO-4021 排产优先级",
        objectId: input.objectId,
        optionId: input.optionId,
        status: "演示预览",
        idempotencyKey: "order:SO-4021:schedule:v17",
        expectedObjectVersion: 17,
        approvalRequired: true,
        rollbackPlan: decisionWorkspace.rollback,
      })),
    submitProposal: protectedProcedure
      .input(z.object({ optionId: z.string(), objectId: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        try {
          return await createStoredProposal(
            {
              objectId: input.objectId,
              optionId: input.optionId,
              capabilityKey: "erp.schedule.action",
              title: "调整 SO-4021 排产优先级",
              expectedObjectVersion: 17,
              simulationSummary: "已完成对象版本、跨系统影响、权限和回滚检查。",
              rollbackPlan: decisionWorkspace.rollback,
            },
            ctx.user,
          );
        } catch (error) {
          if (error instanceof Error && error.message.includes("Duplicate")) {
            throw new TRPCError({ code: "CONFLICT", message: "相同对象版本与方案已存在有效提案" });
          }
          throw error;
        }
      }),
  }),
  governance: router({
    center: publicProcedure.query(async ({ ctx }) => {
      const stored = ctx.user
        ? await getStoredGovernanceCenter()
        : { proposals: [], auditEvents: [] };
      return {
        proposals: [
          ...stored.proposals,
          ...proposals.map(item => ({
            ...item,
            capabilityKey: "erp.schedule.action",
            idempotencyKey: `demo:${item.id}`,
            expectedObjectVersion: 17,
            simulationSummary: "已完成对象版本、跨系统影响、权限和回滚检查。",
            rollbackPlan: decisionWorkspace.rollback,
            createdAt: null,
          })),
        ],
        policies,
        auditEvents: [
          ...stored.auditEvents,
          ...auditEvents.map(item => ({ ...item, correlationId: item.id, createdAt: null })),
        ],
        toolWhitelist,
      };
    }),
    decideProposal: protectedProcedure
      .input(
        z.object({
          proposalId: z.string().min(4),
          decision: z.enum(["approved", "rejected"]),
          comment: z.string().max(500).optional(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        if (!["supervisor", "developer_governance"].includes(ctx.user.enterpriseRole)) {
          throw new TRPCError({ code: "FORBIDDEN", message: "当前企业角色没有审批权限" });
        }
        const result = await decideStoredProposal(input, ctx.user);
        if (!result) throw new TRPCError({ code: "NOT_FOUND", message: "未找到待审批提案" });
        return result;
      }),
  }),
  gateway: router({
    manifest: publicProcedure.query(() => gatewayManifest),
  }),
  access: router({
    matrix: publicProcedure.query(() => ({ roles: enterpriseRoles, matrix: accessMatrix })),
  }),
});
