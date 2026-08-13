# 用户资料阅读卡：规则、约束与受监管知识生产

本卡将 W3C SHACL 作为结构化约束的规范基线，并将 CAAC 维修单位规章作为**规则版本识别和合规落地案例**。二者都不应被直接转换为可执行生产规则；任何执行化必须补齐适用范围、版本、生效时间、管辖权、例外和批准流程。

## SRC-2026-08-04：SHACL

W3C SHACL 将对 RDF 图的验证表达为一个 RDF 形式的 shapes graph，并区分待验证的 data graph。规范规定实现至少支持 SHACL Core；SHACL-SPARQL 则增加基于 SPARQL 的约束与可声明新约束组件的扩展机制。规范覆盖 targets、节点/属性 shapes、属性路径、验证流程、报告和核心约束组件。[1]

**研究定位。** SHACL 更接近“约束验证”而非开放式业务推理。它适合在知识进入 OAG 上下文、发起工具调用或生成行动提案之前校验对象形状、字段类型、必填关系和允许值。若要证明派生结论，应额外记录规则系统、推理语义及溯源，而不能把一次 SHACL 通过误称为业务结论成立。

## SRC-2026-08-10：CAAC 维修单位合格审定规则

用户给出的是中国民用航空局首页，不是具体 CCAR-145 规章页。核验发现官网可定位到现行的《民用航空器维修单位合格审定规则》，通过日期为 2022-02-08、公布日期为 2022-02-11、施行日期为 2022-07-01；同时存在已经标示为失效的 2005 年 CCAR-145-R3 历史页面。研究与合规引用必须固定**现行 2022 规章**及其附件，而不是将门户页或失效版本作为规则来源。[2]

**研究定位。** 民航法规提供了一个很好的“受监管规则知识生产”样例：来源要官方、版本要明确、适用对象要可识别、附件与修订要可追踪；从文本中抽取的任何规则都应先成为可审阅的候选规则，而非自动执行指令。

## 最小规则资产模板

```yaml
rule_id: CAAC-145-CANDIDATE-001
source_id: SRC-2026-08-10
source_version: "2022-07-01 effective rule (verify exact article)"
status: candidate_not_executable
applies_to: "待人工确认"
condition: "待从现行条文逐项抽取"
consequence: "待人工确认"
evidence: ["官方规章页面与附件"]
review: {legal_or_domain_owner: required, effective_date_check: required}
```

该模板是研究结构，不是对任何维修义务或资格要求的法律解释。

## 交叉引用

- SHACL 可在 `01` 作为 RDF 图约束范式引用，在 `03` 作为上下文质量门控引用。
- CAAC 样例可在 `05` 作为运行时审批/权限门控案例，在 `06` 作为法规版本治理和验收案例引用。

## 参考资料

[1] [W3C, Shapes Constraint Language (SHACL)](https://www.w3.org/TR/shacl/)
[2] [中国民用航空局](https://www.caac.gov.cn/)
