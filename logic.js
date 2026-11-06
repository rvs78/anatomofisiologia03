// Lògica pura (sense DOM): sorteig de la partida, posició de les etiquetes i puntuació.
// La fan servir game.js i tests/check.mjs.

export const SCORE = { hit: 10, miss: -3, hint: -5, streakEvery: 3, streakBonus: 15 };
export const SCREENS = 10;
export const MAX_TERMS = 6;

/** Generador pseudoaleatori amb llavor (mulberry32), per poder repetir una partida a les proves. */
export function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(list, rnd = Math.random) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const noRepeatNeighbours = (list, key = x => x) => list.every((x, i) => i === 0 || key(list[i - 1]) !== key(x));

/** Ordre de les làmines: 5 de les 7 possibles (vista i oïda hi són dues vegades) o les 5 una sola vegada. */
export function pickPlates(rnd, repeat = true) {
  const pool = repeat ? ['ull', 'ull', 'orella', 'orella', 'llengua', 'nas', 'pell'] : ['ull', 'orella', 'llengua', 'nas', 'pell'];
  for (let k = 0; k < 200; k++) {
    const pick = shuffle(pool, rnd).slice(0, SCREENS / 2);
    if (noRepeatNeighbours(pick)) return pick;
  }
  return pool.slice(0, SCREENS / 2);
}

/** Tria fins a 6 estructures; la segona vegada que surt un òrgan, primer les que encara no han sortit. */
export function pickParts(all, used, rnd, n = MAX_TERMS) {
  const fresh = shuffle(all.filter(id => !used.has(id)), rnd);
  const old = shuffle(all.filter(id => used.has(id)), rnd);
  return [...fresh, ...old].slice(0, Math.min(n, all.length));
}

/** Prepara una pantalla de conceptes a partir d'una baralla. */
export function dealDeck(deck, rnd) {
  if (deck.type === 'order') return { ids: deck.items.map(i => i[0]) };
  if (deck.type === 'match') return { ids: shuffle(deck.items.map(i => i[0]), rnd).slice(0, Math.min(deck.pick || MAX_TERMS, MAX_TERMS)) };
  // classify: categories (totes o pickCats) i elements repartits de manera equilibrada
  const cats = deck.pickCats ? shuffle(deck.cats.map(c => c[0]), rnd).slice(0, deck.pickCats) : deck.cats.map(c => c[0]);
  const n = Math.min(deck.pick || MAX_TERMS, MAX_TERMS);
  const per = Math.floor(n / cats.length);
  let ids = [];
  const rest = [];
  for (const c of cats) {
    const pool = shuffle(deck.items.filter(i => i[2] === c).map(i => i[0]), rnd);
    ids.push(...pool.slice(0, per));
    rest.push(...pool.slice(per));
  }
  ids.push(...shuffle(rest, rnd).slice(0, n - ids.length));
  return { ids, cats: deck.cats.map(c => c[0]).filter(c => cats.includes(c)) };
}

/** Sorteja una partida de 10 pantalles: làmina, conceptes, làmina, conceptes… (3 de RA3 i 2 de RA4). */
export function buildRun({ plates, decks, rnd = Math.random, repeat = true }) {
  const organs = pickPlates(rnd, repeat);
  const used = {};
  const plateScreens = organs.map(o => {
    used[o] ||= new Set();
    const ids = pickParts(Object.keys(plates[o]), used[o], rnd);
    ids.forEach(id => used[o].add(id));
    return { kind: 'plate', organ: o, ids };
  });
  let concept = null;
  for (let k = 0; k < 300 && !concept; k++) {
    const ra3 = shuffle(decks.filter(d => d.ra === 3), rnd).slice(0, 3);
    const ra4 = shuffle(decks.filter(d => d.ra === 4), rnd).slice(0, 2);
    const mix = shuffle([...ra3, ...ra4], rnd);
    if (noRepeatNeighbours(mix, d => d.type)) concept = mix;
  }
  const conceptScreens = concept.map(d => ({ kind: 'deck', deck: d.id, ...dealDeck(d, rnd) }));
  const run = [];
  for (let i = 0; i < SCREENS / 2; i++) run.push(plateScreens[i], conceptScreens[i]);
  return run.map(sc => ({ ...sc, chips: shuffle(sc.ids, rnd), cards: shuffle(sc.ids, rnd) }));
}

/* ---------- Etiquetes de les làmines ----------
   Dues columnes (esquerra i dreta). Cada etiqueta va a la columna del costat del seu punt,
   amb un màxim de 4 per columna; s'ordenen per l'alçada del punt i mai se solapen. */
export const LABEL = { w: 220, h: 58, gap: 14, xL: 16, xR: 764, top: 22, bottom: 678, mid: 500 };

