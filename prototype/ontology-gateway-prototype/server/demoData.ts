import {
  enterpriseRoles,
  rolePermissionMatrix,
  type CapabilityKind,
  type ConnectorStatus,
  type EnterpriseRole,
  type RiskLevel,
} from "../shared/domain";

export const platformMeta = {
  tenant: "曜石制造集团",
  environment: "企业沙箱",
  ontologyVersion: "v2.4.1",
  region: "CN-East",
  generatedAt: "2026-08-14T09:30:00.000Z",
};

export const alerts = [
  { id: "ALT-018", severity: "高", title: "订单 SO-4021 交付风险升高", objectId: "OBJ-O-4021", system: "ERP Core", age: "4 分钟" },
  { id: "ALT-017", severity: "中", title: "设备 EQ-4401 振动值偏离基线", objectId: "OBJ-D-4401", system: "MES Edge", age: "11 分钟" },
  { id: "ALT-016", severity: "中", title: "客户主数据出现身份冲突", objectId: "OBJ-C-1002", system: "Identity Resolver", age: "23 分钟" },
];

export const tasks = [
  { id: "TSK-221", title: "复核订单延期处置方案", owner: "供应链主管", due: "12:30", status: "待处理" },
  { id: "TSK-220", title: "确认 CRM / ERP 客户映射", owner: "本体建设者", due: "15:00", status: "进行中" },
  { id: "TSK-219", title: "审查 MES Action 白名单", owner: "开发/治理人员", due: "今天", status: "待处理" },
];

export const objectTypes = [
  { key: "Customer", name: "客户", properties: 18, relations: 7, actions: 3, version: "2.3.0", status: "已发布" },
  { key: "Order", name: "订单", properties: 24, relations: 9, actions: 5, version: "2.4.1", status: "已发布" },
  { key: "Equipment", name: "设备", properties: 31, relations: 12, actions: 6, version: "2.2.5", status: "已发布" },
  { key: "Contract", name: "合同", properties: 16, relations: 6, actions: 2, version: "1.9.2", status: "评审中" },
];

export const ontologyVersions = [
  { version: "v2.4.1", status: "已发布", author: "本体建设组", change: "新增订单风险函数与交付 Action", date: "2026-08-12" },
  { version: "v2.4.0", status: "已归档", author: "本体建设组", change: "统一合同—订单关联约束", date: "2026-08-02" },
  { version: "v2.5.0-draft", status: "草稿", author: "林岚", change: "设备健康度 SHACL 约束", date: "2026-08-14" },
];

export const objects = [
  {
    id: "OBJ-C-1002",
    type: "Customer",
    typeName: "客户",
    name: "华星精密",
    status: "重点关注",
    source: "CRM Hub",
    updated: "2 分钟前",
    properties: { 客户等级: "战略客户", 区域: "华东", 年度合同额: "¥ 28.6M", 风险分: 68 },
  },
  {
    id: "OBJ-O-4021",
    type: "Order",
    typeName: "订单",
    name: "SO-4021",
    status: "交付风险",
    source: "ERP Core",
    updated: "4 分钟前",
    properties: { 金额: "¥ 3.4M", 承诺日期: "2026-08-22", 当前预计: "2026-08-27", 缺口: "5 天" },
  },
  {
    id: "OBJ-D-4401",
    type: "Equipment",
    typeName: "设备",
    name: "EQ-4401 / 五轴加工中心",
    status: "需观察",
    source: "MES Edge",
    updated: "1 分钟前",
    properties: { 产线: "Line-7", 健康度: 76, 当前任务: "WO-9188", 预测停机风险: "18%" },
  },
  {
    id: "OBJ-CTR-0088",
    type: "Contract",
    typeName: "合同",
    name: "CT-2026-0088",
    status: "履约中",
    source: "Contract Cloud",
    updated: "昨天",
    properties: { 甲方: "华星精密", 服务等级: "P1", 延期罚则: "0.3% / 日", 到期日: "2026-12-31" },
  },
];

