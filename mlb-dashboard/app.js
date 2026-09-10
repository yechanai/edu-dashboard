/* ─────────────────────────────────────────────────────────
   MLB 2026 Standings Center — 렌더링 엔진 (외부 라이브러리 없음)
   ───────────────────────────────────────────────────────── */

const $ = (sel, root = document) => root.querySelector(sel);
const byAbbr = Object.fromEntries(MLB_TEAMS.map(t => [t.abbr, t]));
const SVG_NS = "http://www.w3.org/2000/svg";

/* ── 포맷 ── */
const F = {
  avg: v => Number(v).toFixed(3).replace(/^0/, ""),
  ops: v => Number(v) >= 1 ? Number(v).toFixed(3) : Number(v).toFixed(3).replace(/^0/, ""),
  pct: v => Number(v).toFixed(3).replace(/^0/, ""),
  "1": v => Number(v).toFixed(1),
  "2": v => Number(v).toFixed(2),
  int: v => String(Math.round(v)),
  signed: v => (v > 0 ? "+" : "") + Math.round(v),
  gb: v => v == null ? "—" : v === 0 ? "—" : (Number.isInteger(v) ? v : v.toFixed(1)),
  wcgb: v => v == null ? "—" : v === 0 ? "—" : v < 0 ? "+" + (-v) : String(v),
};

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}
function svgEl(tag, attrs = {}, text) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (text !== undefined) e.textContent = text;
  return e;
}
const mean = (arr, key) => arr.reduce((s, t) => s + t[key], 0) / arr.length;

/* ── 팀 표시 조각 ── */
function abbrTag(abbr, cls = "ab") {
  const t = byAbbr[abbr];
  return `<span class="${cls}" style="background:${t ? t.color : "#555"}">${abbr}</span>`;
}
function teamCell(t, withEn = true) {
  return `<div class="tc"><span class="stripe" style="background:${t.color}"></span>${abbrTag(t.abbr)}<span class="nm">${t.name}</span>${withEn ? `<span class="en">${t.en}</span>` : ""}</div>`;
}
function streakPill(s) {
  const win = s[0] === "W";
  return `<span class="pill ${win ? "up" : "down"}">${win ? "▲" : "▼"} ${s}</span>`;
}
function signedPill(v, digits = 0) {
  const cls = v > 0 ? "up" : v < 0 ? "down" : "flat";
  return `<span class="pill ${cls}">${v > 0 ? "+" : ""}${Number(v).toFixed(digits)}</span>`;
}
function l10Dots(l10) {
  const w = parseInt(l10.split("-")[0]);
  let html = `<span class="l10" title="최근 10경기 ${l10}">`;
  for (let i = 0; i < 10; i++) html += `<i class="${i < w ? "w" : "l"}"></i>`;
  return html + `</span><span style="margin-left:6px">${l10}</span>`;
}
function clinchBadge(t) {
  if (t.divClinch) return `<span class="badge y" title="지구 우승 확정">y</span>`;
  if (t.divRank === 1 && t.magic <= 5) return `<span class="badge x" title="매직넘버 ${t.magic}">M${t.magic}</span>`;
  if (t.divElim && t.wcElim) return `<span class="badge e" title="포스트시즌 탈락">e</span>`;
  return "";
}
function cellBar(v, max, color, text) {
  const w = Math.max(0, Math.min(100, v / max * 100));
  return `<span class="cellbar"><span class="track"><span class="fill" style="width:${w}%;background:${color}"></span></span><span>${text}</span></span>`;
}

/* ── 툴팁 ── */
const tip = el("div", "tip");
document.body.appendChild(tip);
function showTip(evt, html) {
  tip.innerHTML = html; tip.style.display = "block";
  moveTip(evt);
}
function moveTip(evt) {
  const pad = 14, w = tip.offsetWidth, h = tip.offsetHeight;
  let x = evt.clientX + pad, y = evt.clientY + pad;
  if (x + w > window.innerWidth - 8) x = evt.clientX - w - pad;
  if (y + h > window.innerHeight - 8) y = evt.clientY - h - pad;
  tip.style.left = x + "px"; tip.style.top = y + "px";
}
function hideTip() { tip.style.display = "none"; }
function bindTip(node, htmlFn) {
  node.addEventListener("mouseenter", e => showTip(e, htmlFn()));
  node.addEventListener("mousemove", moveTip);
  node.addEventListener("mouseleave", hideTip);
}
function teamTip(t, rows) {
  return `<b>${t.name}</b> <span style="opacity:.7">${t.en}</span><br>` +
    rows.map(([k, v]) => `<div class="row"><span>${k}</span><span>${v}</span></div>`).join("");
}

/* ── 정렬 가능한 테이블 ──
   cols: [{key,label,fmt(fn|F key),left,sortable=true,cls(fn),render(fn),desc=true}] */
