# 代码深度调研技能摘要

## 模块职责

`.cursor/skills/code-deep-research/` 用于对开源 GitHub 仓库进行固定版本的源码深度拆解。工作流必须先拉取并锁定源码，再完成核心入口、抽象、执行路径、状态、失败处理、扩展点和测试的初读；随后从真实代码中生成 5–10 个复杂技术问题，逐题询问 DeepWiki，并回到锁定源码进行交叉核验。

## 唯一交付契约

每个目标仓库只允许生成以下三份 Markdown 文档：

| 文件 | 责任 |
|---|---|
| `<repo_name>_source_notes.md` | 解释系统如何工作，以及哪些结论已被源码证明。 |
| `<repo_name>_code_index.md` | 定位固定 SHA、已读文件、关键符号、行号、测试和检索覆盖。 |
| `<repo_name>_deepwiki.md` | 保存 5–10 个代码锚定问题、DeepWiki 回答、版本差异和逐项源码裁决。 |

技能不再自动创建 `meta.md`、AgenticX Gap Analysis、Proposal、Evaluation Plan 或采用裁决。用户若另行要求比较或选型，必要分析也应优先并入上述三份文档，除非用户明确授权新增交付物。

## 证据与安全边界

锁定提交的本地源码是实现事实的最高优先级证据。DeepWiki 只是二级解释和线索来源；其索引 SHA 必须与本地 SHA 比较。DeepWiki 不可用时仍需保留问题、失败原因和未验证状态，禁止编造答案。`research/codedeepresearch/*/upstream/` 是本地第三方源码克隆目录，已加入 `.gitignore`，不得提交到本仓库。

## 维护入口

- `SKILL.md`：触发条件、三文件契约、强制顺序与完成标准。
- `WORKFLOW.md`：从锁定源码、初读、问题生成、DeepWiki 追问到回源核验的完整流程。
- `TEMPLATES.md`：三份唯一交付物的结构模板和一致性规则。
