/* ═══════════════════ 도넛/파이 차트 ═══════════════════ */
/* slices: [{label, value, color, abbr?}] */
function donut(container, slices, opts = {}) {
  const root = typeof container === "string" ? $(container) : container; root.innerHTML = "";
  const size = opts.size || 180, r = size / 2 - 4, ir = opts.inner ?? r * .58, cx = size / 2, cy = size / 2;
  const total = slices.reduce((s, d) => s + d.value, 0);
  const svg = svgEl("svg", { viewBox: `0 0 ${size} ${size}`, style: `max-width:${size}px;margin:0 auto` });
  let a0 = -Math.PI / 2;
  const fmt = opts.fmt || (v => v);
  slices.forEach(d => {
    const a1 = a0 + d.value / total * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const p = (a, rr) => [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
    const [x0, y0] = p(a0, r), [x1, y1] = p(a1, r), [x2, y2] = p(a1, ir), [x3, y3] = p(a0, ir);
    const path = svgEl("path", {
      d: `M${x0},${y0} A${r},${r} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${ir},${ir} 0 ${large} 0 ${x3},${y3} Z`,
      fill: d.color, class: "arc",
    });
    const pct = d.value / total * 100;
    bindTip(path, () => `<b>${d.label}</b><div class="row"><span>${opts.valueLabel || "값"}</span><span>${fmt(d.value)}</span></div><div class="row"><span>비중</span><span>${pct.toFixed(1)}%</span></div>`);
    svg.appendChild(path);
    // 큰 조각에는 직접 라벨
    if (pct >= (opts.labelMin ?? 8) && d.abbr) {
      const [lx, ly] = p((a0 + a1) / 2, (r + ir) / 2);
      svg.appendChild(svgEl("text", { x: lx, y: ly + 3.5, "text-anchor": "middle", fill: "#fff", "font-size": 9.5, "font-weight": 800, "font-family": "var(--mono)", "pointer-events": "none" }, d.abbr));
    }
    a0 = a1;
  });
  if (opts.center) {
    svg.appendChild(svgEl("text", { x: cx, y: cy + (opts.centerSub ? 2 : 6), "text-anchor": "middle", class: "donut-center" }, opts.center));
    if (opts.centerSub) svg.appendChild(svgEl("text", { x: cx, y: cy + 15, "text-anchor": "middle", class: "donut-center-sub" }, opts.centerSub));
  }
  root.appendChild(svg);
  if (opts.legend) {
    const lg = el("div", "pie-legend");
    lg.innerHTML = slices.map(d => `<div><span class="sw" style="background:${d.color}"></span>${d.label}<b>${fmt(d.value)} · ${(d.value / total * 100).toFixed(1)}%</b></div>`).join("");
    root.appendChild(lg);
  }
}

/* 리그별 점유율 도넛 (상위 N팀 + 기타) */
function shareDonuts(container, key, opts = {}) {
  const root = $(container); root.innerHTML = "";
  ["AL", "NL"].forEach(lg => {
    const teams = MLB_TEAMS.filter(t => t.league === lg).sort((a, b) => b[key] - a[key]);
    const top = teams.slice(0, opts.top || 8), rest = teams.slice(opts.top || 8);
    const slices = top.map(t => ({ label: t.name, abbr: t.abbr, value: t[key], color: t.color }));
    if (rest.length) slices.push({ label: `기타 ${rest.length}팀`, abbr: "기타", value: rest.reduce((s, t) => s + t[key], 0), color: "var(--c-neutral)" });
    const box = el("div", "donut");
    box.innerHTML = `<div class="cap"><span class="league-tag ${lg}">${lg}</span>${opts.title || key}</div>`;
    const ch = el("div", "chart");
    box.appendChild(ch);
    donut(ch, slices, { size: 230, center: String(teams.reduce((s, t) => s + t[key], 0)), centerSub: `${lg} 합계`, legend: true, valueLabel: opts.title });
    root.appendChild(box);
  });
}

/* ═══════════════════ 팀 비교 (레이더 + 도넛) ═══════════════════ */
const RADAR_AXES = [
  { key: "avg", label: "타율", fmt: "avg" },
  { key: "ops", label: "OPS", fmt: "avg" },
  { key: "hr", label: "홈런", fmt: "int" },
  { key: "rd", label: "득실차", fmt: "signed" },
  { key: "era", label: "ERA", fmt: "2", invert: true },
  { key: "whip", label: "WHIP", fmt: "2", invert: true },
];
const COMPARE_MAX = 6;
let compareSel = ["MIL", "LAD", "TB", "NYY"];

/* 0~100 정규화 (30팀 min-max, 낮을수록 좋은 지표는 반전) */
function normScore(t, ax) {
  const vals = MLB_TEAMS.map(x => x[ax.key]);
  const min = Math.min(...vals), max = Math.max(...vals);
  const s = (t[ax.key] - min) / (max - min || 1) * 100;
  return ax.invert ? 100 - s : s;
}

function radarChart(container, teams) {
  const root = $(container); root.innerHTML = "";
  const size = 460, cx = size / 2, cy = size / 2 + 6, R = 160, n = RADAR_AXES.length;
  const ang = i => -Math.PI / 2 + i * Math.PI * 2 / n;
  const pt = (i, v) => [cx + R * v / 100 * Math.cos(ang(i)), cy + R * v / 100 * Math.sin(ang(i))];
  const svg = svgEl("svg", { viewBox: `0 0 ${size} ${size}`, style: "max-width:520px;margin:0 auto" });
  // 육각 격자
  [20, 40, 60, 80, 100].forEach(lv => {
    const pts = RADAR_AXES.map((_, i) => pt(i, lv).join(",")).join(" ");
    svg.appendChild(svgEl("polygon", { points: pts, class: "radar-grid" }));
    svg.appendChild(svgEl("text", { x: cx + 4, y: cy - R * lv / 100 - 2, class: "radar-sub" }, lv));
  });
  RADAR_AXES.forEach((ax, i) => {
    const [x, y] = pt(i, 100);
    svg.appendChild(svgEl("line", { x1: cx, y1: cy, x2: x, y2: y, class: "radar-axis" }));
    const [lx, ly] = pt(i, 122);
    const anchor = Math.abs(lx - cx) < 8 ? "middle" : lx > cx ? "start" : "end";
    svg.appendChild(svgEl("text", { x: lx, y: ly + 4, "text-anchor": anchor, class: "radar-lbl" }, ax.label));
    svg.appendChild(svgEl("text", { x: lx, y: ly + 16, "text-anchor": anchor, class: "radar-sub" }, ax.invert ? "낮을수록 우수 (반전)" : "높을수록 우수"));
  });
  // 팀 폴리곤
  teams.forEach(t => {
    const scores = RADAR_AXES.map(ax => normScore(t, ax));
    const pts = scores.map((v, i) => pt(i, v).join(",")).join(" ");
    const poly = svgEl("polygon", { points: pts, fill: t.color, stroke: t.color, class: "radar-poly" });
    bindTip(poly, () => teamTip(t, RADAR_AXES.map((ax, i) => [ax.label, `${F[ax.fmt](t[ax.key])} (${Math.round(scores[i])}점)`])));
    svg.appendChild(poly);
    scores.forEach((v, i) => {
      const [x, y] = pt(i, v);
      const c = svgEl("circle", { cx: x, cy: y, r: 4.5, fill: t.color, stroke: "#fff", "stroke-width": 1.5 });
      bindTip(c, () => teamTip(t, [[RADAR_AXES[i].label, F[RADAR_AXES[i].fmt](t[RADAR_AXES[i].key])], ["정규화 점수", Math.round(v) + " / 100"]]));
      svg.appendChild(c);
    });
  });
  root.appendChild(svg);
}

function renderCompare() {
  const sel = compareSel.map(a => byAbbr[a]).filter(Boolean);
  // 선택 버튼 상태
  document.querySelectorAll("#team-picker button").forEach(b => {
    const on = compareSel.includes(b.dataset.abbr);
    b.classList.toggle("on", on);
    b.disabled = !on && compareSel.length >= COMPARE_MAX;
  });
  $("#picker-count").textContent = `${sel.length} / ${COMPARE_MAX}팀 선택`;
  // 범례
  $("#radar-legend").innerHTML = sel.map(t => `<span class="chip-team"><span class="sw" style="background:${t.color}"></span>${t.name} <span style="color:var(--ink-3);font-weight:600">${t.w}-${t.l}</span></span>`).join("");
  radarChart("#chart-radar", sel);

  // 상세 비교표 (선택 팀이 컬럼)
  const root = $("#cmp-table"); root.innerHTML = "";
  if (!sel.length) {
    root.innerHTML = `<div class="note-box" style="margin:14px">비교할 팀을 선택하세요.</div>`;
  } else {
    const total = t => RADAR_AXES.reduce((s, ax) => s + normScore(t, ax), 0);
    const rowsDef = [
      ["성적", t => `${t.w}-${t.l}`],
      ["승률", t => F.pct(t.pct), { num: t => t.pct }],
      ["지구 순위", t => `${LG_KO[t.league]} ${DIV_KO[t.division]} ${t.divRank}위`],
      ...RADAR_AXES.map(ax => [ax.label, t => F[ax.fmt](t[ax.key]), { num: t => t[ax.key], invert: ax.invert }]),
      ["OBP", t => F.avg(t.obp), { num: t => t.obp }],
      ["SLG", t => F.avg(t.slg), { num: t => t.slg }],
      ["득점", t => t.r, { num: t => t.r }],
      ["실점", t => t.ra, { num: t => t.ra, invert: true }],
      ["탈삼진", t => t.so, { num: t => t.so }],
      ["K/BB", t => F["2"](t.kbb), { num: t => t.kbb }],
      ["최근 10경기", t => t.l10],
      ["피타고리안 승률", t => F.pct(t.pyth), { num: t => t.pyth }],
      ["종합 점수 (6축 평균)", t => Math.round(total(t) / RADAR_AXES.length) + " / 100", { num: total }],
    ];
    const table = el("table", "std cmp-table");
    table.innerHTML = `<thead><tr><th class="left">항목</th>${sel.map(t => `<th style="text-align:center">${abbrTag(t.abbr)}<div style="margin-top:4px;font-size:10px">${t.name}</div></th>`).join("")}</tr></thead><tbody></tbody>`;
    const tb = table.querySelector("tbody");
    rowsDef.forEach(([label, fn, cmp]) => {
      let bestIdx = -1;
      if (cmp && sel.length > 1) {
        const nums = sel.map(cmp.num);
        const target = (cmp.invert ? Math.min : Math.max)(...nums);
        bestIdx = nums.indexOf(target);
      }
      const tr = el("tr");
      tr.innerHTML = `<td class="left" style="font-weight:700">${label}</td>` +
        sel.map((t, i) => `<td style="text-align:center" class="${i === bestIdx ? "col-best" : ""}">${fn(t)}</td>`).join("");
      tb.appendChild(tr);
    });
    const wrap = el("div", "tbl-wrap"); wrap.appendChild(table); root.appendChild(wrap);
  }

  // 선택 팀별 승/패 도넛 + 득점/실점 도넛
  const dr = $("#cmp-donuts"); dr.innerHTML = "";
  sel.forEach(t => {
    const box = el("div", "donut");
    box.innerHTML = `<div class="cap">${abbrTag(t.abbr, "mini-ab")} ${t.name}</div>`;
    const c1 = el("div", "chart");
    donut(c1, [{ label: "승", value: t.w, color: t.color }, { label: "패", value: t.l, color: "#D9DEE7" }], { size: 150, center: F.pct(t.pct), centerSub: `${t.w}승 ${t.l}패` });
    const c2 = el("div", "chart");
    donut(c2, [{ label: "득점", value: t.r, color: "var(--pos)" }, { label: "실점", value: t.ra, color: "var(--neg)" }], { size: 150, center: F.signed(t.rd), centerSub: `득실차 (${t.r}/${t.ra})` });
    box.appendChild(c1); box.appendChild(c2);
    box.appendChild(el("div", "sub", "위: 승/패 비율 · 아래: 득점/실점 비율"));
    dr.appendChild(box);
  });
}

function initCompare() {
  const picker = $("#team-picker");
  ["AL", "NL"].forEach(lg => {
    MLB_TEAMS.filter(t => t.league === lg).sort((a, b) => a.division.localeCompare(b.division) || b.pct - a.pct).forEach(t => {
      const b = el("button", "", `<span class="sq"></span>${t.abbr}`);
      b.dataset.abbr = t.abbr; b.title = t.name; b.style.setProperty("--pc", t.color);
      b.addEventListener("click", () => {
        if (compareSel.includes(t.abbr)) compareSel = compareSel.filter(a => a !== t.abbr);
        else if (compareSel.length < COMPARE_MAX) compareSel.push(t.abbr);
        renderCompare();
      });
      picker.appendChild(b);
    });
  });
  const presets = {
    "지구 선두 6팀": MLB_TEAMS.filter(t => t.divRank === 1).map(t => t.abbr),
    "AL 상위 5": MLB_TEAMS.filter(t => t.league === "AL").sort((a, b) => b.pct - a.pct).slice(0, 5).map(t => t.abbr),
    "NL 상위 5": MLB_TEAMS.filter(t => t.league === "NL").sort((a, b) => b.pct - a.pct).slice(0, 5).map(t => t.abbr),
    "와일드카드 경쟁": MLB_TEAMS.filter(t => t.wcRank && t.wcRank <= 3).map(t => t.abbr),
    "초기화": [],
  };
  const pr = $("#picker-presets");
  Object.entries(presets).forEach(([label, list]) => {
    const b = el("button", "", label);
    b.addEventListener("click", () => { compareSel = list.slice(0, COMPARE_MAX); renderCompare(); });
    pr.appendChild(b);
  });
  renderCompare();
}

document.addEventListener("DOMContentLoaded", () => {
  shareDonuts("#donut-hr", "hr", { title: "홈런 점유율", top: 8 });
  shareDonuts("#donut-so", "so", { title: "탈삼진 점유율", top: 8 });
  initCompare();
});
