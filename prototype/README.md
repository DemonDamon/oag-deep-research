# Orion 融合原型

把 `prototype-cursor` 的操作闭环（提案 / 审批 / 四权 / RAG 对照）和 `prototype-near` 的多场景图检索叠在一起。纯静态，可直接上 Vercel。

## 保留场景

- 发放待审核+反洗钱（银行类）
- 知识大脑（能源类）
- 制造供应链
- 机加一线（cursor 夜班温升，作为第四场景）

## 本地

```bash
python3 -m http.server 8766
```

打开 http://localhost:8766/?scene=bank-aml&p=ontology&v=home

## Vercel

目录是纯静态文件，根目录直接部署即可：

```bash
npx vercel --yes --prod
```

官网仓库用 `pnpm sync:orion-prototype` 同步到 `public/prototype/orion/`。

## 取长补短

| 来自 near | 来自 cursor |
| --- | --- |
| 三场景 Tab + 力导向图谱 | 本体 / OAG / 对照 产品切换 |
| 实体识别 + 两跳检索 | Action Proposal 与审批写回 |
| 深浅色主题 | 窄屏顶栏不换行 |
| 示例问题芯片 | Context Pack / 四权矩阵 |

## 2026-08 决策工作台优化

本轮参考公开行业文章中可见的对象类型建模、图谱/参数同屏、情景模拟、工具分级与受控 Action 模式，但没有复制第三方图片或界面。研究阅读卡见：

```text
research/02-palantir-ontology-platform/sources/
└── 2026-08-wechat-yonyou-ontology-agent.md
```

主要变化包括五阶段决策闭环、岗位业务事件入口、对象上下文/情景推演/执行边界三栏 Action 工作台、模拟后才可提案的门控、OAG 工具轨迹，以及分步对象类型建模视图。

> **安全边界：** 当前原型全部在浏览器内运行；模拟、审批与写回均为演示状态，不连接生产系统。生产实现仍需身份认证、对象级授权、审批策略、幂等、审计、回滚和源系统连接。
