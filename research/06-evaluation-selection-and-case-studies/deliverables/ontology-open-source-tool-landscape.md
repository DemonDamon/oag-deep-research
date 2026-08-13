# 本体、知识图谱与图检索开源工具：本地静态评估

> **范围与方法。** 本文记录 2026-08-13 的公开 GitHub API/仓库页面快照、许可证与本地浅克隆的静态审阅。星标和 fork 会变化，不能被用作安全、质量或生产成熟度证明。除非另行核验，所有结论均基于 README、LICENSE、构建配置、顶层目录和测试结构；**未安装依赖、未运行任何第三方代码、未连接数据库或模型服务。**

> **本地存放。** 第三方源代码被克隆到 `/home/ubuntu/oag-research-assets/github-tools/`，不提交至本研究仓库。这里仅保存固定提交、许可证、架构摘要和集成边界，以尊重第三方许可与避免把研究仓库变成第三方镜像。

## 1. 选择结论

不存在一个可直接替代 Palantir Ontology/OAG 的开源仓库。最可行的路线是按能力组合：**语义存储/查询**（RDFLib、Oxigraph、Jena）+ **本体工程/验证/规则**（OWL API、pySHACL、TopBraid SHACL）+ **上下文图/检索**（Graphiti、GraphRAG、OG-RAG）+ **面向 Agent 的聚合平台**（Semantica、AWS Context Ontology Accelerator、OntoBricks）。在这个组合中，业务 Action、对象级权限、变更审批、跨系统写回与运行时审计仍必须由领域适配层自行实现。[1] [2]

| 优先级 | 工具 | GitHub Stars 快照 | 许可证 | 本地固定提交 | 最适合承担的角色 |
|---|---|---:|---|---|---|
| A | Graphiti | 29,873 | Apache-2.0 | `b48a9fdd03098e5906a6d878e1b633723829a85e` | Agent 时态上下文图、来源 episode、混合检索与 MCP 参考 |
| A | Semantica | 5,966 | MIT | `0fa3483b966a34194bb1aa24b3383cd0ccd03be9` | 本体、规则、PROV-O、决策溯源与 MCP/REST 组合平台 |
| A | Microsoft GraphRAG | 35,469 | MIT | `14a00ad88fc33cf2b52f4f113f25807556f8e25e` | 文档→图→社区摘要的批处理检索基线 |
| A | Apache Jena | 1,401 | Apache-2.0 | `21edf2f92ea4b4f8c9594cdb4f21261cd6a12b1b` | RDF、SPARQL、Fuseki、SHACL、TDB 与语义 Web 基础设施 |
| A | Oxigraph | 1,815 | Apache-2.0 or MIT | `2461755a9f14d7a1402379ec40957c21f35d88ce` | 嵌入式 RDF/SPARQL、Python/JS/Rust 查询后端 |
| A | RDFLib | 2,491 | BSD-3-Clause | `282240b90b7db12db68ad86a57a9912b1a6d6d68` | Python 侧 RDF、SPARQL、序列化与适配器基础 |
| B | OG-RAG | 136 | MIT | `768048b92bd74049d2c64627fab7327f6d5ff2bd` | 本体约束超图 RAG 的论文配套实验基线 |
| B | pySHACL | 339 | Apache-2.0 | `469cca7a22a078b36c167c1e8dadecf5e5ec6c75` | SHACL 数据契约、约束验证与受控规则扩展 |
| B | TopBraid SHACL API | 244 | Apache-2.0 | `6687b48bd2c81eda369f224598061f87dce0d425` | Java/Jena 栈的 SHACL 验证和推理侧车 |
| B | AWS Context Ontology Accelerator | 468 | Apache-2.0；含 AGPL/LGPL 依赖 | `9095f00237b37cf318e33808d2c571c0f6f731d4` | 本体语义层、VKG、MCP 与云部署架构对照 |
| B | OntoBricks | 271 | **Databricks License** | `2491c065d32ea2cad4eb42f4028246ee3070cd97` | Databricks 原生本体、R2RML、图物化、GraphQL/MCP 参考 |
| C | OWL API | 921 | README/POM 并列 LGPL-3.0 与 Apache-2.0；需逐模块复核 | `d7e997a53b470e32700de89cc610d9daf01ea769` | OWL 2 本体工程、解析、序列化与 reasoner 接口 |
| C | Neo4j Text2Cypher | 242 | CC0-1.0 | `9d84a99596018178aaa876253fe5ebd29d69405c` | NL→Cypher 数据集、离线评测和微调资源 |

## 2. 能力矩阵与选型边界

