# Pissarra Quest · RA3 La malaltia · RA4 Els sentits

Joc per equips per a **pissarra digital tàctil** del CFGM de Farmàcia i Parafarmàcia (MP0061 Anatomofisiologia i Patologia Bàsiques, grup FAR 1L). Cada pantalla la resol un equip diferent: l'alumne surt a la pissarra i **arrossega amb el dit** cada terme fins al seu lloc.

Mateix sistema visual que [Vascular Quest](https://rvs78.github.io/anatomia02/) i [Sentits Quest](https://rvs78.github.io/anatomofisiologia02/) (àlbum de cromos: coberta indigo, pàgina groga, cromos amb vora retallada, so i moviment de `fx.js`).

**Idioma:** català o castellà (banderes a l'entrada i a la capçalera), es pot canviar a mitja partida.

## Com es juga

1. El professorat tria **1 a 4 equips** (o «Tota la classe»), n'escriu els noms i prem **Comença la partida**.
2. La partida té **10 pantalles sortejades**, alternant làmina i conceptes: làmina → conceptes → làmina → conceptes…
3. Abans de cada pantalla surt un sobre amb el **torn de l'equip** (el color de l'equip tenyeix tota la pantalla) i què s'ha de fer.
4. Al final: **podi**, taula per pantalla (estrelles, errors, pistes, temps, punts) i **llista de repàs** amb els termes que han costat. Es pot imprimir o desar en PDF.

| Tipus de pantalla | Què es fa | Màxim |
| --- | --- | --- |
| **Làmina** (RA4) | Arrossegar el nom de cada estructura a l'etiqueta buida que l'assenyala | 6 termes |
| **Emparella** | Arrossegar cada terme a la seva definició | 6 |
| **Classifica** | Arrossegar cada element a la seva columna (2 o 3) | 6 |
| **Ordena** | Col·locar els termes en ordre (camí de la llum, del so, curs de la malaltia) | 6 |

**Interacció tàctil:** arrossegar, o tocar el terme i després tocar el lloc. Funciona amb diversos dits alhora, amb llapis, ratolí i teclat (Tab i Enter). Botó de **pantalla completa** a la capçalera.

**Puntuació (per equip):** +10 encert · −3 error · −5 pista · +15 cada 3 encerts seguits · mínim 0. Estrelles per pantalla: 3 sense errors ni pistes, 2 amb fins a 2 incidències, 1 a la resta.

## Contingut

**Làmines (RA4 · Els sentits)** — il·lustracions mèdiques realistes generades amb IA (OpenRouter · GPT Image 2.6, via Composio) a partir de dibuixos SVG fets a mà que fan de plantilla; els punts es calculen amb la geometria del dibuix i s'han revisat un per un sobre cada imatge (vegeu `tools/PROMPTS_IA.md`):

| Làmina | Estructures (en surten 6 a l'atzar) |
| --- | --- |
| Ull · secció horitzontal | còrnia, humor aquós, iris, pupil·la, cristal·lí, cos ciliar, lligaments suspensoris, escleròtica, coroide, retina, fòvea, punt cec, nervi òptic, humor vitri, múscul extraocular (15) |
| Orella · tall frontal | pavelló, conducte auditiu extern, timpà, martell, enclusa, estrep, caixa del timpà, trompa d'Eustaqui, finestra oval, finestra rodona, vestíbul, canals semicirculars, còclea, nervi vestibulococlear (14) |
| Llengua i botó gustatiu | epiglotis, amígdala palatina, papil·les caliciformes, fungiformes, filiformes i foliades, solc terminal, àpex, botó gustatiu, porus gustatiu, cèl·lula gustativa, cèl·lula de suport, fibra nerviosa (13) |
| Fosses nasals · tall sagital | bulb i tracte olfactori, làmina cribosa, epiteli olfactori, cornets superior, mitjà i inferior, narina, sinus frontal i esfenoidal, paladar dur, nasofaringe (12) |
| Pell i receptors del tacte | epidermis, dermis, hipodermis, corpuscles de Meissner, Pacini i Ruffini, discs de Merkel, terminacions lliures, pèl, glàndules sebàcia i sudorípara, vasos (12) |

La vista i l'oïda poden sortir **dues vegades** (opció activada per defecte): la segona vegada surten primer les estructures que encara no han sortit. Si es desactiva, surten els cinc sentits una vegada.

**Conceptes:** a cada partida surten 3 pantalles de RA3 i 2 de RA4, sense repetir tipus seguit.

| RA3 · La malaltia | RA4 · Els sentits |
| --- | --- |
| Conceptes bàsics (salut, etiologia, patogènia, semiologia, diagnòstic, pronòstic…) | Tipus de receptors (foto-, mecano-, quimio-, termo-, noci-, propioceptors) |
| Signe o símptoma? | Exteroceptors, interoceptors, propioceptors |
| Curs d'una malaltia infecciosa (ordenar) | A quin sentit pertany? |
| Incidències (complicació, recaiguda, recidiva, seqüela…) | Camí de la llum (ordenar) |
| Aguda o crònica? | Camí del so (ordenar) |
| Causes intrínseques i extrínseques | Patologies de la vista |
| Sufixos (-itis, -àlgia, -ectomia…) | Patologies de l'oïda |
| Prefixos (hiper-, hipo-, taqui-, bradi-…) | Estructures i funcions |
| Termes mèdics (otàlgia, anòsmia, hipoacúsia…) | Els cinc sabors bàsics |
| Nivells de prevenció | |

Tot el contingut és a `data.js` (textos en català i castellà) i `drawings.js` (làmines). Per afegir una baralla n'hi ha prou amb una entrada nova a `DECKS`.

## Fitxers

| Fitxer | Funció |
| --- | --- |
| `index.html`, `styles.css` | Pàgina i estil (mesures en `rem` i `cqw`: escala amb la pissarra) |
| `game.js` | Pantalles, arrossegar i deixar (pointer events, multidit), torns i resultats |
| `logic.js` | Lògica pura: sorteig, posició de les etiquetes sense creuaments, puntuació |
| `drawings.js` | Les cinc làmines: dibuix SVG (plantilla), imatge realista i punts |
| `assets/laminas/` | Les cinc il·lustracions realistes (WebP) |
| `data.js`, `i18n.js` | Contingut i textos d'interfície (ca/es) |
| `fx.js` | Moviment i so (igual que Vascular Quest) |

La partida es desa al `localStorage` del navegador (`far-ra34-pissarra-v1`): si la pissarra es recarrega, continua on era.

## Desenvolupament

```bash
python3 -m http.server 8000                          # obre http://localhost:8000
node tests/check.mjs                                 # dades, 500 partides sortejades, etiquetes i puntuació
python3 tests/e2e.py http://localhost:8000/ shots ca 1920 1080   # partida completa amb tocs reals (Playwright)
```

`tools/preview.html` mostra els dibuixos SVG amb tots els punts; `tools/overlay.html?o=ull&img=ia/ull_gpt.webp` superposa els punts a la imatge generada. `tools/laminas.py` prepara les imatges (vegeu `tools/PROMPTS_IA.md`).

Publicació: GitHub Pages des de la branca `main` (carpeta arrel). Sense dependències ni compilació.
