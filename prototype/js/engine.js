/**
 * Client-side port of prototype-near/server.py Scene engine.
 * Entity resolve + 2-hop traversal + deterministic answer. No backend.
 */
(function (global) {
  function Scene(data) {
    this.id = data.id;
    this.name = data.name || data.id;
    this.desc = data.desc || "";
    this.types = data.types || {};
    this.relKeywords = data.relKeywords || {};
    this.propMap = data.propMap || {};
    this.raw = data;
    this.nodes = {};
    (data.nodes || []).forEach((n) => {
      this.nodes[n.id] = n;
    });
    this.edges = data.edges || [];
    this.typeLabels = {};
    Object.keys(this.types).forEach((k) => {
      this.typeLabels[this.types[k].label] = k;
    });
    this.adj = {};
    this.edges.forEach((e) => {
      (this.adj[e.source] || (this.adj[e.source] = [])).push([e.target, e.rel, e.label, "out"]);
      (this.adj[e.target] || (this.adj[e.target] = [])).push([e.source, e.rel, e.label, "in"]);
    });
  }

  Scene.prototype.resolve = function (question) {
    const seeds = [];
    const rels = [];
    const typeHint = [];
    const q = question.toLowerCase();
    Object.keys(this.nodes).forEach((nid) => {
      const n = this.nodes[nid];
      if (q.indexOf(nid.toLowerCase()) >= 0 || question.indexOf(n.name) >= 0) {
        if (seeds.indexOf(nid) < 0) seeds.push(nid);
      }
    });
    Object.keys(this.relKeywords).forEach((rel) => {
      const kws = this.relKeywords[rel] || [];
      if (kws.some((k) => question.indexOf(k) >= 0 || q.indexOf(String(k).toLowerCase()) >= 0)) {
        if (rels.indexOf(rel) < 0) rels.push(rel);
      }
    });
    Object.keys(this.typeLabels).forEach((lab) => {
      if (question.indexOf(lab) >= 0) {
        const t = this.typeLabels[lab];
        if (typeHint.indexOf(t) < 0) typeHint.push(t);
      }
    });
    return { seeds: seeds, rels: rels, typeHint: typeHint };
  };

  Scene.prototype._edge = function (cur, nbr, rel, label, direction) {
    if (direction === "out") return { rel: rel, label: label, from: cur, to: nbr };
    return { rel: rel, label: label, from: nbr, to: cur };
  };

  Scene.prototype.traverse = function (seeds, rels, typeHint) {
    let starts = seeds && seeds.length ? seeds.slice() : [];
    if (!starts.length) {
      starts = (this.raw.nodes || [])
        .filter((n) => !typeHint.length || typeHint.indexOf(n.type) >= 0)
        .map((n) => n.id);
    }
    const bag = {};
    starts.forEach((s) => {
      (this.adj[s] || []).forEach((a) => {
        const e1 = this._edge(s, a[0], a[1], a[2], a[3]);
        bag[[e1.from, e1.to, a[1]].join("|")] = e1;
        (this.adj[a[0]] || []).forEach((b) => {
          if (b[0] === s) return;
          const e2 = this._edge(a[0], b[0], b[1], b[2], b[3]);
          bag[[e2.from, e2.to, b[1]].join("|")] = e2;
        });
      });
    });
    const out = Object.keys(bag).map((k) => {
      const e = Object.assign({}, bag[k]);
      e.hit = !rels.length || rels.indexOf(e.rel) >= 0;
      const f = this.nodes[e.from];
      const t = this.nodes[e.to];
      e.fromName = f ? f.name : e.from;
      e.toName = t ? t.name : e.to;
      e.fromType = f ? f.type : "";
      e.toType = t ? t.type : "";
      return e;
    });
    out.sort((a, b) => (a.hit === b.hit ? 0 : a.hit ? -1 : 1));
    return out;
  };

  Scene.prototype.deterministicAnswer = function (evidence, rels, seeds) {
    const hits = evidence.filter((e) => e.hit);
    const use = hits.length ? hits : evidence.slice(0, 5);
    const parts = [];
    const seen = {};
    use.forEach((ev) => {
      const k = ev.from + "|" + ev.to + "|" + ev.rel;
      if (seen[k]) return;
      seen[k] = 1;
      parts.push(ev.fromName + "(" + ev.from + ") " + ev.label + " " + ev.toName + "(" + ev.to + ")");
    });
    const propSeen = {};
    let nodeIds = (seeds || []).filter((id) => this.nodes[id]);
    use.slice(0, 6).forEach((ev) => {
      nodeIds.push(ev.from, ev.to);
    });
    (rels || []).forEach((rel) => {
      const spec = this.propMap[rel];
      if (!spec) return;
      const keys = Array.isArray(spec[0]) ? spec[0] : [spec[0]];
      const label = spec[1];
      nodeIds.forEach((nid) => {
        const n = this.nodes[nid];
        if (!n) return;
        keys.forEach((kk) => {
          const pk = nid + "|" + kk;
          if (n.props && n.props[kk] != null && !propSeen[pk]) {
            propSeen[pk] = 1;
            parts.push(n.name + "(" + nid + ") 的 " + label + "为 " + n.props[kk]);
          }
        });
      });
    });
    if (!parts.length) return "未在本体中找到与该问题直接相关的对象或关系。";
    return parts.slice(0, 14).join("；") + "。";
  };

  Scene.prototype.answer = function (question) {
    const r = this.resolve(question);
    const ev = this.traverse(r.seeds, r.rels, r.typeHint);
    return {
      question: question,
      engine: "deterministic",
      answer: this.deterministicAnswer(ev, r.rels, r.seeds),
      seeds: r.seeds,
      rels: r.rels,
      evidence: ev,
    };
  };

  Scene.prototype.linksOf = function (id) {
    return (this.adj[id] || []).map((a) => ({
      to: a[0],
      rel: a[2],
      dir: a[3],
    }));
  };

  global.OagScene = Scene;
})(window);
