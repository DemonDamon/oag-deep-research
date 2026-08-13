# 用户资料阅读卡：概念与范式边界

本卡收录本批资料中以**本体表示、图模型、受控术语与行为原则**为主要研究对象的五项来源。它们不被用来证明某个产品的性能；其用途是界定表示、约束、推理和治理模型的术语边界。

## SRC-2026-08-03：OWL 2

W3C 将 OWL 2 定义为具有形式化语义的本体语言；本体可由类、属性、个体和数据值构成，并与 RDF 信息配合。概览还区分 Direct Semantics 与 RDF-Based Semantics，并将 EL、QL、RL 定位为以表达能力换取计算或工程可实现性的 Profiles。对本仓库而言，OWL 2 是**可判定语义模型和推理边界**的规范基线，而不是要求所有 OAG 系统都采用 OWL 的实现处方。[1]

**主问题。** 研究资产必须明确使用的是 RDF/OWL 的开放世界语义、属性图的应用查询语义，还是平台特有对象模型；不能把三者互称为同一种“本体”。

## SRC-2026-08-05：网络运维知识图谱框架草案

IETF Internet-Draft 将 RDF、RDFS、OWL、SPARQL 和 SHACL 用于网络运维的知识图谱、策略约束、配置合规与诊断讨论。该文档是 Informational 草案，并非 RFC，且该版本有效期已结束。用户提供的“RDF/SHACL vs Property Graph 对比”是有效研究问题，但不是该草案已完成的系统化对比结论。[2]

**主问题。** 在高频操作场景中，形式化表达、合规验证、数据目录和闭环自动化分别需要哪些语义保证？应把性能比较留给 `06`，把检索实现留给 `03`。

## SRC-2026-08-06：Neo4j 社区的 LPG 与知识图谱讨论

这是一篇社区讨论，不是 Neo4j 官方技术立场。讨论者认为 LPG 的实用性与开发敏捷性可以和 RDF/OWL 的一致性、形式推理需求形成互补，建议先从简单模型开始、按需要引入本体。它适合用作**设计权衡的观点材料**，不适合用作事实性基准或行业定论。[3]

**主问题。** 本体何时应承担约束和可推理语义，何时只需作为应用对象模型或查询组织方式？

## SRC-2026-08-08：SNOMED CT

SNOMED International 将 SNOMED CT 描述为多语言临床术语体系，以概念、描述和关系为核心，并通过机器可读标识支持临床信息表达。它提醒本仓库：成熟领域本体不仅是实体关系图，还包括术语治理、发布节奏、映射、许可和实施约束。其官网主页不是完整文档库，且使用受成员/地区许可规则影响。[4]

**主问题。** 若将 OAG 应用于医疗等高风险领域，受控术语、版本、映射和授权应当成为证据和行动边界的一部分。

## SRC-2026-08-11：Constitutional AI

Anthropic 的研究将 Constitutional AI 描述为基于一组原则进行自我批评、修订和 AI 反馈偏好学习的方法。它不是领域本体规范，但可用于区分**训练期行为原则**与**运行期可执行规则**：前者影响模型偏好，后者应在系统中具备可验证条件、权限范围、证据和审计记录。原用户 URL 已失效，本卡引用已核验的官方替代链接；论文版本的许可与官网页面的许可须分别处理。[5]

**主问题。** 行为原则如何转换为可审计的系统约束，而不被误写为已执行的业务规则？

## 交叉引用

- OWL 2 与 IETF 草案可在 `04` 中作为规则/约束语义背景引用。
- SNOMED CT 可在 `03` 中作为受控词汇检索案例，在 `06` 中作为行业实施案例引用。
- Constitutional AI 可在 `05` 中作为训练期对齐与运行期护栏的区分背景引用。

## 参考资料

[1] [W3C, OWL 2 Web Ontology Language Document Overview](https://www.w3.org/TR/owl2-overview/)
[2] [IETF, Knowledge Graph Framework for Network Operations](https://www.ietf.org/archive/id/draft-mackey-nmop-kg-for-netops-02.html)
[3] [Neo4j Community, LPG discussion](https://community.neo4j.com/t/labeled-property-graphs-not-suited-as-knowledge-graphs/75395)
[4] [SNOMED International](https://www.snomed.org/)
[5] [Anthropic, Constitutional AI](https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback)
