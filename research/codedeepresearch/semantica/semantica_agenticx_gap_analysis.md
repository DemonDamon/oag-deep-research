# semantica AgenticX Gap Analysis

## AgenticX Evidence

| Capability | Path | Symbol | Current behavior |
|---|---|---|---|
| MCP multi-transport client | `agenticx/tools/remote_v2.py` | `MCPServerConfig`, `MCPClientV2` | Configures stdio, streamable HTTP or SSE; maintains persistent sessions, discovers tools, serializes stdio calls and retries recoverable transport failures once. [E-010] [E-011] |
| MCP tool wrapping | `agenticx/tools/remote_v2.py` | `create_tool`, `create_all_tools`, `RemoteToolV2` | Converts MCP schemas to Pydantic arguments and exposes remote tools; checked method wraps all discovered tools without applying `enabled_tools` locally. [E-013] |
| Tool governance | `agenticx/tools/policy.py` | `ToolPolicyStack`, `PlanModeLayer`, `CategoryPolicy` | Uses deny-precedence, explicit allow rules and default deny; supports path, plan-mode, command and category controls. [E-012] |
| Context compilation | `agenticx/core/context_compiler.py` | `EventSummarizer`, `LLMEventSummarizer`, `FastHeuristicCompressor` | Compiles event histories under token budgets and retains tool outcomes/errors; it is not a decision-provenance graph. |
| Graph memory | `agenticx/memory/graph/store.py` | `MemoryGraphStore`, `ingest_turn` | Uses optional Graphiti/Kuzu to ingest conversation turns as episodes, with configuration/availability checks, timeouts and recovery paths. [E-014] |
| Skill packaging | `conclusions/tools_module_summary.md` | `SkillBundleLoader`, `SkillTool`, `SkillExecutionBackend` | Supports discovered skill bundles and local/sandbox execution modes, based on the checked conclusion plus referenced modules. |

## Checked scope

| Field | Record |
|---|---|
| Paths | AgenticX `agenticx/tools/remote_v2.py`, `agenticx/tools/policy.py`, `agenticx/core/context_compiler.py`, `agenticx/memory/graph/store.py`, `conclusions/tools_module_summary.md`; Semantica `pyproject.toml`, `semantica/mcp_server/__init__.py`, `semantica/context/context_graph.py`, `semantica/context/decision_recorder.py`, `semantica/core/plugin_registry.py`, `tests/context/test_decision_recorder.py`. |
| Search terms | `provenance`, `decision record`, `precedent`, `causal`, `approval chain`, `knowledge graph`, `context graph`, `memory graph`, `MCPClientV2`, `enabled_tools`. |
| Scope limitation | “not found” statements below mean not found in the explicitly checked scope. They do not claim absence from all AgenticX modules or future commits. |

## Candidate mechanisms

### G-001 Full Semantica MCP client adoption
- User problem: The user wants an ontology/OAG capability usable by AgenticX/Near, but has not reported a missing MCP transport, discovery or retry feature in AgenticX.
- Upstream evidence: E-002 documents Semantica’s server-side MCP surface, not an MCP client mechanism that AgenticX lacks.
- AgenticX current state: `MCPClientV2` already supports stdio, streamable HTTP and SSE with persistent sessions and retry; `ToolPolicyStack` provides a default-deny tool boundary. [E-010] [E-011] [E-012]
- Actual gap: **NO-GAP** for adopting Semantica as an MCP client. Semantica should be treated as a candidate MCP server/service, not as a replacement for AgenticX’s client layer.
- Value: low.
- Cost: medium.
- Regression risk: high, because replacing a mature client path would duplicate transport, lifecycle and policy responsibilities.
- Decision: NO-GAP.
- Minimal adoption: no implementation; preserve a documented server-adapter boundary for future evaluation.
- Scope boundary: Does not judge every AgenticX MCP manager or desktop UI path.
- Acceptance evidence: none; not entering implementation queue.

