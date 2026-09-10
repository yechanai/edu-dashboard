// MLB 2026시즌 팀 데이터 스냅샷 (기준일: 2026-09-10)
// 출처: ESPN 순위(https://www.espn.com/mlb/standings), MLB.com 순위(https://www.mlb.com/standings),
//       CBS Sports 팀 타격/투수 스탯(https://www.cbssports.com/mlb/stats/team/team/)
// 참고: 웹 조사 시점 스냅샷이며 실시간 갱신되지 않습니다.

const MLB_TEAMS = [
  // ── American League East ──
  { name: "탬파베이 레이스", en: "Tampa Bay Rays", abbr: "TB", league: "AL", division: "East",
    w: 87, l: 58, gb: 0, streak: "W2", l10: "6-4",
    avg: .261, obp: .329, slg: .405, ops: .734, hr: 154, r: 661,
    era: 3.81, whip: 1.15, so: 1174, bb: 366, ra: 603, er: 548 },
  { name: "뉴욕 양키스", en: "New York Yankees", abbr: "NYY", league: "AL", division: "East",
    w: 83, l: 62, gb: 4, streak: "W2", l10: "7-3",
    avg: .234, obp: .312, slg: .408, ops: .720, hr: 197, r: 657,
    era: 3.21, whip: 1.16, so: 1301, bb: 434, ra: 533, er: 462 },
  { name: "보스턴 레드삭스", en: "Boston Red Sox", abbr: "BOS", league: "AL", division: "East",
    w: 80, l: 67, gb: 8, streak: "L2", l10: "6-4",
    avg: .248, obp: .322, slg: .404, ops: .726, hr: 153, r: 652,
    era: 3.63, whip: 1.24, so: 1267, bb: 422, ra: 570, er: 527 },
  { name: "토론토 블루제이스", en: "Toronto Blue Jays", abbr: "TOR", league: "AL", division: "East",
    w: 73, l: 74, gb: 15, streak: "L1", l10: "6-4",
    avg: .248, obp: .309, slg: .383, ops: .692, hr: 140, r: 589,
    era: 3.91, whip: 1.29, so: 1268, bb: 535, ra: 628, er: 567 },
  { name: "볼티모어 오리올스", en: "Baltimore Orioles", abbr: "BAL", league: "AL", division: "East",
    w: 71, l: 76, gb: 17, streak: "W1", l10: "3-7",
    avg: .234, obp: .316, slg: .394, ops: .710, hr: 176, r: 661,
    era: 4.15, whip: 1.34, so: 1182, bb: 485, ra: 688, er: 604 },

  // ── American League Central ──
  { name: "시카고 화이트삭스", en: "Chicago White Sox", abbr: "CWS", league: "AL", division: "Central",
    w: 75, l: 70, gb: 0, streak: "L2", l10: "3-7",
    avg: .236, obp: .319, slg: .407, ops: .726, hr: 190, r: 685,
    era: 4.14, whip: 1.31, so: 1200, bb: 520, ra: 644, er: 595 },
  { name: "클리블랜드 가디언스", en: "Cleveland Guardians", abbr: "CLE", league: "AL", division: "Central",
    w: 74, l: 73, gb: 2, streak: "L1", l10: "5-5",
    avg: .237, obp: .314, slg: .372, ops: .686, hr: 138, r: 598,
    era: 3.80, whip: 1.27, so: 1384, bb: 486, ra: 614, er: 552 },
  { name: "미네소타 트윈스", en: "Minnesota Twins", abbr: "MIN", league: "AL", division: "Central",
    w: 69, l: 77, gb: 6.5, streak: "L1", l10: "5-5",
    avg: .245, obp: .319, slg: .407, ops: .726, hr: 172, r: 675,
    era: 4.67, whip: 1.38, so: 1224, bb: 531, ra: 728, er: 667 },
  { name: "디트로이트 타이거스", en: "Detroit Tigers", abbr: "DET", league: "AL", division: "Central",
    w: 67, l: 79, gb: 8.5, streak: "W1", l10: "4-6",
    avg: .238, obp: .314, slg: .395, ops: .709, hr: 164, r: 641,
    era: 3.67, whip: 1.22, so: 1171, bb: 458, ra: 586, er: 527 },
  { name: "캔자스시티 로열스", en: "Kansas City Royals", abbr: "KC", league: "AL", division: "Central",
    w: 65, l: 82, gb: 11, streak: "W1", l10: "3-7",
    avg: .247, obp: .316, slg: .402, ops: .718, hr: 154, r: 629,
    era: 4.64, whip: 1.39, so: 1065, bb: 529, ra: 717, er: 669 },

  // ── American League West ──
  { name: "휴스턴 애스트로스", en: "Houston Astros", abbr: "HOU", league: "AL", division: "West",
    w: 74, l: 72, gb: 0, streak: "L1", l10: "6-4",
    avg: .241, obp: .315, slg: .410, ops: .725, hr: 192, r: 660,
    era: 4.55, whip: 1.35, so: 1282, bb: 595, ra: 701, er: 655 },
  { name: "텍사스 레인저스", en: "Texas Rangers", abbr: "TEX", league: "AL", division: "West",
    w: 72, l: 74, gb: 2, streak: "L1", l10: "6-4",
    avg: .243, obp: .318, slg: .401, ops: .719, hr: 170, r: 607,
    era: 4.29, whip: 1.31, so: 1222, bb: 444, ra: 647, er: 610 },
  { name: "시애틀 매리너스", en: "Seattle Mariners", abbr: "SEA", league: "AL", division: "West",
    w: 68, l: 78, gb: 6, streak: "W1", l10: "4-6",
    avg: .229, obp: .310, slg: .374, ops: .684, hr: 164, r: 577,
    era: 4.22, whip: 1.25, so: 1240, bb: 384, ra: 652, er: 605 },
  { name: "애슬레틱스", en: "Athletics", abbr: "ATH", league: "AL", division: "West",
    w: 59, l: 88, gb: 15.5, streak: "W1", l10: "6-4",
    avg: .245, obp: .318, slg: .403, ops: .721, hr: 178, r: 641,
    era: 5.35, whip: 1.49, so: 1239, bb: 577, ra: 828, er: 773 },
  { name: "LA 에인절스", en: "Los Angeles Angels", abbr: "LAA", league: "AL", division: "West",
    w: 56, l: 90, gb: 18, streak: "W2", l10: "4-6",
    avg: .235, obp: .309, slg: .373, ops: .682, hr: 141, r: 591,
    era: 4.20, whip: 1.34, so: 1304, bb: 587, ra: 664, er: 601 },

  // ── National League East ──
  { name: "애틀랜타 브레이브스", en: "Atlanta Braves", abbr: "ATL", league: "NL", division: "East",
    w: 85, l: 61, gb: 0, streak: "L3", l10: "4-6",
    avg: .246, obp: .309, slg: .409, ops: .718, hr: 183, r: 668,
    era: 3.59, whip: 1.25, so: 1234, bb: 489, ra: 560, er: 517 },
  { name: "필라델피아 필리스", en: "Philadelphia Phillies", abbr: "PHI", league: "NL", division: "East",
    w: 82, l: 64, gb: 3, streak: "W1", l10: "6-4",
    avg: .243, obp: .312, slg: .401, ops: .713, hr: 173, r: 658,
    era: 4.00, whip: 1.27, so: 1427, bb: 435, ra: 620, er: 576 },
  { name: "마이애미 말린스", en: "Miami Marlins", abbr: "MIA", league: "NL", division: "East",
    w: 72, l: 75, gb: 13.5, streak: "L3", l10: "3-7",
    avg: .249, obp: .327, slg: .401, ops: .728, hr: 151, r: 654,
    era: 4.10, whip: 1.28, so: 1187, bb: 506, ra: 647, er: 588 },
  { name: "뉴욕 메츠", en: "New York Mets", abbr: "NYM", league: "NL", division: "East",
    w: 68, l: 78, gb: 17, streak: "W4", l10: "7-3",
    avg: .238, obp: .309, slg: .394, ops: .703, hr: 181, r: 627,
    era: 4.19, whip: 1.31, so: 1304, bb: 508, ra: 667, er: 606 },
  { name: "워싱턴 내셔널스", en: "Washington Nationals", abbr: "WSH", league: "NL", division: "East",
    w: 67, l: 81, gb: 19, streak: "L7", l10: "2-8",
    avg: .247, obp: .323, slg: .428, ops: .751, hr: 198, r: 756,
    era: 4.75, whip: 1.40, so: 1151, bb: 540, ra: 756, er: 692 },

  // ── National League Central ──
  { name: "밀워키 브루어스", en: "Milwaukee Brewers", abbr: "MIL", league: "NL", division: "Central",
    w: 91, l: 56, gb: 0, streak: "W3", l10: "6-4",
    avg: .257, obp: .339, slg: .400, ops: .739, hr: 137, r: 742,
    era: 3.54, whip: 1.19, so: 1406, bb: 475, ra: 570, er: 517 },
  { name: "시카고 컵스", en: "Chicago Cubs", abbr: "CHC", league: "NL", division: "Central",
    w: 81, l: 66, gb: 10, streak: "L4", l10: "4-6",
    avg: .251, obp: .339, slg: .429, ops: .768, hr: 203, r: 780,
    era: 4.22, whip: 1.27, so: 1142, bb: 449, ra: 652, er: 615 },
  { name: "피츠버그 파이리츠", en: "Pittsburgh Pirates", abbr: "PIT", league: "NL", division: "Central",
    w: 73, l: 73, gb: 17.5, streak: "W3", l10: "8-2",
    avg: .254, obp: .331, slg: .403, ops: .734, hr: 167, r: 707,
    era: 4.15, whip: 1.30, so: 1346, bb: 530, ra: 673, er: 602 },
  { name: "세인트루이스 카디널스", en: "St. Louis Cardinals", abbr: "STL", league: "NL", division: "Central",
    w: 72, l: 75, gb: 19, streak: "L3", l10: "4-6",
    avg: .243, obp: .317, slg: .385, ops: .702, hr: 156, r: 668,
    era: 4.31, whip: 1.35, so: 1160, bb: 501, ra: 680, er: 627 },
  { name: "신시내티 레즈", en: "Cincinnati Reds", abbr: "CIN", league: "NL", division: "Central",
    w: 69, l: 77, gb: 21.5, streak: "L3", l10: "5-5",
    avg: .230, obp: .308, slg: .397, ops: .705, hr: 196, r: 611,
    era: 4.73, whip: 1.43, so: 1186, bb: 602, ra: 733, er: 680 },

  // ── National League West ──
  { name: "LA 다저스", en: "Los Angeles Dodgers", abbr: "LAD", league: "NL", division: "West",
    w: 89, l: 57, gb: 0, streak: "W7", l10: "8-2",
    avg: .257, obp: .337, slg: .422, ops: .759, hr: 180, r: 728,
    era: 3.67, whip: 1.16, so: 1348, bb: 447, ra: 559, er: 528 },
  { name: "샌디에이고 파드리스", en: "San Diego Padres", abbr: "SD", league: "NL", division: "West",
    w: 78, l: 68, gb: 11, streak: "W4", l10: "6-4",
    avg: .238, obp: .315, slg: .388, ops: .703, hr: 161, r: 619,
    era: 3.88, whip: 1.28, so: 1189, bb: 493, ra: 602, er: 558 },
  { name: "애리조나 다이아몬드백스", en: "Arizona Diamondbacks", abbr: "ARI", league: "NL", division: "West",
    w: 78, l: 69, gb: 11.5, streak: "L1", l10: "5-5",
    avg: .242, obp: .314, slg: .393, ops: .707, hr: 143, r: 648,
    era: 4.10, whip: 1.28, so: 1012, bb: 441, ra: 649, er: 595 },
  { name: "샌프란시스코 자이언츠", en: "San Francisco Giants", abbr: "SF", league: "NL", division: "West",
    w: 62, l: 85, gb: 27.5, streak: "W3", l10: "6-4",
    avg: .248, obp: .309, slg: .407, ops: .716, hr: 166, r: 617,
    era: 4.34, whip: 1.36, so: 1099, bb: 547, ra: 689, er: 626 },
  { name: "콜로라도 로키스", en: "Colorado Rockies", abbr: "COL", league: "NL", division: "West",
    w: 55, l: 90, gb: 33.5, streak: "L3", l10: "3-7",
    avg: .253, obp: .322, slg: .416, ops: .738, hr: 161, r: 683,
    era: 5.47, whip: 1.52, so: 994, bb: 477, ra: 830, er: 775 },
];

