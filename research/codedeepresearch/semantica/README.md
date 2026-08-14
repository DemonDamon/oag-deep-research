# Semantica 代码深度调研（中文索引）

本目录保存对 [`semantica-agi/semantica`](https://github.com/semantica-agi/semantica) 的第二轮代码深度研究，以及与其能力相近的开源生态横向比较。所有自然语言内容均以中文交付；源代码符号、配置字段、固定 SHA 和 Evidence ID 保持原样，以确保可追溯性。

> **当前裁决：`DO_NOT_ADOPT`。** 这表示在当前证据下不应把 Semantica 直接纳入 AgenticX 生产实现，不是否定其在决策记录、溯源、时态上下文和图检索方面的设计价值。详细的裁决条件见下表。

| 文件 | 用途 | 阅读顺序 |
|---|---|---:|
| [`meta.md`](meta.md) | S0–S8 状态账本、锁定版本、研究范围、工具限制和质量门。 | 1 |
| [`semantica_source_notes.md`](semantica_source_notes.md) | 关键执行路径、错误处理、扩展点、Evidence ID 与交叉核验。 | 2 |
| [`semantica_code_index.md`](semantica_code_index.md) | 核心目录树、已读文件、关键符号和检索范围。 | 3 |
| [`semantica_agenticx_gap_analysis.md`](semantica_agenticx_gap_analysis.md) | 对 AgenticX MCP、工具政策、上下文与图记忆的差距比较。 | 4 |
| [`semantica_proposal.md`](semantica_proposal.md) | 当前不采纳的理由、明确排除范围、再评估触发条件和下一步规划。 | 5 |
| [`semantica_deepwiki.md`](semantica_deepwiki.md) | DeepWiki 辅助资料的版本差异与证据边界。 | 按需 |
| [`semantica_like_open_source_landscape.md`](semantica_like_open_source_landscape.md) | Graphiti、Cognee、Mem0、GraphRAG、LightRAG、KAG、OpenSPG、Neo4j GraphRAG 的横向比较。 | 按需 |

## 使用边界

所有源码结论都绑定到记录在 `meta.md` 中的固定提交。研究未安装、未运行 Semantica，也未上传第三方源码、依赖、环境文件或凭据。相近项目的星标属于记录日期的快照，不能作为成熟度、安全性或生产适配结论。

若未来要重新评估某一候选，应先定义具体业务闭环、对象/关系/来源/政策/Action 数据契约、读写权限与审批边界，并使用无敏感合成数据开展隔离的只读测试。
