# Semantica 与 AgenticX 差距分析

## AgenticX 证据基线

| 能力 | 路径 | 符号 | 当前行为 |
|---|---|---|---|
| MCP 多传输客户端 | `agenticx/tools/remote_v2.py` | `MCPServerConfig`、`MCPClientV2` | 配置 stdio、streamable HTTP 或 SSE；维护持久会话、发现工具、串行化 stdio 调用，并对可恢复传输失败重试一次。[E-010] [E-011] |
| MCP 工具包装 | `agenticx/tools/remote_v2.py` | `create_tool`、`create_all_tools`、`RemoteToolV2` | 将 MCP schema 转化为 Pydantic 参数并公开远程工具；已检查方法会包装所有发现的工具，未在本地应用 `enabled_tools`。 [E-013] |
| 工具治理 | `agenticx/tools/policy.py` | `ToolPolicyStack`、`PlanModeLayer`、`CategoryPolicy` | 使用拒绝优先、显式允许和默认拒绝；支持路径、计划模式、命令与类别控制。 [E-012] |
| 上下文编译 | `agenticx/core/context_compiler.py` | `EventSummarizer`、`LLMEventSummarizer`、`FastHeuristicCompressor` | 在 token 预算内编译事件历史并保留工具结果/错误；它不是决策溯源图。 |
| 图记忆 | `agenticx/memory/graph/store.py` | `MemoryGraphStore`、`ingest_turn` | 使用可选 Graphiti/Kuzu 将对话回合摄入 episode，并包含配置/可用性检查、超时与恢复路径。 [E-014] |
| 技能打包 | `conclusions/tools_module_summary.md` | `SkillBundleLoader`、`SkillTool`、`SkillExecutionBackend` | 根据已检查结论及其引用模块，支持发现技能包和本地/沙箱执行模式。 |

## 已检查范围

| 字段 | 记录 |
|---|---|
| 路径 | AgenticX：`agenticx/tools/remote_v2.py`、`agenticx/tools/policy.py`、`agenticx/core/context_compiler.py`、`agenticx/memory/graph/store.py`、`conclusions/tools_module_summary.md`；Semantica：`pyproject.toml`、`semantica/mcp_server/__init__.py`、`semantica/context/context_graph.py`、`semantica/context/decision_recorder.py`、`semantica/core/plugin_registry.py`、`tests/context/test_decision_recorder.py`。 |
| 检索词 | `provenance`、`decision record`、`precedent`、`causal`、`approval chain`、`knowledge graph`、`context graph`、`memory graph`、`MCPClientV2`、`enabled_tools`。 |
| 范围限制 | 下文“未发现”只表示在明确检查范围内未发现；不表示所有 AgenticX 模块或未来提交中都不存在。 |

## 候选机制

### G-001：完整采纳 Semantica MCP 客户端

用户希望获得可供 AgenticX/Near 使用的本体/OAG 能力，但没有报告 AgenticX 缺少 MCP 传输、发现或重试能力。E-002 所记录的是 Semantica 的服务端 MCP 工具面，并不是 AgenticX 所缺失的 MCP 客户端机制。

`MCPClientV2` 已支持 stdio、streamable HTTP、SSE、持久会话和重试；`ToolPolicyStack` 已提供默认拒绝的工具边界。[E-010] [E-011] [E-012] 因此，以 Semantica 替换 AgenticX MCP 客户端属于**无缺口（NO-GAP）**。Semantica 应被视为未来候选 MCP 服务/适配对象，而非客户端层替代品。

| 评估项 | 结果 |
|---|---|
| 价值 | 低 |
| 成本 | 中 |
| 回归风险 | 高；替换成熟客户端会复制传输、生命周期和政策职责。 |
| 最小采纳 | 不实施；保留有文档的服务—适配边界，以供后续评估。 |
| 范围边界 | 不评价所有 AgenticX MCP 管理器或桌面 UI 路径。 |
| 验收证据 | 无；不进入实现队列。 |

### G-002：用 Semantica `ContextGraph` 替换 AgenticX 图记忆

