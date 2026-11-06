// Pissarra Quest · RA3 La malaltia · RA4 Els sentits
// Joc per equips per a pissarra digital tàctil: 10 pantalles a l'atzar (làmina, conceptes, làmina, conceptes…).
import { ORGANS } from './drawings.js';
import { PLATES, DECKS, SENSES } from './data.js';
import { buildRun, layoutLabels, applyScore, stars, formatTime, ranking, newTeam, SCREENS, LABEL } from './logic.js';
import { t, L, getLang, setLang, FLAGS } from './i18n.js';
import * as fx from './fx.js';

const KEY = 'far-ra34-pissarra-v1';
const COLORS = ['#0b7a83', '#b1500f', '#6b3fa0', '#1f5fbf'];
const TEST = new URLSearchParams(location.search).has('test');

const app = document.querySelector('#app');
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ic = (name, cls = 'icon') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const starRow = (n, cls = 'stars') => `<div class="${cls}" role="img" aria-label="${t('stars', { n })}">${[0, 1, 2].map(i => `<svg viewBox="0 0 24 24" class="${i < n ? '' : 'no'}"><use href="#i-star"/></svg>`).join('')}</div>`;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

/* ---------- Contingut d'una pantalla ---------- */
const deckOf = id => DECKS.find(d => d.id === id);
const kindOf = sc => (sc.kind === 'plate' ? 'plate' : deckOf(sc.deck).type);
const raOf = sc => (sc.kind === 'plate' ? 4 : deckOf(sc.deck).ra);
const titleOf = sc => (sc.kind === 'plate' ? L(PLATES[sc.organ].title) : L(deckOf(sc.deck).title));
const itemOf = (sc, id) => deckOf(sc.deck).items.find(x => x[0] === id);
const termOf = (sc, id) => (sc.kind === 'plate' ? L(PLATES[sc.organ].parts[id]) : L(itemOf(sc, id)[1]));
/** Clau del lloc correcte per a un terme. */
const targetFor = (sc, id) => {
  const k = kindOf(sc);
  if (k === 'classify') return itemOf(sc, id)[2];
  if (k === 'order') return String(sc.ids.indexOf(id));
  return id;
};
const accepts = (sc, key, id) => targetFor(sc, id) === key;

/* ---------- Estat ---------- */
const freshScreens = run => run.map(() => ({ placed: {}, errors: 0, hints: 0, pts: 0, missed: [], start: null, end: null, skipped: false }));
function newGame(names, repeat) {
  const run = buildRun({ plates: PLATES_IDS, decks: DECKS, repeat });
  return { v: 1, teams: names.map((n, i) => newTeam(n, COLORS[i])), repeat, run, i: 0, sc: freshScreens(run), intro: {}, finished: false };
}
const PLATES_IDS = Object.fromEntries(Object.entries(ORGANS).map(([k, O]) => [k, Object.fromEntries(O.parts.map(p => [p[0], 1]))]));

let s = null;
try { s = JSON.parse(localStorage.getItem(KEY)); if (!s || s.v !== 1 || !Array.isArray(s.run)) s = null; } catch { s = null; }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* mode privat */ } };
let cleanup = () => {};
const teamIx = i => i % s.teams.length;
const curTeam = () => s.teams[teamIx(s.i)];

