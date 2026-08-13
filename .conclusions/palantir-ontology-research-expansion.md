# Palantir Ontology / OAG 扩展研究：维护摘要

## 目的

本次扩展将仓库从“目录与第一轮研究笔记”推进到可追溯的专业资料与开源工具评估。重点是区分 Palantir 官方公开事实、第三方专业观点、学术/开源基线和后续工程判断，避免把产品叙述或 GitHub 星标误写为独立性能证据。

## 仓库内新增资产

| 资产 | 路径 | 维护职责 |
|---|---|---|
| Palantir/OAG 扩展报告 | `research/02-palantir-ontology-platform/deliverables/palantir-ontology-oag-expanded-research.md` | 更新官方文档变化、OAG 检索策略、Action/OSDK/MCP 治理结论；每条外部事实保留来源链接。 |
| 工具生态评估 | `research/06-evaluation-selection-and-case-studies/deliverables/ontology-open-source-tool-landscape.md` | 更新星标快照、许可证、固定 SHA 与静态审阅；禁止把星标作为质量评级。 |
| 根索引 | `research/README.md` | 保持研究入口、资产状态、版权与本地工作区位置一致。 |

## 本地工作区

`/home/ubuntu/oag-research-assets/` 保存不可直接放入研究仓库的本地资产：公开论文 PDF/文本、网页快照、第三方仓库浅克隆、静态代码快照和分析中间产物。第三方源代码不推送到用户仓库，避免违反许可、无意镜像或扩大维护面。

## 可复用架构结论

1. Palantir Ontology 的公开最小抽象是对象/属性/链接与 Action/Function/动态安全的组合；OAG 是检索和上下文工程策略与这些对象、逻辑和行动接口的耦合，不是单一算法。
2. 开源方案应按组合评估：RDF/图查询、约束验证/规则、时态上下文图、文档图检索和 Agent/MCP 适配是独立能力层。
3. Near 侧必须默认只读，所有“写”必须表现为带证据、规则检查、权限范围、审批人与回滚路径的 Action Proposal。
4. 当前所有第三方开源项目均只做了静态审阅；未安装依赖、未执行代码、未启动服务、未连接外部数据库、未配置凭据。

## 禁止推断

- 不要将 Graphiti、Semantica、AWS Accelerator、OntoBricks 或任意知识图谱称作 Palantir Foundry 的功能等价物。
- 不要将第三方 README 的能力声明提升为已验证实现事实。
- 不要将 GitHub 星标或 fork 数解释为安全、合规、可维护性或生产成熟度的证明。
- 不要在未复核许可证、依赖、配置、网络、认证、数据许可和运行副作用前执行候选项目。