### G-002 Replace AgenticX graph memory with Semantica `ContextGraph`
- User problem: unvalidated hypothesis. The user requested code research, not replacement of current memory storage.
- Upstream evidence: E-004 — Semantica `ContextGraph` is explicitly an in-memory `GraphStore` with temporal node/edge semantics.
- AgenticX current state: `MemoryGraphStore` already wraps optional Graphiti/Kuzu and ingests turns as episodes with initialization/recovery handling. [E-014]
- Actual gap: **NO-GAP** for direct replacement. Semantica’s context graph and AgenticX’s Graphiti-backed memory graph have overlapping but non-identical responsibilities; the former’s default in-memory implementation is not a demonstrated upgrade for persistent Near memory.
- Value: low.
- Cost: medium.
- Regression risk: high, because data lifecycle, Kuzu integration and memory UI behavior would need revalidation.
- Decision: NO-GAP.
- Minimal adoption: no implementation.
- Scope boundary: Does not assess Semantica’s alternative persistent graph backends, because they were not run or source-inspected in this pass.
- Acceptance evidence: none; not entering implementation queue.

### G-003 Use Semantica decision/provenance mechanisms as a separate research service
- User problem: The user’s stated OAG research goal includes auditable entities, claims, evidence and action boundaries usable by AgenticX/Near. This motivates exploration of decision provenance, but no concrete production workflow, data model, target system or user failure has yet been supplied.
- Upstream evidence: E-002 exposes decision record/query/precedent/causal tools; E-003 shows optional graph, embedding and provenance dependencies; E-005 is mocked test support.
- AgenticX current state: In the checked scope, AgenticX compiles events and manages Graphiti episodes, while explicit provenance/decision/approval-chain abstractions were not found by the listed source search. This is a checked-scope observation, not a repository-wide absence claim.
- Actual gap: A potentially useful **research capability**, not yet a validated product gap. Its upstream mechanisms have static-source evidence, but runtime persistence, provenance backend, access control and data compatibility are unverified.
- Value: medium.
- Cost: medium to high, due to dependencies, data contracts, deployment and governance.
- Regression risk: medium to high, due to duplicate graph/context responsibilities and external MCP write tools.
- Decision: P2.
- Minimal adoption: no production integration; maintain this locked-source study and require a separately approved, isolated, read-only experiment before any code task.
- Scope boundary: Excludes production credentials, external actions, tenant isolation, graph migration, automatic policy enforcement and user interface work.
- Acceptance evidence: A future research experiment would need fixed synthetic data, `record_decision`/query/provenance test fixtures, read-only MCP policy assertions, source citation in every response, and independent review of storage/authorization assumptions.

### G-004 Adopt Semantica `PluginRegistry` into AgenticX skill loading
- User problem: unvalidated hypothesis. No user requirement identifies a missing AgenticX skill-discovery or plugin-lifecycle behavior.
- Upstream evidence: E-006 verifies dynamic filesystem discovery and plugin loading, including fallback construction and lifecycle methods.
- AgenticX current state: The checked tools conclusion identifies existing skill bundle discovery and local/sandbox execution; this pass did not find a demonstrated inability requiring a second dynamic Python plugin loader.
- Actual gap: **NO-GAP / P2**. Dynamic plugin imports would increase code execution and supply-chain risk, while the user’s installed `SKILL.md` workflow fits AgenticX’s existing skill-oriented model more directly.
- Value: low.
- Cost: medium.
- Regression risk: high.
- Decision: NO-GAP.
- Minimal adoption: no implementation.
- Scope boundary: Does not reject all future metadata-only plugin registries; it rejects copying this dynamic loader without a validated need and security model.
- Acceptance evidence: none; not entering implementation queue.

## Verdict derivation

No candidate satisfies P0: none combines a reported real failure, a high-confidence code-level AgenticX gap in checked scope, and a two-week verifiable closure path. No candidate is an evidence-backed, user-validated P1; the only potential value area, decision/provenance, remains a P2 research capability because runtime behavior and target workflow are not validated.

**Verdict: DO_NOT_ADOPT.** The result does not reject Semantica’s ideas. It rejects immediate code adoption or wholesale integration at the current evidence level. The reusable output is a version-locked reference for a future separately authorized isolated experiment.
