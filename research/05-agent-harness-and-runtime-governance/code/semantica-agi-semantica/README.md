# Semantica 源码固定引用

本目录**不包含** `semantica-agi/semantica` 的第三方源代码。完整源码已为静态审阅克隆到本地研究资产工作区；公共研究仓库只保存可核验的版本指针、许可信息和分析结论，避免无必要地镜像第三方项目。

| 字段 | 值 |
|---|---|
| 上游仓库 | <https://github.com/semantica-agi/semantica> |
| 审阅固定提交 | `94d0c3dc07109fb4e6df3027dbd571eeefc45d52` |
| 审阅日期 | 2026-08-14（GMT+8） |
| 许可证 | MIT；最终使用前仍应复核上游 `LICENSE` 与依赖许可 |
| 本地克隆位置 | `/home/ubuntu/oag-research-assets/github-tools/semantica-agi-semantica` |
| 克隆方式 | `git clone --depth 1 https://github.com/semantica-agi/semantica.git` |
| 执行状态 | 仅静态读取；未安装依赖、未运行测试、未启动服务器、未使用凭据 |

深度静态审阅见 [`../../deliverables/semantica-static-code-review.md`](../../deliverables/semantica-static-code-review.md)。

## 更新流程

需要复核时，应新建固定目录或更新本文件中的提交 SHA，并记录差异，而不是使用浮动 `main` 分支作为可复现研究依据。任何实际集成前必须重新核验上游版本、依赖、漏洞公告、MCP 工具权限和企业数据/身份边界。
