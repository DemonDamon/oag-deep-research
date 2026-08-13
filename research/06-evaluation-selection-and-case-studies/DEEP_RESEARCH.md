# 06 · 评估、选型与 AgenticX/Near 接入：深度研究笔记

**研究状态：第一轮完成。** 本方向只整合和评价其他方向产生的资产，不重新定义平台、检索、规则或 Harness。核心原则是：一个研究结论只有在来源、范围、版本、不确定性和验收证据齐全后，才可被转化为 Near/AgenticX 可消费的 Skill 知识或运行时约束。

## 分层验收框架

| 层 | 核心问题 | 最低指标或证据 | 发布闸门 |
|---|---|---|---|
| 来源与知识 | 资料是否可追溯、可复核、适用？ | URL/页码、许可、版本、主张—证据映射 | 无来源或受限内容不进权威上下文 |
| 检索与回答 | 找到的上下文是否相关、完整、被忠实使用？ | context relevance、faithfulness、answer relevance、引用正确率 | 低于阈值时降级或人工复核 |
| 规则与行动 | 规则和 Action 是否被正确选择、校验、解释？ | 规则命中、验证报告、审批、幂等性 | 副作用工具必须有最小权限和确认 |
| Agent 运行时 | 是否能完成任务并在失败时安全停止？ | 工具轨迹、拒绝路径、重试上限、终态 | 越权/注入/敏感泄露测试必须通过 |
| 运维与风险 | 是否在预算、延迟与治理范围内？ | token、调用数、P95 延迟、失败率、审计完整度 | 持续回归、可观测与回滚可用 |

NIST AI RMF 使用 Govern、Map、Measure、Manage 组织 AI 风险管理活动，生成式 AI Profile 则将其扩展到 GenAI 特有风险。[1] [2] 对研究 Skill 来说，这意味着“准确率足够”不是发布条件；还必须有责任主体、风险映射、量化门槛、升级路径和处置策略。

RAGAs 关注检索上下文的相关性与聚焦度、生成对上下文的忠实性以及最终回答质量；ARES 也以 context relevance、answer faithfulness 与 answer relevance 建立自动化评估维度。[3] [4] 这些指标适合构成检索型 Skill 的离线门禁，但 LLM-as-a-Judge 仍会受评审模型、提示词和数据分布影响，必须用人工抽样、固定规则或领域标注集校准。

AgentBench 在多个交互环境中评价 Agent 的推理与决策，提醒我们验收不能只看最终自然语言答案。[5] 对能够调用工具的 Skill，应覆盖正常路径、检索失败、提示注入、权限拒绝、工具参数不合法、幂等重试、超时、敏感信息泄露和人工审批等情形。OWASP 的 GenAI/LLM 风险清单可作为 prompt injection、供应链、敏感信息和 excessive agency 的风险基线，但它不是完整合规认证。[6]

## Near / AgenticX 的可移植接入契约

当前公开资料不足以确认与本仓库语境完全匹配的 AgenticX/Near 官方 manifest、权限和发布规范。因此不能虚构“已兼容”结论；应该先采用可移植的最小契约，待目标平台的实际 SDK/文档可访问后再做适配。

| Manifest 字段 | 目的 |
|---|---|
| `id`、`version`、`owner` | 可识别、可追踪、可回滚 |
| 输入/输出 Schema | 防止自然语言接口无限扩张 |
| 证据资产版本与来源策略 | 防止未核验内容进入上下文 |
| 工具白名单、权限范围、审批条件 | 约束可执行行为 |
| 数据分类、日志策略、保留期 | 处理隐私和审计 |
| 超时、重试、幂等与回滚 | 约束副作用和成本 |
| 离线评测集与发布阈值 | 形成回归门禁 |

上线前应运行离线 eval；上线后应同时保存质量、成本和安全信号。Langfuse 的公开文档区分生产 trace 的 online evaluation 与发布前实验的 offline evaluation，并支持人工评分、LLM judge、代码评估、数据集、实验和 CI/CD regression gate。[7] 这适合构建“离线门禁 + 线上观测 + 版本回滚”的闭环，但不应上传敏感生产 trace 或无权分发的研究资料。

## 选型问题

选择操作型本体、OAG、规则引擎或 Agent Harness，应从业务是否要求受治理写回、领域语义的稳定性、数据规模、检索可解释性、规则变化频率、权限粒度、人工审批要求、运行成本与团队能力共同判断，而不是用“是否用了知识图谱”作为唯一标准。相同领域也可能需要组合：以语义本体/SHACL 稳定术语与约束，以图/向量索引实现检索，以业务命令承载写回，以 Harness 管理工具与审批。

## 参考资料

[1] [NIST AI Risk Management Framework 1.0](https://doi.org/10.6028/NIST.AI.100-1)

[2] [NIST AI RMF: Generative AI Profile](https://doi.org/10.6028/NIST.AI.600-1)

[3] [RAGAs: Automated Evaluation of Retrieval-Augmented Generation](https://aclanthology.org/2024.eacl-demo.16/)

[4] [ARES: An Automated Evaluation Framework for RAG Systems](https://aclanthology.org/2024.naacl-long.20/)

[5] [AgentBench: Evaluating LLMs as Agents](https://proceedings.iclr.cc/paper_files/paper/2024/hash/e9df36b21df4ee211a8b71ee8b7e9f57-Paper-Conference.pdf)

[6] [OWASP GenAI LLM Top 10](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/)

[7] [Langfuse Evaluation Overview](https://langfuse.com/docs/evaluation/overview)
