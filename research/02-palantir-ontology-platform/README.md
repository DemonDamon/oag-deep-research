# 02 · Palantir Ontology 平台模型



本方向研究 **Palantir Ontology 作为组织操作层的实现模型**。重点是对象、属性、链接、Action、Function、Interface、动态安全与应用层如何共同构成可治理的读写决策闭环，而不是泛泛讨论知识图谱。



| 问题 | 预期交付 |

|---|---|

| Palantir 的语义元素与动力元素如何连接数据资产和真实业务对象？ | 平台对象模型图 |

| Object Type、Property、Link Type 与 Interface 的类型系统和约束是什么？ | 建模规范与示例 |

| Action Type、Function、参数、校验、副作用和写回如何实现受控变更？ | Action 生命周期与风险清单 |

| 动态安全、权限、治理和审计如何嵌入 Ontology？ | 治理能力矩阵 |

| OSDK、Ontology MCP 与应用层怎样消费 Ontology？ | 接口与集成图谱 |



## 初始资料



Palantir 官方文档将 Ontology 定位为建立在数据集、虚拟表和模型之上的组织操作层；语义元素包括对象、属性和链接，动力元素包括 Action、Function 与动态安全。[Ontology overview](https://palantir.com/docs/foundry/ontology/overview/)



Action 是依据用户定义逻辑，对一个或多个对象的属性或链接作出变更的单个事务；Action Type 可包含参数、校验、通知等副作用，并将更新后的状态写回数据资产。[Action types overview](https://palantir.com/docs/foundry/action-types/overview/)



| 层 | 核心构件 | 研究重点 |

|---|---|---|

| 语义层 | Object Type、Property、Link Type、Interface | 业务对象、关系与类型能力 |

| 动力层 | Action Type、Function、参数、校验、副作用 | 受控变更与决策编排 |

| 治理层 | 动态安全、权限、审计、写回 | 谁能在何种条件下改变什么 |

| 应用层 | Object View、Object Explorer、Workshop、OSDK | 人与应用如何消费同一份语义 |



OAG 的检索和上下文构造进入 `03`；规则生产进入 `04`；Agent 的工具与审批运行时进入 `05`。



## 资料归档



后续按 `sources/`、`papers/`、`code/`、`notes/` 和 `deliverables/` 归档。实验应固定官方文档版本、对象模型假设、权限前提与 Action 副作用，避免把平台语义直接等同于通用工具调用。
