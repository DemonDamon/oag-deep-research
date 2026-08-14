window.INLINE_SCENES = {
  "bank-aml": {
  "id": "bank-aml",
  "name": "发放待审核+反洗钱（银行类）",
  "desc": "客户-账户-交易-可疑交易-贷款发放-尽调 本体（金融合规场景）",
  "types": {
    "Customer": {"label": "客户", "color": "#2563eb"},
    "Account": {"label": "账户", "color": "#0ea5e9"},
    "Transaction": {"label": "交易", "color": "#7c3aed"},
    "SuspiciousTxn": {"label": "可疑交易", "color": "#ef4444"},
    "LoanApplication": {"label": "贷款申请", "color": "#f59e0b"},
    "Collateral": {"label": "抵押物", "color": "#16a34a"},
    "SanctionHit": {"label": "制裁命中", "color": "#dc2626"},
    "DueDiligence": {"label": "尽调报告", "color": "#64748b"},
    "Approver": {"label": "审批人", "color": "#9333ea"}
  },
  "relKeywords": {
    "owns": ["持有", "拥有", "名下", "账户", "owns", "开立"],
    "initiates": ["发起", "转出", "转入", "交易", "initiates", "付款"],
    "flaggedAs": ["可疑", "标记", "预警", "flagged", "上报"],
    "applies": ["申请", "提交贷款", "授信", "applies", "申贷"],
    "securedBy": ["抵押", "质押", "担保", "secured", "抵押物"],
    "hitsSanction": ["制裁", "命中名单", "制裁名单", "sanction", "黑名单"],
    "reviewedBy": ["尽调", "审核", "审批", "复核", "reviewed", "调查"],
    "risk": ["风险", "评级", "风险等级", "risk"],
    "amount": ["金额", "多少钱", "额度", "amount"],
    "status": ["状态", "进度", "status", "是否通过"]
  },
  "propMap": {
    "risk": [["riskLevel"], "风险等级"],
    "amount": [["amount"], "金额"],
    "status": [["status"], "状态"],
    "location": [["region", "city"], "位置"],
    "priority": [["priority"], "优先级"]
  },
  "nodes": [
    {"id": "CUST-01", "type": "Customer", "name": "深圳华鑫贸易有限公司", "props": {"industry": "大宗商品贸易", "riskLevel": "高", "region": "深圳", "estYear": 2019}},
    {"id": "CUST-02", "type": "Customer", "name": "广州恒达实业有限公司", "props": {"industry": "制造业", "riskLevel": "中", "region": "广州", "estYear": 2012}},
    {"id": "CUST-03", "type": "Customer", "name": "东莞凯越进出口公司", "props": {"industry": "外贸", "riskLevel": "高", "region": "东莞", "estYear": 2021}},
    {"id": "ACCT-01", "type": "Account", "name": "华鑫贸易对公账户 6217***0188", "props": {"accountType": "对公结算", "balance": 3850000, "openDate": "2020-03"}},
    {"id": "ACCT-02", "type": "Account", "name": "恒达实业基本户 6217***2266", "props": {"accountType": "基本户", "balance": 9200000, "openDate": "2013-06"}},
    {"id": "ACCT-03", "type": "Account", "name": "凯越进出口美元户 6217***3311", "props": {"accountType": "外币结算", "balance": 156000, "openDate": "2021-09"}},
    {"id": "TXN-01", "type": "Transaction", "name": "跨行大额转账 20260810-A", "props": {"amount": 5200000, "direction": "转出", "counterparty": "离岸账户", "time": "2026-08-10 15:22"}},
    {"id": "TXN-02", "type": "Transaction", "name": "拆分为多笔小额转账", "props": {"amount": 980000, "direction": "转出", "counterparty": "多个个人账户", "time": "2026-08-11 09:40"}},
    {"id": "TXN-03", "type": "Transaction", "name": "跨境美元汇款 20260812-B", "props": {"amount": 145000, "direction": "汇出", "counterparty": "境外贸易对手", "time": "2026-08-12 11:05"}},
    {"id": "STR-01", "type": "SuspiciousTxn", "name": "可疑交易报告 STR-2026-0317", "props": {"reason": "拆分交易规避大额报告", "status": "待上报", "priority": "高", "detected": "2026-08-11"}},
    {"id": "STR-02", "type": "SuspiciousTxn", "name": "可疑交易报告 STR-2026-0319", "props": {"reason": "资金快进快出", "status": "待复核", "priority": "高", "detected": "2026-08-12"}},
    {"id": "LOAN-01", "type": "LoanApplication", "name": "华鑫贸易流动资金贷款申请", "props": {"amount": 8000000, "loanType": "流动资金贷款", "status": "待审核", "applyDate": "2026-08-08"}},
    {"id": "LOAN-02", "type": "LoanApplication", "name": "恒达实业设备更新贷款申请", "props": {"amount": 15000000, "loanType": "固定资产贷款", "status": "已通过", "applyDate": "2026-07-25"}},
    {"id": "COLL-01", "type": "Collateral", "name": "华鑫贸易存货质押", "props": {"collateralType": "存货", "appraisedValue": 6000000, "location": "深圳"}},
    {"id": "COLL-02", "type": "Collateral", "name": "恒达实业厂房抵押", "props": {"collateralType": "房产", "appraisedValue": 18000000, "location": "广州"}},
    {"id": "SAN-01", "type": "SanctionHit", "name": "制裁名单命中 OFAC-2026-041", "props": {"listType": "OFAC", "matchedEntity": "离岸账户关联主体", "hitDate": "2026-08-11"}},
    {"id": "DD-01", "type": "DueDiligence", "name": "华鑫贸易强化尽调报告", "props": {"ddLevel": "强化", "conclusion": "需补充实际受益人信息", "completedDate": "2026-08-09"}},
    {"id": "DD-02", "type": "DueDiligence", "name": "凯越进出口常规尽调报告", "props": {"ddLevel": "常规", "conclusion": "无异常", "completedDate": "2026-08-10"}},
    {"id": "APPR-01", "type": "Approver", "name": "对公客户经理 王敏", "props": {"role": "客户经理", "dept": "深圳分行公司金融部"}},
    {"id": "APPR-02", "type": "Approver", "name": "反洗钱合规官 李强", "props": {"role": "合规官", "dept": "省分行合规部"}}
  ],
  "edges": [
    {"source": "CUST-01", "target": "ACCT-01", "rel": "owns", "label": "持有"},
    {"source": "CUST-02", "target": "ACCT-02", "rel": "owns", "label": "持有"},
    {"source": "CUST-03", "target": "ACCT-03", "rel": "owns", "label": "持有"},
    {"source": "ACCT-01", "target": "TXN-01", "rel": "initiates", "label": "发起"},
    {"source": "ACCT-01", "target": "TXN-02", "rel": "initiates", "label": "发起"},
    {"source": "ACCT-03", "target": "TXN-03", "rel": "initiates", "label": "发起"},
    {"source": "TXN-01", "target": "STR-01", "rel": "flaggedAs", "label": "标记为可疑"},
    {"source": "TXN-02", "target": "STR-01", "rel": "flaggedAs", "label": "标记为可疑"},
    {"source": "TXN-03", "target": "STR-02", "rel": "flaggedAs", "label": "标记为可疑"},
    {"source": "CUST-01", "target": "LOAN-01", "rel": "applies", "label": "提交"},
    {"source": "CUST-02", "target": "LOAN-02", "rel": "applies", "label": "提交"},
    {"source": "LOAN-01", "target": "COLL-01", "rel": "securedBy", "label": "以...抵押"},
    {"source": "LOAN-02", "target": "COLL-02", "rel": "securedBy", "label": "以...抵押"},
    {"source": "TXN-01", "target": "SAN-01", "rel": "hitsSanction", "label": "命中制裁"},
    {"source": "CUST-01", "target": "DD-01", "rel": "reviewedBy", "label": "被尽调"},
    {"source": "CUST-03", "target": "DD-02", "rel": "reviewedBy", "label": "被尽调"},
    {"source": "LOAN-01", "target": "APPR-01", "rel": "reviewedBy", "label": "由...审批"},
    {"source": "STR-01", "target": "APPR-02", "rel": "reviewedBy", "label": "由...复核"}
  ]
},
  "power-grid": {
  "id": "power-grid",
  "name": "知识大脑（能源类）",
  "desc": "电网设备-缺陷-检修工单-停电-台区-客户 本体（能源类企业文档知识库缩影）",
  "types": {
    "Substation": {"label": "变电站", "color": "#2563eb"},
    "Device": {"label": "一次设备", "color": "#7c3aed"},
    "Defect": {"label": "缺陷", "color": "#ef4444"},
    "WorkOrder": {"label": "检修工单", "color": "#f59e0b"},
    "Outage": {"label": "停电事件", "color": "#dc2626"},
    "Feeder": {"label": "台区/馈线", "color": "#16a34a"},
    "Customer": {"label": "用电客户", "color": "#0ea5e9"},
    "Team": {"label": "检修班组", "color": "#64748b"}
  },
  "relKeywords": {
    "equipAt": ["位于", "所属", "在哪个变电站", "安装", "equip", "站内"],
    "hasDefect": ["缺陷", "故障", "异常", "defect", "隐患"],
    "triggers": ["触发", "导致工单", "生成工单", "由什么触发", "triggers"],
    "assignedTo": ["指派", "派给", "谁处理", "班组", "负责", "assigned"],
    "serves": ["供电", "服务", "供电子", "馈电", "serves"],
    "causes": ["停电", "导致停电", "导致", "后果", "跳闸", "causes", "outage"],
    "severity": ["严重程度", "几级", "severity", "等级"],
    "voltage": ["电压", "千伏", "kv", "voltage", "多少伏"],
    "location": ["在哪", "位于", "位置", "区域", "location"],
    "health": ["健康度", "健康", "状态评分", "health"]
  },
  "propMap": {
    "severity": [["severity"], "严重程度"],
    "voltage": [["voltageLevel"], "电压等级"],
    "location": [["region", "city"], "位置"],
    "health": [["healthScore"], "健康度"],
    "status": [["status"], "状态"],
    "priority": [["priority"], "优先级"]
  },
  "nodes": [
    {"id": "SUB-01", "type": "Substation", "name": "珠江500kV变电站", "props": {"voltageLevel": "500kV", "region": "广州", "inService": 2010}},
    {"id": "SUB-02", "type": "Substation", "name": "前海220kV变电站", "props": {"voltageLevel": "220kV", "region": "深圳", "inService": 2015}},
    {"id": "DEV-01", "type": "Device", "name": "1号主变", "props": {"deviceType": "电力变压器", "manufacturer": "特变电工", "healthScore": 87, "installDate": "2016-05"}},
    {"id": "DEV-02", "type": "Device", "name": "2号主变", "props": {"deviceType": "电力变压器", "manufacturer": "保变电气", "healthScore": 92, "installDate": "2018-11"}},
    {"id": "DEV-03", "type": "Device", "name": "220kV断路器CB-201", "props": {"deviceType": "SF6断路器", "manufacturer": "平高电气", "healthScore": 76, "installDate": "2015-09"}},
    {"id": "DEV-04", "type": "Device", "name": "GIS组合电器G-01", "props": {"deviceType": "GIS", "manufacturer": "新东北电气", "healthScore": 81, "installDate": "2017-03"}},
    {"id": "DEF-01", "type": "Defect", "name": "主变油温异常", "props": {"severity": "严重", "defectType": "过热", "foundDate": "2026-08-10", "foundBy": "巡检机器人"}},
    {"id": "DEF-02", "type": "Defect", "name": "断路器SF6气压偏低", "props": {"severity": "一般", "defectType": "气压异常", "foundDate": "2026-08-12", "foundBy": "在线监测"}},
    {"id": "WO-01", "type": "WorkOrder", "name": "工单GZ-2026-0881", "props": {"status": "待处理", "priority": "高", "workType": "消缺", "createdDate": "2026-08-11"}},
    {"id": "WO-02", "type": "WorkOrder", "name": "工单SZ-2026-1142", "props": {"status": "处理中", "priority": "中", "workType": "检修", "createdDate": "2026-08-13"}},
    {"id": "OUT-01", "type": "Outage", "name": "珠江站10kV馈线跳闸", "props": {"duration": "32分钟", "affectedCustomers": 1450, "startTime": "2026-08-10 14:20", "cause": "主变过热保护动作"}},
    {"id": "FE-01", "type": "Feeder", "name": "10kV工业园甲线", "props": {"voltageLevel": "10kV", "region": "广州", "loadRate": "78%"}},
    {"id": "FE-02", "type": "Feeder", "name": "10kV前海湾乙线", "props": {"voltageLevel": "10kV", "region": "深圳", "loadRate": "65%"}},
    {"id": "CUST-01", "type": "Customer", "name": "广汽新能源工厂", "props": {"customerType": "大工业", "industry": "新能源汽车", "annualLoad": "12000万kWh"}},
    {"id": "CUST-02", "type": "Customer", "name": "前海数据中心", "props": {"customerType": "重要客户", "industry": "算力中心", "annualLoad": "8000万kWh"}},
    {"id": "TEAM-01", "type": "Team", "name": "变电检修一班", "props": {"members": 8, "base": "广州", "specialty": "一次设备"}},
    {"id": "TEAM-02", "type": "Team", "name": "变电检修二班", "props": {"members": 6, "base": "深圳", "specialty": "断路器/GIS"}}
  ],
  "edges": [
    {"source": "DEV-01", "target": "SUB-01", "rel": "equipAt", "label": "位于"},
    {"source": "DEV-02", "target": "SUB-01", "rel": "equipAt", "label": "位于"},
    {"source": "DEV-03", "target": "SUB-02", "rel": "equipAt", "label": "位于"},
    {"source": "DEV-04", "target": "SUB-02", "rel": "equipAt", "label": "位于"},
    {"source": "DEV-01", "target": "DEF-01", "rel": "hasDefect", "label": "存在缺陷"},
    {"source": "DEV-03", "target": "DEF-02", "rel": "hasDefect", "label": "存在缺陷"},
    {"source": "DEF-01", "target": "WO-01", "rel": "triggers", "label": "触发"},
    {"source": "DEF-02", "target": "WO-02", "rel": "triggers", "label": "触发"},
    {"source": "WO-01", "target": "TEAM-01", "rel": "assignedTo", "label": "指派给"},
    {"source": "WO-02", "target": "TEAM-02", "rel": "assignedTo", "label": "指派给"},
    {"source": "FE-01", "target": "CUST-01", "rel": "serves", "label": "供电给"},
    {"source": "FE-02", "target": "CUST-02", "rel": "serves", "label": "供电给"},
    {"source": "SUB-01", "target": "FE-01", "rel": "serves", "label": "馈电给"},
    {"source": "SUB-02", "target": "FE-02", "rel": "serves", "label": "馈电给"},
    {"source": "DEF-01", "target": "OUT-01", "rel": "causes", "label": "导致"}
  ]
},
  "supply-chain": {
  "id": "supply-chain",
  "name": "制造供应链",
  "desc": "供应商-零件-订单-工厂-合同 本体",
  "types": {
    "Supplier": {"label": "供应商", "color": "#2563eb"},
    "Part": {"label": "零件", "color": "#7c3aed"},
    "Order": {"label": "订单", "color": "#f59e0b"},
    "Plant": {"label": "工厂", "color": "#16a34a"},
    "Contract": {"label": "合同", "color": "#ef4444"}
  },
  "relKeywords": {
    "supplies": ["供货", "供应", "供了", "供", "谁供", "由谁", "supply"],
    "madeAt": ["生产", "制造", "产自", "哪生产", "工厂", "在哪生产", "made", "plant"],
    "contains": ["包含", "含", "有哪些零件", "部件", "组成", "contains"],
    "placedWith": ["下单", "下给", "采购", "订单给谁", "placed", "哪个供应商"],
    "hasContract": ["合同", "协议", "签约", "contract"],
    "credit": ["评级", "信用", "credit"],
    "cost": ["成本", "价格", "多少钱", "cost", "单价"],
    "location": ["在哪", "位于", "位置", "城市", "location"],
    "capacity": ["产能", "capacity"]
  },
  "propMap": {
    "credit": [["creditRating"], "信用评级"],
    "cost": [["unitCost"], "单价"],
    "location": [["location", "city"], "位置"],
    "capacity": [["capacity"], "产能"]
  },
  "nodes": [
    {"id": "S-1001", "type": "Supplier", "name": "华南精密制造", "props": {"location": "深圳", "creditRating": "A", "foundedYear": 2008}},
    {"id": "S-1002", "type": "Supplier", "name": "华东轴承集团", "props": {"location": "苏州", "creditRating": "B+", "foundedYear": 2001}},
    {"id": "S-1003", "type": "Supplier", "name": "西部材料科技", "props": {"location": "成都", "creditRating": "A-", "foundedYear": 2015}},
    {"id": "P-2001", "type": "Part", "name": "高精度齿轮", "props": {"sku": "GEAR-42", "unitCost": 128, "category": "传动件"}},
    {"id": "P-2002", "type": "Part", "name": "伺服电机", "props": {"sku": "SERVO-9", "unitCost": 840, "category": "电机"}},
    {"id": "P-2003", "type": "Part", "name": "深沟球轴承", "props": {"sku": "BRG-6204", "unitCost": 22, "category": "轴承"}},
    {"id": "P-2004", "type": "Part", "name": "铝合金壳体", "props": {"sku": "ALU-88", "unitCost": 156, "category": "结构件"}},
    {"id": "P-2005", "type": "Part", "name": "电机控制器", "props": {"sku": "CTRL-7", "unitCost": 320, "category": "电控"}},
    {"id": "O-3001", "type": "Order", "name": "PO-2026-018", "props": {"amount": 128000, "etaDays": 14, "status": "active"}},
    {"id": "O-3002", "type": "Order", "name": "PO-2026-021", "props": {"amount": 460000, "etaDays": 30, "status": "active"}},
    {"id": "PL-4001", "type": "Plant", "name": "深圳一厂", "props": {"city": "深圳", "capacity": 8500, "certLevel": "ISO9001"}},
    {"id": "PL-4002", "type": "Plant", "name": "苏州二厂", "props": {"city": "苏州", "capacity": 12000, "certLevel": "ISO14001"}},
    {"id": "PL-4003", "type": "Plant", "name": "成都三厂", "props": {"city": "成都", "capacity": 6000, "certLevel": "IATF16949"}},
    {"id": "C-5001", "type": "Contract", "name": "年度框架采购协议", "props": {"term": "3年", "expiryDate": "2027-12", "totalValue": 2500000}}
  ],
  "edges": [
    {"source": "S-1001", "target": "P-2001", "rel": "supplies", "label": "供货"},
    {"source": "S-1001", "target": "P-2002", "rel": "supplies", "label": "供货"},
    {"source": "S-1001", "target": "P-2005", "rel": "supplies", "label": "供货"},
    {"source": "S-1002", "target": "P-2003", "rel": "supplies", "label": "供货"},
    {"source": "S-1003", "target": "P-2004", "rel": "supplies", "label": "供货"},
    {"source": "P-2001", "target": "PL-4001", "rel": "madeAt", "label": "生产于"},
    {"source": "P-2002", "target": "PL-4001", "rel": "madeAt", "label": "生产于"},
    {"source": "P-2005", "target": "PL-4001", "rel": "madeAt", "label": "生产于"},
    {"source": "P-2003", "target": "PL-4002", "rel": "madeAt", "label": "生产于"},
    {"source": "P-2004", "target": "PL-4003", "rel": "madeAt", "label": "生产于"},
    {"source": "O-3001", "target": "P-2001", "rel": "contains", "label": "包含"},
    {"source": "O-3001", "target": "P-2003", "rel": "contains", "label": "包含"},
    {"source": "O-3001", "target": "P-2005", "rel": "contains", "label": "包含"},
    {"source": "O-3002", "target": "P-2002", "rel": "contains", "label": "包含"},
    {"source": "O-3002", "target": "P-2004", "rel": "contains", "label": "包含"},
    {"source": "O-3001", "target": "S-1001", "rel": "placedWith", "label": "下单给"},
    {"source": "O-3002", "target": "S-1002", "rel": "placedWith", "label": "下单给"},
    {"source": "S-1001", "target": "C-5001", "rel": "hasContract", "label": "签订合同"},
    {"source": "S-1002", "target": "C-5001", "rel": "hasContract", "label": "签订合同"}
  ]
},
  "workshop": {
  "id": "workshop",
  "name": "机加一线",
  "desc": "设备-异常-工单-零件-班组 运营本体（夜班主轴温升）",
  "types": {
    "Equipment": { "label": "设备", "color": "#3d3ce0" },
    "Event": { "label": "异常事件", "color": "#d21f4a" },
    "WorkOrder": { "label": "工单", "color": "#c27803" },
    "Part": { "label": "零件", "color": "#0d7a72" },
    "Crew": { "label": "班组", "color": "#2563eb" }
  },
  "relKeywords": {
    "hasEvent": ["发生", "事件", "温升", "告警", "异常"],
    "hasWorkOrder": ["工单", "维修", "检查"],
    "needsPart": ["零件", "轴承", "备件", "库存"],
    "ownedBy": ["班组", "负责", "谁来"],
    "consumes": ["消耗", "用哪颗"],
    "risk": ["风险", "分数", "risk"],
    "status": ["状态", "进度"]
  },
  "propMap": {
    "risk": [["riskScore"], "风险分"],
    "status": [["status"], "状态"],
    "location": [["line"], "产线"]
  },
  "nodes": [
    { "id": "EQ-4401", "type": "Equipment", "name": "立式加工中心 VMC-4401", "props": { "assetNo": "VMC-4401", "line": "机加一线", "spindleTemp": "78.4 °C", "threshold": "72 °C", "load": "86%", "status": "告警" } },
    { "id": "EVT-9102", "type": "Event", "name": "主轴轴承温升超阈", "props": { "severity": "高", "riskScore": 0.86, "rule": "risk_score ≥ 0.82", "status": "待处置" } },
    { "id": "WO-8821", "type": "WorkOrder", "name": "主轴轴承检查 / 更换", "props": { "priority": "P1", "window": "今晚 01:30", "downtime": "90 分钟", "status": "草稿" } },
    { "id": "SP-17", "type": "Part", "name": "主轴角接触轴承 7014C", "props": { "sku": "7014C-SP17", "stock": 1, "safety": 2, "status": "库位紧张" } },
    { "id": "CREW-NIGHT", "type": "Crew", "name": "夜班维修组", "props": { "onDuty": 5, "bearingCert": 3, "status": "在岗" } }
  ],
  "edges": [
    { "source": "EQ-4401", "target": "EVT-9102", "rel": "hasEvent", "label": "发生" },
    { "source": "EQ-4401", "target": "WO-8821", "rel": "hasWorkOrder", "label": "关联工单" },
    { "source": "EQ-4401", "target": "SP-17", "rel": "needsPart", "label": "需要零件" },
    { "source": "EQ-4401", "target": "CREW-NIGHT", "rel": "ownedBy", "label": "由班组负责" },
    { "source": "WO-8821", "target": "SP-17", "rel": "consumes", "label": "消耗零件" },
    { "source": "EVT-9102", "target": "SP-17", "rel": "needsPart", "label": "建议零件" }
  ]
}
};
