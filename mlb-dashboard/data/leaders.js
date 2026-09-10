// 2026시즌 개인 타이틀 리더보드 (기준일: 2026-09-10 스냅샷)
// 출처: MLB.com Stats(https://www.mlb.com/stats), ESPN Stats(https://www.espn.com/mlb/stats/player)
// 세이브 부문은 조사 시점에 리더보드가 제공되지 않아 제외.

const LEADERS = {
  batting: [
    { key: "avg", title: "타율", short: "AVG", fmt: "avg", rows: [
      ["Luis Arraez", "SF", .318], ["Yordan Alvarez", "HOU", .312], ["Chandler Simpson", "TB", .309],
      ["Yandy Díaz", "TB", .305], ["Nick Gonzales", "PIT", .305], ["Otto López", "MIA", .303],
      ["Gabriel Moreno", "ARI", .299], ["Freddie Freeman", "LAD", .297], ["TJ Rumfield", "COL", .297],
      ["Chase DeLauter", "CLE", .296],
    ]},
    { key: "hr", title: "홈런", short: "HR", fmt: "int", rows: [
      ["Kyle Schwarber", "PHI", 44], ["Pete Crow-Armstrong", "CHC", 41], ["Junior Caminero", "TB", 39],
      ["Yordan Alvarez", "HOU", 38], ["Hunter Goodman", "COL", 37], ["Matt Olson", "ATL", 37],
      ["Ben Rice", "NYY", 36], ["Rafael Devers", "SF", 35], ["Pete Alonso", "BAL", 34],
      ["Colson Montgomery", "CWS", 31],
    ]},
    { key: "rbi", title: "타점", short: "RBI", fmt: "int", rows: [
      ["Sal Stewart", "CIN", 107], ["Jordan Walker", "STL", 100], ["Pete Alonso", "BAL", 97],
      ["Yordan Alvarez", "HOU", 96], ["CJ Abrams", "WSH", 95], ["Junior Caminero", "TB", 93],
      ["Kyle Schwarber", "PHI", 92], ["Rafael Devers", "SF", 92], ["Bryce Harper", "PHI", 82],
      ["Matt Olson", "ATL", 81],
    ]},
    { key: "ops", title: "OPS", short: "OPS", fmt: "ops", rows: [
      ["Yordan Alvarez", "HOU", 1.021], ["Pete Crow-Armstrong", "CHC", .947], ["Shohei Ohtani", "LAD", .902],
      ["Willson Contreras", "BOS", .900], ["Junior Caminero", "TB", .900], ["Kyle Schwarber", "PHI", .886],
      ["Bryce Harper", "PHI", .883], ["Ben Rice", "NYY", .870], ["Pete Alonso", "BAL", .861],
      ["Rafael Devers", "SF", .858],
    ]},
    { key: "sb", title: "도루", short: "SB", fmt: "int", rows: [
      ["Pete Crow-Armstrong", "CHC", 36], ["Jonathan Aranda", "TB", 32], ["Randy Arozarena", "SEA", 32],
      ["Otto López", "MIA", 30], ["CJ Abrams", "WSH", 28], ["Elly De La Cruz", "CIN", 25],
      ["Alec Burleson", "STL", 24], ["Ezequiel Durán", "TEX", 24], ["Riley Greene", "DET", 22],
      ["Steven Kwan", "CLE", 19],
    ]},
  ],
  pitching: [
    { key: "era", title: "평균자책점", short: "ERA", fmt: "2", rows: [
      ["Jacob Misiorowski", "MIL", 1.95], ["Cam Schlittler", "NYY", 2.01], ["Chris Sale", "ATL", 2.10],
      ["Dylan Cease", "TOR", 2.40], ["Parker Messick", "CLE", 2.53], ["Eduardo Rodriguez", "ARI", 2.55],
      ["Yoshinobu Yamamoto", "LAD", 2.62], ["Sonny Gray", "BOS", 2.69], ["Chase Burns", "CIN", 2.73],
      ["Cristopher Sánchez", "PHI", 2.79],
    ]},
    { key: "w", title: "다승", short: "W", fmt: "int", rows: [
      ["Sonny Gray", "BOS", 17], ["Cristopher Sánchez", "PHI", 17], ["Eduardo Rodriguez", "ARI", 15],
      ["Chase Burns", "CIN", 15], ["Paul Skenes", "PIT", 15], ["Braxton Ashcraft", "PIT", 14],
      ["Jacob Misiorowski", "MIL", 14], ["Chris Sale", "ATL", 14], ["Nick Martinez", "TB", 14],
      ["Bryce Elder", "ATL", 14],
    ]},
    { key: "so", title: "탈삼진", short: "SO", fmt: "int", rows: [
      ["Jacob Misiorowski", "MIL", 236], ["Paul Skenes", "PIT", 228], ["Gavin Williams", "CLE", 228],
      ["Dylan Cease", "TOR", 227], ["Jesús Luzardo", "PHI", 221], ["Cam Schlittler", "NYY", 220],
      ["Cristopher Sánchez", "PHI", 210], ["Reid Detmers", "LAA", 191], ["Cade Cavalli", "WSH", 185],
      ["Taj Bradley", "MIN", 184],
    ]},
    { key: "whip", title: "WHIP", short: "WHIP", fmt: "2", rows: [
      ["Jacob Misiorowski", "MIL", 0.80], ["Yoshinobu Yamamoto", "LAD", 0.88], ["Drew Rasmussen", "TB", 0.91],
      ["Cam Schlittler", "NYY", 0.92], ["Tarik Skubal", "LAD", 0.97], ["Parker Messick", "CLE", 1.04],
      ["Dylan Cease", "TOR", 1.04], ["Reid Detmers", "LAA", 1.04], ["Zack Wheeler", "PHI", 1.08],
      ["Payton Tolle", "BOS", 1.08],
    ]},
  ],
};
