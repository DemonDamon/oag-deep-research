# ORION：企业本体与能力网关原型

ORION 是一套面向企业内部多系统语义对齐、统一对象查询、受控 Action 和终端智能体接入的全栈原型。它把 CRM、ERP、MES 等系统中的异构身份、对象、关系、规则和能力收敛为企业端的统一服务层，再通过 MCP/API 网关向 **AgenticX** 与 **Near 终端智能体**提供机器可读能力。

> 本体层不是单一数据库，也不是可以任意写回业务系统的聊天机器人。它由统一对象语义、身份解析、查询与证据、能力目录、决策模拟、Action 网关、策略和审计共同构成。

## 产品闭环

```text
异常或用户意图
  → 统一企业对象定位
  → 跨系统证据查询与 OAG 解释
  → 多方案比较与确定性模拟
  → 生成带幂等键、影响和回滚计划的 Proposal
  → 人工审批
  → 受控 Action / 补偿
  → Event 回流与审计
```

界面不提供“从聊天直接写业务系统”的入口。公开演示允许对象查询、OAG、方案模拟和非持久化提案预览；真实提案提交与审批由认证后的服务端接口处理。

## 十个工作区

| 工作区 | 核心职责 |
|---|---|
| 运营首页 | 汇聚异常、任务、待审批提案、对象变化和连接器健康度 |
| 对象与关系 | 浏览统一企业对象、跨系统关系、属性和证据来源 |
| 本体工作室 | 维护对象类型、属性、关系、约束、Function、Action 与版本 |
| 连接器管理 | 展示系统适配器、运行健康度和五类能力契约 |
| OAG 智能助手 | 返回对象约束的解释、工具调用轨迹、规则结果与来源引用 |
| 决策工作台 | 比较方案、运行模拟、检查影响并生成受控提案 |
| 审批与治理 | 管理审批、策略、审计事件和工具白名单 |
| 身份映射 | 映射 CRM `customer_id`、ERP `buyer_code` 等异构身份 |
| MCP/API 网关 | 面向 AgenticX 与 Near 终端智能体暴露能力清单 |
| 角色权限 | 展示四类角色的读取、提案、审批和执行权限 |

能力目录术语固定为 **Query、Function、Proposal、Action、Event**。四类角色固定为 **业务员工、主管、本体建设者、开发/治理人员**。

## 技术栈

| 层级 | 当前实现 |
|---|---|
| 前端 | React 19、TypeScript、Tailwind CSS 4、shadcn/ui、Wouter、TanStack Query |
| API | Express 4、tRPC 11、Zod、SuperJSON |
| 身份 | Manus OAuth，会话由服务端认证上下文解析 |
| 数据 | Drizzle ORM、MySQL/TiDB，12 张企业领域表 |
| 测试 | Vitest，覆盖运营概览、OAG、提案预览、持久化提案和审批契约 |
| 视觉 | 深青与燃橙电影感主题、玻璃面板、信号网格和响应式企业控制台 |

## 本地运行与检查

```bash
pnpm install
pnpm dev
pnpm check
pnpm test
pnpm build
```

数据库 Schema 位于 `drizzle/schema.ts`，迁移位于 `drizzle/`。演示读取数据位于 `server/demoData.ts`；提案与审批写路径位于 `server/platformDb.ts`，通过事务同步写入审计事件。

## 服务端边界

公开演示接口仅承担读取、解释、模拟与提案预览。`action.submitProposal` 和 `governance.decideProposal` 使用认证过程，并在服务端执行身份、企业角色、幂等和状态检查。生产环境还需接入真实 Connector Runtime、对象级授权、队列化 Action Executor、追加写审计存储和可重建读模型。

更详细的设计见 [ARCHITECTURE.md](./ARCHITECTURE.md)，模块摘要见 [.conclusions](./.conclusions/README.md)。

## 当前限制

本仓库是可交互的企业产品原型，不是直接连接生产系统的成品。连接器健康度、对象图、OAG 答案和决策方案使用“曜石制造集团”演示数据；真实业务写回、外部凭据、事件总线、图数据库和生产 MCP Server 尚未接入。部署前必须补充租户隔离、对象级授权、密钥托管、限流、灾备和外部系统契约测试。
