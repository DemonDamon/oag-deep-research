# Semantica 代码索引

## 来源与版本

| 来源 | 状态 |
|---|---|
| 本地上游克隆 | 固定 SHA 为 `94d0c3dc07109fb4e6df3027dbd571eeefc45d52`，位于 `research/codedeepresearch/semantica/upstream/`；来自 `https://github.com/semantica-agi/semantica.git` 的干净浅克隆。 |
| AgenticX 基线 | 固定 SHA 为 `de771f7160317fc75a39fa9474480e8e7ea5850b`，位于本地 `agenticx/`；来自 `https://github.com/DemonDamon/AgenticX.git` 的干净浅克隆。 |
| GitHub MCP | 不可用；未配置 GitHub MCP 服务，因此没有 Issue/PR 主张被用作实现证据。 |
| ZRead | 不可用；未配置 ZRead 工具。 |
| DeepWiki | 部分可用的二级来源；页面索引为 `e90bd048`，早于锁定上游 SHA，且交互提问未返回答案。 |

## 核心目录树

```text
upstream/
├── pyproject.toml                         # 包元数据、可选依赖、CLI/server/MCP 入口
├── semantica/
│   ├── context/
│   │   ├── context_graph.py               # 内存图、时态节点与边
│   │   └── decision_recorder.py           # 决策、政策、批准与溯源编排
│   ├── mcp_server/
│   │   └── __init__.py                    # stdio MCP 工具/资源/JSON-RPC 分派
│   ├── core/
│   │   └── plugin_registry.py             # 插件发现与生命周期
│   ├── ontology/                           # OWL / SHACL / SKOS 机制（本轮未读取）
│   ├── reasoning/                          # 规则 / Datalog / Rete 机制（本轮未读取）
│   ├── provenance/                         # W3C PROV-O 机制（本轮未读取）
│   └── graph_store/                        # 图后端接口（本轮未读取）
├── mcp/                                   # 顶层 MCP 打包面（本轮不作为决策证据）
└── tests/
    └── context/test_decision_recorder.py  # 以 mock 为主的决策记录测试
```

## 实际读取的文件

| 文件 | 证据类别 | 已审阅符号 |
|---|---|---|
| `upstream/pyproject.toml` | 公共入口/API 与部署面 | `[project]`、核心依赖、`optional-dependencies`、`[project.scripts]` |
| `upstream/semantica/mcp_server/__init__.py` | 公共入口/API、主路径、错误/降级 | `_get_graph`、`_tool_record_decision`、`_tool_query_decisions`、`TOOLS`、`RESOURCES`、`_handle`、`_run_stdio`、`main` |
| `upstream/semantica/context/decision_recorder.py` | 核心抽象、主路径、失败、扩展 | `DecisionRecorder`、`record_decision`、`link_entities`、`apply_policies`、`record_exception`、`record_approval_chain` |
| `upstream/semantica/context/context_graph.py` | 核心状态/数据模型、时态错误/降级 | `_parse_iso_dt`、`_normalize_temporal_input`、`ContextNode`、`ContextEdge`、`ContextGraph` |
| `upstream/semantica/core/plugin_registry.py` | 扩展点、失败/降级 | `PluginRegistry`、`register_plugin`、`load_plugin`、`unload_plugin` |
| `upstream/tests/context/test_decision_recorder.py` | 测试/示例 | `TestDecisionRecorder`、成功/失败/政策/批准/溯源测试 |
| `agenticx/conclusions/tools_module_summary.md` | AgenticX 文档基线 | 工具、MCP、护栏、政策、技能包摘要 |
| `agenticx/agenticx/tools/remote_v2.py` | AgenticX 实现基线 | `MCPServerConfig`、`MCPClientV2`、`discover_tools`、`call_tool`、`create_all_tools`、`RemoteToolV2` |
| `agenticx/agenticx/tools/policy.py` | AgenticX 治理基线 | `ToolPolicyLayer`、`ToolPolicyStack`、`PathPolicyLayer`、`PlanModeLayer`、`CommandDenyLayer`、`CategoryPolicy` |
| `agenticx/agenticx/core/context_compiler.py` | AgenticX 上下文基线 | `EventSummarizer`、`LLMEventSummarizer`、`FastHeuristicCompressor` |
| `agenticx/agenticx/memory/graph/store.py` | AgenticX 图记忆基线 | `graphiti_available`、`MemoryGraphStore`、`_ensure_ready_impl`、`ingest_turn` |

