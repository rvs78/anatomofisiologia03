// Textos de la interfície en català (ca) i castellà (es). {x} es substitueix amb t('clau', {x: valor}).

export const LANGS = ['ca', 'es'];
const KEY = 'pq-lang';

export const UI = {
  ca: {
    langName: 'Català', brandSub: 'RA3 Malaltia · RA4 Sentits', switchLang: 'Canvia a castellà',
    points: 'Punts', soundOn: 'Activa els sons', soundOff: 'Silencia els sons', fullscreen: 'Pantalla completa', home: "Torna a l'inici",
    exitAsk: "Vols tornar a l'inici? La partida en curs es perdrà.", exitYes: 'Sí, torna', cancel: 'Cancel·la',
    screen: 'Pantalla', screenN: 'Pantalla {n}', of: 'de',
    kind: { plate: 'Làmina', match: 'Emparella', classify: 'Classifica', order: 'Ordena' },
    how: {
      plate: "Arrossega cada nom fins a l'etiqueta buida que assenyala la seva estructura.",
      match: 'Arrossega cada terme fins a la seva definició.',
      classify: 'Arrossega cada element a la columna que li correspon.',
      order: "Col·loca els termes en l'ordre correcte, de l'1 al {n}.",
    },
    ra3: 'RA3 · La malaltia', ra4: 'RA4 · Els sentits',
    turn: 'Torn de', go: 'Som-hi!', teamN: 'Equip {n}', wholeClass: 'Tota la classe',
    // entrada
    welcomeTitle: ['Pissarra', 'Quest'],
    welcomeLead: 'Deu pantalles per resoldre a la pissarra digital: làmines dels sentits i reptes sobre la malaltia. Cada equip surt quan li toca i arrossega amb el dit cada terme al seu lloc.',
    howManyTeams: 'Quants equips juguen?', teamNames: 'Noms dels equips', repeat: "La vista i l'oïda poden sortir dues vegades",
    language: 'Idioma', startGame: 'Comença la partida', resume: 'Continua la partida', resumeMeta: 'Pantalla {i} de 10 · {teams}', newGame: 'Partida nova',
    note: 'Els torns passen al següent equip a cada pantalla. La partida es desa en aquest navegador: si es recarrega, continua on era.',
    credit: 'Aplicació de Rubén Vallejo',
    // intro
    introFirst: 'Com es juga', cardDrag: ['Arrossega', "Toca un terme amb el dit i porta'l fins al seu lloc sense aixecar-lo."],
    cardTap: ['O toca i col·loca', 'Toca un terme i després toca el lloc on va.'],
    cardScore: ['Puntua', 'Encert +10 · Error −3 · Pista −5. Tres encerts seguits: +15.'],
    // joc
    placed: 'Col·locats', hint: 'Pista', hintTitle: 'Marca on va un terme (−5 punts)', skip: 'Salta', skipAsk: 'Vols saltar aquesta pantalla? No sumarà punts.', skipYes: 'Sí, salta',
    fbStart: "Arrossega un terme fins al seu lloc, o toca'l i després toca el lloc.",
    fbHit: ['Molt bé!', 'Correcte!', 'Perfecte!', 'Això és!', 'Exacte!'], fbMiss: 'No va aquí. Torna-ho a provar!', fbHint: 'El terme i el seu lloc estan marcats en daurat.',
    fbSelected: 'Ara toca el lloc on va «{t}».', streakBanner: 'Ratxa de 3! +15',
    doneTitle: 'Pantalla completada!', skippedTitle: 'Pantalla saltada', errors: 'Errors', hints: 'Pistes', time: 'Temps', earned: 'Punts',
    next: 'Següent pantalla', toResults: 'Veure resultats', nextTurn: 'Ara surt: {team}',
    stars: '{n} estrelles de 3', emptySlot: 'Lloc buit', dropHere: 'Deixa-ho aquí',
    // resultats
    results: 'Resultats', winner: 'Guanya {name}!', tie: 'Empat!', soloDone: 'Partida acabada!',
    th: ['#', 'Pantalla', 'Equip', 'Estrelles', 'Errors', 'Pistes', 'Temps', 'Punts'],
    review: 'Per repassar', reviewNone: 'Cap error: tot col·locat a la primera!', reviewLead: 'Termes que han costat (han tingut algun error):',
    print: 'Imprimeix o desa en PDF', again: 'Una altra partida (mateixos equips)', totalStars: 'Estrelles', totalErrors: 'Errors',
  },
  es: {
    langName: 'Castellano', brandSub: 'RA3 Enfermedad · RA4 Sentidos', switchLang: 'Cambiar a catalán',
    points: 'Puntos', soundOn: 'Activar los sonidos', soundOff: 'Silenciar los sonidos', fullscreen: 'Pantalla completa', home: 'Volver al inicio',
    exitAsk: '¿Quieres volver al inicio? Se perderá la partida en curso.', exitYes: 'Sí, volver', cancel: 'Cancelar',
    screen: 'Pantalla', screenN: 'Pantalla {n}', of: 'de',
    kind: { plate: 'Lámina', match: 'Empareja', classify: 'Clasifica', order: 'Ordena' },
    how: {
      plate: 'Arrastra cada nombre hasta la etiqueta vacía que señala su estructura.',
      match: 'Arrastra cada término hasta su definición.',
      classify: 'Arrastra cada elemento a la columna que le corresponde.',
      order: 'Coloca los términos en el orden correcto, del 1 al {n}.',
    },
    ra3: 'RA3 · La enfermedad', ra4: 'RA4 · Los sentidos',
    turn: 'Turno de', go: '¡Vamos!', teamN: 'Equipo {n}', wholeClass: 'Toda la clase',
    welcomeTitle: ['Pizarra', 'Quest'],
    welcomeLead: 'Diez pantallas para resolver en la pizarra digital: láminas de los sentidos y retos sobre la enfermedad. Cada equipo sale cuando le toca y arrastra con el dedo cada término a su sitio.',
    howManyTeams: '¿Cuántos equipos juegan?', teamNames: 'Nombres de los equipos', repeat: 'La vista y el oído pueden salir dos veces',
    language: 'Idioma', startGame: 'Empezar la partida', resume: 'Continuar la partida', resumeMeta: 'Pantalla {i} de 10 · {teams}', newGame: 'Partida nueva',
    note: 'Los turnos pasan al siguiente equipo en cada pantalla. La partida se guarda en este navegador: si se recarga, sigue donde estaba.',
    credit: 'Aplicación de Rubén Vallejo',
    introFirst: 'Cómo se juega', cardDrag: ['Arrastra', 'Toca un término con el dedo y llévalo hasta su sitio sin levantarlo.'],
    cardTap: ['O toca y coloca', 'Toca un término y después toca el sitio donde va.'],
    cardScore: ['Puntúa', 'Acierto +10 · Error −3 · Pista −5. Tres aciertos seguidos: +15.'],
    placed: 'Colocados', hint: 'Pista', hintTitle: 'Marca dónde va un término (−5 puntos)', skip: 'Saltar', skipAsk: '¿Quieres saltar esta pantalla? No sumará puntos.', skipYes: 'Sí, saltar',
    fbStart: 'Arrastra un término hasta su sitio, o tócalo y después toca el sitio.',
    fbHit: ['¡Muy bien!', '¡Correcto!', '¡Perfecto!', '¡Eso es!', '¡Exacto!'], fbMiss: 'No va aquí. ¡Vuelve a probar!', fbHint: 'El término y su sitio están marcados en dorado.',
    fbSelected: 'Ahora toca el sitio donde va «{t}».', streakBanner: '¡Racha de 3! +15',
    doneTitle: '¡Pantalla completada!', skippedTitle: 'Pantalla saltada', errors: 'Errores', hints: 'Pistas', time: 'Tiempo', earned: 'Puntos',
    next: 'Siguiente pantalla', toResults: 'Ver resultados', nextTurn: 'Ahora sale: {team}',
    stars: '{n} estrellas de 3', emptySlot: 'Sitio vacío', dropHere: 'Déjalo aquí',
    results: 'Resultados', winner: '¡Gana {name}!', tie: '¡Empate!', soloDone: '¡Partida terminada!',
    th: ['#', 'Pantalla', 'Equipo', 'Estrellas', 'Errores', 'Pistas', 'Tiempo', 'Puntos'],
    review: 'Para repasar', reviewNone: 'Ningún error: ¡todo colocado a la primera!', reviewLead: 'Términos que han costado (han tenido algún error):',
    print: 'Imprimir o guardar en PDF', again: 'Otra partida (mismos equipos)', totalStars: 'Estrellas', totalErrors: 'Errores',
  },
};

