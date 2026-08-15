export const enterpriseRoles = [
  "业务员工",
  "主管",
  "本体建设者",
  "开发/治理人员",
] as const;

export type EnterpriseRole = (typeof enterpriseRoles)[number];

export const capabilityKinds = [
  "Query",
  "Function",
  "Proposal",
  "Action",
  "Event",
] as const;

export type CapabilityKind = (typeof capabilityKinds)[number];

export type RiskLevel = "低" | "中" | "高";

export type PermissionVerb = "读取" | "提案" | "审批" | "执行";

export type ActionStatus =
  | "草稿"
  | "已模拟"
  | "待审批"
  | "已批准"
  | "已拒绝"
  | "已执行"
  | "已回滚";

export type ConnectorStatus = "在线" | "降级" | "离线";

export const rolePermissionMatrix: Record<
  EnterpriseRole,
  Record<PermissionVerb, boolean>
> = {
  业务员工: { 读取: true, 提案: true, 审批: false, 执行: false },
  主管: { 读取: true, 提案: true, 审批: true, 执行: false },
  本体建设者: { 读取: true, 提案: true, 审批: false, 执行: false },
  "开发/治理人员": { 读取: true, 提案: true, 审批: true, 执行: true },
};