| 工具 | 本体/语义建模 | 查询/检索 | 验证/规则 | Agent/MCP 面 | 主要限制 |
|---|---|---|---|---|---|
| Graphiti | 自定义实体/边类型与时间事实；README 描述 episode 溯源。 | embedding、关键词与图遍历混合检索。 | 未在本轮快照中核验 SHACL/OWL 规则。 | 有独立 `mcp_server` 目录及 README 声明。 | 图后端/LLM 外部依赖；不提供已核验的企业权限与 Action 语义。 |
| Semantica | `ontology`、`kg`、`provenance`、`change_management`、`conflicts` 等模块。 | RDF/LPG/向量多后端、上下文图。 | README 声称 SHACL、OWL、Rete、Datalog、SPARQL。 | `mcp/`、`semantica/mcp_server`、REST/CLI/编辑器插件。 | 功能广、依赖面大；项目自称“Open Source Palantir”是自我定位，不是技术等价证明。 |
| GraphRAG | 从文本抽取结构化图式记忆；不等同形式化本体。 | Local/Global/DRIFT 与社区摘要。 | 未核验规则/约束引擎。 | 未在快照中发现原生 MCP/Agent schema。 | 索引成本高；官方声明代码是方法演示而非正式支持产品。 |
| Jena | RDF、OntAPI、ShEx、SHACL 模块。 | ARQ、TDB、Fuseki、RDF connection。 | `jena-shacl`、相关语义模块。 | 未核验原生 MCP。 | Java 多模块、部署与安全配置复杂；须自行设计对象、动作与策略层。 |
| Oxigraph | RDF Dataset/图。 | SPARQL Query/Update、联邦查询、HTTP Graph Store。 | 未核验 OWL/SHACL 引擎。 | 未核验原生 MCP。 | 项目仍在积极开发；SPARQL 求值优化、权限和多租户需实测。 |
| RDFLib | RDF Graph、Dataset、命名空间和序列化。 | SPARQL 1.1、Store 插件、远程 SPARQL Store。 | 核心不等于 OWL/SHACL；需配 pySHACL/OWL-RL。 | 未核验原生 MCP。 | 纯 Python 工具库，不是完整企业图服务或权限系统。 |
| OG-RAG | JSON-LD 本体映射、知识图谱/超图。 | 多检索引擎和 RAG 评测。 | 评价指标可用，具体规则语义需源码级审阅。 | 未核验 MCP/API。 | 依赖模型密钥/数据路径；研究实现不能直接承诺生产性能。 |
| pySHACL | Shapes graph、RDF data graph、可选 ontology graph。 | 不是通用检索器。 | SHACL Core/AF、RDFS/OWL-RL、SHACL Rules。 | 未核验原生 MCP。 | `owl:imports`、URL 输入、JS/HTTP extras 和规则迭代需设资源边界。 |
| TopBraid SHACL | RDF + Shapes。 | Jena/ARQ 生态接口。 | ValidationUtil、`validate`/`infer`。 | 未核验原生 MCP。 | Java 21、导入与迭代规则可能带来网络/成本/非终止风险。 |
| AWS Accelerator | 形式化本体、VKG、Ontology Engine。 | data-layer、SPARQL federation、GraphRAG。 | 符号推理、SHACL、规则。 | 有 `mcp-server` 和 Smithy/OpenAPI 契约。 | AWS 基础设施、AGPL/LGPL 依赖、持续开发主分支与云成本。 |
| OntoBricks | OWL/RDFS、R2RML、领域/版本生命周期。 | GraphQL、图浏览、MCP。 | OWL RL、SWRL、SHACL（README 声明）。 | `src/mcp-server`、FastMCP 测试。 | 仅限 Databricks Services 的许可证，不适合作为通用可再分发依赖。 |

## 3. 本地静态代码解构要点

### Graphiti：最直接的 Agent 记忆/时间图候选

本地快照显示，Graphiti 的核心 Python 包按 driver、embedder、LLM client、search、models、namespaces、migrations、telemetry、prompts、nodes 与 edges 组织；`mcp_server` 和 `server` 独立存在。README 把 episode 作为来源载体、实体作为节点、事实/关系作为边，并声明事实可保留有效时间窗口和历史状态。其工程价值在于把“当前事实、历史事实、来源回溯”转为不同的查询语义，而不仅是向量相似度。[3]

**Near 最小试验：** 不连接生产图数据库，只选一个隔离后端，构造少量带时间变化的 episode；将三个只读查询——当前事实、某时点事实、证据回溯——封装为工具。验收应包含来源完整性、历史隔离、混合检索召回和失效事实处理。任何写入、网络监听和 MCP 认证都必须在进一步源码审阅后进行。

### Semantica：覆盖面最完整的“上下文—本体—决策溯源”对照

Semantica 的本地固定版本包含 `ingest`、`parse`、`normalize`、`semantic_extract`、`deduplication`、`kg`、`ontology`、`reasoning`、`provenance`、`context`、`change_management`、`graph_store`、`triplet_store`、`vector_store` 等模块；还含 MCP、编辑器插件、REST/CLI 线索和广泛测试目录。README 声称可提供 SHACL/OWL、PROV-O、Rete/Datalog/SPARQL、冲突检测与时间快照；这些功能应先按核心源码、测试和配置逐项验证，而不应只凭 README 进入生产。[4]

**Near 最小试验：** 先只使用其可审计决策记录或只读 Context Graph，输入固定的小样本，要求每个返回对象含 source、时间与规则检查结果。不要在首轮启用全量解析、云连接、自动抽取或多个图/向量后端。该项目的 MIT 根许可证较宽松，但仍需检查重依赖与可选后端许可证。

