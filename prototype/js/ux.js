window.SCENE_UX = {
  "bank-aml": {
    user: { name: "李强", role: "反洗钱合规官" },
    examples: [
      "华鑫贸易提交了什么贷款申请？",
      "哪些交易被标记为可疑？",
      "华鑫贸易的风险等级如何，用什么抵押？",
      "哪些交易命中了制裁名单？",
    ],
    tasks: [
      { severity: "高", title: "STR-2026-0317 待上报", objectId: "STR-01", hint: "拆分交易规避大额报告", age: "3 小时" },
      { severity: "高", title: "华鑫贸易贷款待审核", objectId: "LOAN-01", hint: "尽调结论：需补充受益人", age: "6 小时" },
      { severity: "中", title: "制裁命中 OFAC-2026-041", objectId: "SAN-01", hint: "离岸账户关联主体", age: "1 天" },
    ],
    actions: [
      { id: "file_str", name: "上报可疑交易", writes: "AML.STR 报送", risk: "高", approver: "合规主管 + 双人复核", baseline: "保持待上报，监管时限继续逼近", outcome: "生成结构化 STR 并绑定交易证据链", tradeoff: "降低漏报风险，但会扩大客户调查与交易审查范围", rollback: "报送前可撤回草稿；报送后只能追加更正记录", prechecks: ["STR 对象仍处于待上报状态", "命中交易与受益人证据齐全", "第二复核人已确认报送范围"], fields: [{ label: "报告", value: "STR-2026-0317" }, { label: "理由", value: "拆分交易规避大额报告" }] },
      { id: "hold_loan", name: "暂缓放贷", writes: "信贷系统状态", risk: "高", approver: "授信审批人 + 合规主管", baseline: "继续审批可能把未结制裁风险带入授信", outcome: "冻结放款节点并创建补充尽调任务", tradeoff: "降低合规风险，但会延长客户授信周期", rollback: "风险解除后由授信审批人恢复流程", prechecks: ["贷款申请仍未放款", "制裁命中记录尚未关闭", "客户经理收到暂缓通知"], fields: [{ label: "申请", value: "LOAN-01" }, { label: "原因", value: "制裁命中 + 强化尽调未完成" }] },
    ],
    security: [
      { layer: "打开应用", you: "允许", note: "合规工作台" },
      { layer: "看见对象", you: "本分行客户 / 交易 / STR", note: "对象级，不是整张表" },
      { layer: "调用 Function", you: "risk_score / sanction_match", note: "只读计算" },
      { layer: "执行 Action", you: "可提案；报送需双人复核", note: "与读权限分离" },
    ],
    rag: {
      text: "华鑫贸易现在能不能放贷？",
      chunks: [
        { title: "反洗钱操作手册 §6", body: "存在可疑交易未结案时，原则上不得新增授信……（未绑定当前 STR 对象）" },
        { title: "去年案例复盘.md", body: "类似拆分转账曾触发监管问询。" },
      ],
      answer: "文档建议有未结可疑交易时暂缓授信。无法确认华鑫名下哪几笔交易、是否已命中制裁、抵押是否足值。",
      gaps: ["没有对象 ID", "没有当前 STR / 贷款状态", "不能发起受控写回"],
    },
  },
  "power-grid": {
    user: { name: "陈工", role: "变电检修值班" },
    examples: [
      "1号主变存在什么缺陷？",
      "珠江500kV变电站有哪些设备？",
      "主变油温异常导致什么后果？",
      "10kV工业园甲线供电给哪个客户？",
    ],
    tasks: [
      { severity: "高", title: "主变油温异常待消缺", objectId: "DEF-01", hint: "已触发工单 GZ-2026-0881", age: "4 小时" },
      { severity: "中", title: "断路器 SF6 气压偏低", objectId: "DEF-02", hint: "工单处理中", age: "1 天" },
      { severity: "高", title: "珠江站馈线跳闸复盘", objectId: "OUT-01", hint: "影响 1450 户 / 32 分钟", age: "4 小时" },
    ],
    actions: [
      { id: "dispatch_wo", name: "下达检修工单", writes: "OMS.work_orders", risk: "中", approver: "运行值长", baseline: "缺陷继续运行，设备健康度与停电概率恶化", outcome: "锁定检修窗口并向班组下达工单", tradeoff: "降低设备风险，但可能压缩供电冗余", rollback: "作业开工前可取消；开工后转入变更流程", prechecks: ["设备缺陷仍未消除", "检修班组与窗口可用", "停电影响评估已完成"], fields: [{ label: "工单", value: "WO-01" }, { label: "班组", value: "变电检修一班" }] },
      { id: "notify_vip", name: "通知重要客户", writes: "客户服务工单", risk: "中", approver: "客户服务值班负责人", baseline: "客户无法提前安排负荷与备电", outcome: "生成重要客户通知与确认回执任务", tradeoff: "提升透明度，但可能引发额外升级沟通", rollback: "发送前可撤回草稿；发送后保留更正记录", prechecks: ["客户属于重要客户清单", "影响窗口与范围已确认", "通知模板已通过合规检查"], fields: [{ label: "客户", value: "广汽新能源工厂" }, { label: "原因", value: "主变过热保护动作" }] },
    ],
    security: [
      { layer: "打开应用", you: "允许", note: "企业大脑检修视图" },
      { layer: "看见对象", you: "本区域站 / 设备 / 工单", note: "按运维分区" },
      { layer: "调用 Function", you: "health_score / outage_impact", note: "只读" },
      { layer: "执行 Action", you: "可提案；下令需值长确认", note: "写回 OMS" },
    ],
    rag: {
      text: "1号主变现在该怎么处置？",
      chunks: [
        { title: "主变运维规程", body: "油温异常应申请停电检查冷却系统……" },
        { title: "缺陷管理办法", body: "严重缺陷须 24 小时内消缺。" },
      ],
      answer: "规程要求油温异常尽快消缺。文档没有这台 1 号主变的健康度、已开工单和影响客户。",
      gaps: ["无设备对象", "无工单状态", "无停电影响范围"],
    },
  },
  "supply-chain": {
    user: { name: "周敏", role: "采购计划员" },
    examples: [
      "谁给 PO-2026-018 供应了齿轮？",
      "高精度齿轮的供应商信用评级是多少？",
      "深圳一厂生产哪些零件，成本多少？",
      "华东轴承集团供了哪些零件，工厂在哪？",
    ],
    tasks: [
      { severity: "中", title: "PO-2026-018 交期 14 天", objectId: "O-3001", hint: "齿轮 + 轴承 + 电控", age: "今天" },
      { severity: "低", title: "华东轴承评级 B+", objectId: "S-1002", hint: "框架协议共用", age: "本周" },
    ],
    actions: [
      { id: "hold_po", name: "冻结采购订单", writes: "ERP.purchase_orders", risk: "中", approver: "采购经理", baseline: "订单继续流转，交期风险可能传导至生产计划", outcome: "冻结订单并触发供应风险复核", tradeoff: "阻断风险扩散，但可能损失当前价格与产能窗口", rollback: "供应风险解除后由采购经理解冻订单", prechecks: ["订单尚未完成收货", "供应商交期风险仍有效", "生产计划员已确认影响范围"], fields: [{ label: "订单", value: "O-3001" }, { label: "原因", value: "供应商交期风险" }] },
      { id: "switch_supplier", name: "建议切换供应商", writes: "采购提案（不直接改合同）", risk: "中", approver: "品类经理 + 质量负责人", baseline: "维持现供应商，继续承担交期与质量波动", outcome: "生成备选供应商评估与切换提案", tradeoff: "提高供应韧性，但需要重新验证质量与商务条件", rollback: "提案未批准前不修改订单或合同", prechecks: ["备选供应商具备合格资质", "质量与交期数据已更新", "合同变更仍需独立审批"], fields: [{ label: "零件", value: "P-2001" }, { label: "现供应商", value: "S-1001" }] },
    ],
    security: [
      { layer: "打开应用", you: "允许", note: "供应链本体" },
      { layer: "看见对象", you: "本事业部订单 / 供应商", note: "对象级" },
      { layer: "调用 Function", you: "credit / eta", note: "只读" },
      { layer: "执行 Action", you: "可提案；改单需经理审批", note: "写回 ERP" },
    ],
    rag: {
      text: "谁给 PO-2026-018 供应了齿轮？",
      chunks: [
        { title: "采购流程手册 v3.pdf", body: "齿轮类零件通常由长期合作供应商完成，PO-2026 系列涉及多个零部件……" },
        { title: "供应商名录.xlsx", body: "华南地区有多家精密制造企业，评级从 A 到 C 不等……" },
      ],
      answer: "片段提到华南供应商可能供齿轮，无法断言对象级「订单—零件—供应商—工厂」关系。",
      gaps: ["无对象 ID", "无多跳关系", "口径可能漂移"],
    },
  },
  workshop: {
    user: { name: "林晓", role: "夜班维修主管" },
    examples: [
      "EQ-4401 现在该怎么处置？谁来做、用哪颗零件？",
      "如果把负载降到 60%，停机窗口怎么变？",
      "SP-17 库存够不够？",
    ],
    tasks: [
      { severity: "高", title: "EQ-4401 主轴温升超阈", objectId: "EVT-9102", hint: "规则建议申请轴承并降载", age: "4 分钟" },
      { severity: "中", title: "SP-17 库存低于安全水位", objectId: "SP-17", hint: "可用 1，安全库存 2", age: "12 分钟" },
      { severity: "低", title: "WO-8821 仍为草稿", objectId: "WO-8821", hint: "缺审批与幂等键", age: "刚才" },
    ],
    actions: [
      { id: "request_spare", name: "申请备件", writes: "ERP.inventory 预留", risk: "中", approver: "夜班维修主管 + 仓储值班", baseline: "库存不预留，维修窗口可能因缺件失效", outcome: "预留 SP-17 并绑定维修任务", tradeoff: "保障本次维修，但将库存降至安全水位以下", rollback: "领料前可释放预留；领料后进入退库流程", prechecks: ["SP-17 可用库存至少为 1", "维修任务仍需要该备件", "仓储值班确认安全库存例外"], fields: [{ label: "零件", value: "SP-17" }, { label: "数量", value: "1" }] },
      { id: "create_work_order", name: "创建维修工单", writes: "CMMS.work_orders", risk: "高", approver: "夜班维修主管 + 生产值班", baseline: "设备继续运行，主轴损伤与非计划停机概率上升", outcome: "创建 P1 工单并锁定 01:30 检修窗口", tradeoff: "主动停机影响短期产出，但降低扩大故障风险", rollback: "工单开工前可撤销；开工后记录变更与复工条件", prechecks: ["EQ-4401 异常事件仍处于开放状态", "维修班组与安全隔离条件就绪", "备件或替代方案已经确认"], fields: [{ label: "设备", value: "EQ-4401" }, { label: "窗口", value: "今晚 01:30" }] },
    ],
    security: [
      { layer: "打开应用", you: "允许", note: "Workshop 模块" },
      { layer: "看见对象", you: "本班组设备 / 事件 / 工单", note: "对象级" },
      { layer: "调用 Function", you: "risk_score / what_if_derate", note: "只读" },
      { layer: "执行 Action", you: "可提案；写回需审批", note: "与读权限分离" },
    ],
    rag: {
      text: "EQ-4401 现在该怎么处置？谁来做、用哪颗零件？",
      chunks: [
        { title: "设备手册 §4.2", body: "主轴过热时应停机检查润滑与轴承间隙……（未绑定当前库存）" },
        { title: "SOP-维修-12", body: "P1 工单需主管审批后写回 CMMS。" },
      ],
      answer: "手册要求停机检查并走 P1 审批。无法确认库存、当班资质与是否已有工单。",
      gaps: ["没有对象 ID", "没有库存事实", "不能发起写回"],
    },
  },
};
