// Làmines anatòmiques en SVG (viewBox 1000 × 700). El dibuix ocupa la franja central (x 250–750);
// les columnes laterals queden lliures per als forats de les etiquetes.
// Cada punt d'ancoratge es calcula amb els mateixos paràmetres que dibuixen l'estructura.

export const VIEW = { w: 1000, h: 700, left: 250, right: 750 };

const f = n => Math.round(n * 10) / 10;
const rad = d => (d * Math.PI) / 180;
const polar = (c, r, deg) => [f(c[0] + r * Math.cos(rad(deg))), f(c[1] + r * Math.sin(rad(deg)))];
const P = p => `${p[0]} ${p[1]}`;
const mirrorY = (p, cy) => [p[0], f(2 * cy - p[1])];

/* Traç comú: tinta fosca, vores arrodonides */
const INK = '#3a3252';

/* =========================================================================
   ULL DRET · secció horitzontal, la part anterior a l'esquerra
   ========================================================================= */
function eye() {
  const C = [500, 350];
  const R = { sclO: 200, sclI: 184, chI: 176, retI: 164 };
  const OPEN = 32;                       // mitja obertura anterior (graus al voltant de 180°)
  const CIL = [OPEN + 4, OPEN + 18];     // cos ciliar, en graus des de 180°
  // còrnia: arc que passa pels límits de l'obertura i bomba fins a x = 285
  const lim = polar(C, R.sclO, 180 + OPEN), limB = polar(C, R.sclO, 180 - OPEN);
  const apex = 285, half = C[1] - lim[1], sag = lim[0] - apex;
  const Rc = (half * half + sag * sag) / (2 * sag), Cc = [apex + Rc, C[1]];
  const apexIn = 298, Rci = 142, Cci = [apexIn + Rci, C[1]];
  const cornIn = y => f(Cci[0] - Math.sqrt(Rci * Rci - (y - C[1]) ** 2));
  const cornOut = y => f(Cc[0] - Math.sqrt(Rc * Rc - (y - C[1]) ** 2));
  const ciTop = C[1] - Math.sqrt(R.sclI ** 2 - 152 ** 2);         // paret interna a x = 348
  const iris = { x0: 343, x1: 353, top: f(ciTop), pupil: 32 };
  const lens = { c: [398, 350], rx: 26, ry: 78 };
  const cil1 = polar(C, R.sclI, 180 + CIL[0]), cil2 = polar(C, R.sclI, 180 + CIL[1]);
  const cilApex = [f(lens.c[0] - 22), f(lens.c[1] - lens.ry - 18)];
  const NERVE = [11, 25], ND = 18;                                   // nervi òptic (graus, nasal = avall)
  const nU = [Math.cos(rad(ND)), Math.sin(rad(ND))];
  const n1 = polar(C, R.retI, NERVE[0]), n2 = polar(C, R.retI, NERVE[1]);
  const o1 = polar(C, R.sclO, NERVE[0]), o2 = polar(C, R.sclO, NERVE[1]);
  const L = 58, e1 = [f(o1[0] + nU[0] * L), f(o1[1] + nU[1] * L)], e2 = [f(o2[0] + nU[0] * L), f(o2[1] + nU[1] * L)];
  const disc = polar(C, R.retI + 4, ND), fovea = polar(C, R.retI + 3, -4);

  const ring = (ro, ri, a0, a1) => {
    const A = polar(C, ro, a0), B = polar(C, ro, a1), Ci = polar(C, ri, a1), D = polar(C, ri, a0);
    const large = ((a1 - a0 + 360) % 360) > 180 ? 1 : 0;
    return `M${P(A)} A${ro} ${ro} 0 ${large} 1 ${P(B)} L${P(Ci)} A${ri} ${ri} 0 ${large} 0 ${P(D)} Z`;
  };
  const a0 = 180 + OPEN, a1 = 180 - OPEN + 360;
  const r0 = 180 + CIL[1], r1 = 180 - CIL[1] + 360;
  // músculs rectes (lateral a dalt, medial a baix): banda que abraça el globus i va cap a l'àpex de l'òrbita
  const muscle = sgn => {
    const pts = [];
    for (let a = 236; a <= 318; a += 6) pts.push(polar(C, R.sclO + 3, sgn > 0 ? a : 360 - a));
    const outer = [];
    for (let a = 318; a >= 236; a -= 6) outer.push(polar(C, R.sclO + 3 + 14 + (a - 236) * 0.12, sgn > 0 ? a : 360 - a));
    const end = sgn > 0 ? [[748, 300], [744, 322]] : [[744, 378], [748, 400]];
    return `M${pts.map(P).join(' L')} L${P(end[1])} L${P(end[0])} L${outer.map(P).join(' L')} Z`;
  };
  const mTop = polar(C, R.sclO + 12, 262), mBot = mirrorY(mTop, C[1]);

  const svg = `
  <defs>
    <radialGradient id="eyVit" cx="45%" cy="45%" r="60%"><stop offset="0" stop-color="#fbfdff"/><stop offset="1" stop-color="#e3eff6"/></radialGradient>
    <linearGradient id="eyLens" x1="0" x2="1"><stop offset="0" stop-color="#fffbe9"/><stop offset="1" stop-color="#efe3b4"/></linearGradient>
    <linearGradient id="eyMus" x1="0" x2="1"><stop offset="0" stop-color="#d9777a"/><stop offset="1" stop-color="#b9545c"/></linearGradient>
  </defs>
  <path d="${muscle(1)}" fill="url(#eyMus)" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
  <path d="${muscle(-1)}" fill="url(#eyMus)" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
  <circle cx="${C[0]}" cy="${C[1]}" r="${R.retI}" fill="url(#eyVit)"/>
  <path d="M${P(o1)} L${P(e1)} L${P(e2)} L${P(o2)} Z" fill="#f3e3b0" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M${P([f((o1[0] + o2[0]) / 2 - nU[0] * 8), f((o1[1] + o2[1]) / 2 - nU[1] * 8)])} L${P([f((e1[0] + e2[0]) / 2), f((e1[1] + e2[1]) / 2)])}" stroke="#c8343e" stroke-width="4" stroke-linecap="round"/>
  <path d="${ring(R.sclO, R.sclI, a0, a1)}" fill="#f6f1e6" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="${ring(R.sclI, R.chI, r0, r1)}" fill="#7d3b2d" stroke="#4f2219" stroke-width="1"/>
  <path d="${ring(R.chI, R.retI, r0, r1)}" fill="#ef9f6a" stroke="#b5643a" stroke-width="1.2"/>
  <path d="M${P(n1)} Q${P(disc)} ${P(n2)}" fill="#f6e7b9" stroke="#b5643a" stroke-width="1.5"/>
  <circle cx="${disc[0]}" cy="${disc[1]}" r="10" fill="#fbefc5" stroke="#c99a3c" stroke-width="1.5"/>
  <ellipse cx="${fovea[0]}" cy="${fovea[1]}" rx="7" ry="13" fill="#f2cf5e" stroke="#b5643a" stroke-width="1"/>
  <path d="M${f(fovea[0] - 6)} ${f(fovea[1] - 9)} Q${f(fovea[0] + 4)} ${fovea[1]} ${f(fovea[0] - 6)} ${f(fovea[1] + 9)}" fill="none" stroke="#7d3b2d" stroke-width="2"/>
  <path d="M${P([cornIn(250), 250])} A${Rci} ${Rci} 0 0 0 ${P([cornIn(450), 450])} L${iris.x0} 450 L${iris.x0} 250 Z" fill="#d6eef7"/>
  <path d="M${P(lim)} A${f(Rc)} ${f(Rc)} 0 0 0 ${P(limB)} L${P([cornIn(450), 450])} A${Rci} ${Rci} 0 0 1 ${P([cornIn(250), 250])} Z" fill="#eaf7fc" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
  ${[1, -1].map(s => {
    const k = p => (s > 0 ? p : mirrorY(p, C[1]));
    const top = s > 0 ? iris.top : f(2 * C[1] - iris.top), pupil = s > 0 ? C[1] - iris.pupil : C[1] + iris.pupil;
    const y0 = Math.min(top, pupil), y1 = Math.max(top, pupil);
    return `
  <path d="M${P(k(cil1))} L${P(k(cil2))} L${P(k(cilApex))} Z" fill="#9b5442" stroke="#4f2219" stroke-width="1.5" stroke-linejoin="round"/>
  ${[0, 1, 2, 3].map(i => `<path d="M${P(k([f(cilApex[0] - 4 + i * 3), f(cilApex[1] + 2 - i * 4)]))} L${P(k([f(lens.c[0] - 9 + i * 6), f(lens.c[1] - lens.ry + 4 + i * 1.5)]))}" stroke="#8a7a6a" stroke-width="1.1"/>`).join('')}
  <rect x="${iris.x0}" y="${y0}" width="${iris.x1 - iris.x0}" height="${f(y1 - y0)}" rx="4" fill="#4c86a6" stroke="#1f4a63" stroke-width="1.6"/>`;
  }).join('')}
  <ellipse cx="${lens.c[0]}" cy="${lens.c[1]}" rx="${lens.rx}" ry="${lens.ry}" fill="url(#eyLens)" stroke="#a48c45" stroke-width="2"/>
  <path d="M${lens.c[0]} ${lens.c[1] - lens.ry + 6} Q${lens.c[0] + 8} ${lens.c[1]} ${lens.c[0]} ${lens.c[1] + lens.ry - 6}" fill="none" stroke="#e2d39a" stroke-width="1.5"/>
  <path d="M232 350 H272" stroke="#c99a3c" stroke-width="2" stroke-dasharray="4 6" opacity=".0"/>`;

  const parts = [
    ['cornia', [f((cornOut(300) + cornIn(300)) / 2), 300]],
    ['aquos', [324, 400]],
    ['iris', [348, 282]],
    ['pupil', [348, 350]],
    ['cristal', [404, 326]],
    ['ciliar', [f((cil1[0] + cil2[0] + cilApex[0]) / 3), f((cil1[1] + cil2[1] + cilApex[1]) / 3)]],
    ['zonula', [f(cilApex[0] + 8), f((cilApex[1] + lens.c[1] - lens.ry) / 2 + 2)]],
    ['sclera', polar(C, (R.sclO + R.sclI) / 2, -62)],
    ['coroide', polar(C, (R.sclI + R.chI) / 2, -38)],
    ['retina', polar(C, (R.chI + R.retI) / 2, -18)],
    ['fovea', fovea],
    ['disc', disc],
    ['nervi', [f(disc[0] + nU[0] * 64), f(disc[1] + nU[1] * 64)]],
    ['vitri', [548, 286]],
    ['muscul', mTop],
  ];
  return { svg, parts, mBot };
}