export const relations = [
  { from: "OBJ-C-1002", to: "OBJ-O-4021", type: "下达订单", evidence: "CRM opportunity OP-991 + ERP SO-4021", confidence: 100 },
  { from: "OBJ-O-4021", to: "OBJ-D-4401", type: "依赖设备", evidence: "MES routing RT-77", confidence: 96 },
  { from: "OBJ-C-1002", to: "OBJ-CTR-0088", type: "受合同约束", evidence: "Contract CT-2026-0088", confidence: 100 },
  { from: "OBJ-CTR-0088", to: "OBJ-O-4021", type: "约束交付", evidence: "SLA clause 4.2", confidence: 100 },
];

type DemoCapability = {
  key: string;
  kind: CapabilityKind;
  name: string;
  risk: RiskLevel;
  approval: boolean;
  description: string;
};

type DemoConnector = {
  key: string;
  name: string;
  system: string;
  status: ConnectorStatus;
  latency: number;
  availability: string;
  auth: string;
  capabilities: DemoCapability[];
};

export const connectors: DemoConnector[] = [
  {
    key: "crm-hub",
    name: "CRM Hub",
    system: "系统 A / CRM",
    status: "在线",
    latency: 84,
    availability: "99.99%",
    auth: "OAuth 2.0",
    capabilities: [
      { key: "crm.customer.query", kind: "Query", name: "查询客户主数据", risk: "低", approval: false, description: "按 customer_id 或统一对象 ID 查询客户" },
      { key: "crm.risk.function", kind: "Function", name: "计算客户风险", risk: "中", approval: false, description: "组合回款、投诉和机会数据" },
      { key: "crm.customer.event", kind: "Event", name: "客户状态变更", risk: "低", approval: false, description: "发布等级、负责人和状态变化" },
    ],
  },
  {
    key: "erp-core",
    name: "ERP Core",
    system: "系统 B / ERP",
    status: "在线",
    latency: 112,
    availability: "99.97%",
    auth: "mTLS + Service Token",
    capabilities: [
      { key: "erp.order.query", kind: "Query", name: "查询订单与库存", risk: "低", approval: false, description: "按 buyer_code、订单号和统一对象 ID 查询" },
      { key: "erp.delivery.function", kind: "Function", name: "计算承诺交期", risk: "中", approval: false, description: "基于库存、在制品和供应约束计算" },
      { key: "erp.schedule.proposal", kind: "Proposal", name: "生成调整排产提案", risk: "中", approval: true, description: "只生成受控提案，不直接写回" },
      { key: "erp.schedule.action", kind: "Action", name: "调整订单优先级", risk: "高", approval: true, description: "通过 Action 网关执行，要求主管审批" },
      { key: "erp.order.event", kind: "Event", name: "订单状态变更", risk: "低", approval: false, description: "发布交期、数量和状态变化" },
    ],
  },
  {
    key: "mes-edge",
    name: "MES Edge",
    system: "系统 C / MES",
    status: "降级",
    latency: 286,
    availability: "99.82%",
    auth: "mTLS",
    capabilities: [
      { key: "mes.equipment.query", kind: "Query", name: "查询设备状态", risk: "低", approval: false, description: "读取实时状态与近 24 小时指标" },
      { key: "mes.maintenance.proposal", kind: "Proposal", name: "生成维护窗口提案", risk: "中", approval: true, description: "根据停机风险生成维护建议" },
      { key: "mes.workorder.action", kind: "Action", name: "创建维修工单", risk: "高", approval: true, description: "要求主管审批并生成回滚记录" },
      { key: "mes.alert.event", kind: "Event", name: "设备异常事件", risk: "低", approval: false, description: "发布指标越界和故障预测" },
    ],
  },
];

export const identityMappings = [
  { objectId: "OBJ-C-1002", system: "CRM", field: "customer_id", value: "CUST-2048", confidence: 100, status: "已验证" },
  { objectId: "OBJ-C-1002", system: "ERP", field: "buyer_code", value: "B-7783", confidence: 98, status: "已验证" },
  { objectId: "OBJ-C-1002", system: "Contract", field: "party_code", value: "P-00192", confidence: 91, status: "待复核" },
  { objectId: "OBJ-D-4401", system: "MES", field: "asset_no", value: "EQ-4401", confidence: 100, status: "已验证" },
];

