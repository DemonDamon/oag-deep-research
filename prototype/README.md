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