/* ---------- Capçalera ---------- */
function header() {
  $('.brand small').textContent = t('brandSub');
  $('.brand span').textContent = t('welcomeTitle').join(' ');
  $('#steps').innerHTML = s && !s.finished ? s.run.map((sc, k) => {
    const st = s.sc[k], cur = k === s.i, done = !!st.end;
    return `<li class="${done ? 'done' : ''}" ${cur ? 'aria-current="step"' : ''} style="--tc:${s.teams[teamIx(k)].color}" title="${esc(t('screenN', { n: k + 1 }))} · ${esc(t('kind.' + kindOf(sc)))}">${done ? ic('check') : `<span>${k + 1}</span>`}</li>`;
  }).join('') : '';
  const on = fx.sound.enabled(), other = getLang() === 'ca' ? 'es' : 'ca';
  const teams = s ? `<div class="board-teams">${s.teams.map((tm, k) => `<div class="tscore ${s && !s.finished && teamIx(s.i) === k ? 'now' : ''}" style="--tc:${tm.color}"><i></i><span>${esc(tm.name)}</span><b id="tp${k}">${tm.points}</b></div>`).join('')}</div>` : '';
  $('#score').innerHTML = `${teams}
    <button class="iconbtn flagbtn" id="lang" aria-label="${t('switchLang')}" title="${t('switchLang')}">${FLAGS[other]}</button>
    <button class="iconbtn" id="sound" aria-pressed="${on}" aria-label="${on ? t('soundOff') : t('soundOn')}" title="${on ? t('soundOff') : t('soundOn')}">${ic(on ? 'sound' : 'mute')}</button>
    <button class="iconbtn" id="full" aria-label="${t('fullscreen')}" title="${t('fullscreen')}">${ic('fit')}</button>
    ${s ? `<button class="iconbtn" id="home" aria-label="${t('home')}" title="${t('home')}">${ic('exit')}</button>` : ''}`;
  $('#sound').onclick = () => { fx.sound.toggle(); header(); };
  $('#lang').onclick = () => { setLang(other); render(); };
  $('#full').onclick = () => {
    const d = document;
    if (d.fullscreenElement) d.exitFullscreen?.(); else d.documentElement.requestFullscreen?.().catch(() => {});
  };
  const home = $('#home');
  if (home) home.onclick = () => confirmBox(home, t('exitAsk'), t('exitYes'), () => { s = null; try { localStorage.removeItem(KEY); } catch { /* */ } render(); });
}

/** Confirmació dins la pàgina (els diàlegs del navegador no van bé a totes les pissarres). */
function confirmBox(anchor, msg, yes, onYes) {
  $('.confirm')?.remove();
  const box = document.createElement('div');
  box.className = 'confirm'; box.setAttribute('role', 'alertdialog');
  box.innerHTML = `<p>${esc(msg)}</p><div class="row"><button class="btn small" data-a="yes">${esc(yes)}</button><button class="btn ghost small" data-a="no">${t('cancel')}</button></div>`;
  document.body.append(box);
  const r = anchor.getBoundingClientRect();
  const top = Math.min(innerHeight - box.offsetHeight - 12, r.bottom + 10);
  box.style.top = Math.max(12, top) + 'px';
  box.style.left = Math.max(12, Math.min(innerWidth - box.offsetWidth - 12, r.right - box.offsetWidth)) + 'px';
  const close = () => { box.remove(); document.removeEventListener('keydown', onKey); };
  const onKey = e => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  box.onclick = e => { const a = e.target.closest('[data-a]')?.dataset.a; if (!a) return; close(); if (a === 'yes') onYes(); };
  $('[data-a="no"]', box).focus();
}

function render() {
  cleanup(); cleanup = () => {};
  $('.confirm')?.remove(); $('#intro')?.remove();
  document.documentElement.lang = getLang();
  if (!s) { header(); return welcome(); }
  header();
  if (s.finished) return results();
  play();
  if (!s.intro[s.i]) intro();
}

