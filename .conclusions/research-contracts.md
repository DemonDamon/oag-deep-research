# 研究数据契约摘要

`schemas/claim-ledger.schema.json` 定义本项目的核心机器可读资产：主张账本。顶层文档要求 `schema_version`、`research_question` 和 `claims`。每一条主张至少包含稳定 ID、可读文本、状态、关联实体和至少一项可定位证据。

| 字段/概念 | 契约 | 设计理由 |
|---|---|---|
| `claim_id` | `claim:<slug>` 格式 | 让报告、推断和审查能稳定引用同一主张 |
| `status` | supported / partially_supported / inferred / contested / unverified | 防止将不同认识状态混为确定事实 |
| `entities` | 至少一个 `entity:<slug>` | 使每项结论可以连接到轻量本体 |
| `evidence` | 至少一条 URL、定位符、日期和强度 | 强制保存可复核的来源信息 |
| `reasoning` | 推断主张应填写 | 让模型生成的结论可审查、可反驳 |
| `limitations` | 可选数组 | 保存范围、时效、样本和访问限制 |

此 Schema 是最低数据契约，而不是完整的知识图谱标准。若扩展对象或关系的机器可读表示，应新增相邻 Schema 并保持主张中 `entity:*` 与 `rel:*` ID 的可引用性。任何增加的状态枚举、必填字段或 URL 约束都属于破坏性变更，应提升 Bundle 主版本号并更新示例、技能与文档。
