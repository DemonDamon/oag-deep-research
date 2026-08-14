# Semantica 第二轮中文研究摘要

## 模块目的

`research/codedeepresearch/semantica/` 保存了对 `semantica-agi/semantica` 的第二轮代码深度研究。该研究严格遵循仓库 `.cursor/skills/code-deep-research` 的 S0–S8 工作流，并已将全部自然语言资产中文化。它不是一个 Semantica 集成实现，也不包含第三方源码。

## 固定基线与证据边界

- Semantica 锁定 SHA：`94d0c3dc07109fb4e6df3027dbd571eeefc45d52`。
- AgenticX 对照 SHA：`de771f7160317fc75a39fa9474480e8e7ea5850b`。
- 审阅为静态源码研究；没有安装依赖、运行服务、使用凭据或验证性能/生产安全性。
- DeepWiki 仅为二级架构导航来源，其索引 `e90bd048` 早于锁定源码，不能支撑当前实现或 P0/P1 采纳主张。

## 关键结论

当前裁决为 **`DO_NOT_ADOPT`**。在已检查范围内，AgenticX 已经具备多传输 MCP 客户端、默认拒绝的工具政策和 Graphiti/Kuzu 图记忆；因此不应以 Semantica 替换客户端层、默认内存 `ContextGraph` 或引入其动态 Python 插件加载器。Semantica 的决策记录、政策版本、批准链、时态关系和可选溯源值得作为 P2 设计参考，但其运行时持久化、身份/授权、租户隔离、数据契约与企业写回治理未验证。

## 资产导航

| 资产 | 责任 |
|---|---|
| `research/codedeepresearch/semantica/README.md` | 中文入口、阅读顺序和使用边界。 |
| `meta.md` | S0–S8 账本、锁定版本和质量门。 |
| `semantica_source_notes.md` | 源码执行路径、扩展点、错误处理与 Evidence ID。 |
| `semantica_agenticx_gap_analysis.md` | AgenticX 差距分析和 `NO-GAP`/P2 推导。 |
| `semantica_proposal.md` | 不采纳提案、排除范围与再评估条件。 |
| `semantica_like_open_source_landscape.md` | Graphiti、Cognee、Mem0、GraphRAG、LightRAG、KAG、OpenSPG 与 Neo4j GraphRAG 的中文横向比较。 |

## 后续动作

后续代理不得将该研究视为集成授权。若需要重新评估，必须先定义真实业务决策闭环、对象/关系/来源/政策/Action 数据契约、读写权限和人工审批边界；再以无敏感合成数据、固定上游 SHA 和只读 MCP 白名单做隔离实验。