/* =========================================================================
   ORELLA DRETA · tall coronal, l'exterior a l'esquerra
   ========================================================================= */
function ear() {
  const canal = { top: [338, 334], bot: [338, 392] };
  const tymp = { top: [476, 316], bot: [492, 404] };
  const umbo = [487, 370];
  const mallHead = [503, 280], incBody = [534, 284], incTip = [541, 334];
  const stHead = [548, 340], oval = [570, 348];
  const round = [570, 398];
  const vest = { c: [604, 350], rx: 30, ry: 28 };
  const coch = { c: [660, 436], r0: 60, turns: 2.5, k: 0.84 };
  const spiral = [];
  const N = 140, startA = 200;
  for (let i = 0; i <= N; i++) {
    const tt = i / N, a = startA + tt * coch.turns * 360, r = coch.r0 * (1 - coch.k * tt);
    spiral.push(polar(coch.c, r, a));
  }
  const sp = 'M' + spiral.map(P).join(' L');
  const tube = { pts: [[505, 420], [542, 420], [642, 560], [614, 578]] };
  const canalsD = [
    'M592 326 C566 280 568 212 612 208 C656 204 666 262 638 300 C630 312 622 320 614 326',
    'M622 332 C652 244 728 240 730 296 C732 338 692 352 632 350',
    'M626 344 C662 322 702 324 704 346 C706 370 666 374 630 362',
  ];
  const tubeS = (d, w1, w2, c) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w1}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w2}" stroke-linecap="round"/>`;
  const nerveD = `M628 346 C652 352 670 362 694 364 M${coch.c[0]} ${coch.c[1] - 4} C674 410 684 382 696 368 M694 366 C714 362 732 358 752 354`;

  const svg = `
  <defs>
    <linearGradient id="erBone" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3ead8"/><stop offset="1" stop-color="#e4d5b6"/></linearGradient>
    <radialGradient id="erSkin" cx="35%" cy="45%" r="75%"><stop offset="0" stop-color="#f8dcc6"/><stop offset="1" stop-color="#e6a988"/></radialGradient>
    <pattern id="erDots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.4" fill="#d2c09a"/><circle cx="10" cy="10" r="1" fill="#d9c8a5"/></pattern>
  </defs>
  <path d="M336 150 C430 120 640 130 742 190 L748 590 C640 610 470 600 336 560 Z" fill="url(#erBone)" stroke="#b9a37a" stroke-width="2"/>
  <path d="M336 150 C430 120 640 130 742 190 L748 590 C640 610 470 600 336 560 Z" fill="url(#erDots)" opacity=".6"/>
  <path d="M336 150 V560" stroke="#d9a084" stroke-width="10" stroke-linecap="round"/>
  <path d="M338 236 C330 180 312 132 276 126 C238 120 220 168 222 222 C224 282 240 330 238 384 C236 430 224 472 246 500 C268 526 302 510 314 478 C322 456 328 440 338 430 Z" fill="url(#erSkin)" stroke="#9a5a43" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M326 238 C318 188 302 150 278 146 C252 144 240 182 242 226 C244 282 258 330 256 386 C255 420 250 448 262 476" fill="none" stroke="#c07d60" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M318 262 C296 272 286 300 294 318" fill="none" stroke="#c07d60" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M338 300 C312 298 290 322 290 360 C290 398 312 424 338 420 Z" fill="#dc9a7c" opacity=".55"/>
  <path d="M${P(canal.top)} C384 322 430 344 ${P(tymp.top)} L${P(tymp.bot)} C440 392 392 406 ${P(canal.bot)} Z" fill="#f8dccb" stroke="#9a5a43" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M352 352 C380 344 420 360 456 350" fill="none" stroke="#e7b9a2" stroke-width="2" stroke-dasharray="2 7" stroke-linecap="round"/>
  <path d="M480 250 C500 232 554 234 574 254 L578 422 C556 436 520 436 492 422 Z" fill="#fffaf3" stroke="#a88f63" stroke-width="2.2" stroke-linejoin="round"/>
  <path d="M${P(tube.pts[0])} L${P(tube.pts[1])} L${P(tube.pts[2])} L${P(tube.pts[3])} Z" fill="#fde9dc" stroke="#9a5a43" stroke-width="2.2" stroke-linejoin="round"/>
  <path d="M${P(tymp.top)} Q${umbo[0] + 6} ${umbo[1] - 30} ${P(umbo)} Q${umbo[0] + 2} ${umbo[1] + 14} ${P(tymp.bot)}" fill="none" stroke="#a5452c" stroke-width="5" stroke-linecap="round"/>
  ${tubeS(`M${P(umbo)} L${mallHead[0] - 2} ${mallHead[1] + 16}`, 10, 6, '#efe7d2')}
  <circle cx="${mallHead[0]}" cy="${mallHead[1]}" r="16" fill="#efe7d2" stroke="${INK}" stroke-width="2.4"/>
  <path d="M${incBody[0] - 14} ${incBody[1] - 10} C${incBody[0] + 6} ${incBody[1] - 24} ${incBody[0] + 22} ${incBody[1] - 6} ${incBody[0] + 15} ${incBody[1] + 12} L${incTip[0] + 4} ${incTip[1]} L${incTip[0] - 5} ${incTip[1]} L${incBody[0] - 3} ${incBody[1] + 14} C${incBody[0] - 14} ${incBody[1] + 12} ${incBody[0] - 19} ${incBody[1]} ${incBody[0] - 14} ${incBody[1] - 10} Z" fill="#efe7d2" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>
  <circle cx="${stHead[0]}" cy="${stHead[1]}" r="6" fill="#efe7d2" stroke="${INK}" stroke-width="2.2"/>
  ${tubeS(`M${stHead[0] + 4} ${stHead[1] - 4} L${oval[0] - 3} ${oval[1] - 15} M${stHead[0] + 4} ${stHead[1] + 4} L${oval[0] - 3} ${oval[1] + 15}`, 7, 3.5, '#efe7d2')}
  ${canalsD.map((d, i) => tubeS(d, i === 2 ? 15 : 17, i === 2 ? 10 : 12, i === 2 ? '#fbe9c8' : '#f8e0b5')).join('')}
  <ellipse cx="592" cy="318" rx="10" ry="9" fill="#f8e0b5" stroke="${INK}" stroke-width="2"/>
  ${tubeS(`M${vest.c[0] + 8} 380 C 616 402 610 412 ${P(spiral[0])}`, 24, 18, '#f6d39b')}
  <path d="${sp}" fill="none" stroke="${INK}" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${sp}" fill="none" stroke="#f6d39b" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${sp}" fill="none" stroke="#c9843f" stroke-width="1.6" stroke-dasharray="1 8" stroke-linecap="round"/>
  <ellipse cx="${vest.c[0]}" cy="${vest.c[1]}" rx="${vest.rx}" ry="${vest.ry}" fill="#f8e0b5" stroke="${INK}" stroke-width="2.4"/>
  <ellipse cx="${vest.c[0] - 6}" cy="${vest.c[1] - 6}" rx="9" ry="7" fill="#fbecd0" stroke="#c48a4a" stroke-width="1.2"/>
  <ellipse cx="${vest.c[0] + 4}" cy="${vest.c[1] + 10}" rx="8" ry="6" fill="#fbecd0" stroke="#c48a4a" stroke-width="1.2"/>
  <path d="M${oval[0]} ${oval[1] - 17} V${oval[1] + 17}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
  <path d="M${oval[0]} ${oval[1] - 15} V${oval[1] + 15}" stroke="#efe7d2" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M${round[0] - 2} ${round[1] - 11} Q${round[0] - 9} ${round[1]} ${round[0] - 2} ${round[1] + 11}" fill="#fff" stroke="#a5452c" stroke-width="3.5" stroke-linecap="round"/>
  ${tubeS(nerveD, 15, 10, '#f1dc8b')}`;

  const parts = [
    ['pavello', [236, 300]],
    ['conducte', [404, 357]],
    ['timpa', [483, 334]],
    ['martell', mallHead],
    ['enclusa', [incBody[0] + 2, incBody[1] + 2]],
    ['estrep', [f((stHead[0] + oval[0]) / 2), oval[1] - 7]],
    ['caixa', [522, 408]],
    ['trompa', [f((tube.pts[1][0] + tube.pts[2][0]) / 2 - 14), f((tube.pts[1][1] + tube.pts[2][1]) / 2)]],
    ['oval', [oval[0], f(oval[1] + 13)]],
    ['rodona', [round[0] - 5, round[1]]],
    ['vestibul', [vest.c[0] + 2, vest.c[1] + 2]],
    ['canals', [612, 208]],
    ['coclea', spiral[60]],
    ['nervi8', [732, 357]],
  ];
  return { svg, parts };
}

