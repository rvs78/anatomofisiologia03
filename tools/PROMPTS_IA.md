# Làmines generades amb IA

**Model:** `openai/gpt-image-2.6-sunburst` a través d'OpenRouter, cridat amb Composio (`OPENROUTER_GENERATE_IMAGE`), 6 de novembre de 2026. Format 4:3, resolució 2K, imatge a imatge.
Es va provar també `google/gemini-nano-banana-2.1`: va sortir més pàl·lid i va desplaçar el cristal·lí, i es va descartar.

**Plantilla:** cada làmina parteix del dibuix SVG de `drawings.js` renderitzat amb `tools/ref.html` (1600×1200, viewBox `0 −25 1000 750`, publicat a la branca `ia-referencies`). Com que el model conserva l'enquadrament, els punts calculats a partir del dibuix continuen caient sobre cada estructura. S'han revisat tots amb `tools/overlay.html?o=<òrgan>&img=ia/<òrgan>_gpt.webp` i només se n'han hagut de moure dos (`IA_FIX` a `drawings.js`).

**Processat:** `python3 tools/laminas.py` → `assets/laminas/*.webp` (el fons de textura de paper passa a blanc pur). Els originals són a `tools/ia/`.

## Indicació comuna

> Repaint the reference image as a high-quality realistic medical textbook illustration (anatomy atlas style, like a school anatomy slide): rich natural colours, soft 3D shading, fine tissue texture, clean dark outlines. CRITICAL: keep EXACTLY the same composition, viewpoint, scale and position of every structure as in the reference; do not move, add, remove, flip or resize anything, because label points will be overlaid at fixed coordinates. Keep the left quarter and the right quarter of the canvas completely empty pure white. Pure white background. Absolutely no text, letters, numbers, labels, arrows, pointer lines or watermark.

## Descripció de cada làmina (s'afegeix a la indicació comuna)

| Làmina | Resum |
| --- | --- |
| Ull | Secció horitzontal de l'ull dret, còrnia a l'esquerra: còrnia, humor aquós, iris i pupil·la, cristal·lí amb zònula i cos ciliar, escleròtica, coroide, retina, màcula amb fòvea, disc òptic i nervi òptic amb l'artèria central, vitri i músculs rectes. |
| Orella | Tall coronal de l'orella dreta: pavelló, conducte en S, timpà, martell, enclusa, estrep a la finestra oval, finestra rodona, vestíbul, canals semicirculars, còclea de 2,5 voltes, nervi VIII i trompa d'Eustaqui; os temporal. |
| Llengua | Cara dorsal: epiglotis, amígdales palatines i lingual, solc terminal amb forat cec, papil·les caliciformes, foliades, fungiformes i filiformes; detall circular d'un botó gustatiu (cèl·lules gustatives i de suport, porus, fibres nervioses). |
| Fosses nasals | Paret lateral de la fossa nasal dreta: sinus frontal, lòbul frontal, làmina cribosa, bulb i tracte olfactori, epiteli olfactori, cornets superior, mitjà i inferior, narina, sinus esfenoidal, nasofaringe, paladar dur i tou, llengua. |
| Pell | Bloc de pell: epidermis, dermis, hipodermis; pèl amb fol·licle, glàndula sebàcia i múscul erector; glàndula sudorípara; artèria i vena; terminacions lliures, Meissner, Merkel, Ruffini i Pacini. |

Cost aproximat: 0,05–0,06 $ per imatge.
