# 02 · Palantir Ontology 平台模型：深度研究笔记

**研究状态：第一轮完成。** 本文只陈述 Palantir Foundry 官方文档能直接支持的平台能力，并将可迁移设计模式与 Foundry 的私有实现分开。它不声称外部研究者能够复现 Foundry 的内部事务、存储、动态安全求值或性能。

## 平台模型

Palantir 将 Ontology 定义为建立在数据集、虚拟表和模型之上的 operational layer。其语义元素是对象、属性与链接；动力学元素是 Action、Function 与动态安全。[1] 这一模型把业务对象的读模型、可调用逻辑、受控写回和用户/应用权限放入同一组织语义层。

| 元素 | 官方定义或能力 | 可迁移抽象 | 证据边界 |
|---|---|---|---|
| Object type | 现实实体或事件的 schema，映射 backing datasource | 领域实体类型 + 权威数据映射 | 不可推出底层表/存储设计 |
| Property | 对象的字段和业务属性 | 类型化领域字段 | 不可据此推断时间/版本语义 |
| Link type | 两个对象类型关系的 schema，两个 side 可独立遍历 | 领域关系 + 导航语义 | 不等价于任意图数据库边实现 |
| Action type | 改变对象属性/链接的事务，可带参数、规则、校验和副作用 | 受治理业务命令 | 不公开证明全部事务隔离细节 |
| Function | 服务端隔离执行，可读对象、遍历链接、编辑 Ontology、调用外部逻辑 | 可组合业务逻辑/查询 | 需在具体租户验证限制与凭据边界 |
| Dynamic security | 与对象、动作和函数交互的安全机制 | 策略随上下文生效 | 策略语言、冲突规则和性能不完全公开 |

## 关键事实与工程含义

Object type、object 和 object set 分别对应实体类型、单个实例与实例集合；对象类型以 backing datasource 映射企业实际数据，而不是孤立的概念分类。[2] Link type 则描述两个 object type 的关系，官方指出同一 link type 的两侧可以独立遍历，且同类对象之间也可以建立关系。[3]

Action 是一次改变一个或多个对象属性或链接的事务。Action type 可承载参数、规则、授权校验、提交逻辑与通知等副作用，使应用共享相同的业务变更语义。[4] 对 OAG/Agent 而言，这一点至关重要：检索到对象并不意味着可改变对象；读路径与写路径必须经由不同的工具、授权和审批契约。

Function 在服务端隔离环境执行，支持对象读取、链接遍历、对象集返回、聚合、外部系统丰富化和 Action 驱动逻辑，官方支持 TypeScript 与 Python。[5] OSDK 再以 TypeScript、Python、Java 和 OpenAPI 等形态生成面向 Ontology 的类型与客户端接口，使领域模型可进入应用代码和版本控制工作流。[6]

Foundry 还区分面向消费者的 Ontology MCP（OMCP）和面向建设者的 Palantir MCP。前者可按应用暴露对象、预定义 Action 和查询给外部 AI agent 使用；后者服务类型和开发流程，官方明确说明它不能写实际 Ontology 数据。[7] 这种职责分离应被视为 Agent 接入的最小设计原则：将可操作数据的访问面、结构建设面和审批面分开，而不是把“本体访问”当成无差别的数据库权限。

## 可迁移设计模式

一个不依赖 Foundry 的抽象可分为五层：第一层是具有明确类型、键、来源和版本的业务对象图；第二层是只读查询与关系导航；第三层是可验证、可幂等、带副作用声明的业务命令；第四层是随用户、对象、操作和情境变化的策略；第五层是由 SDK/Schema/MCP 等对外暴露的类型化接口。此模式值得研究，但不能把 Foundry 的产品名、API 或安全机制当作开放标准。

## 开源参考实现与复现入口

| 项目 | 可研究内容 | 限制 |
|---|---|---|
| [palantir/osdk-ts](https://github.com/palantir/osdk-ts) | 强类型对象查询、链接遍历与 Action 调用模式 | SDK 不是 Foundry 服务端 |
| [foundry-platform-python](https://github.com/palantir/foundry-platform-python) | Ontologies API 的对象、链接、Action、查询接口 | 需要实际租户与授权 |
| [foundry-platform-typescript](https://github.com/palantir/foundry-platform-typescript) | Platform SDK 与生成式 OSDK 边界 | 版本随平台演进 |
| [ontology-starter-react-app](https://github.com/palantir/ontology-starter-react-app) | Ontology 作为应用后端的前端骨架 | 不代表安全部署默认值 |

## 未决问题

公开资料不足以确定其动态安全的策略冲突次序、Action 的完整事务隔离级别、跨数据源写回语义和 OMCP 的逐工具风险控制。因此后续实验必须使用拥有合法访问权的测试租户，以被批准的测试对象验证：最小权限读取、Action 审批、幂等重试、审计留痕和拒绝路径。

## 参考资料

[1] [Ontology Building Overview](https://palantir.com/docs/foundry/ontology/overview/)

[2] [Object Types Overview](https://palantir.com/docs/foundry/object-link-types/object-types-overview/)

[3] [Link Types Overview](https://palantir.com/docs/foundry/object-link-types/link-types-overview/)

[4] [Action Types Overview](https://palantir.com/docs/foundry/action-types/overview/)

[5] [Functions Overview](https://palantir.com/docs/foundry/functions/overview/)

[6] [Ontology SDK Overview](https://palantir.com/docs/foundry/ontology-sdk/overview/)

[7] [Ontology MCP Overview](https://palantir.com/docs/foundry/ontology-mcp/overview/)；[Palantir MCP Overview](https://palantir.com/docs/foundry/palantir-mcp/overview/)
