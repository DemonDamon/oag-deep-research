# 用户资料阅读卡：OAG 检索与上下文工程

## SRC-2026-08-09：Function-backed context in AIP Agent Studio

Palantir 于 2025-02-13 公告的功能允许 AIP Agent 在每轮查询中调用开发者实现的检索 Function 来生成上下文。该 Function 在 Code Repositories 的 TypeScript 仓库中实现并发布，需满足 `AipAgentsContextRetrieval` 接口；其字符串输出会插入模型的 system prompt。Function 可以接收用户消息及字符串或对象集类型的应用变量，构建者再将变量映射到 Retrieval context 面板。[1]

这一设计是 OAG 的关键工程案例：上下文不是静态文档拼接，而是一个**由问题、领域对象、检索逻辑和引用格式共同决定的运行时工件**。页面还支持将 Ontology 对象、PDF 文档与外部 URL 输出为可点击引用。该能力展示了可追溯性的产品实现路径，但不等于对任意检索函数的正确性、安全性或引用真实性提供保证。

## 研究转化

| 上下文组件 | 研究要求 | AgenticX/Near 对应约束 |
|---|---|---|
| 触发输入 | 保存用户问题、会话状态和必要的对象过滤条件 | 明确 PII/敏感字段处理，避免无界上下文扩张 |
| Retrieval Function | 保存函数版本、参数模式和选择逻辑 | 只读默认；函数要声明可访问的数据源、超时与失败策略 |
| Context Pack | 保存输出片段、来源、时效、对象 ID 和删减原因 | 与模型提示分离存储，并可重新生成与审计 |
| 引用呈现 | 保存显示文本到原始对象/文档/URL 的映射 | 不能用格式化引用替代证据验证；失效链接需显式标记 |

> 对于 Near，建议将任何自定义检索逻辑的输出先写入“候选上下文包”，再应用来源校验、权限过滤、时效检查和引用去重。只有通过这些检查的内容才可注入模型上下文。

## 边界与交叉引用

本卡不讨论 Ontology 对象、Action 或 OSDK 的完整平台模型，相关内容在 `02`。函数调用、工具权限和参数 Schema 在 `05`。若要评估图检索、GraphRAG 或 Text2Cypher 的质量，则应在 `06` 按数据集、场景和指标进行比较，不应由单一产品公告外推。

## 参考资料

[1] [Palantir, Enable custom retrieval with Function-backed context in AIP Agent Studio](https://palantirfoundation.org/docs/foundry/announcements/2025-02)
