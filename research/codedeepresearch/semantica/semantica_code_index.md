# semantica Code Index

## Provenance

| Source | Status |
|---|---|
| Local clone SHA | `94d0c3dc07109fb4e6df3027dbd571eeefc45d52` at `research/codedeepresearch/semantica/upstream/`; clean shallow clone from `https://github.com/semantica-agi/semantica.git`. |
| AgenticX baseline SHA | `de771f7160317fc75a39fa9474480e8e7ea5850b` at local `agenticx/`; clean shallow clone from `https://github.com/DemonDamon/AgenticX.git`. |
| GitHub MCP | unavailable — no configured GitHub MCP server; no issue/PR claim is used as implementation evidence. |
| ZRead | unavailable — no configured ZRead tool. |
| DeepWiki | partial secondary source — page available at `e90bd048`, which is older than the locked upstream SHA; interactive question submit did not return an answer. |

## Core tree

```text
upstream/
├── pyproject.toml                         # package metadata, extras, CLI/server/MCP entry points
├── semantica/
│   ├── context/
│   │   ├── context_graph.py               # in-memory graph, temporal nodes/edges
│   │   └── decision_recorder.py           # decision, policy, approval, provenance orchestration
│   ├── mcp_server/
│   │   └── __init__.py                    # stdio MCP tools/resources/JSON-RPC dispatch
│   ├── core/
│   │   └── plugin_registry.py             # plugin discovery and lifecycle
│   ├── ontology/                           # OWL / SHACL / SKOS mechanisms (not read in this pass)
│   ├── reasoning/                          # rule / Datalog / Rete mechanisms (not read in this pass)
│   ├── provenance/                         # W3C PROV-O mechanisms (not read in this pass)
│   └── graph_store/                        # graph backend interfaces (not read in this pass)
├── mcp/                                   # alternate top-level MCP packaging surface (not decision evidence this pass)
└── tests/
    └── context/test_decision_recorder.py  # mocked decision recorder tests
```

## Files actually read

| File | Evidence category | Symbols inspected |
|---|---|---|
| `upstream/pyproject.toml` | Public entry/API and deployment surface | `[project]`, core dependencies, `optional-dependencies`, `[project.scripts]` |
| `upstream/semantica/mcp_server/__init__.py` | Public entry/API; main path; error/fallback | `_get_graph`, `_tool_record_decision`, `_tool_query_decisions`, `TOOLS`, `RESOURCES`, `_handle`, `_run_stdio`, `main` |
| `upstream/semantica/context/decision_recorder.py` | Core abstraction; main path; failure; extension | `DecisionRecorder`, `record_decision`, `link_entities`, `apply_policies`, `record_exception`, `record_approval_chain` |
| `upstream/semantica/context/context_graph.py` | Core state/data model; temporal error/fallback | `_parse_iso_dt`, `_normalize_temporal_input`, `ContextNode`, `ContextEdge`, `ContextGraph` |
| `upstream/semantica/core/plugin_registry.py` | Extension point; failure/fallback | `PluginRegistry`, `register_plugin`, `load_plugin`, `unload_plugin` |
| `upstream/tests/context/test_decision_recorder.py` | Test/example | `TestDecisionRecorder`, success/failure/policy/approval/provenance tests |
| `agenticx/conclusions/tools_module_summary.md` | AgenticX documentation baseline | Tools/MCP/guardrails/policy/skill bundle summary |
| `agenticx/agenticx/tools/remote_v2.py` | AgenticX implementation baseline | `MCPServerConfig`, `MCPClientV2`, `discover_tools`, `call_tool`, `create_all_tools`, `RemoteToolV2` |
| `agenticx/agenticx/tools/policy.py` | AgenticX governance baseline | `ToolPolicyLayer`, `ToolPolicyStack`, `PathPolicyLayer`, `PlanModeLayer`, `CommandDenyLayer`, `CategoryPolicy` |
| `agenticx/agenticx/core/context_compiler.py` | AgenticX context baseline | `EventSummarizer`, `LLMEventSummarizer`, `FastHeuristicCompressor` |
| `agenticx/agenticx/memory/graph/store.py` | AgenticX graph-memory baseline | `graphiti_available`, `MemoryGraphStore`, `_ensure_ready_impl`, `ingest_turn` |

