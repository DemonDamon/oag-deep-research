# Palantir Ontology 与 OAG：扩展研究与可迁移架构

> **研究范围。** 本文区分三类证据：Palantir 官方产品文档与技术博客用于描述其公开产品主张；同行评审论文与公开实现用于建立可复现实验基线；独立厂商/咨询材料用于比较概念与架构，不作为 Palantir 产品能力的证明。所有网页链接按 2026-08-13 访问；动态产品文档可能随版本更新。

## 结论摘要

Palantir 对 Ontology 的公开定位并非单纯的知识图谱或语义层，而是位于数据集、虚拟表和模型之上的**操作层**：对象、属性和链接构成语义元素；Action、Function 与动态安全构成可改变运营状态的动力学元素。[1] 这使其可被抽象为“数据—语义对象—确定性逻辑—受控行动—安全治理”的闭环，而不是仅仅从文档检索到答案的 RAG 管线。

OAG 在 Palantir 的公开材料中也不是一个单一检索算法。官方指导从基础分块与语义检索开始，并按需要叠加 HyDE、关键词相关性排序、查询扩展、查询抽取和以 reciprocal rank fusion（RRF）组合的混合检索。[2] 因而，OAG 应被研究为一套**与本体对象、查询与行动接口相耦合的上下文工程策略**，而不应被误写为“Palantir 的专有 GraphRAG 算法”。

| 架构层 | Palantir 公开事实 | 对 AgenticX/Near 的可迁移抽象 | 不应作出的推断 |
|---|---|---|---|
| 语义层 | Ontology 以对象、属性、链接表示组织现实，并可在很多场景充当数字孪生。[1] | 建立带稳定 ID、类型、关系和来源的领域对象图。 | 不能把任意 RDF/属性图实现称为 Foundry Ontology。 |
| 逻辑层 | Action 是带用户定义逻辑的事务；Function 承载任意复杂度的业务逻辑。[3] | 将只读查询、确定性计算和提议性写操作声明为不同工具类型。 | 不能假定开源图数据库自动提供业务动作、写回和并发治理。 |
| SDK 层 | OSDK 支持 TypeScript、Python、Java 和 OpenAPI，并以范围 token 与用户权限控制访问。[4] | 用强类型工具契约、最小权限与结果 schema 约束 Agent 调用。 | 不能从 SDK 文档推断任何第三方环境已具备 Foundry 权限模型。 |
| Agent 层 | AIP 应用可使用 Ontology 数据和工具；Palantir MCP 连接外部 IDE/Agent。[5] | 把对象查询、规则验证、证据回溯和动作提议拆成可审计工具。 | 不能将聊天/工具调用自动视为有权执行行动。 |
| 安全层 | 本地第三方工具中的 MCP 输出会发送给对应 LLM 提供商；本体修改需 proposal review 与人工批准。[6] | 在 Near 中实行只读默认、批准前置、工具白名单与传输路径告知。 | 不能将本地模型、第三方 MCP 或公开仓库视为天然符合 Foundry 的治理。 |

## 1. 从“数据模型”到“决策模型”

官方 Ontology 概览把对象、属性和链接称为语义元素，把 Action、Function 和动态安全称为动力学元素。[1] 这一区分解释了为何 Palantir 的本体论需要同时研究图建模、规则/函数、执行权限和审计。它也提供了为 AgenticX/Near 设计领域能力时的最小分层：**对象与关系用于回答“发生了什么”；函数/规则用于回答“可以怎样计算”；Action 用于表达“被授权时可提议或执行什么”；安全策略用于判断“谁能看到、调用或批准”。**

Action 的公开定义尤其重要：它是根据用户定义逻辑改变一个或多个对象属性的单一事务，并可包含参数、自动建链、通知和授权验证等副作用；写入结果会成为对象的 writeback 数据并反映在相关应用中。[3] 因此，开源原型不应把“LLM 生成一个 Cypher/SPARQL Update”直接等同于安全行动。更接近该语义的设计是：Agent 产出**可解释提议**，规则和权限层校验，再由人或受控工作流批准写入。

2026 年官方博客进一步把 Ontology 的决策表达为 Data、Logic、Action、Security 四部分，并将其描述为面向人和 Agent 的决策中心架构。[7] 该博客是厂商架构论述，不是独立性能基准；但它为研究问题提供了清晰检查表：任何“开源 Palantir”类项目若只提供知识图谱或向量检索，而没有动作、策略、审计和决策溯源，就只能覆盖其中一部分。

## 2. OAG 的检索工程，而非单一算法

Palantir 的 OAG 文档明确建议：若完整上下文能装入模型窗口，应先从不使用检索的简单方案开始；若检索失败，应先确认相关上下文是否真正被取回并进入 prompt，再逐步添加机制。[2] 这种“从简单到必要”的原则比预设复杂 GraphRAG 更可复现。

| 策略 | 官方公开描述 | 可在开源原型中验证的假设 | 主要风险 |
|---|---|---|---|
| 分块 + 语义检索 | 将文档切块为对象并使用向量相似度检索。[2] | 基线召回率是否足以支持给定任务。 | 片段丢失实体关系和业务上下文。 |
| HyDE | 先让模型生成假设答案片段，再嵌入并检索。[2] | 对结构化/领域化章节是否改善召回。 | 假设文本可能引入偏差，需要记录生成模型与提示词。 |
| 关键词相关性排序 | 使用对象检索的相关性排序。[2] | 是否补足领域专名、型号、规则编号等精确匹配。 | 词面匹配弱于概念同义与跨语言表达。 |
| 查询扩展/抽取 | LLM 扩展同义词或抽取核心意图。[2] | 是否提升召回并降低无意义词影响。 | 扩展词会扩大检索面，须记录原问与扩展问。 |
| RRF 混合检索 | 用 RRF 合并向量与关键词检索结果。[2] | 是否稳定优于单路检索。 | 需要独立评测 n、k、融合常量和成本。 |