// 구단 공식 컬러 (primary / secondary)
const TEAM_COLORS = {
  TB:  ["#092C5C", "#8FBCE6"], NYY: ["#0C2340", "#C4CED3"], BOS: ["#BD3039", "#0C2340"],
  TOR: ["#134A8E", "#E8291C"], BAL: ["#DF4601", "#000000"], CWS: ["#27251F", "#C4CED4"],
  CLE: ["#00385D", "#E31937"], MIN: ["#002B5C", "#D31145"], DET: ["#0C2340", "#FA4616"],
  KC:  ["#004687", "#BD9B60"], HOU: ["#002D62", "#EB6E1F"], TEX: ["#003278", "#C0111F"],
  SEA: ["#0C2C56", "#005C5C"], ATH: ["#003831", "#EFB21E"], LAA: ["#BA0021", "#003263"],
  ATL: ["#CE1141", "#13274F"], PHI: ["#E81828", "#002D72"], MIA: ["#00A3E0", "#EF3340"],
  NYM: ["#002D72", "#FF5910"], WSH: ["#AB0003", "#14225A"], MIL: ["#12284B", "#FFC52F"],
  CHC: ["#0E3386", "#CC3433"], PIT: ["#27251F", "#FDB827"], STL: ["#C41E3A", "#0C2340"],
  CIN: ["#C6011F", "#000000"], LAD: ["#005A9C", "#EF3E42"], SD:  ["#2F241D", "#FFC425"],
  ARI: ["#A71930", "#E3D4AD"], SF:  ["#FD5A1E", "#27251F"], COL: ["#333366", "#C4CED4"],
};

