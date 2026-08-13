# Orion · 本体工作台 / OAG 可点击原型

可操作的产品原型：一套 **运营型 Ontology 工作台**，再加一套对照 **OAG（Object-Augmented Generation）**，用来说明它和 RAG 不是同一件事。

场景：机加一线夜班，立式加工中心 `EQ-4401` 主轴温升。

## 怎么打开

在本目录启动静态服务：

```bash
cd prototype-cursor
python3 -m http.server 8765
```

浏览器打开：

- 本体工作台首页：[http://localhost:8765/?p=ontology&v=home](http://localhost:8765/?p=ontology&v=home)
- OAG 提问：[http://localhost:8765/?p=oag&v=ask](http://localhost:8765/?p=oag&v=ask)
- RAG vs OAG：[http://localhost:8765/?p=oag&v=compare](http://localhost:8765/?p=oag&v=compare)
- Context Pack：[http://localhost:8765/?p=oag&v=pack](http://localhost:8765/?p=oag&v=pack)

顶栏可在「本体工作台」和「OAG 对象问答」之间切换。查询参数会随点击更新，便于演示时直接分享某一屏。

## 建议点击路径（Ontology）

1. **运营闭环** → 点对象 ID（`EQ-4401` / `EVT-9102` / `SP-17`）进入对象详情  
2. **任务收件箱** → 点高优先级任务进入事件对象  
3. **对象图** → 点节点切换选中对象  
4. **发起 Action** → 选「申请备件」→ **提交提案（不直接写回）**  
5. **审批队列** → **批准写回**：`SP-17` 变为「已预留」，`EVT-9102` 变为「处置中」  
6. **四权矩阵** → 看「打开应用 / 看见对象 / 调用 Function / 执行 Action」四层分离  

搜索框：输入 `EQ-4401`、`SP-17` 或 `WO-8821` 后回车，跳到对应对象。

## 建议点击路径（OAG，区别于 RAG）

1. 切到 **OAG 对象问答**  
2. 选问题「EQ-4401 现在该怎么处置…」或「如果把负载降到 60%…」  
3. 打开 **RAG vs OAG**：左边是文档切片 + 缺口；右边是对象 ID + 可点回本体  
4. 打开 **Context Pack**：改写链、schema linking、入选/淘汰原因  
5. 点 **生成提案**：回到审批队列，写回仍需批准  

要点：OAG 检索的是对象、链接和只读 Function，答案可以变成 Action Proposal；RAG 检索的是段落，没有对象身份，也不能受控写回。

## 文件

| 路径 | 作用 |
| --- | --- |
| `index.html` | 单页入口 |
| `css/app.css` | 视觉（IBM Plex + indigo） |
| `js/data.js` | 场景对象、权限、Action、两道 OAG 题 |
| `js/app.js` | 可点击状态机 |
| `figma/` | 同步到 Figma 的 Plugin API 脚本 |

## Figma 文件

[Ontology OS + OAG Prototype](https://www.figma.com/design/lE6MjA5vzEkxHljOTRDTNg)

- file key：`lE6MjA5vzEkxHljOTRDTNg`
- 交互以本目录 HTML 为准；Figma 侧是同视觉的可批注画板

| 画板 | 链接 |
| --- | --- |
| Ontology Home（手搭） | [node 2:2](https://www.figma.com/design/lE6MjA5vzEkxHljOTRDTNg?node-id=2-2) |
| Capture / Ontology Home | [node 3:2](https://www.figma.com/design/lE6MjA5vzEkxHljOTRDTNg?node-id=3-2) |
| Capture / OAG Compare | [node 4:2](https://www.figma.com/design/lE6MjA5vzEkxHljOTRDTNg?node-id=4-2) |
| OAG vs RAG（手搭） | [node 2:59](https://www.figma.com/design/lE6MjA5vzEkxHljOTRDTNg?node-id=2-59) |

重新捕获某屏（需本机已登录 Figma MCP）：`index.html` 保留 capture.js，用带 `#figmacapture=` 的本地 URL 打开对应 `?p=&v=` 页面。页面上的捕获工具条也可手动再抓一屏。
