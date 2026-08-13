# OAG / Palantir Ontology 研究总索引



本目录是 `oag-deep-research` 的长期研究工作区，围绕 **Palantir Ontology、Ontology-Augmented Generation（OAG）及其向 AgenticX / Near 技能转化的路径**组织资料、代码、论文、阅读笔记和已审核交付物。



> 每个编号目录只有一个主研究对象；同一资料只选择一个主归档位置。跨主题使用来源 ID 或链接引用，不复制同一份结论。未确认可再分发的附件、付费资料或受限内容只登记元数据和访问链接，不上传原文。
> 


| 目录 | 主问题 | 边界说明 |

|---|---|---|

| [01-foundations-and-paradigm-boundaries](01-foundations-and-paradigm-boundaries/) | 本体在不同工程语境究竟指什么？ | 概念、范式、术语和四类本体的边界。 |

| [02-palantir-ontology-platform](02-palantir-ontology-platform/) | Palantir 如何以对象、链接、动作、函数和安全构成操作型本体？ | 平台对象模型、治理、开发接口和决策闭环。 |

| [03-oag-retrieval-and-context-engineering](03-oag-retrieval-and-context-engineering/) | OAG 如何检索、组织和注入可靠上下文？ | 分块、索引、查询改写、混合检索、Ontology Query 与 Text2Cypher。 |

| [04-rules-reasoning-and-knowledge-production](04-rules-reasoning-and-knowledge-production/) | 如何生产、治理、执行和演化可执行规则知识库？ | 规则表示、抽取、冲突、更新、执行与审计。 |

| [05-agent-harness-and-runtime-governance](05-agent-harness-and-runtime-governance/) | 如何把本体和规则注入 Agent Harness 并治理运行时行为？ | 工具与权限、审批、记忆、图/循环编排、轨迹与上下文治理。 |

| [06-evaluation-selection-and-case-studies](06-evaluation-selection-and-case-studies/) | 如何比较方案、验证价值并落地到 AgenticX / Near？ | 选型、评估、案例、复盘与验收。 |



## 每个方向的标准子树



每个方向均以 `README.md` 汇总范围、问题树、资料与交付物；后续可在其下按以下生命周期目录归档：



```text

<direction>/

├── README.md

├── sources/       # 来源元数据、许可说明和访问链接

├── papers/        # 开放许可论文与复现说明

├── code/          # 原型、实验或外部仓库固定引用

├── notes/         # 带来源 ID 的阅读卡、假设与未决问题

└── deliverables/  # 审核后的专题报告、图表、矩阵或 Skill 资产

```



## 初始资料与归档规则



用户提供的《本体论紫皮书》作为受限来源登记，不复制 PDF；其四种本体框架归入 `01`。两篇规则推理文章归入 `04`；本体注入 Harness、LangGraph 和 Penguin Harness 归入 `05`；Palantir 官方 Ontology / Action 文档归入 `02`；官方 OAG 文档、检索及 Text2Cypher 线索归入 `03`。跨方向选型和 AgenticX / Near 验收归入 `06`。



新资料应先记录题名、来源、访问日期、许可/再分发状态与主归档目录；没有完成正文核验的网页或社区线索只能作为下一轮调研问题，不得直接进入 Skill 的权威知识上下文。