/* ---------- Entrada ---------- */
function welcome() {
  document.body.style.removeProperty('--sys');
  const saved = (() => { try { const x = JSON.parse(localStorage.getItem(KEY)); return x && x.v === 1 && !x.finished ? x : null; } catch { return null; } })();
  let n = 2;
  const names = [1, 2, 3, 4].map(k => t('teamN', { n: k }));
  const [h1a, h1b] = t('welcomeTitle');
  const minis = ['ull', 'orella', 'llengua', 'nas', 'pell'];
  app.innerHTML = `
  <div class="welcome">
    <section class="intro-col">
      <h1>${h1a}<span>${h1b}</span></h1>
      <p>${t('welcomeLead')}</p>
      ${saved ? `<div class="resume"><div><b>${t('resume')}</b><span>${t('resumeMeta', { i: saved.i + 1, teams: saved.teams.map(x => esc(x.name)).join(' · ') })}</span></div><button class="btn" id="resume">${ic('play')} ${t('resume')}</button></div>` : ''}
      <form id="setup" autocomplete="off">
        <fieldset class="field"><legend>${t('howManyTeams')}</legend>
          <div class="seg" role="radiogroup">${[1, 2, 3, 4].map(k => `<button type="button" role="radio" class="segbtn" data-n="${k}" aria-checked="${k === n}">${k === 1 ? `1 <small>${t('wholeClass')}</small>` : k}</button>`).join('')}</div>
        </fieldset>
        <fieldset class="field"><legend>${t('teamNames')}</legend><div class="names" id="names"></div></fieldset>
        <label class="check"><input type="checkbox" id="repeat" checked> <span>${t('repeat')}</span></label>
        <fieldset class="field"><legend>${t('language')}</legend>
          <div class="seg">${['ca', 'es'].map(l => `<button type="button" class="segbtn flag" data-l="${l}" aria-checked="${getLang() === l}">${FLAGS[l]} ${l === 'ca' ? 'Català' : 'Castellano'}</button>`).join('')}</div>
        </fieldset>
        <button class="btn big" type="submit">${ic('play')} ${saved ? t('newGame') : t('startGame')}</button>
      </form>
      <p class="note">${t('note')}</p>
    </section>
    <section class="art">
      <div class="collage">${minis.map((o, k) => `<figure class="minip m${k}"><svg viewBox="240 40 520 620" aria-hidden="true">${ORGANS[o].svg.replaceAll('id="', `id="w${k}`).replaceAll('url(#', `url(#w${k}`)}</svg><figcaption>${L(SENSES[ORGANS[o].sense])}</figcaption></figure>`).join('')}</div>
      <p class="credit">${t('credit')}</p>
    </section>
  </div>`;
  const drawNames = () => {
    $('#names').innerHTML = Array.from({ length: n }, (_, k) => `<label class="tname" style="--tc:${COLORS[k]}"><i></i><input maxlength="18" value="${esc(n === 1 ? t('wholeClass') : names[k])}" data-k="${k}" aria-label="${esc(t('teamN', { n: k + 1 }))}"></label>`).join('');
    $$('#names input').forEach(inp => { inp.oninput = () => { if (n > 1) names[+inp.dataset.k] = inp.value; }; });
  };
  drawNames();
  $$('.segbtn[data-n]').forEach(bt => { bt.onclick = () => { n = +bt.dataset.n; $$('.segbtn[data-n]').forEach(x => x.setAttribute('aria-checked', x === bt)); drawNames(); }; });
  $$('.segbtn[data-l]').forEach(bt => { bt.onclick = () => { setLang(bt.dataset.l); render(); }; });
  $('#setup').onsubmit = e => {
    e.preventDefault();
    const list = $$('#names input').map((inp, k) => inp.value.trim() || (n === 1 ? t('wholeClass') : t('teamN', { n: k + 1 })));
    s = newGame(list, $('#repeat').checked);
    save(); fx.sound.play('open'); render();
  };
  const rb = $('#resume');
  if (rb) rb.onclick = () => { s = saved; render(); };
}

