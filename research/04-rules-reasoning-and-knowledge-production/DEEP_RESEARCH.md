# 04 · 规则推理与知识生产：深度研究笔记

**研究状态：第一轮完成。** “规则”不应被当作单一格式。约束验证、业务决策、递归逻辑推导与生产系统分别拥有不同的语义、失败形式和审计机制。本方向的目标是建立可追溯规则资产，而不是把从文档中提取的自然语言直接变成可执行行动。

## 规则表示的工程分工

| 表示或系统 | 核心语义 | 适合处理 | 主要产物 | 重要边界 |
|---|---|---|---|---|
| SHACL | RDF 图约束与验证结果图 | 数据质量、接口/发布门禁 | validation report | 不是通用生产规则系统 |
| SWRL | OWL + Horn-like 规则 | 与语义本体结合的蕴含规则 | 推导事实 | 是 W3C Member Submission，不是 Recommendation |
| Datalog / Soufflé | 递归逻辑查询和固定点推导 | 数据流、程序分析、派生关系 | 关系与 provenance | 方言扩展可能改变终止性 |
| DMN | 决策需求图、决策表和 FEEL | 可读业务决策与命中策略 | 决策结果/命中规则 | 需锁定引擎、版本与命中策略 |

SHACL 明确将 shapes graph 与 data graph 分开，并将验证结果表达成 RDF 结果图；Core 与基于 SPARQL 的扩展也分层定义。[1] 因此它适合作为知识生产管道中的质量门禁：输入事实即便来自 LLM、文档抽取或人工编辑，也必须先得到结构化的通过/失败结果。

SWRL 以 antecedent 到 consequent 的蕴含规则表达体和头部原子的合取，变量具有规则内作用域和安全性要求。[2] 但其公开页面同时说明这是 W3C Member Submission，不能与正式 Recommendation 混同。它可作为本体规则研究的语义参考，却不应被误写成行业统一标准。

DMN 面向业务决策和业务规则，支持决策图、决策表、验证与执行，并可与 BPMN/CMMN 协作。[3] Datalog 则更适合递归派生和固定点计算；Soufflé 的纯 Datalog 教程指出有限域、无函子时的可判定边界，同时警示其算术函子扩展可能导致图灵等价和不终止。[4]

## 生命周期与证据模型

每条候选规则必须先是一个来源绑定的知识资产，而不是立即执行的命令。建议记录如下字段：

| 字段 | 含义 |
|---|---|
| `rule_id`、版本、作者/审批人 | 可唯一识别和版本化 |
| 来源、页码/章节、摘录定位、许可 | 能回到原始证据 |
| 自然语言原文与结构化表达 | 能比较抽取前后语义 |
| 适用对象、范围、有效期、前置条件 | 避免跨场景误用 |
| 优先级、冲突集、命中策略 | 显式处理冲突而非隐式依赖顺序 |
| 输入快照、执行器版本、输出与 provenance | 可复核、可重跑 |
| 测试用例、预期结果、失败理由 | 支持回归与发布门禁 |

规则冲突治理不能只靠“规则顺序”。DMN 可表达决策表的命中策略；SHACL 可产生约束失败结果；Datalog/SWRL 可表达推导关系。因此审计日志必须分别保存命中规则/优先级、失败约束、推导证明和输入版本，而不能把它们压缩为一个无来源的最终标签。

## 实现与实验基线

[Soufflé](https://github.com/souffle-lang/souffle) 可将逻辑规格编译为并行 C++，并提供聚合、类型、I/O、profiling 以及 provenance/debugging 能力。[5] [pySHACL](https://github.com/RDFLib/pySHACL) 可对 RDF 数据图执行 SHACL 验证，适合把 shapes、输入事实和报告纳入 CI。Apache Jena 则提供 RDF、SPARQL、推理和规则相关组件，可作为语义 Web 规则实验基线。

## 未决问题

公开标准和项目尚未给出跨语言统一的规则版本、冲突裁决和业务审计格式。Soufflé provenance 服务于程序解释与调试，不能直接等同于合规审计。下一轮应选取一个受控领域，将同一规则分别表达为 DMN、SHACL 与 Datalog，测量建模成本、冲突可见性、执行延迟、解释完整性和变更回归风险。

## 参考资料

[1] [Shapes Constraint Language (SHACL)](https://www.w3.org/TR/shacl/)

[2] [SWRL: A Semantic Web Rule Language Combining OWL and RuleML](https://www.w3.org/submissions/SWRL/)

[3] [OMG Decision Model and Notation](https://www.omg.org/dmn/)

[4] [Soufflé Tutorial](https://souffle-lang.github.io/tutorial)

[5] [Soufflé Repository](https://github.com/souffle-lang/souffle)

[6] [Debugging Large-scale Datalog: A Scalable Provenance Evaluation Strategy](https://dl.acm.org/doi/10.1145/3379446)
