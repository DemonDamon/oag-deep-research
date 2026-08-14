# Semantica 代码深度研究摘要

## 模块目的

`research/codedeepresearch/semantica/` 保存对 `semantica-agi/semantica` 的代码深度研究。该目录严格遵循 `.cursor/skills/code-deep-research/` 的三文件产出契约，只保留源码笔记、代码索引和 DeepWiki 深问记录；不包含第三方源码、运行环境或额外的差距分析与采纳提案。

## 固定基线与证据边界

Semantica 的锁定提交为 `94d0c3dc07109fb4e6df3027dbd571eeefc45d52`。本轮工作属于静态源码研究，没有安装依赖、运行服务、使用凭据或验证性能与生产安全性。DeepWiki 仅作为二级解释来源，其回答必须回到锁定源码逐项核验；无法核验的内容保持“未验证”状态。

## 三份必需产物

| 资产 | 责任 |
|---|---|
| `semantica_source_notes.md` | 记录公开入口、核心实现、执行路径、失败处理、扩展边界、测试证据与 Evidence ID。 |
| `semantica_code_index.md` | 记录锁定仓库、关键目录、已读文件、关键符号、检索词与未覆盖范围。 |
| `semantica_deepwiki.md` | 保存源码初读后形成的 5–10 个复杂问题、DeepWiki 回答、代码锚点、回源核验和安全裁决。 |

## 维护规则

该目录不得重新加入 `README.md`、`meta.md`、Gap Analysis、Proposal、Evaluation Plan、生态横向报告或其他第四份产物。需要补充的新结论必须写入上述三份文件中最合适的章节；本地 `upstream/` 克隆由 `.gitignore` 排除，不得提交到公开仓库。