let lang = (() => {
  try { const v = localStorage.getItem(KEY); return LANGS.includes(v) ? v : 'ca'; } catch { return 'ca'; }
})();

export const getLang = () => lang;
export function setLang(l) {
  if (!LANGS.includes(l)) return;
  lang = l;
  try { localStorage.setItem(KEY, l); } catch { /* sense emmagatzematge */ }
  document.documentElement.lang = l;
}

export function t(key, vars) {
  let v = key.split('.').reduce((o, k) => (o == null ? o : o[k]), UI[lang]);
  if (v == null) v = key.split('.').reduce((o, k) => (o == null ? o : o[k]), UI.ca);
  if (typeof v === 'string' && vars) v = v.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));
  return v;
}

/** Tria la llengua activa d'un objecte {ca, es}. */
export const L = obj => (obj && typeof obj === 'object' && 'ca' in obj ? obj[lang] ?? obj.ca : obj);

/** Banderes en SVG (senyera de 9 franges; bandera d'Espanya sense escut). */
export const FLAGS = {
  ca: '<svg viewBox="0 0 27 18" aria-hidden="true"><rect width="27" height="18" fill="#FCDD09"/>' + [1, 3, 5, 7].map(i => `<rect y="${i * 2}" width="27" height="2" fill="#DA121A"/>`).join('') + '</svg>',
  es: '<svg viewBox="0 0 27 18" aria-hidden="true"><rect width="27" height="18" fill="#AA151B"/><rect y="4.5" width="27" height="9" fill="#F1BF00"/></svg>',
};