## Key symbols

| Symbol | SHA + path:line-range | Responsibility |
|---|---|---|
| `MCPServerConfig._validate_transport` | `de771f7` + `agenticx/tools/remote_v2.py:88-154` | Validates exactly one local command or remote URL; chooses stdio, HTTP or SSE transport. |
| `MCPClientV2._create_session` | `de771f7` + `agenticx/tools/remote_v2.py:239-367` | Creates persistent session and handles transport setup failure. |
| `MCPClientV2.call_tool` | `de771f7` + `agenticx/tools/remote_v2.py:395-439` | Serializes calls and performs one controlled reset/retry for recoverable failures. |
| `MCPClientV2.create_all_tools` | `de771f7` + `agenticx/tools/remote_v2.py:523-546` | Wraps discovered tools; checked scope does not apply `enabled_tools` filtering here. |
| `ToolPolicyStack.check` | `de771f7` + `agenticx/tools/policy.py:97-191` | Applies category deny, explicit layer deny, allow, then default deny. |
| `MemoryGraphStore._ensure_ready_impl` | `de771f7` + `agenticx/memory/graph/store.py:275-361` | Initializes Graphiti/Kuzu with timeouts, lock/corruption error handling. |
| `MemoryGraphStore.ingest_turn` | `de771f7` + `agenticx/memory/graph/store.py:363-427` | Converts session messages into a Graphiti episode. |
| `_get_graph` | `94d0c3d` + `semantica/mcp_server/__init__.py:65-81` | Lazily initializes in-memory ContextGraph and optionally loads a persisted path. |
| `_tool_record_decision` | `94d0c3d` + `semantica/mcp_server/__init__.py:130-148` | Validates minimum decision fields then calls graph recorder. |
| `_handle` / `_run_stdio` | `94d0c3d` + `semantica/mcp_server/__init__.py:511-619` | Dispatches JSON-RPC and runs stdio loop with parse/tool error paths. |
| `DecisionRecorder.record_decision` | `94d0c3d` + `semantica/context/decision_recorder.py:88-154` | Performs optional embedding, graph storage, entity links and optional provenance. |
| `DecisionRecorder.apply_policies` | `94d0c3d` + `semantica/context/decision_recorder.py:190-269` | Applies a selected or latest policy version through graph queries. |
| `ContextNode.is_active` / `ContextEdge.is_active` | `94d0c3d` + `semantica/context/context_graph.py:301-410` | Applies time-bound activity checks to nodes and edges. |
| `PluginRegistry.load_plugin` | `94d0c3d` + `semantica/core/plugin_registry.py:183-318` | Resolves/loads dependencies and wraps initialization errors. |

## Search coverage

| Field | Coverage |
|---|---|
| Paths | `semantica/mcp_server`, `semantica/context`, `semantica/core`, `tests/context`, AgenticX `tools`, `core`, `memory/graph`, `conclusions`. |
| Exact symbols | `MCPClientV2`, `MCPServerConfig`, `ToolPolicyStack`, `MemoryGraphStore`, `ContextGraph`, `DecisionRecorder`, `PluginRegistry`, `record_decision`, `create_all_tools`, `enabled_tools`. |
| Synonyms | provenance, decision record, precedent, causal, approval chain, knowledge graph, context graph, memory graph. |
| Protocol/config fields | `command`, `url`, `transport`, `headers`, `enabled_tools`, `assign_to_agents`, `SEMANTICA_KG_PATH`, `SEMANTICA_LOG_LEVEL`, `valid_from`, `valid_until`. |
| Scope limitation | Statements about AgenticX only apply to these explicitly checked paths; statements about Semantica only apply to the fixed SHA and read files. |

## High-signal Issue/PR history

- Not retrieved — GitHub MCP is unavailable and no issue/PR evidence is needed to establish current code behavior.