function renderTable(container, cols, rows, opts = {}) {
  const root = typeof container === "string" ? $(container) : container;
  const state = { key: opts.sortKey || null, asc: opts.sortAsc ?? false };
  const draw = () => {
    let data = [...rows];
    if (state.key) {
      data.sort((a, b) => {
        const av = a[state.key], bv = b[state.key];
        if (av == null) return 1; if (bv == null) return -1;
        return state.asc ? av - bv : bv - av;
      });
    }
    const wrap = el("div", "tbl-wrap");
    const table = el("table", "std");
    const thead = el("thead");
    const trh = el("tr");
    if (opts.rankCol) trh.appendChild(el("th", "", "#"));
    cols.forEach(c => {
      const th = el("th", (c.left ? "left " : "") + (c.sortable === false ? "" : "sortable"), c.label);
      if (c.title) th.title = c.title;
      if (state.key === c.key) th.classList.add("sorted", state.asc ? "asc" : "desc");
      if (c.sortable !== false) th.addEventListener("click", () => {
        if (state.key === c.key) state.asc = !state.asc;
        else { state.key = c.key; state.asc = c.asc ?? false; }
        draw();
      });
      trh.appendChild(th);
    });
    thead.appendChild(trh); table.appendChild(thead);
    const tbody = el("tbody");
    data.forEach((r, i) => {
      const tr = el("tr", opts.rowCls ? opts.rowCls(r) : "");
      if (opts.rankCol) tr.appendChild(el("td", "rank", String(i + 1)));
      cols.forEach(c => {
        const v = r[c.key];
        const fmt = typeof c.fmt === "function" ? c.fmt : (c.fmt ? F[c.fmt] : x => x);
        const td = el("td", (c.left ? "left " : "") + (c.cls ? c.cls(r, v) : ""), c.render ? c.render(r, v) : fmt(v));
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody); wrap.appendChild(table);
    root.innerHTML = ""; root.appendChild(wrap);
  };
  draw();
}

/* 컬럼 최우수값 하이라이트용 헬퍼 */
function bestCls(key, best) { return (r, v) => (v === best ? "hi" : ""); }
function posNegCls() { return (r, v) => (v > 0 ? "num-pos" : v < 0 ? "num-neg" : "dim"); }

/* ═══════════════════ 차트 ═══════════════════ */

/* 발산형 가로 막대 (득실차 등): 0 기준 좌우 */
function divergingBars(container, teams, key, opts = {}) {
  const root = $(container); root.innerHTML = "";
  const data = [...teams].sort((a, b) => b[key] - a[key]);
  const W = 640, rowH = 20, padL = 52, padR = 52, padT = 18, padB = 8;
  const H = padT + padB + data.length * rowH;
  const max = Math.max(...data.map(d => Math.abs(d[key])));
  const half = (W - padL - padR) / 2, cx = padL + half;
  const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}` });
  // 눈금
  const step = opts.step || 50;
  for (let v = -Math.floor(max / step) * step; v <= max; v += step) {
    const x = cx + v / max * half;
    svg.appendChild(svgEl("line", { x1: x, x2: x, y1: padT - 4, y2: H - padB, class: v === 0 ? "axis-line" : "grid-line" }));
    svg.appendChild(svgEl("text", { x, y: padT - 7, "text-anchor": "middle", class: "axis-text" }, (v > 0 ? "+" : "") + v));
  }
  data.forEach((d, i) => {
    const v = d[key], y = padT + i * rowH + 3, h = rowH - 6;
    const len = Math.abs(v) / max * half;
    const x = v >= 0 ? cx + 1 : cx - len - 1;
    const g = svgEl("g");
    const rect = svgEl("rect", { x, y, width: Math.max(len, 1), height: h, rx: 3, fill: v >= 0 ? "var(--pos)" : "var(--neg)", class: "mark" });
    g.appendChild(rect);
    g.appendChild(svgEl("text", { x: v >= 0 ? cx - 6 : cx + 6, y: y + h / 2 + 4, "text-anchor": v >= 0 ? "end" : "start", class: "label" }, d.abbr));
    g.appendChild(svgEl("text", { x: v >= 0 ? x + len + 5 : x - 5, y: y + h / 2 + 4, "text-anchor": v >= 0 ? "start" : "end", class: "val" }, F.signed(v)));
    const hit = svgEl("rect", { x: padL, y: y - 2, width: W - padL - padR, height: rowH, class: "hit" });
    bindTip(hit, () => teamTip(d, opts.tip ? opts.tip(d) : [["득실차", F.signed(v)]]));
    g.appendChild(hit);
    svg.appendChild(g);
  });
  root.appendChild(svg);
}

/* 단일 지표 가로 막대 (팀 컬러) */
function hbars(container, teams, key, opts = {}) {
  const root = $(container); root.innerHTML = "";
  const data = [...teams].sort((a, b) => opts.asc ? a[key] - b[key] : b[key] - a[key]);
  const W = 640, rowH = 20, padL = 46, padR = 54, padT = 6, padB = 4;
  const H = padT + padB + data.length * rowH;
  const vals = data.map(d => d[key]);
  const min = opts.min ?? 0, max = opts.max ?? Math.max(...vals);
  const fmt = typeof opts.fmt === "function" ? opts.fmt : F[opts.fmt || "int"];
  const avg = mean(teams, key);
  const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}` });
  const x0 = padL, span = W - padL - padR;
  const sx = v => x0 + (v - min) / (max - min) * span;
  data.forEach((d, i) => {
    const v = d[key], y = padT + i * rowH + 3, h = rowH - 6;
    const g = svgEl("g");
    g.appendChild(svgEl("rect", { x: x0, y, width: Math.max(sx(v) - x0, 1), height: h, rx: 3, fill: d.color, class: "mark" }));
    g.appendChild(svgEl("text", { x: x0 - 6, y: y + h / 2 + 4, "text-anchor": "end", class: "label" }, d.abbr));
    g.appendChild(svgEl("text", { x: sx(v) + 5, y: y + h / 2 + 4, class: "val" }, fmt(v)));
    const hit = svgEl("rect", { x: 0, y: y - 2, width: W, height: rowH, class: "hit" });
    bindTip(hit, () => teamTip(d, opts.tip ? opts.tip(d) : [[opts.label || key, fmt(v)]]));
    g.appendChild(hit);
    svg.appendChild(g);
  });
  // 리그 평균선
  const ax = sx(avg);
  svg.appendChild(svgEl("line", { x1: ax, x2: ax, y1: padT - 2, y2: H - padB, stroke: "var(--ink-3)", "stroke-width": 1.2, "stroke-dasharray": "3 3" }));
  svg.appendChild(svgEl("text", { x: ax, y: H + 10, "text-anchor": "middle", class: "axis-text" }, `MLB 평균 ${fmt(avg)}`));
  svg.setAttribute("viewBox", `0 0 ${W} ${H + 14}`);
  root.appendChild(svg);
}