export const decisionWorkspace = {
  objectId: "OBJ-O-4021",
  title: "订单 SO-4021 交付风险处置",
  baseline: { 预计延期: "5 天", 合同风险: "¥ 51K / 日", 客户等级: "战略客户", 当前置信度: "94%" },
  options: [
    { id: "OPT-A", name: "维持当前排产", delivery: "08-27", cost: "+¥ 0", risk: "高", impact: "触发合同罚则，客户升级风险" },
    { id: "OPT-B", name: "调整 Line-7 优先级", delivery: "08-23", cost: "+¥ 86K", risk: "中", impact: "影响 2 个普通订单，均有 3 天缓冲" },
    { id: "OPT-C", name: "外协关键工序", delivery: "08-22", cost: "+¥ 142K", risk: "低", impact: "满足承诺交期，需要供应商临时审批" },
  ],
  recommended: "OPT-B",
  rollback: "若 Line-7 在执行后 30 分钟内设备健康度低于 65，则恢复原排产并转入外协方案评审。",
};

export const proposals = [
  { id: "ACT-2026-0814-07", title: "调整 SO-4021 排产优先级", objectId: "OBJ-O-4021", status: "待审批", risk: "高", requester: "AgenticX / 林岚", approver: "供应链主管", age: "8 分钟" },
  { id: "ACT-2026-0814-06", title: "创建 EQ-4401 预防性维护工单", objectId: "OBJ-D-4401", status: "已批准", risk: "中", requester: "Near 终端智能体 / 周岩", approver: "设备主管", age: "21 分钟" },
  { id: "ACT-2026-0814-05", title: "合并客户身份映射冲突", objectId: "OBJ-C-1002", status: "需补充证据", risk: "中", requester: "本体建设者 / 陈澈", approver: "数据治理委员会", age: "39 分钟" },
];

export const policies = [
  { id: "POL-01", name: "高风险 Action 双人审批", role: "主管", resource: "Action:risk=high", permission: "审批", effect: "允许（双签）" },
  { id: "POL-02", name: "业务员工只读与提案", role: "业务员工", resource: "Object:* / Proposal:*", permission: "读取 / 提案", effect: "允许" },
  { id: "POL-03", name: "本体版本发布", role: "本体建设者", resource: "OntologyVersion:*", permission: "提案", effect: "允许，发布需治理审批" },
  { id: "POL-04", name: "网关工具白名单", role: "开发/治理人员", resource: "GatewayTool:*", permission: "执行", effect: "仅白名单" },
];

export const auditEvents = [
  { id: "AUD-441", time: "09:28:41", actor: "AgenticX", event: "OAG_QUERY", object: "OBJ-O-4021", summary: "查询交付风险证据，命中 4 个来源" },
  { id: "AUD-440", time: "09:27:18", actor: "林岚", event: "ACTION_SIMULATED", object: "OBJ-O-4021", summary: "完成 3 个排产方案模拟" },
  { id: "AUD-439", time: "09:24:02", actor: "MES Edge", event: "EVENT_INGESTED", object: "OBJ-D-4401", summary: "设备振动指标偏离基线" },
  { id: "AUD-438", time: "09:18:33", actor: "Near 终端智能体", event: "PROPOSAL_CREATED", object: "OBJ-D-4401", summary: "生成预防性维护工单提案" },
];

export const toolWhitelist = [
  { key: "ontology.get_object", access: "只读", callers: ["AgenticX", "Near 终端智能体"], status: "启用" },
  { key: "ontology.traverse_relations", access: "只读", callers: ["AgenticX", "Near 终端智能体"], status: "启用" },
  { key: "decision.simulate_action", access: "计算", callers: ["AgenticX", "Near 终端智能体"], status: "启用" },
  { key: "action.propose", access: "提案", callers: ["AgenticX", "Near 终端智能体"], status: "启用" },
  { key: "action.execute", access: "执行", callers: ["AgenticX"], status: "受限" },
];