/* Generador pseudoaleatori determinista (textures repetibles) */
function rng(seed) { let x = seed >>> 0; return () => ((x = (x * 1664525 + 1013904223) >>> 0) / 4294967296); }

/* =========================================================================
   LLENGUA · cara dorsal (arrel a dalt, punta a baix) + detall d'un botó gustatiu
   ========================================================================= */
function tongue() {
  const cx = 400;
  const outline = 'M300 170 C280 250 268 380 290 500 C308 590 360 632 400 632 C440 632 492 590 510 500 C532 380 520 250 500 170 C470 150 330 150 300 170 Z';
  // dins de la llengua? (aproximació per a les textures)
  const halfW = y => (y < 170 ? 0 : y < 500 ? 100 + (y - 170) * 0.03 + 12 : 112 * Math.sqrt(Math.max(0, 1 - ((y - 500) / 132) ** 2)));
  const inside = (x, y, m = 0) => y > 175 && y < 625 && Math.abs(x - cx) < halfW(y) - m;
  const V = { l: [312, 304], apex: [cx, 252], r: [488, 304] };
  const cv = [-3, -2, -1, 0, 1, 2, 3].map(i => [cx + i * 26, 286 + Math.abs(i) * 11]);
  const R = rng(7);
  const fung = [];
  while (fung.length < 38) {
    const x = 300 + R() * 200, y = 330 + R() * 290;
    const edge = Math.abs(x - cx) / Math.max(1, halfW(y));
    if (inside(x, y, 10) && (y > 520 || edge > 0.55 || R() < 0.15)) fung.push([f(x), f(y)]);
  }
  const fili = [];
  const R2 = rng(11);
  while (fili.length < 260) {
    const x = 290 + R2() * 220, y = 320 + R2() * 300;
    if (inside(x, y, 8) && Math.abs(x - cx) > 4) fili.push([f(x), f(y), f((R2() - 0.5) * 40)]);
  }
  const fol = [0, 1, 2, 3, 4].map(i => 318 + i * 12);
  const bud = { c: [650, 404], r: 96 };
  const pore = [650, 342];
  const cells = [-30, -20, -10, 0, 10, 20, 30].map((dx, i) => ({ dx, gust: i % 2 === 1 }));
  const budPath = `M${pore[0] - 6} ${pore[1]} C${pore[0] - 46} ${pore[1] + 20} ${pore[0] - 48} ${pore[1] + 100} ${pore[0] - 22} ${pore[1] + 116} L${pore[0] + 22} ${pore[1] + 116} C${pore[0] + 48} ${pore[1] + 100} ${pore[0] + 46} ${pore[1] + 20} ${pore[0] + 6} ${pore[1]} Z`;
  const zoomFrom = cv[5];

  const svg = `
  <defs>
    <radialGradient id="tgSkin" cx="50%" cy="60%" r="65%"><stop offset="0" stop-color="#f5b3b4"/><stop offset="1" stop-color="#df7f88"/></radialGradient>
    <clipPath id="tgBud"><circle cx="${bud.c[0]}" cy="${bud.c[1]}" r="${bud.r}"/></clipPath>
  </defs>
  <path d="M360 122 C366 78 434 78 440 122 C424 136 376 136 360 122 Z" fill="#f4c4b8" stroke="#9b3d4a" stroke-width="2.2"/>
  <path d="${outline}" fill="url(#tgSkin)" stroke="#9b3d4a" stroke-width="2.6"/>
  ${[1, -1].map(s => `<ellipse cx="${cx + s * 122}" cy="196" rx="17" ry="32" fill="#e8949a" stroke="#9b3d4a" stroke-width="2"/>
  <path d="M${cx + s * 122 - 6} 180 q6 6 0 12 M${cx + s * 122 + 5} 196 q-6 6 0 12 M${cx + s * 122 - 4} 210 q6 5 0 10" fill="none" stroke="#b5596a" stroke-width="1.6"/>`).join('')}
  ${Array.from({ length: 16 }, (_, i) => { const x = 330 + (i % 8) * 20 + (i > 7 ? 10 : 0), y = 196 + (i > 7 ? 24 : 0); return `<circle cx="${x}" cy="${y}" r="7" fill="#e58f97" stroke="#c4677a" stroke-width="1"/>`; }).join('')}
  ${fili.map(([x, y, a]) => `<path d="M${x} ${y} l0 -5" transform="rotate(${a} ${x} ${y})" stroke="#f6c9cb" stroke-width="2" stroke-linecap="round"/>`).join('')}
  <path d="M${cx} 330 V560" stroke="#c1606f" stroke-width="3" stroke-linecap="round"/>
  <path d="M${P(V.l)} L${P(V.apex)} L${P(V.r)}" fill="none" stroke="#a94459" stroke-width="2.5" stroke-dasharray="7 5"/>
  <circle cx="${V.apex[0]}" cy="${V.apex[1]}" r="4" fill="#8f3347"/>
  ${cv.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12" fill="#e98d96" stroke="#8f3347" stroke-width="1.6"/><circle cx="${x}" cy="${y}" r="7.5" fill="#f3b1b6" stroke="#8f3347" stroke-width="1.4"/>`).join('')}
  ${[1, -1].map(s => fol.map(y => `<path d="M${f(cx + s * (halfW(y) - 3))} ${y - 4} q${-s * 10} 4 0 9" fill="none" stroke="#8f3347" stroke-width="2.2" stroke-linecap="round"/>`).join('')).join('')}
  ${fung.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.6" fill="#c9374f" stroke="#fff" stroke-width="1.2"/>`).join('')}
  <path d="M${P(zoomFrom)} L${bud.c[0] - 70} ${bud.c[1] - 66} M${P(zoomFrom)} L${bud.c[0] - 58} ${bud.c[1] + 76}" stroke="#8a83ad" stroke-width="1.6" stroke-dasharray="4 5"/>
  <circle cx="${zoomFrom[0]}" cy="${zoomFrom[1]}" r="16" fill="none" stroke="#8a83ad" stroke-width="2"/>
  <g clip-path="url(#tgBud)">
    <rect x="550" y="300" width="200" height="${pore[1] - 300}" fill="#e2f1f8"/>
    <rect x="550" y="${pore[1]}" width="200" height="${116 + 8}" fill="#f7cfcf"/>
    ${Array.from({ length: 40 }, (_, i) => { const x = 556 + (i % 10) * 20 + (Math.floor(i / 10) % 2) * 10, y = pore[1] + 12 + Math.floor(i / 10) * 30; return `<ellipse cx="${x}" cy="${y}" rx="10" ry="${7 + (i % 3)}" fill="#f9dcdc" stroke="#d9a3a8" stroke-width="1"/>`; }).join('')}
    <rect x="550" y="${pore[1] + 120}" width="200" height="120" fill="#fbe7d6"/>
    <path d="M550 ${pore[1] + 120} H750" stroke="#c98f8f" stroke-width="2"/>
    <path d="${budPath}" fill="#f3e2e8" stroke="#8f3347" stroke-width="2"/>
    ${cells.map(({ dx, gust }) => `<path d="M${pore[0] + dx * 0.2} ${pore[1] + 6} C${pore[0] + dx * 1.2} ${pore[1] + 40} ${pore[0] + dx * 1.2} ${pore[1] + 80} ${pore[0] + dx * 0.7} ${pore[1] + 112}" fill="none" stroke="${gust ? '#b9577a' : '#e3c3cf'}" stroke-width="${gust ? 9 : 8}" stroke-linecap="round"/>`).join('')}
    ${cells.filter(c => c.gust).map(({ dx }) => `<ellipse cx="${f(pore[0] + dx * 1.15)}" cy="${pore[1] + 66}" rx="4" ry="6" fill="#6d2443"/>`).join('')}
    ${[-6, -2, 2, 6].map(dx => `<path d="M${pore[0] + dx} ${pore[1] + 2} v-9" stroke="#8f3347" stroke-width="1.6" stroke-linecap="round"/>`).join('')}
    <path d="M${pore[0] - 16} ${pore[1] + 196} C${pore[0] - 18} ${pore[1] + 150} ${pore[0] - 10} ${pore[1] + 120} ${pore[0] - 6} ${pore[1] + 96} M${pore[0] + 22} ${pore[1] + 196} C${pore[0] + 20} ${pore[1] + 150} ${pore[0] + 12} ${pore[1] + 120} ${pore[0] + 8} ${pore[1] + 96}" fill="none" stroke="#7b6522" stroke-width="7" stroke-linecap="round"/>
    <path d="M${pore[0] - 16} ${pore[1] + 196} C${pore[0] - 18} ${pore[1] + 150} ${pore[0] - 10} ${pore[1] + 120} ${pore[0] - 6} ${pore[1] + 96} M${pore[0] + 22} ${pore[1] + 196} C${pore[0] + 20} ${pore[1] + 150} ${pore[0] + 12} ${pore[1] + 120} ${pore[0] + 8} ${pore[1] + 96}" fill="none" stroke="#f1dc8b" stroke-width="3.5" stroke-linecap="round"/>
  </g>
  <circle cx="${bud.c[0]}" cy="${bud.c[1]}" r="${bud.r}" fill="none" stroke="${INK}" stroke-width="3"/>`;

  const parts = [
    ['epiglotis', [cx, 104]],
    ['amigdala', [cx - 122, 200]],
    ['caliciformes', cv[1]],
    ['fungiformes', fung.find(([x, y]) => y > 560 && x < cx) || fung[0]],
    ['filiformes', [440, 440]],
    ['foliades', [f(cx + halfW(338) - 6), 338]],
    ['solc', [f((V.apex[0] + V.r[0]) / 2), f((V.apex[1] + V.r[1]) / 2)]],
    ['apex', [cx, 618]],
    ['boto', [f(pore[0] - 34), pore[1] + 70]],
    ['porus', pore],
    ['gustativa', [f(pore[0] + 10 * 1.15), pore[1] + 66]],
    ['suport', [f(pore[0] + 30 * 1.0), pore[1] + 90]],
    ['fibra', [pore[0] + 21, pore[1] + 160]],
  ];
  return { svg, parts };
}

/* =========================================================================
   FOSSES NASALS · tall sagital (cara a l'esquerra), paret lateral
   ========================================================================= */
function nose() {
  const crib = { x0: 420, x1: 528, y: 236 };
  const bulb = { c: [468, 220], rx: 50, ry: 11 };
  const conchae = {
    sup: 'M604 262 C566 250 506 252 474 270 C488 286 548 288 604 282 Z',
    mid: 'M612 300 C562 286 470 290 420 320 C442 342 542 340 612 332 Z',
    inf: 'M614 366 C562 348 450 350 378 388 C408 414 542 412 614 402 Z',
  };
  const svg = `
  <defs>
    <linearGradient id="nsSkin" x1="0" x2="1"><stop offset="0" stop-color="#f3c6a5"/><stop offset="1" stop-color="#eab693"/></linearGradient>
    <linearGradient id="nsBrain" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6dfe1"/><stop offset="1" stop-color="#eec9cd"/></linearGradient>
    <pattern id="nsBone" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#efe5cf"/><circle cx="3" cy="4" r="1.2" fill="#d6c59d"/><circle cx="9" cy="9" r="1" fill="#dccca8"/></pattern>
  </defs>
  <path d="M300 64 C296 120 304 180 322 226 C306 270 278 326 258 364 C256 380 270 394 296 396 C300 408 300 420 296 446 C292 470 300 500 310 530 L760 530 L760 64 Z" fill="url(#nsSkin)" stroke="#9a5a43" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M318 70 C316 120 326 180 342 222 L610 222 C660 200 700 150 740 70 Z" fill="url(#nsBone)" stroke="#b9a37a" stroke-width="2"/>
  <path d="M370 222 C380 150 470 96 580 92 C660 90 720 120 740 150 L740 222 Z" fill="url(#nsBrain)" stroke="#b07a83" stroke-width="2"/>
  <path d="M420 180 C450 150 500 146 530 160 M560 150 C600 130 650 136 690 160 M450 120 C500 104 560 104 610 112" fill="none" stroke="#c99aa2" stroke-width="2.5" stroke-linecap="round"/>
  <ellipse cx="346" cy="160" rx="18" ry="34" fill="#e2f1f8" stroke="#7aa3b8" stroke-width="2"/>
  <path d="M342 232 C330 270 300 330 282 368 L300 388 C330 380 370 400 380 430 L330 430 L330 436 L620 446 L620 240 L610 232 Z" fill="url(#nsBone)" stroke="#b9a37a" stroke-width="2"/>
  <path d="M606 224 L716 224 L716 322 C694 302 650 296 620 300 C620 280 616 250 606 236 Z" fill="url(#nsBone)" stroke="#b9a37a" stroke-width="2"/>
  <path d="M346 236 L606 236 C616 250 620 280 620 300 C650 296 692 302 712 328 L716 520 L620 520 L620 446 L560 446 L332 438 C330 420 318 404 300 398 C296 392 292 386 296 380 C310 346 330 290 346 236 Z" fill="#e4f2f8" stroke="#8fb3c4" stroke-width="2" stroke-linejoin="round"/>
  <rect x="628" y="240" width="70" height="50" rx="22" fill="#e2f1f8" stroke="#7aa3b8" stroke-width="2"/>
  <path d="M712 310 C730 360 734 440 726 520" fill="none" stroke="#d58d8d" stroke-width="8" stroke-linecap="round"/>
  <path d="M332 438 L560 446 L566 462 L330 456 Z" fill="#efe5cf" stroke="#9c8a62" stroke-width="2" stroke-linejoin="round"/>
  <path d="M560 446 C590 448 616 462 628 500 C614 506 596 496 584 480 C576 470 568 466 560 462 Z" fill="#f1a9a8" stroke="#9a5a5a" stroke-width="2"/>
  <path d="M330 460 C380 470 470 474 560 470 C590 480 610 500 614 528 L330 528 Z" fill="#ef9ea4" stroke="#9b3d4a" stroke-width="2"/>
  <path d="M${crib.x0 - 60} ${crib.y} H${crib.x1 + 70}" stroke="#9c8a62" stroke-width="6" stroke-linecap="round"/>
  <path d="M${crib.x0} ${crib.y} H${crib.x1}" stroke="#efe5cf" stroke-width="4" stroke-dasharray="6 5"/>
  <path d="M${bulb.c[0] + bulb.rx - 10} ${bulb.c[1] - 4} C560 214 600 206 650 190" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/>
  <path d="M${bulb.c[0] + bulb.rx - 10} ${bulb.c[1] - 4} C560 214 600 206 650 190" fill="none" stroke="#f1dc8b" stroke-width="9" stroke-linecap="round"/>
  <ellipse cx="${bulb.c[0]}" cy="${bulb.c[1]}" rx="${bulb.rx}" ry="${bulb.ry}" fill="#f3d978" stroke="${INK}" stroke-width="2.2"/>
  ${Array.from({ length: 9 }, (_, i) => { const x = crib.x0 + 6 + i * 12; return `<path d="M${x} ${bulb.c[1] + 8} L${x - 2} ${crib.y + 18}" stroke="#b39433" stroke-width="1.6"/>`; }).join('')}
  <path d="M${crib.x0 - 10} ${crib.y + 4} H${crib.x1 + 40} C${crib.x1 + 60} ${crib.y + 10} 590 250 600 262 C560 252 520 256 490 266 C470 258 440 250 ${crib.x0 - 10} ${crib.y + 14} Z" fill="#f2cf5e" stroke="#b9902c" stroke-width="1.6" opacity=".95"/>
  <path d="${conchae.sup}" fill="#efaaa6" stroke="#9a4c4c" stroke-width="2.2"/>
  <path d="${conchae.mid}" fill="#efaaa6" stroke="#9a4c4c" stroke-width="2.2"/>
  <path d="${conchae.inf}" fill="#efaaa6" stroke="#9a4c4c" stroke-width="2.2"/>
  <path d="M474 270 C470 262 480 258 490 262" fill="none" stroke="#b9902c" stroke-width="3"/>
  <path d="M292 380 l-8 -6 M296 372 l-9 -4 M300 386 l-6 -9" stroke="#7b4a3a" stroke-width="1.6" stroke-linecap="round"/>
  <ellipse cx="290" cy="392" rx="12" ry="6" fill="#7b4a3a" opacity=".8"/>`;

  const parts = [
    ['bulb', [bulb.c[0] - 14, bulb.c[1]]],
    ['tracte', [606, 204]],
    ['cribosa', [crib.x1 + 30, crib.y]],
    ['epiteli', [450, 244]],
    ['csup', [560, 270]],
    ['cmig', [510, 316]],
    ['cinf', [470, 386]],
    ['narina', [290, 392]],
    ['sfrontal', [346, 160]],
    ['sesfenoidal', [663, 265]],
    ['paladar', [450, 451]],
    ['nasofaringe', [668, 420]],
  ];
  return { svg, parts };
}

/* =========================================================================
   PELL · secció amb els receptors del tacte
   ========================================================================= */
function skin() {
  const X0 = 280, X1 = 720, top = 108;
  const waveY = x => f(176 + 14 * Math.sin((x - X0) / 22));
  const wave = [];
  for (let x = X0; x <= X1; x += 4) wave.push([x, waveY(x)]);
  const derBot = 430, bottom = 640;
  const surf = [];
  for (let x = X0; x <= X1; x += 8) surf.push([x, f(top + 3 * Math.sin((x - X0) / 30))]);
  const fol = { a: [372, top], b: [424, 446] };
  const folAt = t => [f(fol.a[0] + (fol.b[0] - fol.a[0]) * t), f(fol.a[1] + (fol.b[1] - fol.a[1]) * t)];
  const R = rng(5);
  const fat = [];
  for (let y = derBot + 26; y < bottom; y += 44) for (let x = X0 + 24; x < X1; x += 48) fat.push([f(x + (R() - 0.5) * 12 + ((y / 44) % 2) * 20), f(y + (R() - 0.5) * 10)]);
  const sweat = { c: [646, 476], top: [646, top] };
  const coil = [];
  for (let i = 0; i <= 80; i++) { const a = i / 80 * Math.PI * 8; coil.push([f(sweat.c[0] + 26 * Math.cos(a) * (1 - i / 160)), f(sweat.c[1] + 14 * Math.sin(a) + (i / 80) * 10 - 5)]); }
  const duct = [];
  for (let y = sweat.c[1] - 16; y >= top; y -= 4) duct.push([f(sweat.c[0] - 26 + 6 * Math.sin(y / 9) * (y < 190 ? 1.4 : 0.6)), y]);
  const meis = [528, f(waveY(528) - 2)];
  const merk = [584, waveY(584)];
  const ruff = [566, 342];
  const pac = [500, 552];
  const nerve = (pts, w = 6) => `<path d="${pts}" fill="none" stroke="#7b6522" stroke-width="${w + 3}" stroke-linecap="round" stroke-linejoin="round"/><path d="${pts}" fill="none" stroke="#f1dc8b" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

  const svg = `
  <defs>
    <clipPath id="skBlock"><rect x="${X0}" y="40" width="${X1 - X0}" height="${bottom - 40}" rx="6"/></clipPath>
    <pattern id="skEpi" width="16" height="12" patternUnits="userSpaceOnUse"><rect width="16" height="12" fill="#f3cba8"/><circle cx="5" cy="5" r="1.8" fill="#d9a07a"/><circle cx="13" cy="10" r="1.6" fill="#dba684"/></pattern>
  </defs>
  <g clip-path="url(#skBlock)">
    <path d="M${X0} ${derBot} H${X1} V${bottom} H${X0} Z" fill="#fbecc0"/>
    ${fat.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="19" fill="#fde39a" stroke="#d6b04f" stroke-width="1.6"/>`).join('')}
    <path d="M${X0} ${waveY(X0)} L${wave.map(P).join(' L')} L${X1} ${derBot} L${X0} ${derBot} Z" fill="#f7d9d3"/>
    ${Array.from({ length: 14 }, (_, i) => `<path d="M${X0 + (i % 7) * 66} ${230 + Math.floor(i / 7) * 110} q30 -16 60 0 t60 0" fill="none" stroke="#ebbcb6" stroke-width="2"/>`).join('')}
    <path d="M${X0} ${derBot} H${X1}" stroke="#d9a69b" stroke-width="2" stroke-dasharray="6 6"/>
    <path d="M${X0} ${top} L${surf.map(P).join(' L')} L${X1} ${waveY(X1)} L${[...wave].reverse().map(P).join(' L')} Z" fill="url(#skEpi)" stroke="#a8705a" stroke-width="2"/>
    <path d="M${X0} ${top} L${surf.map(P).join(' L')}" fill="none" stroke="#c9a27c" stroke-width="8"/>
    <path d="M${X0} ${top - 3} L${surf.map(p => P([p[0], p[1] - 3])).join(' L')}" fill="none" stroke="#a8705a" stroke-width="2"/>
    <path d="M${X0} ${derBot - 10} C420 ${derBot - 24} 560 ${derBot + 4} ${X1} ${derBot - 14}" fill="none" stroke="#c8343e" stroke-width="7" stroke-linecap="round"/>
    <path d="M${X0} ${derBot + 6} C420 ${derBot - 6} 560 ${derBot + 20} ${X1} ${derBot + 2}" fill="none" stroke="#2f62b8" stroke-width="7" stroke-linecap="round"/>
    ${[318, 462, 610].map(x => `<path d="M${x} ${derBot - 18} C${x - 8} 300 ${x + 10} 230 ${x} ${waveY(x) + 8} C${x + 14} 230 ${x + 22} 300 ${x + 14} ${derBot - 6}" fill="none" stroke="#c8343e" stroke-width="2.4" opacity=".85"/>`).join('')}
  </g>
  <rect x="${X0}" y="40" width="${X1 - X0}" height="${bottom - 40}" rx="6" fill="none" stroke="#8d6f62" stroke-width="2.5"/>
  <path d="M${P(folAt(0.02))} L${fol.a[0] - 26} 52" stroke="#4a3426" stroke-width="7" stroke-linecap="round"/>
  <path d="M${f(fol.a[0] - 12)} ${fol.a[1]} L${f(fol.b[0] - 22)} ${fol.b[1] - 8} C${fol.b[0] - 26} ${fol.b[1] + 18} ${fol.b[0] + 26} ${fol.b[1] + 22} ${fol.b[0] + 22} ${fol.b[1] - 6} L${f(fol.a[0] + 12)} ${fol.a[1]} Z" fill="#e7b48f" stroke="#8a5a40" stroke-width="2"/>
  <path d="M${P(folAt(0))} L${P(folAt(0.95))}" stroke="#4a3426" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="${fol.b[0]}" cy="${fol.b[1] + 4}" rx="10" ry="8" fill="#f4c6c0" stroke="#8a5a40" stroke-width="1.6"/>
  <path d="M${folAt(0.32)[0] + 10} ${folAt(0.32)[1] - 8} c26 -18 46 6 34 22 c18 8 6 34 -14 26 c-6 12 -24 10 -26 -6 Z" fill="#fbe7a6" stroke="#b58c2a" stroke-width="2"/>
  <path d="M${P(folAt(0.6))} L486 ${waveY(486) + 4}" stroke="#c4555f" stroke-width="5" stroke-linecap="round"/>
  <path d="${'M' + coil.map(P).join(' L')}" fill="none" stroke="#3d7ea6" stroke-width="5" stroke-linejoin="round"/>
  <path d="${'M' + duct.map(P).join(' L')}" fill="none" stroke="#3d7ea6" stroke-width="4" stroke-linejoin="round"/>
  ${nerve(`M${X1} 372 C640 380 590 370 ${ruff[0] + 22} ${ruff[1] + 4}`)}
  <path d="M${ruff[0] - 26} ${ruff[1]} C${ruff[0] - 10} ${ruff[1] - 14} ${ruff[0] + 12} ${ruff[1] - 14} ${ruff[0] + 26} ${ruff[1]} C${ruff[0] + 12} ${ruff[1] + 14} ${ruff[0] - 10} ${ruff[1] + 14} ${ruff[0] - 26} ${ruff[1]} Z" fill="#fff3d6" stroke="#8a6d2a" stroke-width="2"/>
  <path d="M${ruff[0] - 18} ${ruff[1]} l10 -5 l8 6 l9 -6 l8 5 M${ruff[0] - 14} ${ruff[1] + 4} l10 4 l9 -5 l9 4" fill="none" stroke="#b39433" stroke-width="1.6"/>
  ${nerve(`M${X0} 500 C380 510 430 540 ${pac[0] - 36} ${pac[1]}`)}
  ${[34, 28, 22, 16, 10].map((r, i) => `<ellipse cx="${pac[0]}" cy="${pac[1]}" rx="${r + 8}" ry="${f(r * 0.68)}" fill="${i % 2 ? '#fff6e2' : '#f7e3c0'}" stroke="#b08a4a" stroke-width="1.5"/>`).join('')}
  <path d="M${pac[0] - 40} ${pac[1]} H${pac[0] + 10}" stroke="#7b6522" stroke-width="3"/>
  ${nerve(`M${X0} 300 C380 300 440 280 456 ${waveY(456) + 30} M456 ${waveY(456) + 30} L452 140 M456 ${waveY(456) + 30} L470 146 M456 ${waveY(456) + 30} L440 152`, 3)}
  ${nerve(`M${X1} 262 C640 262 560 250 ${meis[0]} ${meis[1] + 30}`, 4)}
  <ellipse cx="${meis[0]}" cy="${meis[1] + 10}" rx="9" ry="17" fill="#fff3d6" stroke="#8a6d2a" stroke-width="2"/>
  ${[-8, -2, 4, 10, 16].map(dy => `<path d="M${meis[0] - 6} ${meis[1] + 10 + dy} h12" stroke="#b39433" stroke-width="1.6"/>`).join('')}
  ${nerve(`M${X1} 230 C670 228 620 210 ${merk[0]} ${merk[1] + 18}`, 3)}
  ${[-14, 0, 14].map(dx => `<path d="M${merk[0] + dx} ${merk[1] + 16} L${merk[0] + dx} ${merk[1] + 2}" stroke="#b39433" stroke-width="2"/><ellipse cx="${merk[0] + dx}" cy="${merk[1] - 4}" rx="7" ry="5" fill="#9fd0c7" stroke="#2c6b62" stroke-width="1.5"/><path d="M${merk[0] + dx - 8} ${merk[1] + 2} q8 5 16 0" fill="none" stroke="#7b6522" stroke-width="2.4"/>`).join('')}`;

  const parts = [
    ['epidermis', [302, f((top + waveY(302)) / 2 + 4)]],
    ['dermis', [302, 300]],
    ['hipodermis', [302, 590]],
    ['meissner', [meis[0], meis[1] + 10]],
    ['pacini', pac],
    ['merkel', [merk[0], merk[1] - 4]],
    ['lliures', [454, 150]],
    ['ruffini', ruff],
    ['pel', [f(fol.a[0] - 14), 76]],
    ['sebacia', [folAt(0.32)[0] + 28, folAt(0.32)[1] + 4]],
    ['sudoripara', [sweat.c[0], sweat.c[1] + 4]],
    ['vas', [580, f(derBot - 14)]],
  ];
  return { svg, parts };
}

const BASE_ORGANS = {
  ull: { sense: 'vista', ...eye() },
  orella: { sense: 'oida', ...ear() },
  llengua: { sense: 'gust', mid: 575, ...tongue() },
  nas: { sense: 'olfacte', ...nose() },
  pell: { sense: 'tacte', ...skin() },
};

/* Làmines realistes generades amb IA (OpenRouter · openai/gpt-image-2.6-sunburst) a partir d'aquests mateixos
   dibuixos com a plantilla (tools/ref.html → tools/laminas.py). La imatge cobreix el viewBox 0 −25 1000 750.
   Els punts s'han revisat un per un sobre cada imatge (tools/overlay.html); aquí hi ha els que s'han hagut de moure. */
export const IMG_BOX = { x: 0, y: -25, w: 1000, h: 750 };
const IA_FIX = {
  orella: { pavello: [273, 288] },
  llengua: { fungiformes: [357, 567] },
};

export const ORGANS = Object.fromEntries(Object.entries(BASE_ORGANS).map(([k, O]) => [k, {
  ...O,
  img: `./assets/laminas/${k}.webp`,
  parts: O.parts.map(([id, at]) => [id, (IA_FIX[k] || {})[id] || at]),
}]));

/** Contingut SVG de la làmina: la imatge realista o, si es demana, el dibuix vectorial original. */
export const plateArt = (O, vector = false) => (vector || !O.img ? O.svg
  : `<image href="${O.img}" x="${IMG_BOX.x}" y="${IMG_BOX.y}" width="${IMG_BOX.w}" height="${IMG_BOX.h}" preserveAspectRatio="none"/>`);