/* 산점도: 경기당 득점 vs 경기당 실점 (4분면) */
function scatterRunProfile(container, teams) {
  const root = $(container); root.innerHTML = "";
  const W = 640, H = 420, padL = 46, padR = 16, padT = 16, padB = 40;
  const xs = teams.map(t => t.rpg), ys = teams.map(t => t.rapg);
  const xmin = Math.min(...xs) - .15, xmax = Math.max(...xs) + .15;
  const ymin = Math.min(...ys) - .15, ymax = Math.max(...ys) + .15;
  const sx = v => padL + (v - xmin) / (xmax - xmin) * (W - padL - padR);
  const sy = v => padT + (ymax - v) / (ymax - ymin) * (H - padT - padB);
  const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}` });
  const ax = mean(teams, "rpg"), ay = mean(teams, "rapg");
  // 격자
  for (let v = Math.ceil(xmin * 2) / 2; v <= xmax; v += .5) {
    svg.appendChild(svgEl("line", { x1: sx(v), x2: sx(v), y1: padT, y2: H - padB, class: "grid-line" }));
    svg.appendChild(svgEl("text", { x: sx(v), y: H - padB + 14, "text-anchor": "middle", class: "axis-text" }, v.toFixed(1)));
  }
  for (let v = Math.ceil(ymin * 2) / 2; v <= ymax; v += .5) {
    svg.appendChild(svgEl("line", { x1: padL, x2: W - padR, y1: sy(v), y2: sy(v), class: "grid-line" }));
    svg.appendChild(svgEl("text", { x: padL - 6, y: sy(v) + 3.5, "text-anchor": "end", class: "axis-text" }, v.toFixed(1)));
  }
  // 평균선 (4분면)
  svg.appendChild(svgEl("line", { x1: sx(ax), x2: sx(ax), y1: padT, y2: H - padB, stroke: "var(--ink-3)", "stroke-dasharray": "4 3" }));
  svg.appendChild(svgEl("line", { x1: padL, x2: W - padR, y1: sy(ay), y2: sy(ay), stroke: "var(--ink-3)", "stroke-dasharray": "4 3" }));
  // 사분면 라벨
  const q = (x, y, txt, anchor) => svg.appendChild(svgEl("text", { x, y, "text-anchor": anchor, class: "axis-text", "font-weight": 800, "font-size": 11 }, txt));
  q(W - padR - 4, padT + 12, "강타선 · 약투수", "end");
  q(padL + 6, padT + 12, "약타선 · 약투수", "start");
  q(W - padR - 4, H - padB - 6, "강타선 · 강투수 ▶ 우승후보", "end");
  q(padL + 6, H - padB - 6, "약타선 · 강투수", "start");
  svg.appendChild(svgEl("text", { x: (padL + W - padR) / 2, y: H - 6, "text-anchor": "middle", class: "axis-text" }, "경기당 득점 (RS/G) →"));
  svg.appendChild(svgEl("text", { x: 12, y: (padT + H - padB) / 2, "text-anchor": "middle", class: "axis-text", transform: `rotate(-90 12 ${(padT + H - padB) / 2})` }, "← 경기당 실점 (RA/G)  (아래일수록 우수)"));
  // 점
  teams.forEach(t => {
    const g = svgEl("g");
    const cx = sx(t.rpg), cy = sy(t.rapg);
    g.appendChild(svgEl("circle", { cx, cy, r: 9, fill: t.color, stroke: "#fff", "stroke-width": 2, class: "mark" }));
    g.appendChild(svgEl("text", { x: cx, y: cy - 12, "text-anchor": "middle", class: "label", "font-size": 9.5 }, t.abbr));
    const hit = svgEl("circle", { cx, cy, r: 14, class: "hit" });
    bindTip(hit, () => teamTip(t, [["성적", `${t.w}-${t.l} (${F.pct(t.pct)})`], ["경기당 득점", t.rpg.toFixed(2)], ["경기당 실점", t.rapg.toFixed(2)], ["득실차", F.signed(t.rd)]]));
    g.appendChild(hit);
    svg.appendChild(g);
  });
  root.appendChild(svg);
}

/* 덤벨 차트: 실제 승률 vs 피타고리안 기대승률 */
function dumbbellPyth(container, teams) {
  const root = $(container); root.innerHTML = "";
  const data = [...teams].sort((a, b) => b.pct - a.pct);
  const W = 640, rowH = 20, padL = 46, padR = 60, padT = 22, padB = 6;
  const H = padT + padB + data.length * rowH;
  const min = .34, max = .66;
  const sx = v => padL + (v - min) / (max - min) * (W - padL - padR);
  const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}` });
  for (let v = .35; v <= .65; v += .05) {
    svg.appendChild(svgEl("line", { x1: sx(v), x2: sx(v), y1: padT - 4, y2: H - padB, class: v.toFixed(2) === "0.50" ? "axis-line" : "grid-line" }));
    svg.appendChild(svgEl("text", { x: sx(v), y: padT - 8, "text-anchor": "middle", class: "axis-text" }, F.pct(v)));
  }
  data.forEach((t, i) => {
    const y = padT + i * rowH + rowH / 2;
    const x1 = sx(t.pct), x2 = sx(t.pyth);
    const g = svgEl("g");
    g.appendChild(svgEl("line", { x1, x2, y1: y, y2: y, stroke: t.pct >= t.pyth ? "var(--c-blue)" : "var(--c-red)", "stroke-width": 3, "stroke-linecap": "round", opacity: .5 }));
    g.appendChild(svgEl("circle", { cx: x2, cy: y, r: 5, fill: "#fff", stroke: "var(--c-gold)", "stroke-width": 2.5 }));
    g.appendChild(svgEl("circle", { cx: x1, cy: y, r: 5.5, fill: "var(--navy)", stroke: "#fff", "stroke-width": 1.5 }));
    g.appendChild(svgEl("text", { x: padL - 6, y: y + 4, "text-anchor": "end", class: "label" }, t.abbr));
    g.appendChild(svgEl("text", { x: Math.max(x1, x2) + 9, y: y + 4, class: "val", fill: t.pythDiff > 0 ? "var(--good)" : t.pythDiff < 0 ? "var(--bad)" : "var(--ink-3)" }, (t.pythDiff > 0 ? "+" : "") + t.pythDiff + "승"));
    const hit = svgEl("rect", { x: 0, y: y - rowH / 2, width: W, height: rowH, class: "hit" });
    bindTip(hit, () => teamTip(t, [["실제 승률", `${F.pct(t.pct)} (${t.w}-${t.l})`], ["기대 승률", `${F.pct(t.pyth)} (${t.pythW}-${t.g - t.pythW})`], ["승운(실제−기대)", (t.pythDiff > 0 ? "+" : "") + t.pythDiff + "승"]]));
    g.appendChild(hit);
    svg.appendChild(g);
  });
  root.appendChild(svg);
}