/* ---------- Sobre d'instruccions de cada pantalla ---------- */
function intro() {
  const sc = s.run[s.i], k = kindOf(sc), team = curTeam();
  const wrap = document.createElement('div');
  wrap.className = 'intro'; wrap.id = 'intro';
  wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-modal', 'true'); wrap.setAttribute('aria-labelledby', 'intro-title');
  wrap.style.setProperty('--sys', team.color);
  const first = s.i === 0;
  wrap.innerHTML = `
    <div class="envelope">
      <div class="flap"></div>
      <div class="inside">
        <div class="meta"><span class="pageno">${t('screen')} <b>${s.i + 1}</b> ${t('of')} ${SCREENS}</span><span class="kindtag">${t('kind.' + k)}</span><span class="ratag">${t(raOf(sc) === 3 ? 'ra3' : 'ra4')}</span></div>
        <h2 id="intro-title">${esc(titleOf(sc))}</h2>
        <div class="turnbig"><span>${t('turn')}</span><b>${esc(team.name)}</b></div>
        <p class="lead">${t('how.' + k, { n: sc.ids.length })}</p>
        ${first ? `<div class="cards">
          <div class="howto">${ic('drag', '')}<h3>${t('cardDrag')[0]}</h3><p>${t('cardDrag')[1]}</p></div>
          <div class="howto">${ic('target', '')}<h3>${t('cardTap')[0]}</h3><p>${t('cardTap')[1]}</p></div>
          <div class="howto foil">${ic('star', '')}<h3>${t('cardScore')[0]}</h3><p>${t('cardScore')[1]}</p></div></div>` : ''}
        <div class="row end"><button class="btn big" id="intro-go">${ic('play')} ${t('go')}</button></div>
      </div>
    </div>`;
  document.body.append(wrap);
  const close = () => {
    s.intro[s.i] = true; s.sc[s.i].start = Date.now(); save();
    fx.sound.play('open');
    const done = () => { wrap.remove(); $('.chip:not(.gone)')?.focus({ preventScroll: true }); };
    if (fx.reduced()) return done();
    wrap.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220 }).finished.then(done, done);
  };
  $('#intro-go', wrap).onclick = close;
  $('#intro-go', wrap).focus();
  if (!fx.reduced()) $('.envelope', wrap).animate([{ transform: 'translateY(30px) scale(.96)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
}

/* ---------- Pantalla de joc ---------- */
function boardHTML(sc, st) {
  const k = kindOf(sc);
  const filled = id => st.placed[id] != null;
  if (k === 'plate') {
    const O = ORGANS[sc.organ];
    const at = Object.fromEntries(O.parts);
    const lay = layoutLabels(sc.ids.map(id => ({ id, at: at[id] })), { ...LABEL, mid: O.mid || LABEL.mid });
    const pct = (v, total) => `${(v / total) * 100}%`;
    return `
      <svg class="art" viewBox="0 0 1000 700" aria-hidden="true">${O.svg}</svg>
      <svg class="leaders" viewBox="0 0 1000 700" aria-hidden="true">${lay.map(l => `<polyline data-for="${l.id}" class="${filled(l.id) ? 'done' : ''}" points="${l.leader.map(p => p.join(',')).join(' ')}"/>`).join('')}</svg>
      ${lay.map(l => `<span class="dot ${filled(l.id) ? 'done' : ''}" data-for="${l.id}" style="left:${pct(l.leader[2][0], 1000)};top:${pct(l.leader[2][1], 700)}"></span>`).join('')}
      ${lay.map(l => `<button class="slot ${l.side} ${filled(l.id) ? 'done' : ''}" data-target="${l.id}" style="left:${pct(l.x, 1000)};top:${pct(l.y - LABEL.h / 2, 700)};width:${pct(LABEL.w, 1000)};height:${pct(LABEL.h, 700)}" aria-label="${filled(l.id) ? esc(termOf(sc, l.id)) : t('emptySlot')}" ${filled(l.id) ? 'disabled' : ''}><span>${filled(l.id) ? esc(termOf(sc, l.id)) : ''}</span></button>`).join('')}
      <p class="modelcap">${esc(titleOf(sc))}</p>`;
  }
  const deck = deckOf(sc.deck);
  const head = `<h2 class="boardtitle">${esc(L(deck.title))}</h2>`;
  if (k === 'match') {
    return `${head}<div class="mgrid n${sc.cards.length}">${sc.cards.map(id => `
      <div class="mcard ${filled(id) ? 'done' : ''}">
        <button class="hole ${filled(id) ? 'done' : ''}" data-target="${id}" aria-label="${filled(id) ? esc(termOf(sc, id)) : t('emptySlot')}" ${filled(id) ? 'disabled' : ''}><span>${filled(id) ? esc(termOf(sc, id)) : ''}</span></button>
        <p>${esc(L(itemOf(sc, id)[2]))}</p>
      </div>`).join('')}</div>`;
  }
  if (k === 'classify') {
    return `${head}<div class="bins n${sc.cats.length}">${sc.cats.map(c => {
      const cat = deck.cats.find(x => x[0] === c);
      const inside = sc.ids.filter(id => st.placed[id] === c);
      return `<div class="bin" data-target="${c}" role="button" tabindex="0" aria-label="${esc(L(cat[1]))}">
        <header><b>${esc(L(cat[1]))}</b><span>${esc(L(cat[2]))}</span></header>
        <div class="binlist">${inside.map(id => `<span class="placed">${esc(termOf(sc, id))}</span>`).join('')}<span class="drophint">${t('dropHere')}</span></div>
      </div>`;
    }).join('')}</div>`;
  }
  // order
  return `${head}<ol class="seq n${sc.ids.length}">${sc.ids.map((id, i) => `
    <li><span class="n">${i + 1}</span>
      <button class="hole ${filled(id) ? 'done' : ''}" data-target="${i}" aria-label="${filled(id) ? esc(termOf(sc, id)) : `${i + 1} · ${t('emptySlot')}`}" ${filled(id) ? 'disabled' : ''}><span>${filled(id) ? esc(termOf(sc, id)) : ''}</span></button>
    </li>`).join('')}</ol>`;
}

function play() {
  const sc = s.run[s.i], st = s.sc[s.i], team = curTeam(), k = kindOf(sc);
  document.body.style.setProperty('--sys', team.color);
  if (st.start == null) st.start = Date.now();
  const total = sc.ids.length;
  app.innerHTML = `
  <div class="play">
    <section class="stage" id="stage"><div class="board k-${k}" id="board">${boardHTML(sc, st)}</div></section>
    <aside class="panel" id="panel">
      <header>
        <div class="meta"><span class="pageno">${t('screen')} <b>${s.i + 1}</b>/${SCREENS}</span><span class="kindtag">${t('kind.' + k)}</span><span class="ratag">${t(raOf(sc) === 3 ? 'ra3' : 'ra4')}</span></div>
        <div class="turn"><span>${t('turn')}</span><b>${esc(team.name)}</b></div>
      </header>
      <div class="progress"><div class="row"><span>${t('placed')}</span><b id="prog">${Object.keys(st.placed).length} / ${total}</b></div><div class="bar"><span id="bar" style="width:${(Object.keys(st.placed).length / total) * 100}%"></span></div></div>
      <div id="work"></div>
    </aside>
  </div>`;
  if (st.end) return doneCard();
  $('#work').innerHTML = `
    <div class="pile" id="pile">${sc.chips.map(id => `<button class="chip ${st.placed[id] != null ? 'gone' : ''}" data-chip="${id}">${esc(termOf(sc, id))}</button>`).join('')}</div>
    <p class="feedback info" id="fb" aria-live="polite">${t('fbStart')}</p>
    <div class="tools row">
      <button class="btn ghost small" id="hint" title="${t('hintTitle')}">${ic('bulb')} ${t('hint')} <small>−5</small></button>
      <span class="clock" id="clock">${ic('play')} <b>${formatTime(Date.now() - st.start)}</b></span>
      <button class="btn ghost small" id="skip">${t('skip')}</button>
    </div>`;
  const tick = setInterval(() => { const c = $('#clock b'); if (c && s && !s.sc[s.i].end && s.intro[s.i]) c.textContent = formatTime(Date.now() - s.sc[s.i].start); }, 1000);
  const offDnD = dnd(sc, st);
  cleanup = () => { clearInterval(tick); offDnD(); };
  $('#hint').onclick = () => hint(sc, st);
  $('#skip').onclick = () => confirmBox($('#skip'), t('skipAsk'), t('skipYes'), () => { st.skipped = true; st.end = Date.now(); save(); finish(); });
}

/* ---------- Arrossegar i deixar (ratolí, llapis i dit; diversos dits alhora) ---------- */
let selected = null;
function dnd(sc, st) {
  const drags = new Map();
  const board = $('#board'), pile = $('#pile');
  const targets = () => $$('[data-target]', board).filter(el => !el.disabled);
  const targetAt = (x, y) => {
    const hit = document.elementFromPoint(x, y)?.closest('[data-target]');
    if (hit && !hit.disabled && board.contains(hit)) return hit;
    let best = null, bd = 26; // tolerància per als dits
    for (const el of targets()) {
      const r = el.getBoundingClientRect();
      const dx = Math.max(r.left - x, 0, x - r.right), dy = Math.max(r.top - y, 0, y - r.bottom);
      const d = Math.hypot(dx, dy);
      if (d < bd) { bd = d; best = el; }
    }
    return best;
  };
  const mark = (d, el) => { if (d.over === el) return; d.over?.classList.remove('drop'); d.over = el; el?.classList.add('drop'); };
  let lastTap = 0, tapT = null;
  const tapChip = chip => {
    select(selected === chip.dataset.chip ? null : chip.dataset.chip);
    if (selected) fb('info', t('fbSelected', { t: chip.textContent }));
  };
  const tapTarget = tg => { if (selected && !tg.disabled) attempt(sc, st, selected, tg, null); };
  const down = e => {
    if (e.button > 0) return;
    const tg = e.target.closest('[data-target]');
    if (tg && board.contains(tg)) { tapT = { el: tg, id: e.pointerId, x0: e.clientX, y0: e.clientY }; return; }
    const chip = e.target.closest('.chip');
    if (!chip || chip.classList.contains('gone') || !pile.contains(chip)) return;
    e.preventDefault();
    try { chip.setPointerCapture(e.pointerId); } catch { /* */ }
    drags.set(e.pointerId, { id: chip.dataset.chip, chip, x0: e.clientX, y0: e.clientY, moved: false, ghost: null, over: null });
  };
  const move = e => {
    const d = drags.get(e.pointerId); if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.x0, e.clientY - d.y0) > (e.pointerType === 'mouse' ? 6 : 12)) {
      d.moved = true;
      d.ghost = document.createElement('div');
      d.ghost.className = 'ghost-chip'; d.ghost.textContent = d.chip.textContent; d.ghost.setAttribute('aria-hidden', 'true');
      document.body.append(d.ghost);
      d.chip.classList.add('lifting');
      select(null);
    }
    if (!d.moved) return;
    d.ghost.style.left = e.clientX + 'px'; d.ghost.style.top = e.clientY + 'px';
    mark(d, targetAt(e.clientX, e.clientY));
  };
  const end = (e, cancel) => {
    if (tapT && tapT.id === e.pointerId) {
      const tp = tapT; tapT = null;
      if (!cancel && Math.hypot(e.clientX - tp.x0, e.clientY - tp.y0) < 14) { lastTap = Date.now(); tapTarget(tp.el); }
    }
    const d = drags.get(e.pointerId); if (!d) return;
    drags.delete(e.pointerId);
    if (!d.moved) { // un toc sobre el cromo: el selecciona (no depenem de l'esdeveniment click, que algunes pantalles tàctils perden)
      if (!cancel) { lastTap = Date.now(); tapChip(d.chip); }
      return;
    }
    lastTap = Date.now();
    d.ghost.remove(); d.chip.classList.remove('lifting'); mark(d, null);
    if (cancel) return;
    const tg = targetAt(e.clientX, e.clientY);
    if (tg) attempt(sc, st, d.id, tg, { x: e.clientX, y: e.clientY });
  };
  const up = e => end(e, false), cancel = e => end(e, true);
  // click: només per al teclat (Enter/Espai) o per a dispositius sense esdeveniments de punter
  const click = e => {
    if (Date.now() - lastTap < 600) return;
    const chip = e.target.closest('.chip');
    if (chip && pile.contains(chip)) return tapChip(chip);
    const tg = e.target.closest('[data-target]');
    if (tg && board.contains(tg)) tapTarget(tg);
  };
  const key = e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.bin')) { e.preventDefault(); e.target.click(); } };
  const noMenu = e => { if (e.target.closest('.chip, .board')) e.preventDefault(); };
  app.addEventListener('pointerdown', down);
  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', cancel);
  app.addEventListener('click', click);
  app.addEventListener('keydown', key);
  app.addEventListener('contextmenu', noMenu);
  return () => {
    drags.forEach(d => { d.ghost?.remove(); });
    app.removeEventListener('pointerdown', down);
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
    window.removeEventListener('pointercancel', cancel);
    app.removeEventListener('click', click);
    app.removeEventListener('keydown', key);
    app.removeEventListener('contextmenu', noMenu);
    selected = null;
  };
}

