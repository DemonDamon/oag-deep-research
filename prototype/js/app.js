(function () {
  const ORDER = ["bank-aml", "power-grid", "supply-chain", "workshop"];
  const params = new URLSearchParams(location.search);
  const state = {
    sceneId: params.get("scene") || "bank-aml",
    product: params.get("p") || "ontology",
    view: params.get("v") || "home",
    objectId: params.get("oid") || "",
    actionId: "",
    proposals: {},
    lastAnswer: null,
    toast: null,
    search: "",
    scenes: {},
    engines: {},
  };

  const app = document.getElementById("app");
  const $esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function ux() {
    return window.SCENE_UX[state.sceneId] || {};
  }
  function engine() {
    return state.engines[state.sceneId];
  }
  function scene() {
    return state.scenes[state.sceneId];
  }
  function node(id) {
    return engine() && engine().nodes[id];
  }
  function typeLabel(t) {
    const sc = scene();
    return (sc && sc.types[t] && sc.types[t].label) || t;
  }

  function syncUrl() {
    const u = new URL(location.href);
    u.searchParams.set("scene", state.sceneId);
    u.searchParams.set("p", state.product);
    u.searchParams.set("v", state.view);
    if (state.objectId) u.searchParams.set("oid", state.objectId);
    history.replaceState(null, "", u.pathname + u.search);
  }
  function go(patch) {
    Object.assign(state, patch);
    if (patch.sceneId) {
      const first = (scene().nodes || [])[0];
      if (!node(state.objectId) && first) state.objectId = first.id;
      state.lastAnswer = null;
      if (!state.proposals[state.sceneId]) state.proposals[state.sceneId] = [];
      if (!ux().actions.some((a) => a.id === state.actionId)) state.actionId = (ux().actions[0] || {}).id || "";
    }
    syncUrl();
    render();
  }
  function toast(msg) {
    state.toast = msg;
    render();
    setTimeout(() => {
      if (state.toast === msg) {
        state.toast = null;
        render();
      }
    }, 2200);
  }
  function idBtn(id) {
    return `<button class="idbtn" data-act="object" data-id="${$esc(id)}">${$esc(id)}</button>`;
  }
  function pendingCount() {
    return (state.proposals[state.sceneId] || []).filter((p) => p.status === "pending").length;
  }

  function topbar() {
    const u = ux().user || { name: "用户", role: "" };
    return `<header class="topbar">
      <div class="brand"><span class="brand-mark"></span><span class="brand-name">Orion<span class="brand-sub"> 决策本体</span></span></div>
      <div class="switch">
        <button class="${state.product === "ontology" ? "on" : ""}" data-act="product" data-v="ontology"><span class="lbl-full">本体工作台</span><span class="lbl-short">本体</span></button>
        <button class="${state.product === "oag" ? "on" : ""}" data-act="product" data-v="oag"><span class="lbl-full">OAG 问答</span><span class="lbl-short">OAG</span></button>
        <button class="${state.product === "compare" ? "on" : ""}" data-act="product" data-v="compare"><span class="lbl-full">RAG vs OAG</span><span class="lbl-short">对照</span></button>
      </div>
      <input class="top-search" placeholder="搜索对象 ID 或名称…" value="${$esc(state.search)}" data-act="search-input">
      <button class="ghost" data-act="theme">${document.documentElement.getAttribute("data-theme") === "dark" ? "浅色" : "深色"}</button>
      <div class="userpill"><div class="avatar">${$esc(u.name.slice(0, 1))}</div><div class="user-meta">${$esc(u.name)}<div class="user-role">${$esc(u.role)}</div></div></div>
    </header>`;
  }

  function sceneTabs() {
    return `<div class="scene-tabs">${ORDER.map((id) => {
      const s = state.scenes[id];
      if (!s) return "";
      return `<button class="${id === state.sceneId ? "on" : ""}" data-act="scene" data-id="${id}">${$esc(s.name)}</button>`;
    }).join("")}</div>`;
  }

  function navItems() {
    if (state.product === "oag") return [["ask", "提问"], ["pack", "证据链"]];
    if (state.product === "compare") return [["compare", "对照"]];
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

  function sidenav() {
    return `<aside class="nav"><div class="nav-label">${state.product === "ontology" ? "Ontology" : "OAG"}</div>${navItems()
      .map(([id, label]) => {
        const on = state.view === id || (state.product === "oag" && id === "ask" && state.view === "home");
        return `<button class="${on ? "active" : ""}" data-act="view" data-v="${id}"><span class="dot"></span><span class="label">${label}</span></button>`;
      })
      .join("")}</aside>`;
  }

  function viewHome() {
    const sc = scene();
    const n = (sc.nodes || []).length;
    const e = (sc.edges || []).length;
    return `<div class="crumb"><div><h1>${$esc(sc.name)}</h1><p>${$esc(sc.desc)} · 对象、关系、权限与写回在同一条回路上。</p></div>
      <button class="btn primary" data-act="view" data-v="inbox">进入收件箱</button></div>
      <div class="row cols-3" style="margin-bottom:14px">
        <div class="card kpi"><div class="k">对象 / 关系</div><div class="v">${n} / ${e}</div><div class="s">当前场景本体规模</div></div>
        <div class="card kpi"><div class="k">待审批 Action</div><div class="v">${pendingCount()}</div><div class="s">写回前必须过这一关</div></div>
        <div class="card kpi"><div class="k">检索引擎</div><div class="v" style="font-size:18px">图多跳</div><div class="s">实体识别 + 两跳遍历，无后端</div></div>
      </div>
      <div class="card"><h2>当前回路</h2><div class="pad">
        <ol style="margin:0;padding-left:18px;line-height:1.9;font-size:13.5px">
          <li>场景对象进入本体（${n} 个）</li>
          <li>任务进入收件箱，点开即对象</li>
          <li>对象图可拖拽、点选、两边遍历</li>
          <li>OAG 用图检索回答，证据可点回对象</li>
          <li>Action Proposal → 审批 → 模拟写回 → 对象状态更新</li>
        </ol>
        <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn" data-act="view" data-v="graph">打开对象图</button>
          <button class="btn" data-act="product" data-v="oag">用 OAG 提问</button>
          <button class="btn" data-act="product" data-v="compare">看 RAG 对照</button>
        </div>
      </div></div>`;
  }

  function viewInbox() {
    const tasks = ux().tasks || [];
    return `<div class="crumb"><div><h1>任务收件箱</h1><p>一线看到的是任务，不是表名。</p></div></div>
      <div class="card">${tasks
        .map(
          (t) => `<div class="item" data-act="object" data-id="${$esc(t.objectId)}" role="button" tabindex="0">
          <span class="chip ${t.severity === "高" ? "high" : t.severity === "中" ? "mid" : "low"}">${t.severity}</span>
          <span><div class="t">${$esc(t.title)}</div><div class="d">${$esc(t.hint)} · ${$esc(t.objectId)}</div></span>
          <span class="d">${$esc(t.age)}</span></div>`
        )
        .join("")}</div>`;
  }

  function viewGraph() {
    const o = node(state.objectId);
    const links = o ? engine().linksOf(state.objectId) : [];
    return `<div class="crumb"><div><h1>对象图</h1><p>力导向图谱，点击节点打开对象。可拖拽、缩放。</p></div></div>
      <div class="row cols-graph">
        <div class="card"><div class="graph-box" id="chart"></div></div>
        <div class="card"><h2>${o ? $esc(o.name) : "未选中"}</h2>
          <div class="pad">${
            o
              ? `${idBtn(o.id)} <span class="chip idle">${$esc(typeLabel(o.type))}</span>
            <div style="margin-top:10px">${links
              .map((l) => `<div style="margin:6px 0">${$esc(l.rel)} → ${idBtn(l.to)}</div>`)
              .join("")}</div>
            <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">
              <button class="btn primary" data-act="object" data-id="${o.id}">对象详情</button>
              <button class="btn" data-act="view" data-v="action">发起 Action</button>
            </div>`
              : "<p class='empty'>在图上点一个节点</p>"
          }</div></div>
      </div>`;
  }

  function viewObject() {
    const o = node(state.objectId);
    if (!o) return `<div class="empty">未选中对象</div>`;
    const props = Object.entries(o.props || {});
    const links = engine().linksOf(o.id);
    return `<div class="crumb"><div><h1>${$esc(o.name)}</h1><p>${$esc(typeLabel(o.type))} · ${$esc(o.id)}</p></div>
      <div style="display:flex;gap:8px"><button class="btn" data-act="view" data-v="graph">回对象图</button>
      <button class="btn primary" data-act="view" data-v="action">发起 Action</button></div></div>
      <div class="row cols-2">
        <div class="card"><h2>属性</h2><div class="pad">${idBtn(o.id)}
          <table class="props">${props.map(([k, v]) => `<tr><th>${$esc(k)}</th><td>${$esc(v)}</td></tr>`).join("")}</table>
        </div></div>
        <div class="card"><h2>链接</h2><div class="pad">${links
          .map((l) => {
            const t = node(l.to);
            return `<div class="item" data-act="object" data-id="${l.to}" style="grid-template-columns:1fr auto">
              <span><div class="t">${$esc(l.rel)} → ${$esc(t ? t.name : l.to)}</div><div class="d">${t ? $esc(typeLabel(t.type)) : ""}</div></span>${idBtn(l.to)}</div>`;
          })
          .join("")}</div></div>
      </div>`;
  }

  function viewAction() {
    const actions = ux().actions || [];
    const a = actions.find((x) => x.id === state.actionId) || actions[0];
    if (!a) return `<div class="empty">该场景未配置 Action</div>`;
    return `<div class="crumb"><div><h1>发起 Action Proposal</h1><p>只能生成提案。写回要审批、幂等键。</p></div></div>
      <div class="row cols-2">
        <div class="card"><h2>命令</h2><div class="pad">
          <div class="qchips">${actions
            .map((x) => `<button class="${x.id === a.id ? "on" : ""}" data-act="action-type" data-id="${x.id}">${$esc(x.name)}</button>`)
            .join("")}</div>
          <div class="banner">写回目标：${$esc(a.writes)} · 需要审批：是</div>
          <div class="form">${a.fields
            .map((f) => `<div class="field"><label>${$esc(f.label)}</label><input value="${$esc(f.value)}"></div>`)
            .join("")}
            <div class="field"><label>幂等键</label><input class="mono" value="act-${a.id}-${state.sceneId}-20260814"></div>
          </div>
          <button class="btn primary" data-act="submit-proposal">提交提案（不直接写回）</button>
        </div></div>
        <div class="card"><h2>校验</h2><div class="pad"><table class="props">
          <tr><th>打开应用</th><td>通过</td></tr>
          <tr><th>看见对象</th><td>通过 · 当前场景可见域</td></tr>
          <tr><th>调用 Function</th><td>通过 · 只读</td></tr>
          <tr><th>执行 Action</th><td>拦截直写 · 进入审批</td></tr>
        </table></div></div>
      </div>`;
  }

  function viewApprovals() {
    const rows = state.proposals[state.sceneId] || [];
    return `<div class="crumb"><div><h1>审批队列</h1><p>批准后才模拟写回。拒绝则留在历史上。</p></div></div>
      <div class="card">${
        rows.length === 0
          ? `<div class="empty">还没有提案。去「发起 Action」或从 OAG 生成。</div>`
          : rows
              .map(
                (p) => `<div class="item" style="grid-template-columns:1fr auto">
            <div><div class="t">${$esc(p.actionName)} · ${p.status === "pending" ? "待审批" : p.status === "approved" ? "已批准" : "已拒绝"}</div>
            <div class="d">${$esc(p.by)} · ${$esc(p.idem)}</div></div>
            <div style="display:flex;gap:8px">${
              p.status === "pending"
                ? `<button class="btn ok" data-act="decide" data-id="${p.id}" data-v="approved">批准写回</button>
                   <button class="btn danger" data-act="decide" data-id="${p.id}" data-v="rejected">拒绝</button>`
                : `<span class="chip ${p.status === "approved" ? "low" : "high"}">${p.status}</span>`
            }</div></div>`
              )
              .join("")
      }</div>`;
  }

  function viewSecurity() {
    return `<div class="crumb"><div><h1>四权矩阵</h1><p>打开应用、看见数据、调用函数、执行写回是四种权限。</p></div></div>
      <div class="card"><div class="pad"><table class="props">
        <tr><th>层</th><td><b>${$esc((ux().user || {}).name || "")}</b></td><td>含义</td></tr>
        ${(ux().security || []).map((r) => `<tr><th>${$esc(r.layer)}</th><td>${$esc(r.you)}</td><td>${$esc(r.note)}</td></tr>`).join("")}
      </table></div></div>`;
  }

  function viewTypes() {
    const sc = scene();
    const groups = {};
    (sc.nodes || []).forEach((n) => {
      (groups[n.type] || (groups[n.type] = [])).push(n);
    });
    return `<div class="crumb"><div><h1>对象类型</h1><p>${$esc(sc.name)} 的类型清单。</p></div></div>
      <div class="row cols-3">${Object.keys(groups)
        .map((t) => `<div class="card"><h2>${$esc(typeLabel(t))}</h2><div class="pad">${groups[t]
          .map((n) => `<div style="margin-bottom:8px">${idBtn(n.id)} <span class="d">${$esc(n.name)}</span></div>`)
          .join("")}</div></div>`)
        .join("")}</div>`;
  }

  function viewAsk() {
    const examples = ux().examples || [];
    const ans = state.lastAnswer;
    return `<div class="crumb"><div><h1>OAG · 对象增强生成</h1><p>检索的是对象与关系，不是文档切片。答案可变成提案。</p></div>
      <button class="btn" data-act="product" data-v="compare">看 RAG 对照</button></div>
      <div class="qbar"><input id="qinput" placeholder="输入问题…" value=""><button class="btn primary" data-act="ask">问答</button></div>
      <div class="qchips">${examples.map((q) => `<button data-act="example" data-q="${$esc(q)}">${$esc(q)}</button>`).join("")}</div>
      ${
        ans
          ? `<div class="engine">引擎：确定性图检索（实体识别 + 两跳） · 种子 ${ans.seeds.length ? ans.seeds.map($esc).join(", ") : "全图"} · 关系 ${ans.rels.join(", ") || "未指定"}</div>
        <div class="card"><h2>回答</h2><div class="pad"><p style="line-height:1.7;margin:0 0 12px">${$esc(ans.answer)}</p>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">${ans.seeds.map(idBtn).join("")}</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">${(ux().actions || [])
            .map((a) => `<button class="btn primary" data-act="from-oag" data-id="${a.id}">生成提案：${$esc(a.name)}</button>`)
            .join("")}
            <button class="btn" data-act="view" data-v="pack">打开证据链</button>
          </div></div></div>`
          : `<div class="empty">选一条示例，或自己提问。检索在浏览器内完成。</div>`
      }`;
  }

  function viewPack() {
    const ans = state.lastAnswer;
    if (!ans) return `<div class="empty">先在「提问」里跑一轮 OAG。</div>`;
    return `<div class="crumb"><div><h1>证据链 / Context Pack</h1><p>每条证据可点回对象。HyDE 假设文本不会进入证据库。</p></div></div>
      <div class="card"><h2>入选关系</h2><div class="pad">${(ans.evidence || [])
        .slice(0, 16)
        .map(
          (e) =>
            `<div class="ev" data-act="object" data-id="${e.from}"><span class="rel">${$esc(e.label)}</span>：${$esc(e.fromName)} ${idBtn(e.from)} → ${$esc(e.toName)} ${idBtn(e.to)}${e.hit ? "" : " <span class='d'>（弱相关）</span>"}</div>`
        )
        .join("")}</div></div>`;
  }

  function viewCompare() {
    const rag = ux().rag || { text: "", chunks: [], answer: "", gaps: [] };
    const live = state.lastAnswer;
    return `<div class="crumb"><div><h1>同一问题：RAG vs OAG</h1><p>左边是段落检索；右边是对象、证据与可执行边界。</p></div></div>
      <div class="qchips"><button class="on" data-act="example" data-q="${$esc(rag.text)}">${$esc(rag.text)}</button></div>
      <div class="compare">
        <div class="card"><div class="head rag-head"><b>RAG</b><span class="chip idle">chunk / passage</span></div>
          <div class="pad">${rag.chunks.map((c) => `<div class="chunk"><b>${$esc(c.title)}</b><p>${$esc(c.body)}</p></div>`).join("")}
            <p style="font-size:13.5px;line-height:1.65">${$esc(rag.answer)}</p>
            ${(rag.gaps || []).map((g) => `<div class="gap">缺口：${$esc(g)}</div>`).join("")}
          </div></div>
        <div class="card"><div class="head oag-head"><b>OAG</b><span class="chip idle">object / link</span></div>
          <div class="pad">${
            live
              ? `<p style="line-height:1.65;margin-top:0">${$esc(live.answer)}</p>
                 <div style="margin:8px 0 12px;display:flex;flex-wrap:wrap;gap:6px">${live.seeds.map(idBtn).join("")}</div>
                 <button class="btn" data-act="view" data-v="pack">检查证据链</button>`
              : `<p class="empty">点上方问题，右侧用图引擎现场检索。</p>`
          }</div></div>
      </div>`;
  }

  function body() {
    if (state.product === "oag") return state.view === "pack" ? viewPack() : viewAsk();
    if (state.product === "compare") return viewCompare();
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

  function drawGraph() {
    const el = document.getElementById("chart");
    if (!el || !window.echarts) return;
    const sc = scene();
    const types = Object.keys(sc.types);
    const cats = types.map((t) => ({ name: sc.types[t].label, itemStyle: { color: sc.types[t].color } }));
    const nodes = (sc.nodes || []).map((n) => ({
      id: n.id,
      name: n.name,
      category: types.indexOf(n.type),
      itemStyle: { color: (sc.types[n.type] || {}).color },
      label: { show: true, fontSize: 11 },
    }));
    const links = (sc.edges || []).map((e) => ({
      source: e.source,
      target: e.target,
      label: { show: true, formatter: e.label, fontSize: 9 },
    }));
    const chart = echarts.init(el, document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : null);
    chart.setOption({
      tooltip: { formatter: (p) => (p.data && (p.data.name || p.data.label)) || "" },
      legend: { data: cats.map((c) => c.name), bottom: 0, textStyle: { fontSize: 10 } },
      series: [
        {
          type: "graph",
          layout: "force",
          roam: true,
          draggable: true,
          categories: cats,
          data: nodes,
          links: links,
          force: { repulsion: 280, edgeLength: 110, gravity: 0.08 },
          lineStyle: { width: 1, curveness: 0.1 },
          emphasis: { focus: "adjacency" },
          label: { position: "right" },
        },
      ],
    });
    chart.on("click", (p) => {
      if (p.data && p.data.id) go({ view: "object", objectId: p.data.id, product: "ontology" });
    });
    window.addEventListener("resize", () => chart.resize(), { once: true });
  }

  function render() {
    app.innerHTML = `${topbar()}${sceneTabs()}${sidenav()}<main class="main">${body()}</main>${
      state.toast ? `<div class="toast">${$esc(state.toast)}</div>` : ""
    }`;
    if (state.view === "graph" && state.product === "ontology") requestAnimationFrame(drawGraph);
  }

  function runAsk(q) {
    const d = engine().answer(q);
    state.lastAnswer = d;
    if (d.seeds[0]) state.objectId = d.seeds[0];
    if (state.product === "compare") go({ product: "compare", view: "compare" });
    else go({ product: "oag", view: "ask" });
  }

  function submitProposal(actionId, by) {
    const a = (ux().actions || []).find((x) => x.id === actionId);
    if (!a) return;
    const list = state.proposals[state.sceneId] || (state.proposals[state.sceneId] = []);
    const p = {
      id: "P-" + (list.length + 1),
      actionId: actionId,
      actionName: a.name,
      by: by,
      status: "pending",
      idem: "act-" + actionId + "-" + state.sceneId,
    };
    list.unshift(p);
    go({ product: "ontology", view: "approvals" });
    toast("已生成提案 " + p.id + "，未写回外部系统。");
  }

  app.addEventListener("keydown", (e) => {
    if (e.target.matches(".top-search") && e.key === "Enter") {
      const q = e.target.value.trim();
      const hit = (scene().nodes || []).find(
        (n) => n.id.toLowerCase() === q.toLowerCase() || n.name.indexOf(q) >= 0
      );
      if (hit) go({ product: "ontology", view: "object", objectId: hit.id });
      else toast("没有匹配的对象");
    }
    if (e.target.id === "qinput" && e.key === "Enter") {
      const q = e.target.value.trim();
      if (q) runAsk(q);
    }
  });
  app.addEventListener("input", (e) => {
    if (e.target.matches(".top-search")) state.search = e.target.value;
  });
  app.addEventListener("click", (e) => {
    const t = e.target.closest("[data-act]");
    if (!t) return;
    const act = t.dataset.act;
    if (act === "theme") {
      const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", cur);
      render();
    } else if (act === "product") {
      const v = t.dataset.v;
      go({ product: v, view: v === "ontology" ? "home" : v === "oag" ? "ask" : "compare" });
    } else if (act === "scene") go({ sceneId: t.dataset.id, view: state.product === "ontology" ? "home" : state.view });
    else if (act === "view") go({ view: t.dataset.v });
    else if (act === "object") go({ product: "ontology", view: "object", objectId: t.dataset.id });
    else if (act === "action-type") go({ view: "action", actionId: t.dataset.id, product: "ontology" });
    else if (act === "submit-proposal") submitProposal(state.actionId || (ux().actions[0] || {}).id, (ux().user || {}).name);
    else if (act === "from-oag") submitProposal(t.dataset.id, "OAG · " + ((ux().user || {}).name || ""));
    else if (act === "example") runAsk(t.dataset.q);
    else if (act === "ask") {
      const q = (document.getElementById("qinput") || {}).value;
      if (q && q.trim()) runAsk(q.trim());
    } else if (act === "decide") {
      const p = (state.proposals[state.sceneId] || []).find((x) => x.id === t.dataset.id);
      if (!p) return;
      p.status = t.dataset.v;
      toast(p.status === "approved" ? p.id + " 已批准，写回已模拟。" : p.id + " 已拒绝。");
      render();
    }
  });

  async function boot() {
    await Promise.all(
      ORDER.map(async (id) => {
        const data = (window.INLINE_SCENES && window.INLINE_SCENES[id])
          ? window.INLINE_SCENES[id]
          : await (await fetch("scenes/" + id + ".json")).then((r) => r.json());
        state.scenes[id] = data;
        state.engines[id] = new window.OagScene(data);
      })
    );
    if (!state.scenes[state.sceneId]) state.sceneId = ORDER[0];
    const first = (scene().nodes || [])[0];
    if (!state.objectId && first) state.objectId = first.id;
    if (!state.proposals[state.sceneId]) state.proposals[state.sceneId] = [];
    if (!state.actionId) state.actionId = ((ux().actions || [])[0] || {}).id || "";
    if (localStorage.getItem("orion-theme") === "dark") document.documentElement.setAttribute("data-theme", "dark");
    render();
  }

  const _render = render;
  render = function () {
    localStorage.setItem("orion-theme", document.documentElement.getAttribute("data-theme") || "light");
    _render();
  };

  boot();
})();