/* 와일드카드 레이스 바: 3번째 WC 팀 대비 게임차 */
function wcRaceBars(container, teams) {
  const root = $(container); root.innerHTML = "";
  const data = [...teams].sort((a, b) => a.wcgb - b.wcgb);
  const W = 640, rowH = 24, padL = 46, padR = 60, padT = 18, padB = 6;
  const H = padT + padB + data.length * rowH;
  const max = Math.max(...data.map(d => Math.abs(d.wcgb)), 1);
  const half = (W - padL - padR) / 2, cx = padL + half;
  const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}` });
  svg.appendChild(svgEl("line", { x1: cx, x2: cx, y1: padT - 4, y2: H - padB, class: "axis-line" }));
  svg.appendChild(svgEl("text", { x: cx, y: padT - 7, "text-anchor": "middle", class: "axis-text" }, "WC 컷라인"));
  data.forEach((d, i) => {
    const v = -d.wcgb; // 양수 = 컷라인 위
    const y = padT + i * rowH + 4, h = rowH - 8;
    const len = Math.abs(v) / max * half;
    const x = v >= 0 ? cx + 1 : cx - len - 1;
    const g = svgEl("g");
    g.appendChild(svgEl("rect", { x, y, width: Math.max(len, 2), height: h, rx: 3, fill: d.color, class: "mark", opacity: d.wcElim ? .35 : 1 }));
    g.appendChild(svgEl("text", { x: v >= 0 ? cx - 6 : cx + 6, y: y + h / 2 + 4, "text-anchor": v >= 0 ? "end" : "start", class: "label" }, d.abbr));
    g.appendChild(svgEl("text", { x: v >= 0 ? x + len + 5 : x - 5, y: y + h / 2 + 4, "text-anchor": v >= 0 ? "start" : "end", class: "val" }, v === 0 ? "컷라인" : (v > 0 ? "+" : "−") + Math.abs(v) + " G"));
    const hit = svgEl("rect", { x: 0, y: y - 4, width: W, height: rowH, class: "hit" });
    bindTip(hit, () => teamTip(d, [["성적", `${d.w}-${d.l}`], ["WC 순위", d.wcRank + "위"], ["컷라인 대비", F.wcgb(d.wcgb)], ["잔여 경기", d.rem]]));
    g.appendChild(hit);
    svg.appendChild(g);
  });
  root.appendChild(svg);
}

/* ═══════════════════ 탭별 렌더 ═══════════════════ */

const DIV_KO = { East: "동부", Central: "중부", West: "서부" };
const LG_KO = { AL: "아메리칸리그", NL: "내셔널리그" };

function renderTicker() {
  const root = $("#ticker"); root.innerHTML = "";
  ["AL", "NL"].forEach(lg => {
    const leaders = MLB_TEAMS.filter(t => t.league === lg && t.divRank === 1).sort((a, b) => b.pct - a.pct);
    const wc = MLB_TEAMS.filter(t => t.league === lg && t.wcRank && t.wcRank <= 3).sort((a, b) => a.wcRank - b.wcRank);
    const g = el("div", "ticker-group");
    g.innerHTML = `<span class="league-tag ${lg}">${lg}</span><span class="ticker-label">지구 선두</span>` +
      leaders.map(t => `<span class="chip"><span class="sq" style="background:${t.color}"></span>${t.abbr}<span class="rec">${t.w}-${t.l}</span></span>`).join("") +
      `<span class="ticker-label" style="margin-left:6px">와일드카드</span>` +
      wc.map(t => `<span class="chip"><span class="sq" style="background:${t.color}"></span>${t.abbr}<span class="rec">${t.w}-${t.l}</span></span>`).join("");
    root.appendChild(g);
  });
}

const STANDING_COLS = [
  { key: "name", label: "팀", left: true, sortable: false, render: r => teamCell(r) + clinchBadge(r) },
  { key: "w", label: "승" }, { key: "l", label: "패", asc: true },
  { key: "pct", label: "승률", fmt: "pct", cls: r => r.divRank === 1 ? "hi" : "" },
  { key: "gb", label: "GB", fmt: "gb", asc: true, cls: () => "dim" },
  { key: "wcgb", label: "WCGB", fmt: "wcgb", asc: true, cls: () => "dim", title: "3번째 와일드카드 대비 게임차" },
  { key: "l10", label: "최근10", sortable: false, render: r => l10Dots(r.l10) },
  { key: "streak", label: "연속", sortable: false, render: r => streakPill(r.streak) },
  { key: "r", label: "득점" }, { key: "ra", label: "실점", asc: true },
  { key: "rd", label: "득실", fmt: "signed", cls: posNegCls() },
  { key: "rem", label: "잔여", cls: () => "dim" },
];

function renderStandings() {
  const root = $("#standings-grid"); root.innerHTML = "";
  ["AL", "NL"].forEach(lg => {
    ["East", "Central", "West"].forEach(div => {
      const teams = MLB_TEAMS.filter(t => t.league === lg && t.division === div).sort((a, b) => a.divRank - b.divRank);
      const lead = teams[0];
      const p = el("div", "panel");
      p.innerHTML = `<div class="panel-head league-${lg}"><h3><span class="league-tag ${lg}">${lg}</span> &nbsp;${LG_KO[lg]} ${DIV_KO[div]}</h3>
        <span class="sub">선두 ${lead.abbr} · 매직넘버 <b>${lead.magic}</b></span></div><div class="panel-body flush"></div>`;
      renderTable(p.querySelector(".panel-body"), STANDING_COLS, teams, { rowCls: r => r.divRank === 1 ? "leader" : "" });
      root.appendChild(p);
    });
  });
  divergingBars("#chart-rd", MLB_TEAMS, "rd", { step: 50, tip: d => [["성적", `${d.w}-${d.l}`], ["득점", d.r], ["실점", d.ra], ["득실차", F.signed(d.rd)]] });
  scatterRunProfile("#chart-scatter", MLB_TEAMS);
}

function renderWildcard() {
  const root = $("#wc-grid"); root.innerHTML = "";
  ["AL", "NL"].forEach(lg => {
    const teams = MLB_TEAMS.filter(t => t.league === lg && t.divRank > 1).sort((a, b) => a.wcRank - b.wcRank);
    const p = el("div", "panel");
    p.innerHTML = `<div class="panel-head league-${lg}"><h3><span class="league-tag ${lg}">${lg}</span> &nbsp;${LG_KO[lg]} 와일드카드</h3><span class="sub">상위 3팀 진출 · 노란 배경 = 현재 진출권</span></div>
      <div class="panel-body flush tbl"></div><div class="panel-body"><div class="chart" id="wc-chart-${lg}"></div></div>`;
    const cols = [
      { key: "wcRank", label: "WC", cls: () => "dim" },
      { key: "name", label: "팀", left: true, sortable: false, render: r => teamCell(r, false) + (r.wcElim ? `<span class="badge e">e</span>` : "") },
      { key: "w", label: "승" }, { key: "l", label: "패", asc: true },
      { key: "pct", label: "승률", fmt: "pct" },
      { key: "wcgb", label: "WCGB", fmt: "wcgb", asc: true, cls: (r, v) => v < 0 ? "num-pos" : v > 0 ? "num-neg" : "hi" },
      { key: "l10", label: "최근10", sortable: false, render: r => r.l10 },
      { key: "streak", label: "연속", sortable: false, render: r => streakPill(r.streak) },
      { key: "rd", label: "득실", fmt: "signed", cls: posNegCls() },
      { key: "rem", label: "잔여", cls: () => "dim" },
    ];
    renderTable(p.querySelector(".tbl"), cols, teams, { rowCls: r => r.wcRank <= 3 ? "wc" : "" });
    root.appendChild(p);
    wcRaceBars(`#wc-chart-${lg}`, teams);
  });
}

