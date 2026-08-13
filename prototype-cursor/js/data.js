/**
 * Shared scenario: 立式加工中心 EQ-4401 主轴过热处置
 * Objects / links / actions / permissions — operational ontology, not a knowledge graph dump.
 */
window.ORYX = {
  user: {
    id: "u-lin",
    name: "林晓",
    role: "夜班维修主管",
    crew: "夜班维修组",
    perms: {
      app: true,
      data: ["EQ-4401", "EVT-9102", "WO-8821", "SP-17", "CREW-NIGHT"],
      functions: ["risk_score", "spare_eta", "what_if_derate"],
      actions: ["create_work_order", "request_spare", "propose_derate"],
    },
  },

  objects: {
    "EQ-4401": {
      id: "EQ-4401",
      type: "设备",
      title: "立式加工中心 VMC-4401",
      status: "告警",
      owner: "夜班维修组",
      source: "MES.equipment + IoT.telemetry",
      key: "asset_no=VMC-4401",
      updated: "2 分钟前",
      props: [
        ["资产编号", "VMC-4401"],
        ["产线", "机加一线"],
        ["主轴温度", "78.4 °C"],
        ["温度阈值", "72 °C"],
        ["负载", "86%"],
        ["上次保养", "11 天前"],
        ["责任班组", "夜班维修组"],
        ["权威来源", "MES / IoT 遥测"],
      ],
      links: [
        { dir: "out", rel: "发生", to: "EVT-9102" },
        { dir: "out", rel: "关联工单", to: "WO-8821" },
        { dir: "out", rel: "需要零件", to: "SP-17" },
        { dir: "out", rel: "由班组负责", to: "CREW-NIGHT" },
      ],
    },
    "EVT-9102": {
      id: "EVT-9102",
      type: "异常事件",
      title: "主轴轴承温升超阈",
      status: "待处置",
      owner: "林晓",
      source: "规则 risk_score v3.2",
      key: "event_id=9102",
      updated: "4 分钟前",
      props: [
        ["事件类型", "温升超阈"],
        ["严重度", "高"],
        ["触发规则", "risk_score ≥ 0.82"],
        ["持续时长", "11 分钟"],
        ["证据片段", "IoT.spindle_temp 连续 6 点 > 72°C"],
        ["建议动作", "申请备件 SP-17 + 降载运行"],
      ],
      links: [
        { dir: "in", rel: "发生于", to: "EQ-4401" },
        { dir: "out", rel: "建议零件", to: "SP-17" },
      ],
    },
    "WO-8821": {
      id: "WO-8821",
      type: "工单",
      title: "主轴轴承检查 / 更换",
      status: "草稿",
      owner: "林晓",
      source: "CMMS.work_orders",
      key: "wo=8821",
      updated: "刚才",
      props: [
        ["工单类型", "紧急维修"],
        ["优先级", "P1"],
        ["计划开始", "今晚 01:30"],
        ["预计停机", "90 分钟"],
        ["写回系统", "CMMS / ERP"],
      ],
      links: [
        { dir: "in", rel: "针对设备", to: "EQ-4401" },
        { dir: "out", rel: "消耗零件", to: "SP-17" },
      ],
    },
    "SP-17": {
      id: "SP-17",
      type: "零件",
      title: "主轴角接触轴承 7014C",
      status: "库位紧张",
      owner: "备件仓",
      source: "ERP.inventory",
      key: "sku=7014C-SP17",
      updated: "12 分钟前",
      props: [
        ["SKU", "7014C-SP17"],
        ["可用库存", "1"],
        ["安全库存", "2"],
        ["最近到货", "预计 06:40"],
        ["替代件", "7014C-SP17A（需审批）"],
      ],
      links: [
        { dir: "in", rel: "被设备需要", to: "EQ-4401" },
        { dir: "in", rel: "被工单消耗", to: "WO-8821" },
      ],
    },
    "CREW-NIGHT": {
      id: "CREW-NIGHT",
      type: "班组",
      title: "夜班维修组",
      status: "在岗",
      owner: "林晓",
      source: "HR.roster + CMMS.crew",
      key: "crew=night-maint",
      updated: "1 小时前",
      props: [
        ["在岗人数", "5"],
        ["轴承专项资质", "3 人"],
        ["当前负荷", "2 张 P1 工单"],
      ],
      links: [{ dir: "in", rel: "负责设备", to: "EQ-4401" }],
    },
  },

  tasks: [
    {
      id: "T-01",
      severity: "高",
      title: "EQ-4401 主轴温升超阈",
      objectId: "EVT-9102",
      hint: "规则建议申请轴承并降载",
      age: "4 分钟",
    },
    {
      id: "T-02",
      severity: "中",
      title: "SP-17 库存低于安全水位",
      objectId: "SP-17",
      hint: "可用 1，安全库存 2",
      age: "12 分钟",
    },
    {
      id: "T-03",
      severity: "低",
      title: "WO-8821 仍为草稿，未提交写回",
      objectId: "WO-8821",
      hint: "缺审批人与幂等键",
      age: "刚才",
    },
  ],

  actionTypes: [
    {
      id: "request_spare",
      name: "申请备件",
      writes: "ERP.inventory 预留 + 对象 SP-17 状态",
      needApproval: true,
      fields: [
        { key: "part", label: "零件", value: "SP-17 主轴角接触轴承 7014C" },
        { key: "qty", label: "数量", value: "1" },
        { key: "reason", label: "理由", value: "EQ-4401 主轴温升，规则 risk_score=0.86" },
      ],
    },
    {
      id: "create_work_order",
      name: "创建维修工单",
      writes: "CMMS.work_orders + 对象 WO-8821",
      needApproval: true,
      fields: [
        { key: "eq", label: "设备", value: "EQ-4401" },
        { key: "window", label: "窗口", value: "今晚 01:30–03:00" },
        { key: "downtime", label: "预计停机", value: "90 分钟" },
      ],
    },
    {
      id: "propose_derate",
      name: "建议降载运行",
      writes: "MES.setpoint 提案（不直接下发）",
      needApproval: true,
      fields: [
        { key: "load", label: "目标负载", value: "60%" },
        { key: "until", label: "有效至", value: "轴承更换完成" },
      ],
    },
  ],

  history: [
    { t: "02:14", who: "规则 risk_score v3.2", text: "将 EVT-9102 标为高严重度（0.86）" },
    { t: "02:15", who: "IoT", text: "主轴温度 78.4 °C，连续 6 点超阈" },
    { t: "02:16", who: "系统", text: "生成任务 T-01 并推送到夜班维修组收件箱" },
  ],

  oagQuestions: [
    {
      id: "q1",
      text: "EQ-4401 现在该怎么处置？谁来做、用哪颗零件？",
      rag: {
        chunks: [
          { title: "设备手册 §4.2", body: "主轴过热时应停机检查润滑与轴承间隙……（段落检索，未绑定当前库存）" },
          { title: "去年事故复盘.md", body: "类似温升曾导致 4 小时停线。建议准备 7014 系列轴承。" },
          { title: "SOP-维修-12", body: "P1 工单需主管审批后写回 CMMS。" },
        ],
        answer:
          "根据手册，主轴过热应停机检查。文档提到准备 7014 轴承，并走 P1 审批。无法确认当前库存、当班资质与是否已有工单。",
        gaps: ["没有对象 ID", "没有库存事实", "没有权限边界", "不能发起写回"],
      },
      oag: {
        objects: ["EQ-4401", "EVT-9102", "SP-17", "WO-8821", "CREW-NIGHT"],
        pack: {
          query: "EQ-4401 现在该怎么处置？谁来做、用哪颗零件？",
          rewrite: ["EQ-4401 处置路径", "实体链接: 设备 EQ-4401"],
          schemaLink: ["设备", "异常事件", "零件", "工单", "班组"],
          selected: [
            { id: "EQ-4401", why: "问题主语，当前告警对象", score: 0.98 },
            { id: "EVT-9102", why: "该设备上的活动异常", score: 0.94 },
            { id: "SP-17", why: "规则建议零件，库存=1", score: 0.91 },
            { id: "CREW-NIGHT", why: "责任班组，含 3 名轴承资质", score: 0.88 },
            { id: "WO-8821", why: "已有草稿工单，避免重复建单", score: 0.84 },
          ],
          dropped: [
            { id: "EQ-3308", why: "同产线但无温升事件" },
            { id: "手册§4.2", why: "无对象 ID，降为次级证据" },
          ],
        },
        answer:
          "EQ-4401 处于告警：事件 EVT-9102（主轴温升，risk_score=0.86）。责任班组为夜班维修组（3 人具备轴承资质）。建议零件是 SP-17（可用库存 1）。已有草稿工单 WO-8821，不要另开一张。下一步应提交「申请备件」和「创建维修工单」两条 Action Proposal，经你审批后写回 ERP / CMMS。",
        actions: ["request_spare", "create_work_order", "propose_derate"],
      },
    },
    {
      id: "q2",
      text: "如果把负载降到 60%，停机窗口怎么变？",
      rag: {
        chunks: [
          { title: "工艺说明", body: "降载可减缓温升，但具体分钟数因机型而异。" },
        ],
        answer: "降载通常能缓解温升，停机窗口可能缩短。文档没有这台设备的实时负载与工单窗口。",
        gaps: ["无 Function 计算结果", "无对象状态"],
      },
      oag: {
        objects: ["EQ-4401", "WO-8821", "EVT-9102"],
        pack: {
          query: "如果把负载降到 60%，停机窗口怎么变？",
          rewrite: ["what_if_derate(EQ-4401, load=0.6)"],
          schemaLink: ["设备", "工单", "Function"],
          selected: [
            { id: "EQ-4401", why: "what_if 的主体", score: 0.97 },
            { id: "WO-8821", why: "当前窗口 01:30–03:00", score: 0.9 },
          ],
          dropped: [{ id: "SP-17", why: "情景不消耗额外零件" }],
        },
        answer:
          "Function what_if_derate（只读）估算：负载 86%→60% 后，主轴温度约 40 分钟内回到阈值以下，WO-8821 窗口可从 90 分钟收到 55 分钟。这是计算结果，不是已执行设定。若要真正改 MES 设定值，需走「建议降载运行」Action，且你当前角色仅可提案、不可直接下发。",
        actions: ["propose_derate"],
      },
    },
  ],

  securityMatrix: [
    { layer: "打开应用", you: "允许", note: "Workshop 模块访问" },
    { layer: "看见对象", you: "本班组设备 / 事件 / 工单 / 零件", note: "对象级，不是整张表" },
    { layer: "调用 Function", you: "risk_score / spare_eta / what_if_derate", note: "只读计算" },
    { layer: "执行 Action", you: "可提案；写回需审批", note: "与读权限分离" },
  ],
};
