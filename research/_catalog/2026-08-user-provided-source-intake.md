# 用户提供资料批次：核验与归档登记

本登记收录用户于 2026-08-13 提供的 14 条资料。每条资料只进入一个**主归档方向**；跨方向使用本表中的来源 ID 与链接引用。除明确允许的标准文件外，公开仓库仅保存元数据、可定位短摘要、访问日期与研究结论，不镜像网页全文、第三方源码或未核验许可的附件。

> **版本规则。** 网页和代码仓库会发生变更；下表记录的是本批次核验时的状态，不取代原始站点的最新版本。法规、Internet-Draft 与产品公告必须同时记录版本或生效状态，不能只依赖页面标题。

| ID | 核验标题与来源属性 | 主归档 | 访问与再分发边界 |
|---|---|---|---|
| SRC-2026-08-01 | Palantir *Platform overview*；官方产品资料 | `02` | 可访问；页面未显示开放全文许可，保存摘要元数据与链接。 |
| SRC-2026-08-02 | Palantir *Foundry platform summary for LLMs*；官方产品资料 | `02` | 可访问，页面标注最后更新 2026-07-02；权利归 Palantir，保存摘要元数据与链接。 |
| SRC-2026-08-03 | W3C *OWL 2 Web Ontology Language Document Overview (Second Edition)*；W3C Recommendation | `01` | 可访问，2012-12-11；按 W3C 文档使用规则保存版本标识、版权与原始 URL。 |
| SRC-2026-08-04 | W3C *Shapes Constraint Language (SHACL)*；W3C Recommendation | `04` | 可访问，2017-07-20；按 W3C 文档使用规则归档，保留版权、状态与原始 URL。 |
| SRC-2026-08-05 | IETF *Knowledge Graph Framework for Network Operations*；Internet-Draft | `01` | 可访问，draft-mackey-nmop-kg-for-netops-02，2025-03-03；草案已过有效期，不能当作 RFC 或现行标准。 |
| SRC-2026-08-06 | Neo4j Community *Labeled Property Graphs not suited as knowledge graphs?*；社区讨论 | `01` | 可访问，2025-09；个人/社区观点，保存摘要与链接，不重发全文。 |
| SRC-2026-08-07 | Graphwise *Introducing GraphRAG: The Trust Layer of the Graphwise Platform*；企业博客 | `06` | 可访问，2025-12-18；产品主张须与独立基准区分，保存摘要与链接。 |
| SRC-2026-08-08 | SNOMED International 主页与 SNOMED CT 文档库；官方术语体系资料 | `01` | 可访问；用户 URL 是主页而非单独文档库，使用受成员/地区许可规则约束，保存摘要元数据。 |
| SRC-2026-08-09 | Palantir *Enable custom retrieval with Function-backed context in AIP Agent Studio*；官方产品公告 | `03` | 可访问，2025-02-13；产品功能说明，保存摘要元数据与链接。 |
| SRC-2026-08-10 | CAAC 中国民用航空局；现行《民用航空器维修单位合格审定规则》入口 | `04` | 用户 URL 是法规门户而非具体 CCAR-145 页面；优先引用现行 2022 规章，历史 CCAR-145-R3 已失效。 |
| SRC-2026-08-11 | Anthropic *Constitutional AI: Harmlessness from AI Feedback*；官方研究页面/论文 | `01` | 原用户 URL 404，已校正至官方研究页；arXiv 论文版本标注 CC BY 4.0，网页本身许可未单列。 |
| SRC-2026-08-12 | NVIDIA *NeMo Guardrails*；官方开源项目 | `05` | 可访问；仓库标示 Apache-2.0，第三方依赖另行核验。 |
| SRC-2026-08-13 | LangChain *LangGraph*；官方开源项目 | `05` | 可访问；仓库标示 MIT License，文档/商标/依赖可能有独立权利边界。 |
| SRC-2026-08-14 | OpenAI *Function calling*；官方开发者文档 | `05` | 可访问，原 URL 已重定向；页面未见开放全文许可，保存摘要元数据与链接。 |

## 主归档裁决

概念与范式方向 `01` 负责形式本体、图模型、行业术语体系与行为原则的边界问题，因此收录 OWL、IETF 草案、Neo4j 社区讨论、SNOMED 与 Constitutional AI。平台方向 `02` 负责 Palantir 的对象—链接—逻辑—行动模型及其官方术语。检索方向 `03` 收录 Function-backed context，因为它的主要研究对象是每轮查询的上下文构造。规则方向 `04` 收录 SHACL 及民航维修规章，分别代表结构约束与受监管业务规则。运行时方向 `05` 收录 NeMo Guardrails、LangGraph 和函数调用，因为其共同问题是工具、状态、约束与执行回传。评估方向 `06` 收录 Graphwise GraphRAG 博客，使厂商“可信层”主张与可独立验证的效果证据保持分离。

## 校正与待办

用户提供的部分链接是入口或发生过重定向：SNOMED 链接是主页；CAAC 链接是机构门户；Anthropic 原链接返回 Not Found；OpenAI 链接已迁至 `developers.openai.com`。这些差异已在对应阅读卡中明确，不应被静默修正后误当作用户的原始引用。对于 CAAC 规章，后续若要作为合规规则样本，应固定现行 2022 规章 PDF、实施日期、适用范围与任何后续修订，再建立机器可读规则。

## 参考资料

[1] [Palantir, Platform overview](https://www.palantir.com/docs/foundry/platform-overview/overview/)
[2] [Palantir, Foundry platform summary for LLMs](https://palantirfoundation.org/docs/foundry/getting-started/foundry-platform-summary-llm)
[3] [W3C, OWL 2 overview](https://www.w3.org/TR/owl2-overview/)
[4] [W3C, SHACL](https://www.w3.org/TR/shacl/)
[5] [IETF, Knowledge Graph Framework for Network Operations](https://www.ietf.org/archive/id/draft-mackey-nmop-kg-for-netops-02.html)
[6] [Neo4j Community discussion](https://community.neo4j.com/t/labeled-property-graphs-not-suited-as-knowledge-graphs/75395)
[7] [Graphwise, Introducing GraphRAG](https://graphwise.ai/blog/introducing-graphrag-the-trust-layer-of-the-graphwise-platform/)
[8] [SNOMED International](https://www.snomed.org/)
[9] [Palantir, Function-backed context](https://palantirfoundation.org/docs/foundry/announcements/2025-02)
[10] [CAAC](https://www.caac.gov.cn/)
[11] [Anthropic, Constitutional AI](https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback)
[12] [NVIDIA, NeMo Guardrails](https://github.com/NVIDIA/NeMo-Guardrails)
[13] [LangChain, LangGraph](https://github.com/langchain-ai/langgraph)
[14] [OpenAI, Function calling](https://developers.openai.com/api/docs/guides/function-calling)