function leagueTiles(container, specs) {
  const root = $(container); root.innerHTML = "";
  specs.forEach(s => {
    const best = [...MLB_TEAMS].sort((a, b) => s.asc ? a[s.key] - b[s.key] : b[s.key] - a[s.key])[0];
    const fmt = F[s.fmt || "int"];
    const t = el("div", "tile");
    t.style.setProperty("--tile-color", best.color);
    t.innerHTML = `<div class="tile-label">${s.label} 1위</div><div class="tile-value">${fmt(best[s.key])}</div>
      <div class="tile-team">${abbrTag(best.abbr, "mini-ab")} ${best.name}</div><div class="tile-sub">MLB 평균 ${fmt(mean(MLB_TEAMS, s.key))}</div>`;
    root.appendChild(t);
  });
}

function renderBatting() {
  leagueTiles("#bat-tiles", [
    { key: "avg", label: "타율", fmt: "avg" }, { key: "obp", label: "출루율", fmt: "avg" }, { key: "slg", label: "장타율", fmt: "avg" },
    { key: "ops", label: "OPS", fmt: "avg" }, { key: "hr", label: "홈런" }, { key: "r", label: "득점" },
  ]);
  const max = k => Math.max(...MLB_TEAMS.map(t => t[k]));
  const cols = [
    { key: "name", label: "팀", left: true, sortable: false, render: r => teamCell(r, false) },
    { key: "league", label: "리그", sortable: false, render: r => `<span class="league-tag ${r.league}">${r.league}</span>` },
    { key: "g", label: "G", cls: () => "dim" },
    { key: "avg", label: "AVG", fmt: "avg", cls: bestCls("avg", max("avg")) },
    { key: "obp", label: "OBP", fmt: "avg", cls: bestCls("obp", max("obp")) },
    { key: "slg", label: "SLG", fmt: "avg", cls: bestCls("slg", max("slg")) },
    { key: "ops", label: "OPS", fmt: "avg", cls: bestCls("ops", max("ops")), render: (r, v) => cellBar(v - .6, .2, r.color, F.avg(v)) },
    { key: "hr", label: "HR", cls: bestCls("hr", max("hr")), render: (r, v) => cellBar(v, max("hr"), r.color, v) },
    { key: "r", label: "R", cls: bestCls("r", max("r")) },
    { key: "rpg", label: "R/G", fmt: "2" },
  ];
  renderTable("#bat-table", cols, MLB_TEAMS, { sortKey: "ops", rankCol: true });
  hbars("#chart-ops", MLB_TEAMS, "ops", { min: .66, max: .78, fmt: "avg", label: "OPS", tip: d => [["AVG", F.avg(d.avg)], ["OBP", F.avg(d.obp)], ["SLG", F.avg(d.slg)], ["OPS", F.avg(d.ops)]] });
  hbars("#chart-hr", MLB_TEAMS, "hr", { min: 120, max: 210, label: "홈런", tip: d => [["홈런", d.hr], ["득점", d.r], ["경기당 득점", d.rpg.toFixed(2)]] });
}

