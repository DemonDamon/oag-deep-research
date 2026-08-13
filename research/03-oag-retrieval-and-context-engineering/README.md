# 03 · OAG 检索与上下文工程



本方向研究 **模型如何在 OAG 场景中找到、组织、验证并注入相关上下文**。范围包括分块、对象化、Embedding、关键词检索、HyDE、查询改写、混合检索、重排、Ontology Query、Schema Linking 与 Text2Cypher；不讨论 Palantir Action 的业务变更语义。



| 问题 | 预期交付 |

|---|---|

| OAG 与传统 RAG 在上下文单位、结构化对象和可追溯性上有什么区别？ | OAG / RAG 对照图 |

| 分块、媒体引用、对象化和 Embedding 怎样影响证据定位？ | 语料建模与分块规范 |

| HyDE、关键词、查询扩展/提炼与 RRF 何时应组合使用？ | 检索策略决策树与基准方案 |

| Text2Cypher / Ontology Query 的 Schema Linking 难点如何缓解？ | 渐进优化实验与风险清单 |

| 如何让检索结果成为带来源、范围、时效和置信度的 Context Pack？ | Context Pack 数据契约 |



## 初始资料



Palantir 的 [Ontology-augmented generation 文档](https://palantir.com/docs/foundry/ontology/ontology-augmented-generation/) 将“为 LLM 找到相关上下文”作为核心问题，并描述分块、Embedding、关键词、HyDE、查询改写和以 RRF 融合的混合检索。其方法立场是从简单方案开始，再依据数据和问题逐步增加复杂度。



用户提供的 [Text2Cypher 优化文章](https://mp.weixin.qq.com/s/jELrbU40W30DF59swlyDHA) 是 Schema Linking、查询生成和本体检索的待核验专题入口；在正文完成核验前只能作为调研线索。



| 阶段 | 应记录的可审计信息 |

|---|---|

| 语料建模 | Chunk / Object ID、版本、原文定位和许可 |

| 查询准备 | 原始问题、转换链、提示词与检索策略版本 |

| 候选召回 | 过滤条件、排序、得分和时间范围 |

| 融合与重排 | 融合策略、淘汰理由和失败样例 |

| Context Pack | 来源、摘录、对象/关系、时效与置信度 |



平台对象与 Action 的定义进入 `02`；规则表示与执行进入 `04`；Agent 的状态、工具、权限和审批进入 `05`。
