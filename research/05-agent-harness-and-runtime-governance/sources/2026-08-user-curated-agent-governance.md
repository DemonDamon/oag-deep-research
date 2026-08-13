# 用户资料阅读卡：Agent Harness 与运行时治理

本卡收录三类运行时材料：对话/检索/执行护栏，长期有状态编排，以及工具调用 Schema。它们共同说明 Agent 的安全性不能只依赖提示词；应把约束放在输入、状态、检索、执行、输出和审计链路上。

## SRC-2026-08-12：NVIDIA NeMo Guardrails

NeMo Guardrails 是 NVIDIA 的 Apache-2.0 开源库，用于在应用代码与 LLM 之间放置可编程护栏。其 README 将护栏分为输入、对话、检索、执行和输出五类，并使用 Colang 建模可控对话流程；项目同时提醒内置护栏未必适用于所有生产场景。[1]

**纳入方式。** 该项目应作为“多阶段护栏能力”的候选实现，而不是默认安全保证。Near 接入前必须独立检查依赖、许可证、模型/服务调用、日志、数据留存和具体行业风险。

## SRC-2026-08-13：LangGraph

LangGraph 是 LangChain 的 MIT 许可低层编排框架，用于构建和部署长运行、有状态 Agent。项目强调持久化执行、故障恢复、人机协同、短期与长期记忆以及可观测性；它可独立使用，也可与 LangChain 生态集成。[2]

**纳入方式。** LangGraph 是状态机/图编排的候选，而非本体或规则引擎。若被用于 Near 试验，应将本体事实、规则验证、Action Proposal 和审批节点明确建模为不同状态，不允许模型将“已检索到文本”直接转为“已获批准的行动”。

## SRC-2026-08-14：OpenAI Function calling

OpenAI 的函数调用文档将 tool/function calling 描述为模型与应用外部数据或操作的连接机制：应用向模型提供工具定义，接收调用，应用侧执行代码，再把带 `call_id` 的工具输出回传模型。函数定义采用 JSON Schema，严格模式还要求额外 Schema 约束，例如 `additionalProperties: false` 与所有字段标记为 required。[3]

**纳入方式。** 工具 Schema 是最小治理接口，不是授权本身。一个合格的 Near 工具还要声明身份与权限、只读/写入类别、数据范围、审批、超时、幂等性、审计和回滚。官方“减少初始暴露工具数量、按需加载”的建议可作为上下文最小化实践，但不能取代威胁建模。

## 统一运行时契约

| 层 | 最小控制 | 对应来源 |
|---|---|---|
| 输入 | 主题/PII/注入风险筛查 | NeMo Guardrails |
| 状态与编排 | 显式状态、检查点、恢复、人机节点 | LangGraph |
| 检索 | 来源范围、时效、敏感标签、引用 | NeMo retrieval rails；`03` 的 Context Pack |
| 工具 | JSON Schema、权限、执行类别、幂等性 | OpenAI Function calling |
| 写操作 | Action Proposal、规则验证、审批、回滚 | 本仓库 `02`、`04` 的平台与规则资产 |
| 输出 | 引用、可解释性、敏感信息和质量检查 | NeMo output rails；本仓库主张账本 |

## 参考资料

[1] [NVIDIA, NeMo Guardrails](https://github.com/NVIDIA/NeMo-Guardrails)
[2] [LangChain, LangGraph](https://github.com/langchain-ai/langgraph)
[3] [OpenAI, Function calling](https://developers.openai.com/api/docs/guides/function-calling)