function renderPitching() {
  leagueTiles("#pit-tiles", [
    { key: "era", label: "평균자책점", fmt: "2", asc: true }, { key: "whip", label: "WHIP", fmt: "2", asc: true },
    { key: "so", label: "탈삼진" }, { key: "bb", label: "최소 볼넷", asc: true }, { key: "ra", label: "최소 실점", asc: true },
    { key: "kbb", label: "K/BB", fmt: "2" },
  ]);
  const min = k => Math.min(...MLB_TEAMS.map(t => t[k]));
  const max = k => Math.max(...MLB_TEAMS.map(t => t[k]));
  const cols = [
    { key: "name", label: "팀", left: true, sortable: false, render: r => teamCell(r, false) },
    { key: "league", label: "리그", sortable: false, render: r => `<span class="league-tag ${r.league}">${r.league}</span>` },
    { key: "era", label: "ERA", fmt: "2", asc: true, cls: bestCls("era", min("era")), render: (r, v) => cellBar(6 - v, 3, r.color, F["2"](v)) },
    { key: "whip", label: "WHIP", fmt: "2", asc: true, cls: bestCls("whip", min("whip")) },
    { key: "so", label: "SO", cls: bestCls("so", max("so")) },
    { key: "bb", label: "BB", asc: true, cls: bestCls("bb", min("bb")) },
    { key: "kbb", label: "K/BB", fmt: "2", cls: bestCls("kbb", max("kbb")) },
    { key: "ra", label: "실점", asc: true, cls: bestCls("ra", min("ra")) },
    { key: "er", label: "자책", asc: true },
    { key: "rapg", label: "RA/G", fmt: "2", asc: true },
  ];
  renderTable("#pit-table", cols, MLB_TEAMS, { sortKey: "era", sortAsc: true, rankCol: true });
  hbars("#chart-era", MLB_TEAMS, "era", { asc: true, min: 2.8, max: 5.6, fmt: "2", label: "ERA", tip: d => [["ERA", F["2"](d.era)], ["WHIP", F["2"](d.whip)], ["실점", d.ra]] });
  hbars("#chart-kbb", MLB_TEAMS, "kbb", { min: 1.4, max: 3.4, fmt: "2", label: "K/BB", tip: d => [["탈삼진", d.so], ["볼넷", d.bb], ["K/BB", F["2"](d.kbb)]] });
}

