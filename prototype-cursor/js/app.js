(function () {
  const D = window.ORYX;
  const params = new URLSearchParams(location.search);
  const state = {
    product: params.get("p") === "oag" ? "oag" : "ontology",
    view: params.get("v") || (params.get("p") === "oag" ? "ask" : "home"),
    objectId: params.get("oid") || "EQ-4401",
    actionId: params.get("aid") || "request_spare",
    qid: params.get("qid") || "q1",
    proposals: [],
    toast: null,
    search: "",
  };

  const $ = (sel, el = document) => el.querySelector(sel);
  const app = $("#app");

  function toast(msg) {
    state.toast = msg;
    render();
    setTimeout(() => {
      if (state.toast === msg) {
        state.toast = null;
        render();
      }
    }, 2400);
  }

  function syncUrl() {
    const u = new URL(location.href);
    u.searchParams.set("p", state.product);
    u.searchParams.set("v", state.view);
    u.searchParams.set("oid", state.objectId);
    u.searchParams.set("aid", state.actionId);
    u.searchParams.set("qid", state.qid);
    history.replaceState(null, "", u.pathname + u.search + u.hash);
  }

  function go(patch) {
    Object.assign(state, patch);
    syncUrl();
    render();
  }

  function obj(id) {
    return D.objects[id];
  }

  function openObject(id) {
    go({ product: "ontology", view: "object", objectId: id });
  }

  function navItems() {
    if (state.product === "oag") {
      return [
        ["ask", "提问"],
        ["compare", "RAG vs OAG"],
        ["pack", "Context Pack"],
      ];
    }
    return [
      ["home", "运营闭环"],
      ["inbox", "任务收件箱"],
      ["graph", "对象图"],
      ["object", "对象详情"],
      ["action", "发起 Action"],
      ["approvals", "审批队列"],
      ["security", "四权矩阵"],
      ["types", "对象类型"],
    ];
  }

  function topbar() {
    return `
      <header class="topbar">
        <div class="brand"><span class="brand-mark"></span><span class="brand-name">Orion<span class="brand-sub"> 决策本体</span></span></div>
        <div class="switch">
          <button class="${state.product === "ontology" ? "on" : ""}" data-act="product" data-v="ontology"><span class="lbl-full">本体工作台</span><span class="lbl-short">本体</span></button>
          <button class="${state.product === "oag" ? "on" : ""}" data-act="product" data-v="oag"><span class="lbl-full">OAG 对象问答</span><span class="lbl-short">OAG</span></button>
        </div>
        <input class="top-search" placeholder="搜索对象 ID、工单、零件 SKU…" value="${state.search || ""}" data-act="search-input">
        <div class="userpill">
          <div class="avatar">林</div>
          <div class="user-meta">${D.user.name}<div class="user-role">${D.user.role}</div></div>
        </div>
      </header>`;
  }

  function sidenav() {
    return `
      <aside class="nav">
        <div class="nav-label">${state.product === "oag" ? "OAG" : "Ontology"}</div>
        ${navItems()
          .map(([id, label]) => {
            const on = state.view === id || (state.product === "oag" && id === "ask" && state.view === "home");
            return `<button class="${on ? "active" : ""}" data-act="view" data-v="${id}"><span class="dot"></span><span class="label">${label}</span></button>`;
          })
          .join("")}
      </aside>`;
  }

  function kpi(k, v, s) {
    return `<div class="card kpi"><div class="k">${k}</div><div class="v">${v}</div><div class="s">${s}</div></div>`;
  }

  function idBtn(id) {
    return `<button class="idbtn" data-act="object" data-id="${id}">${id}</button>`;
  }

  function viewHome() {
    return `
      <div class="crumb">
        <div>
          <h1>机加一线 · 决策闭环</h1>
          <p>不是看板：对象、规则、权限与写回在同一条回路上。</p>
        </div>
        <button class="btn primary" data-act="view" data-v="inbox">进入收件箱</button>
      </div>
      <div class="row cols-3" style="margin-bottom:14px">
        ${kpi("活动告警对象", "1", "EQ-4401 主轴温升")}
        ${kpi("待审批 Action", String(state.proposals.filter((p) => p.status === "pending").length), "写回前必须过这一关")}
        ${kpi("规则版本", "risk_score v3.2", "只读 Function，不可直接改 MES")}
      </div>
      <div class="row cols-2">
        <div class="card">
          <h2>当前回路</h2>
          <div class="pad">
            <ol style="margin:0;padding-left:18px;line-height:1.9;font-size:13.5px">
              <li>遥测进入设备对象 ${idBtn("EQ-4401")}</li>
              <li>规则生成事件 ${idBtn("EVT-9102")}（0.86）</li>
              <li>任务进入夜班维修组收件箱</li>
              <li>建议零件 ${idBtn("SP-17")}，草稿工单 ${idBtn("WO-8821")}</li>
              <li>Action Proposal → 审批 → ERP / CMMS 写回 → 回流对象历史</li>
            </ol>
            <div style="margin-top:12px;display:flex;gap:8px">
              <button class="btn" data-act="view" data-v="graph">打开对象图</button>
              <button class="btn" data-act="product" data-v="oag">用 OAG 提问</button>
            </div>
          </div>
        </div>
        <div class="card">
          <h2>对象历史</h2>
          <div class="pad">
            <ul class="timeline">
              ${D.history.map((h) => `<li><time>${h.t}</time><div><b>${h.who}</b> · ${h.text}</div></li>`).join("")}
              ${state.proposals
                .map((p) => `<li><time>现在</time><div><b>${p.by}</b> · ${p.actionName} → ${p.status}</div></li>`)
                .join("")}
            </ul>
          </div>
        </div>
      </div>`;
  }

  function viewInbox() {
    return `
      <div class="crumb">
        <div>
          <h1>任务收件箱</h1>
          <p>一线看到的是任务，不是表名。点开即进入对象。</p>
        </div>
      </div>
      <div class="card">
        ${D.tasks
          .map(
            (t) => `
          <div class="item" data-act="object" data-id="${t.objectId}" role="button" tabindex="0">
            <span class="chip ${t.severity === "高" ? "high" : t.severity === "中" ? "mid" : "low"}">${t.severity}</span>
            <span>
              <div class="t">${t.title}</div>
              <div class="d">${t.hint} · 对象 ${t.objectId}</div>
            </span>
            <span class="d">${t.age}</span>
          </div>`
          )
          .join("")}
      </div>`;
  }

  function viewGraph() {
    const selected = state.objectId;
    const nodes = [
      { id: "EQ-4401", x: 280, y: 210, r: 46 },
      { id: "EVT-9102", x: 520, y: 90, r: 40 },
      { id: "WO-8821", x: 760, y: 210, r: 40 },
      { id: "SP-17", x: 520, y: 340, r: 40 },
      { id: "CREW-NIGHT", x: 120, y: 340, r: 40 },
    ];
    const edges = [
      ["EQ-4401", "EVT-9102"],
      ["EQ-4401", "WO-8821"],
      ["EQ-4401", "SP-17"],
      ["EQ-4401", "CREW-NIGHT"],
      ["WO-8821", "SP-17"],
      ["EVT-9102", "SP-17"],
    ];
    const pos = Object.fromEntries(nodes.map((n) => [n.id, n]));
    const lines = edges
      .map(([a, b]) => {
        const p = pos[a],
          q = pos[b];
        return `<line x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" stroke="#c9d0db" stroke-width="1.5"/>`;
      })
      .join("");
    const nodeEls = nodes
      .map((n) => {
        const o = obj(n.id);
        return `
          <g class="node ${n.id === selected ? "on" : ""}" data-act="object" data-id="${n.id}">
            <circle class="node-hit" cx="${n.x}" cy="${n.y}" r="${n.r}"/>
            <text x="${n.x}" y="${n.y - 4}" text-anchor="middle">${o.type}</text>
            <text class="nid" x="${n.x}" y="${n.y + 12}" text-anchor="middle">${n.id}</text>
          </g>`;
      })
      .join("");
    const o = obj(selected);
    return `
      <div class="crumb">
        <div>
          <h1>对象图</h1>
          <p>可导航关系，不是任意知识图谱。点击节点打开对象。</p>
        </div>
      </div>
      <div class="row cols-graph">
        <div class="card">
          <div class="graph-wrap">
            <svg viewBox="0 0 880 430">${lines}${nodeEls}</svg>
          </div>
        </div>
        <div class="card">
          <h2>${o.title}</h2>
          <div class="pad">
            <div style="margin-bottom:8px">${idBtn(o.id)} <span class="chip alert">${o.status}</span></div>
            <p style="font-size:13px;color:var(--ink-2);line-height:1.6">${o.type} · 责任 ${o.owner}<br>来源 ${o.source}</p>
            <div style="margin-top:12px;font-size:12px;color:var(--muted)">链接</div>
            ${o.links
              .map((l) => `<div class="pack-row"><span>${l.rel}</span><span>${idBtn(l.to)}</span><span class="d">${l.dir}</span></div>`)
              .join("")}
            <div style="margin-top:14px;display:flex;gap:8px">
              <button class="btn primary" data-act="object" data-id="${o.id}">对象详情</button>
              <button class="btn" data-act="view" data-v="action">发起 Action</button>
            </div>
          </div>
        </div>
      </div>`;
  }

  function viewObject() {
    const o = obj(state.objectId);
    return `
      <div class="crumb">
        <div>
          <h1>${o.title}</h1>
          <p>${o.type} · 权威来源 ${o.source} · 更新 ${o.updated}</p>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn" data-act="view" data-v="graph">回对象图</button>
          <button class="btn primary" data-act="view" data-v="action">发起 Action</button>
        </div>
      </div>
      <div class="row cols-2">
        <div class="card">
          <h2>属性</h2>
          <div class="pad">
            <div style="margin-bottom:10px">${idBtn(o.id)} <span class="chip alert">${o.status}</span> <span class="chip idle">责任 ${o.owner}</span></div>
            <table class="props">
              ${o.props.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}
            </table>
          </div>
        </div>
        <div>
          <div class="card" style="margin-bottom:14px">
            <h2>链接（可两边遍历）</h2>
            <div class="pad">
              ${o.links
                .map((l) => {
                  const t = obj(l.to);
                  return `<div class="item" data-act="object" data-id="${l.to}" role="button" tabindex="0" style="grid-template-columns:1fr auto">
                    <span><div class="t">${l.rel} → ${t.title}</div><div class="d">${t.type} · ${t.status}</div></span>
                    ${idBtn(l.to)}
                  </div>`;
                })
                .join("")}
            </div>
          </div>
          <div class="card">
            <h2>允许的操作</h2>
            <div class="pad" style="display:flex;flex-wrap:wrap;gap:8px">
              ${D.actionTypes
                .map(
                  (a) =>
                    `<button class="btn" data-act="action-type" data-id="${a.id}">${a.name}</button>`
                )
                .join("")}
            </div>
            <div class="pad" style="padding-top:0;font-size:12px;color:var(--muted)">检索到对象不等于可以改对象。写回走 Action，且与 Function 权限分离。</div>
          </div>
        </div>
      </div>`;
  }

  function viewAction() {
    const a = D.actionTypes.find((x) => x.id === state.actionId);
    const allowed = D.user.perms.actions.includes(a.id);
    return `
      <div class="crumb">
        <div>
          <h1>发起 Action Proposal</h1>
          <p>Agent / 用户都只能生成提案。真正写回要审批、幂等键和回滚路径。</p>
        </div>
      </div>
      <div class="row cols-2">
        <div class="card">
          <h2>命令</h2>
          <div class="pad">
            <div class="qchips">
              ${D.actionTypes
                .map(
                  (x) =>
                    `<button class="${x.id === a.id ? "on" : ""}" data-act="action-type" data-id="${x.id}">${x.name}</button>`
                )
                .join("")}
            </div>
            <div class="banner">写回目标：${a.writes} · 需要审批：是 · 当前用户：可提案，不可跳过审批</div>
            <div class="form">
              ${a.fields
                .map(
                  (f) =>
                    `<div class="field"><label>${f.label}</label><input value="${f.value}"></div>`
                )
                .join("")}
              <div class="field"><label>证据</label><textarea>EVT-9102 risk_score=0.86；IoT 连续 6 点超阈；SP-17 库存=1</textarea></div>
              <div class="field"><label>幂等键</label><input class="mono" value="act-${a.id}-EQ-4401-20260814"></div>
            </div>
            <button class="btn primary" data-act="submit-proposal" ${allowed ? "" : "disabled"}>${allowed ? "提交提案（不直接写回）" : "无 Action 权限"}</button>
          </div>
        </div>
        <div class="card">
          <h2>校验</h2>
          <div class="pad">
            <table class="props">
              <tr><th>打开应用</th><td>通过</td></tr>
              <tr><th>看见对象</th><td>通过 · EQ-4401 / SP-17 / WO-8821</td></tr>
              <tr><th>调用 Function</th><td>通过 · risk_score 只读</td></tr>
              <tr><th>执行 Action</th><td>拦截直写 · 进入审批</td></tr>
            </table>
            <p style="font-size:13px;color:var(--muted);line-height:1.6;margin:12px 0 0">这是操作型本体和「LLM 生成一条 Update」的差别：参数、权限、审批人、回滚路径是一等公民。</p>
          </div>
        </div>
      </div>`;
  }

  function viewApprovals() {
    const rows = state.proposals;
    return `
      <div class="crumb">
        <div>
          <h1>审批队列</h1>
          <p>批准后才写回外部系统。拒绝则留在对象历史上。</p>
        </div>
      </div>
      <div class="card">
        ${
          rows.length === 0
            ? `<div class="empty">还没有提案。去「发起 Action」或在 OAG 答案里点「生成提案」。</div>`
            : rows
                .map(
                  (p) => `
            <div class="item" style="grid-template-columns:1fr auto;align-items:start">
              <div>
                <div class="t">${p.actionName} · ${p.status === "pending" ? "待审批" : p.status === "approved" ? "已批准（已写回）" : "已拒绝"}</div>
                <div class="d">${p.by} · 目标 ${p.target} · 幂等键 ${p.idem}</div>
              </div>
              <div style="display:flex;gap:8px">
                ${
                  p.status === "pending"
                    ? `<button class="btn ok" data-act="decide" data-id="${p.id}" data-v="approved">批准写回</button>
                       <button class="btn danger" data-act="decide" data-id="${p.id}" data-v="rejected">拒绝</button>`
                    : `<span class="chip ${p.status === "approved" ? "low" : "high"}">${p.status}</span>`
                }
              </div>
            </div>`
                )
                .join("")
        }
      </div>`;
  }

  function viewSecurity() {
    return `
      <div class="crumb">
        <div>
          <h1>四权矩阵</h1>
          <p>能打开应用、看见数据、调用函数、执行写回是四种权限。</p>
        </div>
      </div>
      <div class="card">
        <div class="pad">
          <table class="matrix">
            <tr><th>层</th><th>林晓（当前）</th><th>含义</th></tr>
            ${D.securityMatrix.map((r) => `<tr><td>${r.layer}</td><td>${r.you}</td><td>${r.note}</td></tr>`).join("")}
          </table>
        </div>
      </div>`;
  }

  function viewTypes() {
    const types = [...new Set(Object.values(D.objects).map((o) => o.type))];
    return `
      <div class="crumb">
        <div>
          <h1>对象类型</h1>
          <p>10–30 个核心对象即可跑通闭环。一线员工不在这里建模。</p>
        </div>
      </div>
      <div class="row cols-3">
        ${types
          .map((t) => {
            const items = Object.values(D.objects).filter((o) => o.type === t);
            return `<div class="card"><h2>${t}</h2><div class="pad">${items
              .map((o) => `<div style="margin-bottom:8px">${idBtn(o.id)} <span class="d">${o.status}</span></div>`)
              .join("")}</div></div>`;
          })
          .join("")}
      </div>`;
  }

  function oagQuestionBar() {
    return `
      <div class="qchips">
        ${D.oagQuestions
          .map(
            (q) =>
              `<button class="${state.qid === q.id ? "on" : ""}" data-act="qid" data-id="${q.id}">${q.text}</button>`
          )
          .join("")}
      </div>`;
  }

  function viewOagAsk() {
    const q = D.oagQuestions.find((x) => x.id === state.qid);
    return `
      <div class="crumb">
        <div>
          <h1>OAG · 对象增强生成</h1>
          <p>检索的是业务对象、关系和只读 Function，不是文档切片。答案可以变成 Action Proposal。</p>
        </div>
        <button class="btn" data-act="view" data-v="compare">看 RAG 对照</button>
      </div>
      ${oagQuestionBar()}
      <div class="card" style="margin-bottom:14px">
        <h2>当前问题</h2>
        <div class="pad" style="font-size:15px;line-height:1.6">${q.text}</div>
      </div>
      <div class="card">
        <h2>OAG 回答（绑定对象）</h2>
        <div class="pad">
          <p style="font-size:14px;line-height:1.7;margin-top:0">${q.oag.answer}</p>
          <div style="margin:10px 0 14px;display:flex;flex-wrap:wrap;gap:6px">
            ${q.oag.objects.map(idBtn).join("")}
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${q.oag.actions
              .map((id) => {
                const a = D.actionTypes.find((x) => x.id === id);
                return `<button class="btn primary" data-act="from-oag" data-id="${id}">生成提案：${a.name}</button>`;
              })
              .join("")}
            <button class="btn" data-act="view" data-v="pack">打开 Context Pack</button>
          </div>
        </div>
      </div>`;
  }

  function viewCompare() {
    const q = D.oagQuestions.find((x) => x.id === state.qid);
    return `
      <div class="crumb">
        <div>
          <h1>同一问题：RAG vs OAG</h1>
          <p>左边是段落检索；右边是对象、证据与可执行边界。</p>
        </div>
      </div>
      ${oagQuestionBar()}
      <div class="compare">
        <div class="card">
          <div class="head rag-head"><b>RAG</b><span class="chip idle">chunk / passage</span></div>
          <div class="pad">
            ${q.rag.chunks
              .map((c) => `<div class="chunk"><b>${c.title}</b><p>${c.body}</p></div>`)
              .join("")}
            <p style="font-size:13.5px;line-height:1.65">${q.rag.answer}</p>
            ${q.rag.gaps.map((g) => `<div class="gap">缺口：${g}</div>`).join("")}
          </div>
        </div>
        <div class="card">
          <div class="head oag-head"><b>OAG</b><span class="chip" style="background:#fff;color:var(--indigo-ink)">object / link / function</span></div>
          <div class="pad">
            <p style="font-size:13.5px;line-height:1.65;margin-top:0">${q.oag.answer}</p>
            <div style="margin:8px 0 12px;display:flex;flex-wrap:wrap;gap:6px">${q.oag.objects.map(idBtn).join("")}</div>
            <button class="btn primary" data-act="view" data-v="pack">检查 Context Pack</button>
          </div>
        </div>
      </div>`;
  }

  function viewPack() {
    const q = D.oagQuestions.find((x) => x.id === state.qid);
    const p = q.oag.pack;
    return `
      <div class="crumb">
        <div>
          <h1>Context Pack</h1>
          <p>每轮回答都是可复核资产：改写链、schema linking、入选/淘汰原因、主张。</p>
        </div>
      </div>
      ${oagQuestionBar()}
      <div class="row cols-2">
        <div class="card">
          <h2>构造过程</h2>
          <div class="pad">
            <table class="props">
              <tr><th>原问</th><td>${p.query}</td></tr>
              <tr><th>改写</th><td>${p.rewrite.join(" → ")}</td></tr>
              <tr><th>Schema</th><td>${p.schemaLink.join(" / ")}</td></tr>
            </table>
            <h3 style="font-size:13px;margin:16px 0 8px">入选对象</h3>
            ${p.selected
              .map(
                (s) =>
                  `<div class="pack-row">${idBtn(s.id)}<span>${s.why}</span><span class="mono">${s.score}</span></div>`
              )
              .join("")}
            <h3 style="font-size:13px;margin:16px 0 8px">被淘汰</h3>
            ${p.dropped.map((s) => `<div class="pack-row"><span class="mono">${s.id}</span><span>${s.why}</span><span></span></div>`).join("")}
          </div>
        </div>
        <div class="card">
          <h2>主张</h2>
          <div class="pad">
            <p style="font-size:14px;line-height:1.7">${q.oag.answer}</p>
            <div class="banner">HyDE 假设文本不会进入证据库。这里每条主张都能点回对象。</div>
            ${q.oag.actions
              .map((id) => {
                const a = D.actionTypes.find((x) => x.id === id);
                return `<button class="btn" style="margin:4px 8px 0 0" data-act="from-oag" data-id="${id}">${a.name}</button>`;
              })
              .join("")}
          </div>
        </div>
      </div>`;
  }

  function titleFor() {
    if (state.product === "oag") {
      if (state.view === "compare") return viewCompare();
      if (state.view === "pack") return viewPack();
      return viewOagAsk();
    }
    const map = {
      home: viewHome,
      inbox: viewInbox,
      graph: viewGraph,
      object: viewObject,
      action: viewAction,
      approvals: viewApprovals,
      security: viewSecurity,
      types: viewTypes,
    };
    return (map[state.view] || viewHome)();
  }

  function render() {
    app.innerHTML = `
      ${topbar()}
      ${sidenav()}
      <main class="main">${titleFor()}</main>
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    `;
  }

  function submitProposal(actionId, from) {
    const a = D.actionTypes.find((x) => x.id === actionId);
    const p = {
      id: "P-" + (state.proposals.length + 1),
      actionId,
      actionName: a.name,
      target: "EQ-4401 / SP-17",
      by: from || D.user.name,
      status: "pending",
      idem: "act-" + actionId + "-EQ-4401-20260814",
    };
    state.proposals.unshift(p);
    go({ view: "approvals", product: "ontology" });
    toast("已生成提案 " + p.id + "，等待审批。未写回外部系统。");
  }

  app.addEventListener("keydown", (e) => {
    if (e.target.matches(".top-search") && e.key === "Enter") {
      const q = e.target.value.trim().toUpperCase();
      const hit = Object.values(D.objects).find(
        (o) => o.id === q || o.title.toUpperCase().includes(q) || o.key.toUpperCase().includes(q)
      );
      if (hit) openObject(hit.id);
      else toast("没有匹配的对象。试试 EQ-4401 / SP-17 / WO-8821");
    }
  });

  app.addEventListener("input", (e) => {
    if (e.target.matches(".top-search")) state.search = e.target.value;
  });

  app.addEventListener("click", (e) => {
    const t = e.target.closest("[data-act]");
    if (!t) return;
    const act = t.dataset.act;
    if (act === "product") {
      const v = t.dataset.v;
      go({ product: v, view: v === "oag" ? "ask" : "home" });
    } else if (act === "view") {
      go({ view: t.dataset.v });
    } else if (act === "object") {
      openObject(t.dataset.id);
    } else if (act === "action-type") {
      go({ view: "action", actionId: t.dataset.id, product: "ontology" });
    } else if (act === "submit-proposal") {
      submitProposal(state.actionId, D.user.name);
    } else if (act === "from-oag") {
      submitProposal(t.dataset.id, "OAG · " + D.user.name);
    } else if (act === "qid") {
      go({ qid: t.dataset.id });
    } else if (act === "decide") {
      const p = state.proposals.find((x) => x.id === t.dataset.id);
      if (!p) return;
      p.status = t.dataset.v;
      if (p.status === "approved") {
        if (p.actionId === "request_spare") D.objects["SP-17"].status = "已预留";
        if (p.actionId === "create_work_order") D.objects["WO-8821"].status = "已下达";
        D.objects["EVT-9102"].status = "处置中";
        toast(p.id + " 已批准，写回已模拟完成，对象状态已更新。");
      } else {
        toast(p.id + " 已拒绝，外部系统未变更。");
      }
      render();
    }
  });

  render();
})();
