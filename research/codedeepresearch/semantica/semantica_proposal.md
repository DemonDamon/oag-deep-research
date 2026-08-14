# semantica AgenticX Research Decision

## Decision

- Verdict: **DO_NOT_ADOPT**
- Why:
  - G-001：AgenticX 已在检查范围内具备持久 MCP client、三类 transport 与 default-deny 工具政策；Semantica 贡献的是服务端工具面，而非应替换的客户端能力。[E-010] [E-011] [E-012]
  - G-002：Semantica 默认 `ContextGraph` 是内存实现，不能以静态证据证明它优于 AgenticX 已有的 Graphiti/Kuzu 图记忆。[E-004] [E-014]
  - G-003：决策/溯源机制值得保留为研究参考，但缺少已验证的真实工作流、运行验证、授权模型和存储兼容性，优先级只能为 P2。[E-002] [E-003] [E-005]
- Now: 归档锁定版本研究，不进入 AgenticX 生产实现队列。
- Later: 仅在出现明确的可审计决策工作流、批准隔离实验与固定数据契约后，重新评估 G-003。
- Explicitly not doing:
  - 不复制 Semantica 的 MCP client、`ContextGraph` 或动态 `PluginRegistry` 到 AgenticX。
  - 不把 Semantica MCP 的写图/导出工具直接暴露给 Near 用户或 Agent。
  - 不安装 `semantica[all]`、不运行上游服务、不开启外部数据库或使用生产凭据。

## 1. Background and research boundary

本研究按固定源码提交 `94d0c3dc07109fb4e6df3027dbd571eeefc45d52` 审阅 `semantica-agi/semantica`，并与固定 AgenticX 基线 `de771f7160317fc75a39fa9474480e8e7ea5850b` 的 MCP、工具政策、上下文编译和 Graphiti/Kuzu 记忆图实现进行对照。范围是研究与采纳决策；没有修改 AgenticX 生产代码，也未对 Semantica 做安装、运行、压测或安全认证。

## 2. Reusable upstream knowledge

Semantica 的可复用价值主要是架构原则，而不是可以直接搬运的完整模块。第一，决策记录应将决策者、推理、置信度、相关实体、源文档、有效期和政策版本作为显式对象，而不是散落在模型输出文本中。[E-003] 第二，图上下文必须能区分实体关系与时间有效性，并对时间格式异常给出明确行为。[E-004] 第三，溯源是可选依赖时应在数据契约中明确启用条件；“支持 provenance”不等于每条决策自动产生可审核谱系。[E-003] 第四，MCP 是协议暴露层而不是权限系统；工具的读写分级、调用方身份、政策、审批与审计应在 AgenticX/企业网关保持控制。[E-002] [E-012]

## 3. AgenticX capability and NO-GAP/P2 findings

| Finding | Current evidence | Decision |
|---|---|---|
| MCP transport/session lifecycle | AgenticX 有持久会话、stdio/HTTP/SSE、工具发现和可恢复错误重试。 | NO-GAP; 不采纳 Semantica 作为客户端。 |
| Tool authorization | AgenticX 政策栈支持 deny 优先、默认拒绝、路径/计划/命令/类别政策。 | NO-GAP; Semantica MCP 服务必须置于该边界之后。 |
| Graph memory | AgenticX 有 Graphiti/Kuzu episode memory、初始化超时和恢复逻辑。 | NO-GAP; 不替换为默认内存 `ContextGraph`。 |
| Decision/provenance semantics | Semantica 有可检查的决策、政策、异常、批准链与可选溯源代码。 | P2; 只作为未来研究主题。 |
| Dynamic plugin loading | Semantica 有动态 Python 插件注册；AgenticX 已有技能包方向。 | NO-GAP; 避免扩大执行面。 |

## 4. Why not adopt: value, cost, regression risk

Semantica 的仓库形态是宽平台而非最小库：基础依赖已包含 ML、图、文档、媒体与向量组件，另外还存在 LLM、图后端、向量后端、云、监控、Explorer 和 SHACL 等可选组。[E-001] 直接采纳会让 AgenticX 同时承担两个上下文/图体系、多个数据生命周期以及 MCP 服务工具写入风险。由于本次没有真实业务用例、系统接口、数据分级、授权传播或运行验证，潜在价值不能超过 P2，而成本和回归风险无法被合理化。

## 5. Explicit exclusions: not entering implementation queue

本轮明确不建立 `.cursor/plans/`、不创建代码任务、不拷贝上游模块、不引入新依赖、不配置 Semantica MCP、不迁移图记忆、不连接企业系统，也不基于 DeepWiki 的旧索引做功能承诺。若未来需要采用其语义，优先将本仓库已有的主张账本、来源、对象、关系和行动边界作为独立数据契约，而非首先绑定一个上游运行时。

## 6. Re-evaluation triggers

只有在以下条件同时出现时，才应重新触发一次代码深度调研：第一，提出者给出一个具体岗位和决策闭环，例如“维修工单例外批准”；第二，明确需要存储哪些决策字段、保留多久、谁可读写、何时允许写回；第三，能在无敏感合成数据上定义成功/失败样本和审批边界；第四，允许在隔离环境对固定上游 SHA 运行最小只读实验；第五，确认 AgenticX 图记忆和 Semantica 图/溯源组件的职责边界，而不是把二者都当作同一“长期记忆”。

## 7. 下一步规划调整

将 Semantica 从“拟集成组件”下调为“版本锁定的设计参考”。下一轮优先工作应是从现有 OAG 研究资产中选定一个真实的决策闭环，先写对象、关系、来源、证据、政策、批准与 Action 的数据契约；只有该契约暴露出 AgenticX 当前确实无法满足的可审计决策需求时，才重新评估 G-003。
