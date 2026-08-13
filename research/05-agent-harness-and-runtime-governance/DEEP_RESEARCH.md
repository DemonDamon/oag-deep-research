# 05 · Agent Harness 与运行时治理：深度研究笔记

**研究状态：第一轮完成。** 本文将 Harness 定义为管理 Agent 状态、控制流、工具、策略、审批与可观测性的运行时层。它不是单一图框架，也不是一段 prompt；本体、规则和 Context Pack 只有进入具体控制点，才能对 Agent 行为产生可验证约束。

## 控制平面

| 控制点 | 应注入的资产 | 应留下的证据 | 常见失败 |
|---|---|---|---|
| 任务理解 | 领域术语、对象类型、允许范围 | schema linking、拒答理由 | 把模糊词误映射为敏感对象 |
| 规划与路由 | 状态、规则前置条件、工具可用性 | 分支、循环次数、路由依据 | 循环、目标漂移、无效重试 |
| 工具调用 | 参数 Schema、最小权限、审批条件 | 调用前/后校验、审批事件 | 过度授权、越权副作用 |
| 状态与记忆 | 已验证事实、未决问题、保留策略 | 写入来源、版本、淘汰原因 | 无限增长、过期记忆污染 |
| 输出与写回 | 规则、引用、对象关系和发布契约 | 主张—来源映射、写回/拒绝记录 | 将猜测升级为行动 |

LangGraph 将持久化分为两类：checkpointer 保存单线程图状态，支持恢复、容错、时间旅行与人工介入；store 保存跨线程应用级数据，适合用户偏好、事实和共享知识。[1] 这表明“状态”至少需要拆分为短期可恢复的执行状态与跨会话的长期记忆。它们的读写权限、保留期限和审计要求不同，不能用一个无界消息列表替代。

OpenAI Agents SDK 的 Runner 管理工具循环、handoff、停止和审批；其 guardrail 分为输入、输出和工具层。输入 guardrail 只应用于链中的首个 Agent，输出 guardrail 只应用于最终 Agent，而自定义函数工具调用可由工具 guardrail 包裹。[2] [3] 因而高风险副作用应在真正执行前的工具层同时进行参数校验、权限判断和人工确认，不能仅依赖首尾的文本安全检查。

Tracing 不是可选的展示层。SDK 的 trace/span 可覆盖 workflow、task、turn、agent、generation、function、guardrail 和 handoff，且可关闭敏感数据采集或替换导出器。[4] 在生产环境，轨迹保存策略应明确区分：用于调试的临时内容、用于安全审计的不可抵赖事件、以及受数据最小化约束的用户内容。

MCP 定义 Host、Client 和 Server 的 JSON-RPC 协作与能力协商，Resources、Prompts 和 Tools 可以被暴露；规范强调工具可能代表任意代码执行，Host 应在调用前取得用户明确同意。[5] 但 MCP 只能提供能力描述与同意原则，不会自动完成逐工具授权、凭证受众验证、作用域限制、审批或审计。这些必须由 Host、网关或具体 Harness 显式实现。[6]

## 与本体和 OAG 的接入关系

本体用于帮助 Agent 识别对象、属性和关系；规则用于表达前置条件、禁止条件和验证要求；Context Pack 用于提供带来源的当前证据。三者应在不同控制点进入系统，而不是一股脑注入 system prompt：本体服务理解和检索，规则服务规划与工具前校验，Context Pack 服务回答和主张验证。任何会改变真实世界状态的 Action 均应有独立工具 Schema、最小权限和审批路径。

## 开源参考与实验

| 项目 | 研究价值 | 需避免的误解 |
|---|---|---|
| [LangGraph](https://github.com/langchain-ai/langgraph) | 图状态、检查点、条件路由与人工介入 | 图编排不等于权限治理 |
| [OpenAI Agents SDK](https://github.com/openai/openai-agents-python) | 工具循环、handoff、guardrails、sessions、tracing | 框架默认行为不是安全保证 |
| [MCP Specification](https://github.com/modelcontextprotocol/specification) | 工具/资源/提示的互操作契约 | MCP 不替代身份、授权与审计 |
| [Tree of Thoughts](https://github.com/princeton-nlp/tree-of-thought-llm) | 搜索、状态评估、分支与回溯 | 推理搜索不证明生产可靠性 |

## 未决问题

需要在相同的工具集合与权限模型下，对图、循环和 Harness 三种编排风格比较：计划成功率、循环/超时率、人工审批命中、越权阻断率、敏感数据暴露率、轨迹完备性和平均成本。还要分别验证输入、输出、工具和 handoff 层的 guardrail 覆盖，不得把某层的通过误解为全链路安全。

## 参考资料

[1] [LangGraph Persistence](https://docs.langchain.com/oss/python/langgraph/persistence)

[2] [OpenAI Agents SDK Guide](https://developers.openai.com/api/docs/guides/agents)

[3] [OpenAI Agents SDK Guardrails](https://openai.github.io/openai-agents-python/guardrails/)

[4] [OpenAI Agents SDK Tracing](https://github.com/openai/openai-agents-python/blob/main/docs/tracing.md)

[5] [Model Context Protocol Specification](https://modelcontextprotocol.io/specification/2026-07-28)

[6] [MCP Security Best Practices — Draft](https://modelcontextprotocol.io/specification/draft/basic/security_best_practices)