### Jena、Oxigraph、RDFLib：构建开放语义底座的分工

Jena 具有完整 Java 生态：基础 RDF、ARQ 查询、TDB、Fuseki、OntAPI、SHACL、ShEx、GeoSPARQL、RDF Patch 等模块；适合构建长寿命的语义服务。[5] Oxigraph 更适合嵌入式/轻量服务：以 Rust/RDF/SPARQL 为核心，暴露 Python、JS、CLI 与 HTTP Graph Store 查询面。[6] RDFLib 适合作为 Python Agent 适配层，负责 RDF 格式、SPARQL、命名空间和 Store 抽象，但它自身并非完整推理/验证系统。[7]

**Near 最小试验：** 以 RDFLib 建图与序列化、Oxigraph 作为只读 SPARQL 后端、pySHACL 作为验证门槛。Jena/ Fuseki 可作为需要 Java 服务、复杂语义模块或成熟 SPARQL 生态时的后续选择。所有三个项目都不能单独提供 Palantir 式业务 Action、对象级权限或人工审批。

### 规则与验证：pySHACL 和 TopBraid SHACL

pySHACL 的静态入口包含 `validate`、`validate_each`、`shacl_rules`、CLI 和可选 HTTP 服务；它能为 RDF data graph、Shapes graph 和本体图输出结构化验证报告，并支持 RDFS/OWL-RL 预推理。[8] TopBraid SHACL API 是 Jena 生态的 SHACL 验证/规则推理实现，可通过 Java API、命令行或 Docker 的 `validate`/`infer` 面使用。[9]

**Near 最小试验：** 将 Shapes 固化为数据契约，Agent 仅发送候选对象/关系；验证工具返回 `conforms`、违规路径、规则 ID 和建议，不执行自动修复或外部 imports。该模式能够形成 OAG 的“输入/输出语义质量门”，但不替代业务授权审批。

### 研究/评测资产：GraphRAG、OG-RAG 和 Text2Cypher

GraphRAG 适合把非结构化文本转换为图、社区摘要与查询工作流；OG-RAG 则把 JSON-LD 本体映射、知识图谱/超图、查询引擎与 RAG 评测放在同一研究管线。[10] [11] Text2Cypher 仓库是数据集、评估 notebook 和微调资源，并非已核验的生产查询服务；适合做“自然语言→受限查询”的离线回放与指标研究。[12]

**Near 最小试验：** 首先只做“生成但不执行”或“固定样本的只读离线回放”，比对查询结构、schema 约束、结果匹配与上下文引用。待加上查询白名单、资源限制、只读数据库账号和人工审核后，才可评估真实图查询。

## 4. AgenticX/Near 推荐能力组合

| 目标 | 建议首选组合 | 明确排除项 |
|---|---|---|
| 可审计实体关系检索 | RDFLib + Oxigraph + pySHACL | 不把 LLM 生成的查询直接写入任何业务库。 |
| 时间化 Agent 记忆 | Graphiti + 外部政策/审计适配层 | 不因 README 中有 MCP 而跳过认证、租户和网络审查。 |
| 文档知识图谱研究 | GraphRAG 或 OG-RAG + 主张账本 | 不把图抽取结果直接升格为事实；要求保留来源与证据强度。 |
| 规则化决策建议 | pySHACL/TopBraid + 领域 Action Proposal Schema | 不让验证器或规则引擎自动改变外部业务系统。 |
| 全栈原型对照 | Semantica（优先）或 AWS Accelerator（仅架构参考） | 不在未审依赖、密钥、云资源和授权的情况下运行。 |
| Databricks 语义层评估 | OntoBricks（只作受限平台评估） | 不将其纳入通用 Apache/MIT 依赖或再分发方案。 |

## 5. 下一步实验门槛

在任何仓库进入运行期前，必须完成：固定 SHA 与依赖锁文件；确认各组件和数据的许可证；离线最小数据集；只读服务账号；网络/密钥/遥测检查；可复现输入输出记录；主张、来源、规则和审批链路的统一账本。未经这些步骤，本地克隆仅代表**可审阅的候选**，不代表已批准的技术选型。

## References

[1]: https://palantir.com/docs/foundry/ontology/overview/ "Palantir Ontology building overview"
[2]: https://palantir.com/docs/foundry/palantir-mcp/security/ "Palantir MCP data governance"
[3]: https://github.com/getzep/graphiti "Graphiti"
[4]: https://github.com/semantica-agi/semantica "Semantica"
[5]: https://github.com/apache/jena "Apache Jena"
[6]: https://github.com/oxigraph/oxigraph "Oxigraph"
[7]: https://github.com/RDFLib/rdflib "RDFLib"
[8]: https://github.com/RDFLib/pySHACL "pySHACL"
[9]: https://github.com/TopQuadrant/shacl "TopBraid SHACL API"
[10]: https://github.com/microsoft/graphrag "Microsoft GraphRAG"
[11]: https://github.com/microsoft/ograg2 "Microsoft OG-RAG"
[12]: https://github.com/neo4j-labs/text2cypher "Neo4j Labs Text2Cypher"