这是未经验证的假设。用户请求的是代码研究，而不是替换现有记忆存储。E-004 明确表明 Semantica `ContextGraph` 是具有时态节点/边语义的内存 `GraphStore`；AgenticX 的 `MemoryGraphStore` 已封装可选 Graphiti/Kuzu，并将会话回合摄入 episode，带有初始化和恢复处理。[E-004] [E-014]

因此，直接替换同样是**无缺口（NO-GAP）**。两者职责有重叠但不相同，Semantica 的默认内存实现不能被静态证据证明为 Near 持久记忆的升级方案。

| 评估项 | 结果 |
|---|---|
| 价值 | 低 |
| 成本 | 中 |
| 回归风险 | 高；数据生命周期、Kuzu 集成和记忆 UI 行为都需重验。 |
| 最小采纳 | 不实施。 |
| 范围边界 | 不评估 Semantica 的其他持久图后端，因为本轮没有运行或源码审阅它们。 |
| 验收证据 | 无；不进入实现队列。 |

### G-003：将 Semantica 决策/溯源机制作为独立研究服务

用户的 OAG 调研目标包含可审计的实体、主张、证据和行动边界，并希望它们可被 AgenticX/Near 使用。这为研究决策溯源提供了正当动机；但尚未给出具体生产工作流、数据模型、目标系统或实际用户失败案例。

E-002 公开决策记录/查询/先例/因果工具，E-003 说明图、嵌入和溯源是可选依赖，E-005 仅提供 mock 测试支持。在明确检查范围内，AgenticX 编译事件并管理 Graphiti episode，而没有通过上述检索发现显式的 provenance/decision/approval-chain 抽象；这是检查范围内观察，不能外推为仓库全局不存在。

这是一项可能有价值的**研究能力**，还不是已验证产品缺口。上游机制拥有静态源码证据，但运行时持久化、溯源后端、访问控制和数据兼容性都未验证，故优先级为 **P2**。

| 评估项 | 结果 |
|---|---|
| 价值 | 中 |
| 成本 | 中到高；涉及依赖、数据契约、部署和治理。 |
| 回归风险 | 中到高；图/上下文职责重叠且存在外部 MCP 写工具。 |
| 最小采纳 | 不生产集成；保留锁定源码研究，任何代码任务前必须先获得单独批准的、隔离且只读实验。 |
| 范围边界 | 排除生产凭据、外部行动、租户隔离、图迁移、自动政策执行和 UI 工作。 |
| 未来验收证据 | 固定合成数据、`record_decision`/查询/溯源测试夹具、只读 MCP 政策断言、每次回答的来源引用，以及存储/授权假设的独立审查。 |

### G-004：将 Semantica `PluginRegistry` 用于 AgenticX 技能加载

这同样是未经验证的假设。当前没有用户需求表明 AgenticX 缺少技能发现或插件生命周期行为。E-006 证明 Semantica 支持动态文件系统发现和插件加载，包括构造回退和生命周期方法；已检查的 AgenticX 工具结论则指出已有技能包发现与本地/沙箱执行方向。

因此，复制一个第二动态 Python 插件加载器是**无缺口 / P2**。它会扩大代码执行与供应链风险，而用户已安装的 `SKILL.md` 工作流更直接地符合 AgenticX 的技能模型。

| 评估项 | 结果 |
|---|---|
| 价值 | 低 |
| 成本 | 中 |
| 回归风险 | 高 |
| 最小采纳 | 不实施。 |
| 范围边界 | 不拒绝未来元数据驱动的插件注册；拒绝在没有已验证需求和安全模型的前提下复制动态加载器。 |
| 验收证据 | 无；不进入实现队列。 |

## 裁决推导

没有候选满足 P0：没有一个同时具备已报告的真实失败、高置信的已检查范围内 AgenticX 代码缺口，以及两周内可验证的关闭路径。也没有候选构成证据充分、经用户验证的 P1；唯一具有潜在价值的决策/溯源方向仍是 P2 研究能力，因为运行行为和目标工作流尚未验证。

**最终裁决：`DO_NOT_ADOPT`。** 该裁决并不否定 Semantica 的设计理念，而是在当前证据水平下拒绝立即代码采纳或整体集成。可复用产物是面向未来、需要单独授权的隔离实验的版本锁定参考。
