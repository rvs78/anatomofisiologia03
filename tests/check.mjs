// Comprovacions de dades, sorteig, etiquetes i puntuació. Ús: node tests/check.mjs
import { ORGANS } from '../drawings.js';
import { PLATES, DECKS, SENSES } from '../data.js';
import { UI } from '../i18n.js';
import { buildRun, layoutLabels, leaderConflicts, applyScore, newTeam, stars, seeded, LABEL, SCREENS, MAX_TERMS, ranking } from '../logic.js';

let ok = 0, fail = 0;
const check = (cond, msg) => { if (cond) ok++; else { fail++; console.error('✗', msg); } };
const both = (o, where) => check(o && typeof o.ca === 'string' && o.ca.trim() && typeof o.es === 'string' && o.es.trim(), `text en ca/es: ${where}`);

/* Làmines */
for (const [k, O] of Object.entries(ORGANS)) {
  check(PLATES[k], `làmina sense textos: ${k}`);
  check(SENSES[O.sense], `sentit desconegut: ${k}`);
  const ids = O.parts.map(p => p[0]);
  check(new Set(ids).size === ids.length, `ids repetits a ${k}`);
  check(ids.length >= MAX_TERMS, `${k} té menys de ${MAX_TERMS} estructures`);
  for (const [id, [x, y]] of O.parts) {
    both(PLATES[k].parts[id], `${k}.${id}`);
    check(x >= 220 && x <= 760 && y >= 40 && y <= 660, `punt fora del dibuix: ${k}.${id} (${x}, ${y})`);
    check(Number.isFinite(x) && Number.isFinite(y), `punt no numèric: ${k}.${id}`);
  }
  for (const id of Object.keys(PLATES[k].parts)) check(ids.includes(id), `nom sense punt: ${k}.${id}`);
  both(PLATES[k].title, `${k}.title`);
  // punts massa a prop entre si (s'han de poder distingir)
  for (let i = 0; i < O.parts.length; i++) for (let j = i + 1; j < O.parts.length; j++) {
    const [a, b] = [O.parts[i][1], O.parts[j][1]];
    check(Math.hypot(a[0] - b[0], a[1] - b[1]) >= 14, `punts massa junts: ${k}.${O.parts[i][0]} i ${O.parts[j][0]}`);
  }
}

/* Baralles de conceptes */
check(new Set(DECKS.map(d => d.id)).size === DECKS.length, 'ids de baralla repetits');
check(DECKS.filter(d => d.ra === 3).length >= 3 && DECKS.filter(d => d.ra === 4).length >= 2, 'falten baralles de RA3 o RA4');
const allItemIds = new Set();
for (const d of DECKS) {
  both(d.title, `${d.id}.title`);
  check(['match', 'classify', 'order'].includes(d.type), `tipus desconegut: ${d.id}`);
  for (const it of d.items) {
    check(!allItemIds.has(it[0]), `id d'element repetit entre baralles: ${it[0]}`);
    allItemIds.add(it[0]);
    both(it[1], `${d.id}.${it[0]}`);
    if (d.type === 'match') both(it[2], `${d.id}.${it[0]}.def`);
    if (d.type === 'classify') check(d.cats.some(c => c[0] === it[2]), `categoria desconeguda: ${d.id}.${it[0]}`);
  }
  if (d.type === 'order') check(d.items.length >= 4 && d.items.length <= MAX_TERMS, `ordre amb ${d.items.length} elements: ${d.id}`);
  if (d.type === 'match') {
    check(d.items.length >= (d.pick || MAX_TERMS), `poques parelles: ${d.id}`);
    const terms = d.items.map(i => i[1].ca.toLowerCase()), defs = d.items.map(i => i[2].ca.toLowerCase());
    check(new Set(terms).size === terms.length && new Set(defs).size === defs.length, `termes o definicions repetits: ${d.id}`);
  }
  if (d.type === 'classify') {
    d.cats.forEach(c => { both(c[1], `${d.id}.${c[0]}`); both(c[2], `${d.id}.${c[0]}.desc`); });
    const shown = d.pickCats || d.cats.length;
    check(shown <= 3, `massa columnes: ${d.id}`);
    for (const c of d.cats) check(d.items.filter(i => i[2] === c[0]).length >= Math.floor((d.pick || 6) / shown), `poca cosa a la categoria ${d.id}.${c[0]}`);
  }
}