function renderLeaders() {
  const draw = (container, cats) => {
    const root = $(container); root.innerHTML = "";
    cats.forEach(c => {
      const fmt = F[c.fmt];
      const [n1, t1, v1] = c.rows[0];
      const card = el("div", "lb-card");
      card.innerHTML = `<div class="lb-head"><h4>${c.title}</h4><span>${c.short}</span></div>
        <div class="lb-hero"><div class="v">${fmt(v1)}</div><div class="n">${abbrTag(t1, "mini-ab")} ${n1}</div><div class="t">${byAbbr[t1] ? byAbbr[t1].name : t1}</div></div>
        <ol class="lb-list">${c.rows.slice(1).map(([n, t, v], i) => `<li><span class="r">${i + 2}</span><span class="n">${abbrTag(t, "mini-ab")} ${n}</span><span class="v">${fmt(v)}</span></li>`).join("")}</ol>`;
      root.appendChild(card);
    });
  };
  draw("#lb-bat", LEADERS.batting);
  draw("#lb-pit", LEADERS.pitching);
}

function renderAdvanced() {
  // 파워랭킹: 승률·득실차·OPS·ERA 순위 합산 (낮을수록 좋음) → 100점 환산
  const rank = (key, asc) => {
    const s = [...MLB_TEAMS].sort((a, b) => asc ? a[key] - b[key] : b[key] - a[key]);
    const m = {}; s.forEach((t, i) => m[t.abbr] = i + 1); return m;
  };
  MLB_TEAMS.forEach(t => { t.l10w = parseInt(t.l10.split("-")[0]); });
  const rp = rank("pct"), rr = rank("rd"), ro = rank("ops"), re = rank("era", true), rl2 = rank("l10w");
  MLB_TEAMS.forEach(t => {
    const sum = rp[t.abbr] * 2 + rr[t.abbr] * 2 + ro[t.abbr] + re[t.abbr] + rl2[t.abbr];
    t.power = Math.round(100 - (sum - 7) / (30 * 7 - 7) * 100);
  });
  const pr = [...MLB_TEAMS].sort((a, b) => b.power - a.power);
  const root = $("#power-list"); root.innerHTML = "";
  pr.forEach((t, i) => {
    const d = el("div", "pr-item" + (i < 3 ? " top" : ""));
    d.innerHTML = `<div class="rk">${i + 1}</div><div>${teamCell(t, false)}<div class="meta">${t.w}-${t.l} · 득실 ${F.signed(t.rd)} · OPS ${F.avg(t.ops)} · ERA ${F["2"](t.era)} · 최근10 ${t.l10}</div></div>
      <div class="score">${t.power}<small>POWER</small></div>`;
    root.appendChild(d);
  });

  dumbbellPyth("#chart-pyth", MLB_TEAMS);
  const cols = [
    { key: "name", label: "팀", left: true, sortable: false, render: r => teamCell(r, false) },
    { key: "w", label: "승" }, { key: "l", label: "패", asc: true },
    { key: "pct", label: "실제 승률", fmt: "pct" },
    { key: "pyth", label: "기대 승률", fmt: "pct", title: "피타고리안: RS² / (RS² + RA²)" },
    { key: "pythW", label: "기대 승수" },
    { key: "pythDiff", label: "승운", fmt: "signed", cls: posNegCls(), title: "실제 승수 − 기대 승수" },
    { key: "rd", label: "득실차", fmt: "signed", cls: posNegCls() },
    { key: "rpg", label: "RS/G", fmt: "2" }, { key: "rapg", label: "RA/G", fmt: "2", asc: true },
    { key: "projW", label: "162G 환산승", title: "현재 승률 × 162" },
    { key: "power", label: "POWER" },
  ];
  renderTable("#adv-table", cols, MLB_TEAMS, { sortKey: "rd", rankCol: true });

  // 리그 비교 타일
  const lgStat = (lg, key) => mean(MLB_TEAMS.filter(t => t.league === lg), key);
  const root2 = $("#lg-compare"); root2.innerHTML = "";
  [["avg", "타율", "avg"], ["ops", "OPS", "avg"], ["hr", "팀 평균 홈런", "1"], ["rpg", "경기당 득점", "2"], ["era", "ERA", "2"], ["whip", "WHIP", "2"]].forEach(([k, label, f]) => {
    const a = lgStat("AL", k), n = lgStat("NL", k);
    const better = ["era", "whip"].includes(k) ? (a < n ? "AL" : "NL") : (a > n ? "AL" : "NL");
    const t = el("div", "tile");
    t.style.setProperty("--tile-color", better === "AL" ? "var(--red)" : "var(--c-blue)");
    t.innerHTML = `<div class="tile-label">${label}</div>
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:4px">
        <div><span class="league-tag AL">AL</span> <b style="font-size:18px">${F[f](a)}</b></div>
        <div><span class="league-tag NL">NL</span> <b style="font-size:18px">${F[f](n)}</b></div></div>
      <div class="tile-sub">우위: <b>${better}</b></div>`;
    root2.appendChild(t);
  });
}

/* ═══════════════════ 탭 & 초기화 ═══════════════════ */
function initTabs() {
  const buttons = document.querySelectorAll("nav.tabs button");
  const show = id => {
    buttons.forEach(b => b.classList.toggle("active", b.dataset.tab === id));
    document.querySelectorAll("section.tab").forEach(s => s.classList.toggle("active", s.id === id));
    history.replaceState(null, "", "#" + id);
    window.scrollTo({ top: 0 });
  };
  buttons.forEach(b => b.addEventListener("click", () => show(b.dataset.tab)));
  const initial = location.hash.slice(1);
  show(document.getElementById(initial) && initial ? initial : "standings");
}

document.addEventListener("DOMContentLoaded", () => {
  $("#snapshot-date").textContent = SNAPSHOT_DATE;
  document.querySelectorAll(".source-note").forEach(n => n.textContent = DATA_SOURCE_NOTE);
  renderTicker();
  renderStandings();
  renderWildcard();
  renderBatting();
  renderPitching();
  renderLeaders();
  renderAdvanced();
  initTabs();
});