## 关键符号

| 符号 | SHA + 路径:行范围 | 职责 |
|---|---|---|
| `MCPServerConfig._validate_transport` | `de771f7` + `agenticx/tools/remote_v2.py:88-154` | 校验唯一的本地命令或远程 URL，并选择 stdio、HTTP 或 SSE 传输。 |
| `MCPClientV2._create_session` | `de771f7` + `agenticx/tools/remote_v2.py:239-367` | 创建持久会话并处理传输初始化失败。 |
| `MCPClientV2.call_tool` | `de771f7` + `agenticx/tools/remote_v2.py:395-439` | 串行化调用，并针对可恢复错误进行一次受控重置/重试。 |
| `MCPClientV2.create_all_tools` | `de771f7` + `agenticx/tools/remote_v2.py:523-546` | 包装已发现的工具；已检查范围内未在此处应用 `enabled_tools` 过滤。 |
| `ToolPolicyStack.check` | `de771f7` + `agenticx/tools/policy.py:97-191` | 按类别拒绝、显式层拒绝、允许、默认拒绝的顺序评估。 |
| `MemoryGraphStore._ensure_ready_impl` | `de771f7` + `agenticx/memory/graph/store.py:275-361` | 通过超时、锁/损坏处理初始化 Graphiti/Kuzu。 |
| `MemoryGraphStore.ingest_turn` | `de771f7` + `agenticx/memory/graph/store.py:363-427` | 将会话消息转化为 Graphiti episode。 |
| `_get_graph` | `94d0c3d` + `semantica/mcp_server/__init__.py:65-81` | 延迟初始化内存 `ContextGraph`，并可选择加载持久路径。 |
| `_tool_record_decision` | `94d0c3d` + `semantica/mcp_server/__init__.py:130-148` | 校验最低决策字段后调用图记录器。 |
| `_handle` / `_run_stdio` | `94d0c3d` + `semantica/mcp_server/__init__.py:511-619` | 分派 JSON-RPC 并运行带解析/工具错误路径的 stdio 循环。 |
| `DecisionRecorder.record_decision` | `94d0c3d` + `semantica/context/decision_recorder.py:88-154` | 执行可选嵌入、图存储、实体连接和可选溯源。 |
| `DecisionRecorder.apply_policies` | `94d0c3d` + `semantica/context/decision_recorder.py:190-269` | 通过图查询应用指定或最新政策版本。 |
| `ContextNode.is_active` / `ContextEdge.is_active` | `94d0c3d` + `semantica/context/context_graph.py:301-410` | 按时间范围判断节点和边是否生效。 |
| `PluginRegistry.load_plugin` | `94d0c3d` + `semantica/core/plugin_registry.py:183-318` | 解析/加载依赖，并包装初始化错误。 |

## 检索覆盖范围

| 字段 | 覆盖情况 |
|---|---|
| 路径 | `semantica/mcp_server`、`semantica/context`、`semantica/core`、`tests/context`；AgenticX 的 `tools`、`core`、`memory/graph`、`conclusions`。 |
| 精确符号 | `MCPClientV2`、`MCPServerConfig`、`ToolPolicyStack`、`MemoryGraphStore`、`ContextGraph`、`DecisionRecorder`、`PluginRegistry`、`record_decision`、`create_all_tools`、`enabled_tools`。 |
| 同义检索词 | `provenance`、`decision record`、`precedent`、`causal`、`approval chain`、`knowledge graph`、`context graph`、`memory graph`。 |
| 协议/配置字段 | `command`、`url`、`transport`、`headers`、`enabled_tools`、`assign_to_agents`、`SEMANTICA_KG_PATH`、`SEMANTICA_LOG_LEVEL`、`valid_from`、`valid_until`。 |
| 范围限制 | 关于 AgenticX 的陈述只适用于这些明确检查的路径；关于 Semantica 的陈述只适用于固定 SHA 和已读取文件。 |

## 高信号 Issue/PR 历史

未获取。由于 GitHub MCP 不可用，且当前代码行为不依赖 Issue/PR 作为实现证据，本轮没有把 Issue 或 PR 用于任何结论。