/* Sorteig de 500 partides */
const PL = Object.fromEntries(Object.entries(ORGANS).map(([k, O]) => [k, Object.fromEntries(O.parts.map(p => [p[0], 1]))]));
const seenDecks = new Set(), seenOrgans = new Set();
for (let seed = 1; seed <= 500; seed++) {
  const repeat = seed % 3 !== 0;
  const run = buildRun({ plates: PL, decks: DECKS, rnd: seeded(seed), repeat });
  check(run.length === SCREENS, `partida ${seed}: ${run.length} pantalles`);
  run.forEach((sc, i) => {
    check((i % 2 === 0) === (sc.kind === 'plate'), `partida ${seed}: no alterna a la pantalla ${i + 1}`);
    check(sc.ids.length >= 4 && sc.ids.length <= MAX_TERMS, `partida ${seed}: ${sc.ids.length} termes a la pantalla ${i + 1}`);
    check(new Set(sc.ids).size === sc.ids.length, `partida ${seed}: termes repetits`);
    check(sc.chips.length === sc.ids.length && sc.chips.every(id => sc.ids.includes(id)), `partida ${seed}: munt incorrecte`);
    if (sc.kind === 'plate') seenOrgans.add(sc.organ); else seenDecks.add(sc.deck);
    if (sc.kind === 'deck') {
      const d = DECKS.find(x => x.id === sc.deck);
      if (d.type === 'classify') {
        check(sc.cats.every(c => sc.ids.some(id => d.items.find(it => it[0] === id)[2] === c)), `partida ${seed}: columna buida a ${d.id}`);
        check(sc.ids.every(id => sc.cats.includes(d.items.find(it => it[0] === id)[2])), `partida ${seed}: element sense columna a ${d.id}`);
      }
    }
  });
  const plates = run.filter(x => x.kind === 'plate');
  plates.forEach((p, i) => i && check(p.organ !== plates[i - 1].organ, `partida ${seed}: mateix òrgan seguit`));
  const counts = plates.reduce((m, p) => ((m[p.organ] = (m[p.organ] || 0) + 1), m), {});
  for (const [o, n] of Object.entries(counts)) {
    check(n <= (repeat && (o === 'ull' || o === 'orella') ? 2 : 1), `partida ${seed}: ${o} surt ${n} vegades`);
    if (n === 2) {
      const [a, b] = plates.filter(p => p.organ === o);
      const overlap = b.ids.filter(id => a.ids.includes(id)).length;
      const total = Object.keys(PL[o]).length;
      check(overlap === Math.max(0, a.ids.length + b.ids.length - total), `partida ${seed}: ${o} repeteix estructures sense necessitat`);
    }
  }
  if (!repeat) check(Object.keys(counts).length === 5, `partida ${seed}: sense repetició han de sortir els 5 sentits`);
  const concept = run.filter(x => x.kind === 'deck').map(x => DECKS.find(d => d.id === x.deck));
  check(concept.filter(d => d.ra === 3).length === 3 && concept.filter(d => d.ra === 4).length === 2, `partida ${seed}: barreja RA3/RA4`);
  concept.forEach((d, i) => i && check(d.type !== concept[i - 1].type, `partida ${seed}: dos «${d.type}» seguits`));
}
check(seenOrgans.size === Object.keys(ORGANS).length, 'algun òrgan no surt mai');
check(seenDecks.size === DECKS.length, `alguna baralla no surt mai (${DECKS.length - seenDecks.size})`);

/* Etiquetes: dins de la làmina, sense solapaments, poques interferències */
let conflicts = 0, layouts = 0;
for (let seed = 1; seed <= 300; seed++) {
  const r = seeded(seed * 7);
  for (const [k, O] of Object.entries(ORGANS)) {
    const at = Object.fromEntries(O.parts);
    const ids = O.parts.map(p => p[0]).sort(() => r() - 0.5).slice(0, MAX_TERMS);
    const lay = layoutLabels(ids.map(id => ({ id, at: at[id] })), { ...LABEL, mid: O.mid || LABEL.mid });
    layouts++;
    check(lay.length === ids.length, `${k}: falten etiquetes`);
    for (const side of ['L', 'R']) {
      const col = lay.filter(x => x.side === side).sort((a, b) => a.y - b.y);
      check(col.length <= 4, `${k}: massa etiquetes a la columna ${side}`);
      col.forEach((x, i) => {
        check(x.y - LABEL.h / 2 >= LABEL.top - 0.5 && x.y + LABEL.h / 2 <= LABEL.bottom + 0.5, `${k}: etiqueta fora (${x.id})`);
        if (i) check(x.y - col[i - 1].y >= LABEL.h + LABEL.gap - 0.5, `${k}: etiquetes solapades (${x.id})`);
      });
    }
    conflicts += leaderConflicts(lay) > 0 ? 1 : 0;
  }
}
check(conflicts / layouts < 0.01, `massa làmines amb línies que es creuen o tapen un punt: ${conflicts}/${layouts}`);

/* Puntuació */
const tm = newTeam('A', '#000');
check(applyScore(tm, 'miss').delta === 0 && tm.points === 0, 'la puntuació no baixa de 0');
applyScore(tm, 'hit'); applyScore(tm, 'hit');
const third = applyScore(tm, 'hit');
check(third.bonus && tm.points === 45, `ratxa de 3: ${tm.points}`);
applyScore(tm, 'hint');
check(tm.points === 40 && tm.streak === 0 && tm.hints === 1, 'pista −5 i trenca la ratxa');
check(stars(0, 0) === 3 && stars(1, 1) === 2 && stars(2, 1) === 1, 'estrelles');
const rk = ranking([{ ...newTeam('A', ''), points: 10 }, { ...newTeam('B', ''), points: 30 }, { ...newTeam('C', ''), points: 30, errors: 1 }]);
check(rk[0].name === 'B' && rk[1].name === 'C', 'classificació');

/* Textos d'interfície */
const keys = o => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? keys(v).map(x => `${k}.${x}`) : [k]));
const kc = keys(UI.ca).sort(), ke = keys(UI.es).sort();
check(JSON.stringify(kc) === JSON.stringify(ke), `claus d'interfície diferents: ${kc.filter(k => !ke.includes(k))} / ${ke.filter(k => !kc.includes(k))}`);

console.log(`${ok} comprovacions correctes, ${fail} errors`);
if (fail) process.exit(1);