const SEASON_GAMES = 162;
const SNAPSHOT_DATE = "2026-09-10";

// 파생 지표 계산: 승률, 득실차, 피타고리안 기대승률, 잔여경기
MLB_TEAMS.forEach(t => {
  t.color = TEAM_COLORS[t.abbr][0];
  t.color2 = TEAM_COLORS[t.abbr][1];
  t.g = t.w + t.l;
  t.rem = SEASON_GAMES - t.g;
  t.pct = t.w / t.g;
  t.rd = t.r - t.ra;
  t.pyth = (t.r ** 2) / (t.r ** 2 + t.ra ** 2);
  t.pythW = Math.round(t.pyth * t.g);
  t.pythDiff = t.w - t.pythW; // 실제승 - 기대승 (양수면 승운이 따름)
  t.rpg = t.r / t.g;   // 경기당 득점
  t.rapg = t.ra / t.g; // 경기당 실점
  t.kbb = t.so / t.bb; // K/BB
  t.projW = Math.round(t.pct * SEASON_GAMES); // 현재 승률 기준 162경기 환산 승수
});

// 지구 순위 / 매직넘버 / 탈락 여부 / 와일드카드
(function computeRaces() {
  const divs = {};
  MLB_TEAMS.forEach(t => {
    const k = t.league + t.division;
    (divs[k] = divs[k] || []).push(t);
  });
  Object.values(divs).forEach(arr => {
    arr.sort((a, b) => b.pct - a.pct || b.rd - a.rd);
    const lead = arr[0], second = arr[1];
    arr.forEach((t, i) => {
      t.divRank = i + 1;
      t.gb = i === 0 ? 0 : ((lead.w - t.w) + (t.l - lead.l)) / 2;
      // 탈락 판정: 남은 경기 전승해도 선두 현재 승수에 못 미치면 지구 우승 탈락
      t.divElim = i > 0 && (t.w + t.rem) < lead.w;
    });
    // 매직넘버 = 162 + 1 - 선두 승수 - 2위 패수
    lead.magic = Math.max(0, SEASON_GAMES + 1 - lead.w - second.l);
    lead.divClinch = lead.magic === 0;
  });

  ["AL", "NL"].forEach(lg => {
    const nonLeaders = MLB_TEAMS.filter(t => t.league === lg && t.divRank > 1)
      .sort((a, b) => b.pct - a.pct || b.rd - a.rd);
    const third = nonLeaders[2];
    nonLeaders.forEach((t, i) => {
      t.wcRank = i + 1;
      // WCGB: 3번째 와일드카드 팀 대비 게임차 (상위 3팀은 +값으로 여유 표시)
      t.wcgb = ((third.w - t.w) + (t.l - third.l)) / 2;
      t.wcElim = (t.w + t.rem) < third.w;
    });
    MLB_TEAMS.filter(t => t.league === lg && t.divRank === 1).forEach(t => { t.wcgb = null; });
  });
})();

const DATA_SOURCE_NOTE = `데이터 기준일: ${SNAPSHOT_DATE} (조사 시점 스냅샷) · 출처: ESPN, MLB.com, CBS Sports 팀 스탯 페이지 · 매직넘버·와일드카드·피타고리안 승률은 위 기록으로부터 계산 · 실시간 갱신되지 않습니다.`;
