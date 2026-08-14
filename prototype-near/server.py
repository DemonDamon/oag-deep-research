#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""OAG 原型后端：场景数据驱动的通用本体图引擎（零第三方依赖）。

- 场景：scenes/*.json，每个场景自带 types / relKeywords / propMap / nodes / edges
- OAG 检索：实体识别 + 本体图多跳路径遍历（确定性、可溯源、语义方向正确）
- 生成：设置 DEEPSEEK_API_KEY 则调 DeepSeek(deepseek-v4-flash)，否则确定性模板生成。

启动：python3 server.py  ->  http://localhost:8765
"""
import json, os, urllib.request
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

BASE = Path(__file__).parent
SCENES_DIR = BASE / 'scenes'


class Scene:
    """一个本体场景：从 scenes/*.json 加载并构建图索引。"""

    def __init__(self, data):
        self.id = data['id']
        self.name = data.get('name', data['id'])
        self.desc = data.get('desc', '')
        self.types = data['types']
        self.rel_keywords = data.get('relKeywords', {})
        self.prop_map = data.get('propMap', {})
        self.nodes = {n['id']: n for n in data['nodes']}
        self.edges = data['edges']
        self.raw = data
        # 类型中文标签 -> 类型 id
        self.type_labels = {v['label']: k for k, v in self.types.items()}
        # 邻接表
        self.adj = {}
        for e in self.edges:
            self.adj.setdefault(e['source'], []).append((e['target'], e['rel'], e['label'], 'out'))
            self.adj.setdefault(e['target'], []).append((e['source'], e['rel'], e['label'], 'in'))

    # ---- 检索 ----
    def resolve(self, question):
        seeds, rels, type_hint = [], [], []
        q = question.lower()
        for nid, n in self.nodes.items():
            if nid.lower() in q or n['name'].lower() in q:
                if nid not in seeds:
                    seeds.append(nid)
        for rel, kws in self.rel_keywords.items():
            if any(k.lower() in question for k in kws):
                if rel not in rels:
                    rels.append(rel)
        for lab, t in self.type_labels.items():
            if lab in question:
                if t not in type_hint:
                    type_hint.append(t)
        return {'seeds': seeds, 'rels': rels, 'type_hint': type_hint}

    def traverse(self, seeds, rels, type_hint):
        if not seeds:
            starts = [n['id'] for n in self.raw['nodes'] if (not type_hint or n['type'] in type_hint)]
        else:
            starts = list(seeds)
        edges = {}
        for s in starts:
            for (n1, rel1, lab1, d1) in self.adj.get(s, []):
                e1 = self._edge(s, n1, rel1, lab1, d1)
                edges[(e1['from'], e1['to'], rel1)] = e1
                for (n2, rel2, lab2, d2) in self.adj.get(n1, []):
                    if n2 == s:
                        continue
                    e2 = self._edge(n1, n2, rel2, lab2, d2)
                    edges[(e2['from'], e2['to'], rel2)] = e2
        out = []
        for e in edges.values():
            e = dict(e)
            e['hit'] = (not rels) or (e['rel'] in rels)
            e['fromName'] = self.nodes[e['from']]['name']
            e['toName'] = self.nodes[e['to']]['name']
            e['fromType'] = self.nodes[e['from']]['type']
            e['toType'] = self.nodes[e['to']]['type']
            out.append(e)
        out.sort(key=lambda e: (not e['hit'], e['rel']))
        return out

    @staticmethod
    def _edge(cur, nbr, rel, label, direction):
        if direction == 'out':
            return {'rel': rel, 'label': label, 'from': cur, 'to': nbr}
        return {'rel': rel, 'label': label, 'from': nbr, 'to': cur}

    def evidence_to_text(self, evidence):
        lines, seen = [], set()
        for ev in evidence:
            k = (ev['from'], ev['to'], ev['rel'])
            if k in seen:
                continue
            seen.add(k)
            f, t = self.nodes[ev['from']], self.nodes[ev['to']]
            fp = ', '.join(f'{k}={v}' for k, v in f['props'].items())
            tp = ', '.join(f'{k}={v}' for k, v in t['props'].items())
            lines.append(f"{f['id']}({f['name']}) --{ev['label']}--> {t['id']}({t['name']})")
            lines.append(f"    {f['name']} 属性: {fp}")
            lines.append(f"    {t['name']} 属性: {tp}")
        return '\n'.join(lines)

    def deterministic_answer(self, evidence, rels=(), seeds=()):
        hits = [e for e in evidence if e.get('hit')]
        use = hits if hits else evidence[:5]
        parts, seen = [], set()
        for ev in use:
            k = (ev['from'], ev['to'], ev['rel'])
            if k in seen:
                continue
            seen.add(k)
            parts.append(f"{ev['fromName']}({ev['from']}) {ev['label']} {ev['toName']}({ev['to']})")
        prop_seen = set()
        node_ids = [nid for nid in seeds if nid in self.nodes]
        for ev in use[:6]:
            node_ids += [ev['from'], ev['to']]
        for rel in rels:
            if rel in self.prop_map:
                spec = self.prop_map[rel]
                keys, label = spec
                keys = keys if isinstance(keys, list) else [keys]
                for nid in node_ids:
                    n = self.nodes.get(nid)
                    if not n:
                        continue
                    for kk in keys:
                        pk = (nid, kk)
                        if kk in n['props'] and pk not in prop_seen:
                            prop_seen.add(pk)
                            parts.append(f"{n['name']}({nid}) 的 {label}为 {n['props'][kk]}")
        if not parts:
            return '未在本体中找到与该问题直接相关的对象或关系。'
        return '；'.join(parts[:14]) + '。'

    def answer(self, question, llm):
        r = self.resolve(question)
        ev = self.traverse(r['seeds'], r['rels'], r['type_hint'])
        txt = self.evidence_to_text(ev)
        ans = llm(question, txt)
        engine = 'deepseek' if ans else 'deterministic'
        if not ans:
            ans = self.deterministic_answer(ev, r['rels'], r['seeds'])
        return {'question': question, 'engine': engine, 'answer': ans,
                'seeds': r['seeds'], 'rels': r['rels'], 'evidence': ev}


# ---- 场景加载 ----
SCENES = {}
for p in sorted(SCENES_DIR.glob('*.json')):
    sc = Scene(json.loads(p.read_text(encoding='utf-8')))
    SCENES[sc.id] = sc
DEFAULT_SCENE = next(iter(SCENES.values())) if SCENES else None


def llm_generate(question, evidence_text):
    key = os.environ.get('DEEPSEEK_API_KEY', '').strip()
    # 默认 deepseek-v4-flash；直连官方 API 时 export DEEPSEEK_MODEL=deepseek-chat
    model = os.environ.get('DEEPSEEK_MODEL', 'deepseek-v4-flash').strip()
    if not key:
        return None
    payload = {
        'model': model,
        'messages': [
            {'role': 'system', 'content': '你是企业本体(Ontology)问答助手。只基于给定结构化证据回答，不得编造事实；回答末尾用【证据】列出用到的对象ID。'},
            {'role': 'user', 'content': f'问题：{question}\n\n结构化证据：\n{evidence_text}'},
        ],
        'temperature': 0.3, 'stream': False,
    }
    req = urllib.request.Request(
        'https://api.deepseek.com/chat/completions',
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {key}'},
    )
    resp = json.loads(urllib.request.urlopen(req, timeout=40).read())
    return resp['choices'][0]['message']['content']


class Handler(BaseHTTPRequestHandler):
    def _json(self, obj, code=200):
        body = json.dumps(obj, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _scene(self):
        qs = self.path.split('?', 1)[1] if '?' in self.path else ''
        args = dict(kv.split('=', 1) for kv in qs.split('&') if '=' in kv)
        sid = args.get('scene', DEFAULT_SCENE.id if DEFAULT_SCENE else '')
        return SCENES.get(sid) or DEFAULT_SCENE

    def do_GET(self):
        if self.path.startswith('/api/scenes'):
            return self._json([{'id': s.id, 'name': s.name, 'desc': s.desc,
                                'nodes': len(s.nodes), 'edges': len(s.edges)} for s in SCENES.values()])
        if self.path.startswith('/api/graph'):
            s = self._scene()
            if not s:
                return self._json({'error': 'no scene'}, 404)
            return self._json(s.raw)
        if self.path.startswith('/api/node/'):
            s = self._scene()
            if not s:
                return self._json({'error': 'no scene'}, 404)
            nid = self.path.split('/')[-1]
            return self._json(s.nodes.get(nid, {'error': 'not found'}))
        html = (BASE / 'index.html').read_text(encoding='utf-8')
        body = html.encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        if self.path == '/api/answer':
            ln = int(self.headers.get('Content-Length', 0))
            data = json.loads(self.rfile.read(ln).decode('utf-8'))
            s = SCENES.get(data.get('scene')) or DEFAULT_SCENE
            if not s:
                return self._json({'error': 'no scene'}, 404)
            return self._json(s.answer(data.get('question', ''), llm_generate))
        return self._json({'error': 'not found'}, 404)

    def log_message(self, *a):
        pass


if __name__ == '__main__':
    port = int(os.environ.get('PORT', '8765'))
    print(f'OAG prototype running: http://localhost:{port}')
    print(f'场景: {", ".join(f"{s.id}({s.name})" for s in SCENES.values())}')
    if os.environ.get('DEEPSEEK_API_KEY'):
        print(f"LLM engine: DeepSeek({os.environ.get('DEEPSEEK_MODEL','deepseek-v4-flash')})")
    else:
        print('LLM engine: deterministic (export DEEPSEEK_API_KEY=... to enable DeepSeek)')
    HTTPServer(('127.0.0.1', port), Handler).serve_forever()
