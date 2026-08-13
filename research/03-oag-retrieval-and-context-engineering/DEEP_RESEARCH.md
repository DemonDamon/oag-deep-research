# 03 · OAG 检索与上下文工程：深度研究笔记

**研究状态：第一轮完成。** 本文将 OAG 视为“用显式领域对象、类型和关系参与上下文构造的 RAG 工程路线”，而不是把所有图检索都称为 OAG。必须区分厂商产品术语、同行评议方法与开源工程实现。

## 从 RAG 到 OAG

原始 RAG 把预训练生成模型作为参数化记忆，并用密集向量索引作为非参数化记忆；论文区分了整段生成共享检索文档与按 token 使用不同文档的两种形式。[1] 这一基线的上下文单位通常是文档片段或 passage，并不要求领域本体。

OG-RAG 则将领域文档映射为由 ontology 支撑的超图：hyperedge 封装事实簇，检索过程选择构成答案上下文的最小相关 hyperedge 集合。[2] 论文摘要报告了在其数据集、模型和基线下的事实召回、回答正确性、归因速度与推理准确率提升；这些是作者自报实验结果，不能直接外推为所有 OAG 的普遍收益。

| 路线 | 上下文组织单元 | 结构约束 | 典型强项 | 首要风险 |
|---|---|---|---|---|
| 传统 RAG | chunk / passage | 通常无显式领域约束 | 实现简单、普适 | 证据离散、跨段关系丢失 |
| Hybrid RAG | 词法与向量候选融合 | 检索策略约束 | 兼顾稀疏精确匹配与语义召回 | 归因不清、配置复杂 |
| HyDE | 假设文档作为检索查询 | 向量空间锚定 | 零样本密集召回 | 假设文本不能作为证据 |
| GraphRAG | 实体关系图和社区摘要 | 图抽取结构 | 跨文档/全局问题 | 抽取图不等于领域本体 |
| OAG / OG-RAG | 本体类型、事实簇和关系 | 领域概念、类型与关系 | 可解释的结构化证据选择 | 本体覆盖率、噪声与维护成本 |
| Text2Cypher | schema + 查询 + 执行结果 | 图 schema linking | 结构化事实检索 | 语义错误可在执行成功后隐藏 |

## 检索与上下文构造的事实

HyDE 先由指令模型生成可能含有虚假细节的 hypothetical document，再通过无监督编码器映射到真实语料向量空间检索；其 dense bottleneck 的作用正是将生成文本重新锚定到真实文档，而不是把假设文档当作可引用证据。[3]

Palantir 的 OAG 文档将分块、Embedding、关键词检索、HyDE、查询改写和基于 RRF 的混合检索纳入企业流程，并强调根据数据与问题逐步增加复杂度。[4] 因此研究仓库应把“召回层策略”和“本体/Schema 约束层”分别记录，禁止将任意检索指标改善归因给本体。

Text2Cypher 的 schema filtering 研究表明，全量 schema 可能引入噪声、幻觉与 prompt 成本；可按查询保留相关节点、关系和属性，但过度过滤同样可能删除多跳查询所需的中间结构。[5] 其工程含义是：schema linking、查询生成、数据库执行、结果校验和来源回填必须是一条可观测链路；Cypher 不报错并不代表答案语义正确。

## Context Pack 最小契约

每次回答应固化为一个 Context Pack，而非一段无法复现的提示词。该资产至少记录：问题与时间范围、query rewrite 链、策略版本、Ontology/Schema link、候选来源 ID、片段或图路径、重排分数、被淘汰原因、最终上下文、输出主张、引用和验证状态。这样才能分别测量召回、结构对齐、上下文覆盖、回答忠实性与引用正确性。

```text
question → rewrite / entity linking → lexical+dense+structured recall
         → fusion / reranking → evidence graph or fact cluster selection
         → context pack with provenance → constrained answer → verification
```

## 可复现实验入口

| 项目 | 适合验证什么 | 注意事项 |
|---|---|---|
| [microsoft/ograg2](https://github.com/microsoft/ograg2) | 本体映射、超图检索和 RAGAS 指标 | 固定其数据集、模型和 mapping 配置 |
| [microsoft/graphrag](https://github.com/microsoft/graphrag) | 文本抽图、社区摘要、local/global 检索 | 图抽取不自动具有本体语义 |
| [texttron/hyde](https://github.com/texttron/hyde) | HyDE 与 dense retrieval 基线 | 假设文本不得进入证据库 |
| [neo4j-labs/text2cypher](https://github.com/neo4j-labs/text2cypher) | Text2Cypher 正确性与错误分析 | 分离执行正确性和语义正确性 |

## 评估与未决问题

实验至少报告 Recall@k、MRR/nDCG、context precision/recall、faithfulness、citation correctness、Text2Cypher execution accuracy、延迟和成本。还应控制 chunking、本体质量、实体覆盖率、稀疏/密集候选、查询改写、重排和模型规模。公开资料尚未给出一个统一 OAG 基准来同时控制这些变量，因此“本体必然优于 RAG”目前不是成立的结论。

## 参考资料

[1] [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://proceedings.neurips.cc/paper_files/paper/2020/hash/6b493230205f780e1bc26945df7481e5-Abstract.html)

[2] [OG-RAG: Ontology-grounded Retrieval-Augmented Generation](https://aclanthology.org/2025.emnlp-main.1674/)

[3] [Precise Zero-Shot Dense Retrieval without Relevance Labels (HyDE)](https://aclanthology.org/2023.acl-long.99/)

[4] [Palantir Ontology-Augmented Generation](https://palantir.com/docs/foundry/ontology/ontology-augmented-generation/)

[5] [Enhancing Text2Cypher with Schema Filtering](https://arxiv.org/html/2505.05118v2)