export function layoutLabels(anchors, o = LABEL) {
  const cap = Math.max(3, Math.ceil(anchors.length / 2) + 1);
  const place = (list, side) => {
    const s = [...list].sort((a, b) => a.at[1] - b.at[1]);
    const step = o.h + o.gap, lo = o.top + o.h / 2, hi = o.bottom - o.h / 2;
    const ys = s.map(a => Math.min(hi, Math.max(lo, a.at[1])));
    for (let i = 1; i < ys.length; i++) ys[i] = Math.max(ys[i], ys[i - 1] + step);
    if (ys.length && ys[ys.length - 1] > hi) {
      ys[ys.length - 1] = hi;
      for (let i = ys.length - 2; i >= 0; i--) ys[i] = Math.min(ys[i], ys[i + 1] - step);
    }
    const build = order => order.map((a, i) => {
      const x = side === 'L' ? o.xL : o.xR;
      const edge = side === 'L' ? o.xL + o.w : o.xR;
      const bend = side === 'L' ? edge + 18 : edge - 18;
      return { id: a.id, side, x, y: Math.round(ys[i]), leader: [[edge, Math.round(ys[i])], [bend, Math.round(ys[i])], a.at] };
    });
    // intercanvia etiquetes veïnes si així una línia deixa de passar per sobre d'un altre punt o de creuar-se
    let order = s, best = leaderConflicts(build(order));
    for (let pass = 0; pass < 6 && best > 0; pass++) {
      let improved = false;
      for (let i = 0; i < order.length - 1; i++) {
        const tryOrder = [...order];
        [tryOrder[i], tryOrder[i + 1]] = [tryOrder[i + 1], tryOrder[i]];
        const c = leaderConflicts(build(tryOrder));
        if (c < best) { best = c; order = tryOrder; improved = true; }
      }
      if (!improved) break;
    }
    return build(order);
  };
  // prova totes les maneres de repartir les etiquetes entre les dues columnes
  const len = lab => Math.hypot(lab.leader[2][0] - lab.leader[1][0], lab.leader[2][1] - lab.leader[1][1]);
  let best = null;
  for (let mask = 0; mask < 1 << anchors.length; mask++) {
    const L = anchors.filter((_, i) => mask & (1 << i)), R = anchors.filter((_, i) => !(mask & (1 << i)));
    if (L.length > cap || R.length > cap) continue;
    const labels = [...place(L, 'L'), ...place(R, 'R')];
    const score = leaderConflicts(labels) * 1000 + labels.reduce((t, x) => t + len(x) + (x.side === 'L' ? Math.max(0, x.leader[2][0] - o.mid) : Math.max(0, o.mid - x.leader[2][0])) * 0.5, 0);
    if (!best || score < best.score) best = { score, labels };
  }
  return best.labels;
}

const segDist = (p, a, b) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L2));
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
};
const cross = (p1, p2, p3, p4) => {
  const d = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  return d(p1, p2, p3) * d(p1, p2, p4) < 0 && d(p3, p4, p1) * d(p3, p4, p2) < 0;
};
/** Nombre de conflictes: línies que passen a menys de 16 unitats d'un altre punt i parelles de línies que es creuen. */
export function leaderConflicts(labels) {
  let n = 0;
  const segs = labels.map(l => [[l.leader[0], l.leader[1]], [l.leader[1], l.leader[2]]]);
  labels.forEach((l, i) => labels.forEach((m, j) => {
    if (i === j) return;
    if (segs[i].some(([a, b]) => segDist(m.leader[2], a, b) < 16)) n++;
    if (j > i && segs[i].some(([a, b]) => segs[j].some(([c, d]) => cross(a, b, c, d)))) n++;
  }));
  return n;
}

/* ---------- Puntuació per equips ---------- */
export const newTeam = (name, color) => ({ name, color, points: 0, streak: 0, hits: 0, errors: 0, hints: 0 });

/** Aplica una acció a l'equip. Retorna els punts guanyats (amb el bonus) i el canvi real del marcador. */
export function applyScore(team, kind) {
  let gained = SCORE[kind];
  if (kind === 'hit') {
    team.hits++;
    team.streak++;
    if (team.streak % SCORE.streakEvery === 0) gained += SCORE.streakBonus;
  } else {
    team.streak = 0;
    if (kind === 'hint') team.hints++; else team.errors++;
  }
  const before = team.points;
  team.points = Math.max(0, team.points + gained);
  return { gained, delta: team.points - before, bonus: kind === 'hit' && gained > SCORE.hit };
}

/** 3 estrelles sense errors ni pistes; 2 amb fins a 2 incidències; 1 a la resta. */
export function stars(errors, hints) {
  const n = errors + hints;
  return n === 0 ? 3 : n <= 2 ? 2 : 1;
}

export function formatTime(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** Classificació final: punts, després estrelles, després menys errors. */
export function ranking(teams, starsByTeam = {}) {
  return teams.map((t, i) => ({ ...t, i, stars: starsByTeam[i] || 0 }))
    .sort((a, b) => b.points - a.points || b.stars - a.stars || a.errors - b.errors || a.i - b.i);
}