function select(id) {
  selected = id;
  $$('.chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.chip === id)));
  $('#board')?.classList.toggle('picking', !!id);
}

function fb(kind, text) {
  const el = $('#fb'); if (!el) return;
  el.className = `feedback ${kind}`;
  el.innerHTML = `${ic(kind === 'ok' ? 'check' : kind === 'err' ? 'x' : 'bulb')}<span>${esc(text)}</span>`;
}

function bump(k) {
  const tm = s.teams[k], el = $(`#tp${k}`);
  if (!el) return;
  el.textContent = tm.points;
  el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
}

function attempt(sc, st, id, tg, from) {
  if (st.placed[id] != null || st.end) return;
  const chip = $(`.chip[data-chip="${id}"]`), key = tg.dataset.target, tk = teamIx(s.i), team = s.teams[tk];
  const term = termOf(sc, id);
  $$('.ask').forEach(x => x.classList.remove('ask')); $$('.ping').forEach(x => x.classList.remove('ping'));
  select(null);
  if (accepts(sc, key, id)) {
    st.placed[id] = key;
    const r = applyScore(team, 'hit');
    st.pts += r.delta; save();
    fx.sound.play('hit');
    chip?.classList.add('gone');
    fx.fly(from || chip, tg, term, '').then(() => {
      if (kindOf(sc) === 'classify') {
        const list = $('.binlist', tg);
        const span = document.createElement('span');
        span.className = 'placed'; span.textContent = term;
        list.insertBefore(span, $('.drophint', list));
        fx.stick(span);
      } else {
        tg.classList.add('done'); tg.disabled = true; tg.setAttribute('aria-label', term);
        $('span', tg).textContent = term;
        tg.closest('.mcard')?.classList.add('done');
        $(`polyline[data-for="${id}"]`)?.classList.add('done', 'draw');
        $(`.dot[data-for="${id}"]`)?.classList.add('done');
        fx.stick(tg);
      }
      fx.burst(tg, `+${r.gained}`);
    });
    bump(tk);
    if (r.bonus) { fx.banner(t('streakBanner')); fx.sound.play('bonus'); }
    const n = Object.keys(st.placed).length;
    $('#prog').textContent = `${n} / ${sc.ids.length}`;
    $('#bar').style.width = `${(n / sc.ids.length) * 100}%`;
    fb('ok', `${pick(t('fbHit'))} ${term}`);
    if (n === sc.ids.length) { st.end = Date.now(); save(); setTimeout(finish, fx.reduced() ? 200 : 700); }
  } else {
    const r = applyScore(team, 'miss');
    st.errors++; st.pts += r.delta;
    if (!st.missed.includes(id)) st.missed.push(id);
    save();
    fx.sound.play('miss');
    fx.shake(tg);
    if (from) fx.bounceBack(from, chip, term, ''); else fx.shake(chip);
    fx.burst(tg, '−3', 'loss');
    bump(tk);
    fb('err', t('fbMiss'));
  }
}

function hint(sc, st) {
  const left = sc.chips.filter(id => st.placed[id] == null);
  if (!left.length) return;
  const id = selected && left.includes(selected) ? selected : pick(left);
  const tg = $(`#board [data-target="${CSS.escape(targetFor(sc, id))}"]`);
  const r = applyScore(curTeam(), 'hint');
  st.hints++; st.pts += r.delta; save();
  bump(teamIx(s.i));
  fx.sound.play('hint');
  select(id);
  $$('.ask').forEach(x => x.classList.remove('ask'));
  tg?.classList.add('ask');
  $(`.dot[data-for="${id}"]`)?.classList.add('ping');
  fb('info', t('fbHint'));
  fx.burst($('#hint'), '−5', 'loss');
}

function finish() {
  if (!s || s.finished) return;
  fx.sound.play('level');
  render();
}

function doneCard() {
  const st = s.sc[s.i], n = st.skipped ? 0 : stars(st.errors, st.hints), last = s.i === SCREENS - 1;
  const nextTeam = s.teams[teamIx(s.i + 1)];
  $('#work').innerHTML = `
    <div class="done-card">
      <h2>${st.skipped ? t('skippedTitle') : t('doneTitle')}</h2>
      ${st.skipped ? '' : starRow(n)}
      <div class="stats">
        <div><span>${t('errors')}</span><b>${st.errors}</b></div>
        <div><span>${t('hints')}</span><b>${st.hints}</b></div>
        <div><span>${t('time')}</span><b>${formatTime((st.end || Date.now()) - (st.start || Date.now()))}</b></div>
        <div><span>${t('earned')}</span><b>${st.pts >= 0 ? '+' : ''}${st.pts}</b></div>
      </div>
      ${!last && s.teams.length > 1 ? `<p class="nextturn" style="--tc:${nextTeam.color}"><i></i>${esc(t('nextTurn', { team: nextTeam.name }))}</p>` : ''}
      <button class="btn big" id="next">${last ? t('toResults') : t('next')} ${ic('play')}</button>
    </div>`;
  $$('.done-card .stars svg').forEach((sv, i) => fx.stamp(sv, 120 + i * 160));
  $('#next').onclick = () => {
    if (last) s.finished = true; else s.i++;
    save(); render();
  };
  $('#next').focus({ preventScroll: true });
}

/* ---------- Resultats ---------- */
function results() {
  document.body.style.removeProperty('--sys');
  const starsBy = {};
  s.sc.forEach((st, k) => { if (!st.skipped && st.end) starsBy[teamIx(k)] = (starsBy[teamIx(k)] || 0) + stars(st.errors, st.hints); });
  const rank = ranking(s.teams, starsBy);
  const tie = rank.length > 1 && rank[0].points === rank[1].points && rank[0].stars === rank[1].stars && rank[0].errors === rank[1].errors;
  const headline = s.teams.length === 1 ? t('soloDone') : tie ? t('tie') : t('winner', { name: rank[0].name });
  const missed = s.run.map((sc, k) => ({ sc, k, ids: s.sc[k].missed })).filter(x => x.ids.length);
  app.innerHTML = `
  <div class="reportwrap"><div class="report">
    <div class="sheet">
      <div class="row between"><h1>${t('results')}</h1><span class="muted">${new Date().toLocaleDateString(getLang() === 'es' ? 'es-ES' : 'ca-ES')}</span></div>
      <p class="headline">${esc(headline)}</p>
      <div class="podium">${rank.map((r, i) => `
        <div class="pod p${i + 1}" style="--tc:${r.color}">
          <span class="place">${i + 1}</span><b class="pname">${esc(r.name)}</b><b class="ppts num">${r.points}</b><span class="punit">${t('points')}</span>
          <span class="pmeta">${ic('star')} ${r.stars} · ${t('totalErrors')} ${r.errors}</span>
        </div>`).join('')}</div>
      <table>
        <thead><tr>${t('th').map((h, i) => `<th class="${i >= 3 ? 'num' : ''}">${h}</th>`).join('')}</tr></thead>
        <tbody>${s.run.map((sc, k) => { const st = s.sc[k], tm = s.teams[teamIx(k)]; return `<tr>
          <td>${k + 1}</td><td><b>${esc(titleOf(sc))}</b><br><span class="muted">${t('kind.' + kindOf(sc))} · ${t(raOf(sc) === 3 ? 'ra3' : 'ra4')}</span></td>
          <td><span class="tdot" style="--tc:${tm.color}"></span>${esc(tm.name)}</td>
          <td class="num">${st.skipped ? '—' : starRow(stars(st.errors, st.hints), 'mini')}</td>
          <td class="num">${st.errors}</td><td class="num">${st.hints}</td>
          <td class="num">${st.end && st.start ? formatTime(st.end - st.start) : '—'}</td><td class="num">${st.pts}</td></tr>`; }).join('')}</tbody>
      </table>
      <div class="reviewbox"><h2>${t('review')}</h2>
        ${missed.length ? `<p class="muted">${t('reviewLead')}</p><ul>${missed.map(x => `<li><b>${esc(titleOf(x.sc))}:</b> ${x.ids.map(id => esc(termOf(x.sc, id))).join(' · ')}</li>`).join('')}</ul>` : `<p>${t('reviewNone')}</p>`}
      </div>
    </div>
    <div class="row no-print">
      <button class="btn" id="print">${ic('pdf')} ${t('print')}</button>
      <button class="btn" id="again">${ic('rotate')} ${t('again')}</button>
      <button class="btn ghost" id="home2">${ic('exit')} ${t('home')}</button>
    </div>
  </div></div>`;
  fx.sound.play('level');
  $$('.pod').forEach((p, i) => fx.stamp(p, 150 + i * 180));
  $('#print').onclick = () => window.print();
  $('#again').onclick = () => { s = newGame(s.teams.map(x => x.name), s.repeat); save(); render(); };
  $('#home2').onclick = () => { s = null; try { localStorage.removeItem(KEY); } catch { /* */ } render(); };
}

/* ---------- Ganxo per a les proves automàtiques (?test) ---------- */
if (TEST) {
  window.__pq = {
    state: () => s,
    targetFor: id => targetFor(s.run[s.i], id),
    wrongTargetFor: id => {
      const sc = s.run[s.i], ok = targetFor(sc, id);
      return $$('#board [data-target]').map(el => el.dataset.target).find(k => k !== ok && !$(`#board [data-target="${CSS.escape(k)}"]`).disabled);
    },
  };
}

render();