export const accessMatrix = enterpriseRoles.map((role: EnterpriseRole) => ({
  role,
  permissions: rolePermissionMatrix[role],
  scope:
    role === "业务员工"
      ? "授权业务对象与只读工具"
      : role === "主管"
        ? "所属组织对象与审批队列"
        : role === "本体建设者"
          ? "Ontology Schema、映射与版本"
          : "连接器、策略、白名单与受控执行",
}));

export const gatewayManifest = {
  name: "Enterprise Ontology MCP/API Gateway",
  version: "2026-08-preview",
  protocols: ["MCP 2025-06", "API / tRPC preview"],
  allowedCallers: ["AgenticX", "Near 终端智能体"],
  defaultMode: "只读",
  endpoints: [
    { tool: "ontology.resolve_entity", kind: "Query", risk: "低", approval: false, description: "将外部 ID 或名称解析为统一企业对象 ID" },
    { tool: "ontology.get_object", kind: "Query", risk: "低", approval: false, description: "读取对象、属性、来源和版本" },
    { tool: "ontology.traverse_relations", kind: "Query", risk: "低", approval: false, description: "按关系类型遍历授权范围内对象" },
    { tool: "decision.evaluate_risk", kind: "Function", risk: "中", approval: false, description: "运行确定性规则与风险函数" },
    { tool: "decision.create_proposal", kind: "Proposal", risk: "中", approval: true, description: "生成带证据、影响和回滚计划的提案" },
    { tool: "action.execute", kind: "Action", risk: "高", approval: true, description: "仅执行已批准且幂等校验通过的 Action" },
    { tool: "events.subscribe", kind: "Event", risk: "低", approval: false, description: "订阅对象状态与执行结果事件" },
  ],
};

export function getObjectGraph(objectId: string) {
  const focus = objects.find(object => object.id === objectId) ?? objects[1];
  const edges = relations.filter(edge => edge.from === focus.id || edge.to === focus.id);
  const nodeIds = new Set([focus.id, ...edges.flatMap(edge => [edge.from, edge.to])]);
  return { focus, nodes: objects.filter(object => nodeIds.has(object.id)), edges };
}

export function createOagAnswer(question: string, objectId?: string) {
  const graph = getObjectGraph(objectId ?? "OBJ-O-4021");
  return {
    question,
    object: graph.focus,
    answer: "订单 SO-4021 的主要风险来自 Line-7 设备健康度下降与关键物料晚到。合同 CT-2026-0088 对延期设置了按日罚则，因此建议优先模拟调整排产，同时保留外协作为补偿方案。",
    confidence: 94,
    ruleResult: "delivery_gap_days = 5；contract_penalty_risk = 51K/日；recommended_option = OPT-B",
    trace: [
      { step: 1, tool: "ontology.resolve_entity", kind: "Query", status: "完成", detail: "将 SO-4021 解析为 OBJ-O-4021" },
      { step: 2, tool: "ontology.traverse_relations", kind: "Query", status: "完成", detail: "发现客户、设备与合同关系" },
      { step: 3, tool: "erp.delivery.function", kind: "Function", status: "完成", detail: "计算当前预计交期与 5 天缺口" },
      { step: 4, tool: "decision.evaluate_risk", kind: "Function", status: "完成", detail: "应用合同罚则与客户等级规则" },
    ],
    citations: [
      { source: "ERP Core", ref: "Order SO-4021 / promise-date", observedAt: "09:26:11" },
      { source: "MES Edge", ref: "Equipment EQ-4401 / health-score", observedAt: "09:24:02" },
      { source: "Contract Cloud", ref: "CT-2026-0088 / clause 4.2", observedAt: "昨天 18:10" },
      { source: "Ontology Function", ref: "delivery-risk@2.4.1", observedAt: "09:28:40" },
    ],
  };
}