OG-RAG 论文提供了接近“本体增强检索”的公开研究对照：它使用本体约束构建超图上下文，选择最小相关事实集合并评测答案正确性、忠实性、相关性、上下文精确/召回与实体召回。[8] 其 MIT 代码仓库已被本地固定克隆，但它并非 Palantir 实现；最合适的用途是作为与传统 RAG、GraphRAG 和 Ontology Query 的**可复现实验基线**。[9]

## 3. AIP、工具与受控行动

AIP Features 文档把 AIP Logic、AIP Chatbot Studio、AIP Evals、OSDK 与 Palantir MCP 列为贯通 Ontology 数据、工具和应用的组成部分。[5] 其中，Chatbot 可使用企业 Ontology 数据与工具完成任务；Automate 可把 Ontology 编辑先置于人工审批，再应用到系统。[5] 这支持一个保守设计原则：**生成、查询、提议、批准、提交是不同阶段，必须具有不同的日志、权限和回滚语义。**

Palantir MCP 的安全文档特别区分 Foundry 内与本地第三方 AI 工具的传输边界。后者会把 MCP 工具输出发送给相应模型提供商；官方还声明不提供破坏性写工具，Agent 不允许更新或删除已有数据集，本体修改必须经人工批准。[6] 这与 Near 的本地桌面使用直接相关：即使模型/客户端位于本地，只要工具调用或日志跨越提供商边界，数据流和凭据范围仍需显式记录。

## 4. 与外部语义层架构的比较

Stardog 的数字孪生文章提出“独立于计算的业务模型 + 语义图 + 规则/虚拟化”的企业知识图谱路线。[10] AWS 的语义层指南则提出 Data、Knowledge、Intelligence、Orchestration 四层，并以 RDF、OWL、SPARQL、SHACL、R2RML、SWRL 和 MCP/A2A 为可组合能力。[11] 两者都不是 Palantir 的替代证明，但可帮助拆解其公开架构中的通用部分。

| 维度 | Palantir 公布的重点 | Stardog 文章的重点 | AWS 指南的重点 | 对本仓库的含义 |
|---|---|---|---|---|
| 业务语义 | 对象、链接、Action、Function、动态安全。[1] | 独立业务模型、规则和虚拟化。 | 正式本体与虚拟知识图谱。 | 将语义图、规则和工具契约分离建模。 |
| 决策闭环 | 数据、逻辑、行动、安全统一到运营模型。[7] | 以规则和可互操作访问支持决策。 | 推理、查询、GraphRAG 与 Agent 编排组合。 | 禁止将检索答案直接升级为执行行动。 |
| 标准互操作 | 产品文档未承诺以某一种开放标准完整暴露全部语义。 | 以 W3C 语义技术为核心。 | 明确使用 RDF/RDFS/OWL/SPARQL/SHACL/R2RML/SWRL。 | 用开放标准建立可移植层，同时保留平台专属抽象。 |
| 部署与治理 | 平台内权限、审核和数据流控制。 | 商业知识图谱与虚拟化。 | AWS 云服务与 MCP/A2A 组合。 | 将本地研究与生产部署/权限审批严格分开。 |

## 5. 面向 AgenticX/Near 的最小试验建议

第一阶段不应尝试复刻 Foundry，而应验证四个小而可审计的能力：

1. 用稳定对象 ID、类型、属性、关系和 `source_id` 建立一个只读领域图。
2. 以 RDFLib/Oxigraph 或等价后端提供只读结构化查询，以 pySHACL/TopBraid SHACL 之类验证器承担输入与输出约束门槛。
3. 用 OG-RAG、GraphRAG 或 Text2Cypher 数据集建立检索/查询基线，记录问题、上下文、模型、提示词、返回证据与评价指标。
4. 将任何写操作表达为 Action Proposal：目标对象、字段变更、理由、证据、策略检查结果、审批人和回滚路径缺一不可。

完成上述分层后，才评估 Graphiti、Semantica、OntoBricks、AWS Context Ontology Accelerator 等较完整平台的 MCP/REST/GraphQL 面。它们可提供不同的实现参考，但不应绕过本仓库既有的主张账本、证据强度、行动边界和人工复核要求。

## References

[1]: https://palantir.com/docs/foundry/ontology/overview/ "Palantir Ontology building overview"
[2]: https://palantir.com/docs/foundry/ontology/ontology-augmented-generation/ "Palantir Ontology-augmented generation"
[3]: https://palantir.com/docs/foundry/action-types/overview/ "Palantir Action types overview"
[4]: https://palantir.com/docs/foundry/ontology-sdk/overview/ "Palantir Ontology SDK overview"
[5]: https://palantir.com/docs/foundry/aip/aip-features/ "Palantir AIP features"
[6]: https://palantir.com/docs/foundry/palantir-mcp/security/ "Palantir MCP data governance"
[7]: https://blog.palantir.com/connecting-agents-to-decisions-277dee8ddb40 "Palantir: Connecting Agents to Decisions"
[8]: https://aclanthology.org/2025.emnlp-main.1674/ "OG-RAG: Ontology-grounded retrieval-augmented generation"
[9]: https://github.com/microsoft/ograg2 "microsoft/ograg2"
[10]: https://www.stardog.com/blog/create-your-digital-twin-with-an-enterprise-knowledge-graph/ "Stardog: Create your Digital Twin with an Enterprise Knowledge Graph"
[11]: https://docs.aws.amazon.com/prescriptive-guidance/latest/semantic-layer-agentic-ai-ontology-reasoning-virtual-knowledge-graph/ "AWS: Semantic Layer for Agentic AI"
