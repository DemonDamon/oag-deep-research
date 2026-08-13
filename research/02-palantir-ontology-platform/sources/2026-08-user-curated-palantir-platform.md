# 用户资料阅读卡：Palantir Ontology 平台模型

本卡收录两份 Palantir 官方高层资料。它们适合界定官方产品术语、对象模型和治理叙事；任何具体性能、可用区域、许可或生产适用性结论仍须回到对应功能文档、合同与部署配置核验。

## SRC-2026-08-01：Platform overview

Palantir 的平台总览将 Ontology 描述为围绕企业**决策**而不只是数据的表示层，并以对象、链接、数据、逻辑和行动组织运营应用。页面将逻辑说明为模型、业务规则和模板化分析/报告，将行动说明为在 Ontology 或外部系统中写入和编排变化；同时提到语义搜索、媒体引用、值类型、API 网关和 OSDK。[1]

对本仓库的最重要含义是：Palantir 的“本体”是**操作型对象模型**。研究应同时记录对象/链接的表示、逻辑可追溯性、Action 的写入边界、权限、Scenario 沙箱以及提案式人机协作，而不能只把它简化成知识图谱或向量检索索引。

> 研究裁决：平台页面的“AI Mesh”“决策中心”“可信”等用语是产品架构叙事；除非有独立可复核基准或规范，应标为官方主张而非通用效果结论。

## SRC-2026-08-02：Foundry platform summary for LLMs

该页是面向 LLM 和 Agent 的 Foundry 术语摘要，页面明确其由 LLM 生成并经 Palantir 工程师审核，因此适合作为**词汇导航**，不是完整实现规范。页面将 Foundry 描述为由数据层与 Ontology 对象层构成的企业数据操作系统，并将 AIP 描述为模型连接、Agent 开发、AI 应用与 Evals 的生成式 AI 平台；它还涵盖 Retrieval Context、兼容 LLM Provider 的 API、BYOM、权限、使用追踪和零数据保留等术语。[2]

该材料可用于统一仓库中的 Palantir 名称，但应遵守两个限制。第一，具体字段、API、功能可用性和安全属性要回查相应产品文档。第二，页面版权归 Palantir 所有，仓库只保存来源、版本、摘要和研究链接，不镜像全文。

## 可转化为 AgenticX/Near 的抽象

| Palantir 官方术语 | 可迁移抽象 | Near 侧最小审计要求 |
|---|---|---|
| Ontology 对象/链接 | 领域实体和可导航关系 | ID、来源、版本、关系方向与允许操作 |
| Logic | 规则、模型输出与分析工件 | 输入、规则/模型版本、置信度、适用范围 |
| Action | 受控副作用或变更提案 | 权限、参数 Schema、审批人、回滚与执行记录 |
| Retrieval Context | 每轮查询的受限上下文包 | 来源、选择逻辑、时效、敏感级别与引用 |
| Evals / observability | 可比较的运行质量记录 | 场景、预期、实际、失败类型与复现条件 |

## 交叉引用

- 具体的 Function-backed retrieval 归 `03`，因为其主问题是上下文构造而非平台对象模型。
- Action、工具权限和审批的执行边界可由 `05` 引用。
- OSDK、工具调用和供应商 API 的比较可由 `06` 引用，但不得从本卡推断互操作性已获验证。

## 参考资料

[1] [Palantir, Platform overview](https://www.palantir.com/docs/foundry/platform-overview/overview/)
[2] [Palantir, Foundry platform summary for LLMs](https://palantirfoundation.org/docs/foundry/getting-started/foundry-platform-summary-llm)
