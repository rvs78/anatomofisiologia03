// Contingut del joc en català (ca) i castellà (es).
// RA3 · La malaltia (conceptes, signes i símptomes, fases, incidències, causes, terminologia, prevenció).
// RA4 · Els sentits (generalitats, vista, oïda, gust, olfacte i tacte).

const b = (ca, es = ca) => ({ ca, es });

/* ---------- Làmines d'anatomia ---------- */
export const SENSES = {
  vista: b('Vista'), oida: b('Oïda', 'Oído'), gust: b('Gust', 'Gusto'), olfacte: b('Olfacte', 'Olfato'), tacte: b('Tacte', 'Tacto'),
};

export const PLATES = {
  ull: {
    title: b("L'ull · secció horitzontal", 'El ojo · sección horizontal'),
    parts: {
      cornia: b('Còrnia', 'Córnea'), aquos: b('Humor aquós', 'Humor acuoso'), iris: b('Iris'), pupil: b('Pupil·la', 'Pupila'),
      cristal: b('Cristal·lí', 'Cristalino'), ciliar: b('Cos ciliar', 'Cuerpo ciliar'), zonula: b('Lligaments suspensoris', 'Ligamentos suspensorios'),
      sclera: b('Escleròtica', 'Esclerótica'), coroide: b('Coroide', 'Coroides'), retina: b('Retina'), fovea: b('Fòvea (màcula)', 'Fóvea (mácula)'),
      disc: b('Punt cec (disc òptic)', 'Punto ciego (disco óptico)'), nervi: b('Nervi òptic', 'Nervio óptico'), vitri: b('Humor vitri', 'Humor vítreo'),
      muscul: b('Múscul extraocular', 'Músculo extraocular'),
    },
  },
  orella: {
    title: b("L'orella · tall frontal", 'El oído · corte frontal'),
    parts: {
      pavello: b('Pavelló auricular', 'Pabellón auricular'), conducte: b('Conducte auditiu extern', 'Conducto auditivo externo'),
      timpa: b('Timpà', 'Tímpano'), martell: b('Martell', 'Martillo'), enclusa: b('Enclusa', 'Yunque'), estrep: b('Estrep', 'Estribo'),
      caixa: b('Caixa del timpà', 'Caja del tímpano'), trompa: b("Trompa d'Eustaqui", 'Trompa de Eustaquio'),
      oval: b('Finestra oval', 'Ventana oval'), rodona: b('Finestra rodona', 'Ventana redonda'), vestibul: b('Vestíbul', 'Vestíbulo'),
      canals: b('Canals semicirculars', 'Conductos semicirculares'), coclea: b('Còclea (cargol)', 'Cóclea (caracol)'),
      nervi8: b('Nervi vestibulococlear', 'Nervio vestibulococlear'),
    },
  },
  llengua: {
    title: b('La llengua i el botó gustatiu', 'La lengua y el botón gustativo'),
    parts: {
      epiglotis: b('Epiglotis'), amigdala: b('Amígdala palatina', 'Amígdala palatina'), caliciformes: b('Papil·les caliciformes', 'Papilas caliciformes'),
      fungiformes: b('Papil·les fungiformes', 'Papilas fungiformes'), filiformes: b('Papil·les filiformes', 'Papilas filiformes'),
      foliades: b('Papil·les foliades', 'Papilas foliadas'), solc: b('Solc terminal (V lingual)', 'Surco terminal (V lingual)'),
      apex: b('Àpex de la llengua', 'Punta de la lengua'), boto: b('Botó gustatiu', 'Botón gustativo'), porus: b('Porus gustatiu', 'Poro gustativo'),
      gustativa: b('Cèl·lula gustativa', 'Célula gustativa'), suport: b('Cèl·lula de suport', 'Célula de sostén'), fibra: b('Fibra nerviosa', 'Fibra nerviosa'),
    },
  },
  nas: {
    title: b('Les fosses nasals · tall sagital', 'Las fosas nasales · corte sagital'),
    parts: {
      bulb: b('Bulb olfactori', 'Bulbo olfatorio'), tracte: b('Tracte olfactori', 'Tracto olfatorio'), cribosa: b("Làmina cribosa de l'etmoide", 'Lámina cribosa del etmoides'),
      epiteli: b('Epiteli olfactori', 'Epitelio olfatorio'), csup: b('Cornet superior', 'Cornete superior'), cmig: b('Cornet mitjà', 'Cornete medio'),
      cinf: b('Cornet inferior', 'Cornete inferior'), narina: b('Narina', 'Narina'), sfrontal: b('Sinus frontal', 'Seno frontal'),
      sesfenoidal: b('Sinus esfenoidal', 'Seno esfenoidal'), paladar: b('Paladar dur', 'Paladar duro'), nasofaringe: b('Nasofaringe'),
    },
  },
  pell: {
    title: b('La pell i els receptors del tacte', 'La piel y los receptores del tacto'),
    parts: {
      epidermis: b('Epidermis'), dermis: b('Dermis'), hipodermis: b('Hipodermis'),
      meissner: b('Corpuscle de Meissner', 'Corpúsculo de Meissner'), pacini: b('Corpuscle de Pacini', 'Corpúsculo de Pacini'),
      merkel: b('Discs de Merkel', 'Discos de Merkel'), lliures: b('Terminacions nervioses lliures', 'Terminaciones nerviosas libres'),
      ruffini: b('Corpuscle de Ruffini', 'Corpúsculo de Ruffini'), pel: b('Pèl (fol·licle pilós)', 'Pelo (folículo piloso)'),
      sebacia: b('Glàndula sebàcia', 'Glándula sebácea'), sudoripara: b('Glàndula sudorípara', 'Glándula sudorípara'), vas: b('Vasos sanguinis', 'Vasos sanguíneos'),
    },
  },
};

/* ---------- Pantalles de conceptes ----------
   match:    arrossega cada terme a la seva definició.
   classify: arrossega cada element a la seva columna.
   order:    col·loca els termes en l'ordre correcte. */
export const DECKS = [
  /* ===================== RA3 · La malaltia ===================== */
  {
    id: 'conceptes', ra: 3, type: 'match', pick: 6,
    title: b('Conceptes bàsics de patologia', 'Conceptos básicos de patología'),
    items: [
      ['salut', b('Salut', 'Salud'), b('Estat de complet benestar físic, mental i social, i no només absència de malaltia (OMS).', 'Estado de completo bienestar físico, mental y social, y no solo ausencia de enfermedad (OMS).')],
      ['malaltia', b('Malaltia', 'Enfermedad'), b("Alteració de l'estat de salut que afecta l'estructura o la funció de l'organisme.", 'Alteración del estado de salud que afecta a la estructura o la función del organismo.')],
      ['etiologia', b('Etiologia', 'Etiología'), b('Estudi de les causes que produeixen una malaltia.', 'Estudio de las causas que producen una enfermedad.')],
      ['patogenia', b('Patogènia', 'Patogenia'), b('Mecanisme pel qual la causa produeix la malaltia.', 'Mecanismo por el que la causa produce la enfermedad.')],
      ['semiologia', b('Semiologia', 'Semiología'), b('Estudi dels signes i dels símptomes.', 'Estudio de los signos y de los síntomas.')],
      ['diagnostic', b('Diagnòstic', 'Diagnóstico'), b('Procés per identificar quina malaltia té el pacient.', 'Proceso para identificar qué enfermedad tiene el paciente.')],
      ['pronostic', b('Pronòstic', 'Pronóstico'), b('Previsió de com evolucionarà la malaltia i com acabarà.', 'Previsión de cómo evolucionará la enfermedad y cómo acabará.')],
      ['tractament', b('Tractament', 'Tratamiento'), b('Mitjans que es fan servir per curar o alleujar la malaltia.', 'Medios que se emplean para curar o aliviar la enfermedad.')],
      ['epidemiologia', b('Epidemiologia', 'Epidemiología'), b('Estudi de la freqüència i la distribució de les malalties en la població.', 'Estudio de la frecuencia y la distribución de las enfermedades en la población.')],
      ['fisiopatologia', b('Fisiopatologia', 'Fisiopatología'), b("Estudi del funcionament alterat de l'organisme malalt.", 'Estudio del funcionamiento alterado del organismo enfermo.')],
    ],
  },
  {
    id: 'signes', ra: 3, type: 'classify', pick: 6,
    title: b('Signe o símptoma?', '¿Signo o síntoma?'),
    cats: [
      ['signe', b('Signe', 'Signo'), b('Objectiu: es pot observar o mesurar', 'Objetivo: se puede observar o medir')],
      ['simptoma', b('Símptoma', 'Síntoma'), b('Subjectiu: només el nota el pacient', 'Subjetivo: solo lo nota el paciente')],
    ],
    items: [
      ['febre', b('Febre de 39 °C', 'Fiebre de 39 °C'), 'signe'], ['exantema', b('Erupció a la pell', 'Erupción en la piel'), 'signe'],
      ['hta', b('Pressió arterial alta', 'Presión arterial alta'), 'signe'], ['pols', b('Pols de 120 batecs/min', 'Pulso de 120 latidos/min'), 'signe'],
      ['edema', b('Edema (inflor)', 'Edema (hinchazón)'), 'signe'], ['icteric', b('Icterícia (pell groga)', 'Ictericia (piel amarilla)'), 'signe'],
      ['dolor', b('Dolor', 'Dolor'), 'simptoma'], ['nausea', b('Nàusees', 'Náuseas'), 'simptoma'], ['mareig', b('Mareig', 'Mareo'), 'simptoma'],
      ['astenia', b('Cansament (astènia)', 'Cansancio (astenia)'), 'simptoma'], ['pruija', b('Picor (pruïja)', 'Picor (prurito)'), 'simptoma'],
      ['acufens', b('Xiulets a les orelles', 'Pitidos en los oídos'), 'simptoma'],
    ],
  },
  {
    id: 'fases', ra: 3, type: 'order',
    title: b("El curs d'una malaltia infecciosa", 'El curso de una enfermedad infecciosa'),
    items: [
      ['exposicio', b("Contacte amb l'agent causal", 'Contacto con el agente causal')],
      ['incubacio', b("Període d'incubació", 'Periodo de incubación')],
      ['prodromic', b('Període prodròmic', 'Periodo prodrómico')],
      ['estat', b("Període d'estat (clínic)", 'Periodo de estado (clínico)')],
      ['convalescencia', b('Convalescència', 'Convalecencia')],
      ['desenllac', b('Desenllaç: curació, cronificació o mort', 'Desenlace: curación, cronificación o muerte')],
    ],
  },
  {
    id: 'incidencies', ra: 3, type: 'match', pick: 6,
    title: b('Incidències en el curs de la malaltia', 'Incidencias en el curso de la enfermedad'),
    items: [
      ['complicacio', b('Complicació', 'Complicación'), b('Apareix un procés nou que agreuja la malaltia inicial.', 'Aparece un proceso nuevo que agrava la enfermedad inicial.')],
      ['recaiguda', b('Recaiguda', 'Recaída'), b('Els símptomes tornen durant la convalescència, abans de la curació.', 'Los síntomas vuelven durante la convalecencia, antes de la curación.')],
      ['recidiva', b('Recidiva', 'Recidiva'), b('La malaltia torna a aparèixer quan ja estava curada.', 'La enfermedad vuelve a aparecer cuando ya estaba curada.')],
      ['sequela', b('Seqüela', 'Secuela'), b('Lesió permanent que queda després de la malaltia.', 'Lesión permanente que queda tras la enfermedad.')],
      ['cronificacio', b('Cronificació', 'Cronificación'), b('La malaltia no es cura i dura molt de temps.', 'La enfermedad no se cura y dura mucho tiempo.')],
      ['remissio', b('Remissió', 'Remisión'), b('Els signes i símptomes disminueixen o desapareixen.', 'Los signos y síntomas disminuyen o desaparecen.')],
      ['exitus', b('Èxitus', 'Éxitus'), b('Mort del pacient.', 'Muerte del paciente.')],
    ],
  },
  {
    id: 'evolucio', ra: 3, type: 'classify', pick: 6,
    title: b('Malaltia aguda o crònica?', '¿Enfermedad aguda o crónica?'),
    cats: [
      ['aguda', b('Aguda', 'Aguda'), b('Inici brusc i curta durada', 'Inicio brusco y corta duración')],
      ['cronica', b('Crònica', 'Crónica'), b('Evolució lenta i llarga (més de 6 mesos)', 'Evolución lenta y larga (más de 6 meses)')],
    ],
    items: [
      ['grip', b('Grip', 'Gripe'), 'aguda'], ['apendicitis', b('Apendicitis'), 'aguda'], ['otitisag', b('Otitis mitjana aguda', 'Otitis media aguda'), 'aguda'],
      ['gastro', b('Gastroenteritis'), 'aguda'], ['refredat', b('Refredat comú', 'Resfriado común'), 'aguda'], ['conjunt', b('Conjuntivitis bacteriana'), 'aguda'],
      ['diabetis', b('Diabetis mellitus', 'Diabetes mellitus'), 'cronica'], ['hta2', b('Hipertensió arterial', 'Hipertensión arterial'), 'cronica'],
      ['artrosi', b('Artrosi', 'Artrosis'), 'cronica'], ['glaucoma', b('Glaucoma'), 'cronica'], ['asma', b('Asma'), 'cronica'],
      ['alzheimer', b("Malaltia d'Alzheimer", 'Enfermedad de Alzheimer'), 'cronica'],
    ],
  },
  {
    id: 'causes', ra: 3, type: 'classify', pick: 6,
    title: b('Causes de la malaltia (etiologia)', 'Causas de la enfermedad (etiología)'),
    cats: [
      ['intrinseca', b('Intrínseca', 'Intrínseca'), b("Ve del mateix organisme", 'Viene del propio organismo')],
      ['extrinseca', b('Extrínseca', 'Extrínseca'), b("Ve de l'entorn", 'Viene del entorno')],
    ],
    items: [
      ['genetica', b('Alteració genètica', 'Alteración genética'), 'intrinseca'], ['edat', b('Edat avançada', 'Edad avanzada'), 'intrinseca'],
      ['autoimmune', b('Resposta autoimmunitària', 'Respuesta autoinmune'), 'intrinseca'], ['hormonal', b('Alteració hormonal', 'Alteración hormonal'), 'intrinseca'],
      ['hereditaria', b('Malaltia hereditària', 'Enfermedad hereditaria'), 'intrinseca'],
      ['virus', b('Virus i bacteris', 'Virus y bacterias'), 'extrinseca'], ['soroll', b('Soroll intens', 'Ruido intenso'), 'extrinseca'],
      ['uv', b('Radiació ultraviolada', 'Radiación ultravioleta'), 'extrinseca'], ['tabac', b('Fum del tabac', 'Humo del tabaco'), 'extrinseca'],
      ['trauma', b('Traumatisme (cop)', 'Traumatismo (golpe)'), 'extrinseca'], ['toxic', b('Producte tòxic', 'Producto tóxico'), 'extrinseca'],
    ],
  },
  {
    id: 'sufixos', ra: 3, type: 'match', pick: 6,
    title: b('Terminologia: sufixos', 'Terminología: sufijos'),
    items: [
      ['itis', b('-itis'), b('Inflamació', 'Inflamación')], ['algia', b('-àlgia', '-algia'), b('Dolor')],
      ['ectomia', b('-ectomia', '-ectomía'), b('Extirpació quirúrgica', 'Extirpación quirúrgica')], ['oma', b('-oma'), b('Tumor')],
      ['patia', b('-patia', '-patía'), b('Malaltia', 'Enfermedad')], ['scopia', b('-scòpia', '-scopia'), b('Observació amb un instrument', 'Observación con un instrumento')],
      ['tomia', b('-tomia', '-tomía'), b('Incisió (tall)', 'Incisión (corte)')], ['plastia', b('-plàstia', '-plastia'), b('Reparació quirúrgica', 'Reparación quirúrgica')],
      ['megalia', b('-megàlia', '-megalia'), b('Augment de mida', 'Aumento de tamaño')], ['rragia', b('-rràgia', '-rragia'), b('Vessament abundant (de sang)', 'Derrame abundante (de sangre)')],
    ],
  },
  {
    id: 'prefixos', ra: 3, type: 'match', pick: 6,
    title: b('Terminologia: prefixos', 'Terminología: prefijos'),
    items: [
      ['hiper', b('hiper-'), b('Excés, per sobre del normal', 'Exceso, por encima de lo normal')], ['hipo', b('hipo-'), b('Defecte, per sota del normal', 'Defecto, por debajo de lo normal')],
      ['taqui', b('taqui-'), b('Ràpid', 'Rápido')], ['bradi', b('bradi-'), b('Lent', 'Lento')],
      ['an', b('a- / an-'), b('Absència, sense', 'Ausencia, sin')], ['dis', b('dis-'), b('Dificultat o alteració', 'Dificultad o alteración')],
      ['poli', b('poli-'), b('Molts, abundant', 'Muchos, abundante')], ['oligo', b('oligo-'), b('Poc, escàs', 'Poco, escaso')],
      ['hemi', b('hemi-'), b('Meitat', 'Mitad')],
    ],
  },
  {
    id: 'termes', ra: 3, type: 'match', pick: 6,
    title: b('Termes mèdics', 'Términos médicos'),
    items: [
      ['otalgia', b('Otàlgia', 'Otalgia'), b("Dolor d'orella", 'Dolor de oído')], ['conjuntivitis', b('Conjuntivitis'), b('Inflamació de la conjuntiva', 'Inflamación de la conjuntiva')],
      ['rinitis', b('Rinitis'), b('Inflamació de la mucosa nasal', 'Inflamación de la mucosa nasal')], ['anosmia', b('Anòsmia', 'Anosmia'), b("Pèrdua de l'olfacte", 'Pérdida del olfato')],
      ['ageusia', b('Ageusia'), b('Pèrdua del gust', 'Pérdida del gusto')], ['hipoacusia', b('Hipoacúsia', 'Hipoacusia'), b("Disminució de l'audició", 'Disminución de la audición')],
      ['taquicardia', b('Taquicàrdia', 'Taquicardia'), b('Freqüència cardíaca ràpida', 'Frecuencia cardiaca rápida')], ['cefalalgia', b('Cefalàlgia', 'Cefalalgia'), b('Mal de cap', 'Dolor de cabeza')],
      ['dermatitis', b('Dermatitis'), b('Inflamació de la pell', 'Inflamación de la piel')], ['hepatomegalia', b('Hepatomegàlia', 'Hepatomegalia'), b('Fetge més gran del normal', 'Hígado más grande de lo normal')],
      ['dispnea', b('Dispnea', 'Disnea'), b('Dificultat per respirar', 'Dificultad para respirar')],
    ],
  },
  {
    id: 'prevencio', ra: 3, type: 'classify', pick: 6,
    title: b('Nivells de prevenció', 'Niveles de prevención'),
    cats: [
      ['primaria', b('Primària', 'Primaria'), b('Evitar que la malaltia aparegui', 'Evitar que la enfermedad aparezca')],
      ['secundaria', b('Secundària', 'Secundaria'), b('Detectar-la aviat', 'Detectarla pronto')],
      ['terciaria', b('Terciària', 'Terciaria'), b('Reduir les seqüeles', 'Reducir las secuelas')],
    ],
    items: [
      ['vacuna', b('Vacunació', 'Vacunación'), 'primaria'], ['mans', b('Rentat de mans', 'Lavado de manos'), 'primaria'],
      ['tapons', b('Protectors auditius a la feina', 'Protectores auditivos en el trabajo'), 'primaria'], ['ulleres', b('Ulleres de sol amb filtre UV', 'Gafas de sol con filtro UV'), 'primaria'],
      ['cribnado', b('Prova auditiva al nadó', 'Prueba auditiva al recién nacido'), 'secundaria'], ['pio', b('Mesura de la pressió intraocular', 'Medida de la presión intraocular'), 'secundaria'],
      ['glucosa', b('Prova de glucosa a la farmàcia', 'Prueba de glucosa en la farmacia'), 'secundaria'], ['mamo', b('Mamografia de cribratge', 'Mamografía de cribado'), 'secundaria'],
      ['rehab', b("Rehabilitació després d'un ictus", 'Rehabilitación tras un ictus'), 'terciaria'], ['audiofon', b('Audiòfon per a una pèrdua auditiva', 'Audífono para una pérdida auditiva'), 'terciaria'],
      ['braille', b('Aprendre braille després de perdre la vista', 'Aprender braille tras perder la vista'), 'terciaria'], ['fisio', b("Fisioteràpia després d'una fractura", 'Fisioterapia tras una fractura'), 'terciaria'],
    ],
  },

  /* ===================== RA4 · Els sentits ===================== */
  {
    id: 'receptors', ra: 4, type: 'match', pick: 6,
    title: b('Tipus de receptors sensorials', 'Tipos de receptores sensoriales'),
    items: [
      ['foto', b('Fotoreceptors', 'Fotorreceptores'), b('Capten la llum (cons i bastons).', 'Captan la luz (conos y bastones).')],
      ['mecano', b('Mecanoreceptors', 'Mecanorreceptores'), b('Capten pressió, vibració i so.', 'Captan presión, vibración y sonido.')],
      ['quimio', b('Quimioreceptors', 'Quimiorreceptores'), b('Capten substàncies químiques (gust i olfacte).', 'Captan sustancias químicas (gusto y olfato).')],
      ['termo', b('Termoreceptors', 'Termorreceptores'), b('Capten els canvis de temperatura.', 'Captan los cambios de temperatura.')],
      ['noci', b('Nociceptors', 'Nociceptores'), b('Capten els estímuls que fan mal.', 'Captan los estímulos que hacen daño.')],
      ['propio', b('Propioceptors', 'Propioceptores'), b('Informen de la posició i el moviment del cos.', 'Informan de la posición y el movimiento del cuerpo.')],
    ],
  },
  {
    id: 'ubicacio', ra: 4, type: 'classify', pick: 6,
    title: b("Receptors segons d'on ve l'estímul", 'Receptores según de dónde viene el estímulo'),
    cats: [
      ['extero', b('Exteroceptors', 'Exteroceptores'), b("Estímuls de l'exterior", 'Estímulos del exterior')],
      ['intero', b('Interoceptors', 'Interoceptores'), b("Estímuls dels òrgans interns", 'Estímulos de los órganos internos')],
      ['propio2', b('Propioceptors', 'Propioceptores'), b('Posició del cos', 'Posición del cuerpo')],
    ],
    items: [
      ['retina2', b('Retina'), 'extero'], ['meissner2', b('Corpuscle de Meissner', 'Corpúsculo de Meissner'), 'extero'], ['corti', b('Òrgan de Corti', 'Órgano de Corti'), 'extero'],
      ['estomac', b("Receptors de distensió de l'estómac", 'Receptores de distensión del estómago'), 'intero'], ['co2', b('Quimioreceptors del CO₂ de la sang', 'Quimiorreceptores del CO₂ de la sangre'), 'intero'],
      ['bufeta', b('Receptors de la bufeta plena', 'Receptores de la vejiga llena'), 'intero'],
      ['fus', b('Fus neuromuscular', 'Huso neuromuscular'), 'propio2'], ['tendo', b('Òrgan tendinós de Golgi', 'Órgano tendinoso de Golgi'), 'propio2'],
      ['articul', b('Receptors de les articulacions', 'Receptores de las articulaciones'), 'propio2'],
    ],
  },
  {
    id: 'quinsentit', ra: 4, type: 'classify', pick: 6, pickCats: 3,
    title: b('A quin sentit pertany?', '¿A qué sentido pertenece?'),
    cats: [
      ['vista', b('Vista'), b('Ull', 'Ojo')], ['oida', b('Oïda', 'Oído'), b('Orella', 'Oído')], ['gust', b('Gust', 'Gusto'), b('Llengua', 'Lengua')],
      ['olfacte', b('Olfacte', 'Olfato'), b('Nas', 'Nariz')], ['tacte', b('Tacte', 'Tacto'), b('Pell', 'Piel')],
    ],
    items: [
      ['cons', b('Cons i bastons', 'Conos y bastones'), 'vista'], ['cristal2', b('Cristal·lí', 'Cristalino'), 'vista'], ['iris2', b('Iris'), 'vista'],
      ['coclea2', b('Còclea', 'Cóclea'), 'oida'], ['estrep2', b('Estrep', 'Estribo'), 'oida'], ['timpa2', b('Timpà', 'Tímpano'), 'oida'],
      ['calic2', b('Papil·les caliciformes', 'Papilas caliciformes'), 'gust'], ['boto2', b('Botó gustatiu', 'Botón gustativo'), 'gust'], ['porus2', b('Porus gustatiu', 'Poro gustativo'), 'gust'],
      ['bulb2', b('Bulb olfactori', 'Bulbo olfatorio'), 'olfacte'], ['pituitaria', b('Pituïtària groga', 'Pituitaria amarilla'), 'olfacte'], ['cribosa2', b('Làmina cribosa', 'Lámina cribosa'), 'olfacte'],
      ['pacini2', b('Corpuscle de Pacini', 'Corpúsculo de Pacini'), 'tacte'], ['merkel2', b('Discs de Merkel', 'Discos de Merkel'), 'tacte'], ['ruffini2', b('Corpuscle de Ruffini', 'Corpúsculo de Ruffini'), 'tacte'],
    ],
  },
  {
    id: 'llum', ra: 4, type: 'order',
    title: b('El camí de la llum fins a la retina', 'El camino de la luz hasta la retina'),
    items: [
      ['l1', b('Còrnia', 'Córnea')], ['l2', b('Humor aquós', 'Humor acuoso')], ['l3', b('Pupil·la', 'Pupila')],
      ['l4', b('Cristal·lí', 'Cristalino')], ['l5', b('Humor vitri', 'Humor vítreo')], ['l6', b('Retina')],
    ],
  },
  {
    id: 'so', ra: 4, type: 'order',
    title: b('El camí del so fins al cervell', 'El camino del sonido hasta el cerebro'),
    items: [
      ['s1', b('Pavelló auricular', 'Pabellón auricular')], ['s2', b('Conducte auditiu extern', 'Conducto auditivo externo')], ['s3', b('Timpà', 'Tímpano')],
      ['s4', b('Martell, enclusa i estrep', 'Martillo, yunque y estribo')], ['s5', b('Còclea (òrgan de Corti)', 'Cóclea (órgano de Corti)')], ['s6', b('Nervi auditiu', 'Nervio auditivo')],
    ],
  },
  {
    id: 'patvista', ra: 4, type: 'match', pick: 6,
    title: b('Patologies de la vista', 'Patologías de la vista'),
    items: [
      ['miopia', b('Miopia', 'Miopía'), b('Veu malament de lluny: la imatge es forma davant de la retina.', 'Ve mal de lejos: la imagen se forma delante de la retina.')],
      ['hipermetropia', b('Hipermetropia', 'Hipermetropía'), b('Veu malament de prop: la imatge es forma darrere de la retina.', 'Ve mal de cerca: la imagen se forma detrás de la retina.')],
      ['presbicia', b('Presbícia', 'Presbicia'), b("Amb l'edat, el cristal·lí perd capacitat d'enfocar de prop.", 'Con la edad, el cristalino pierde capacidad de enfocar de cerca.')],
      ['astigmatisme', b('Astigmatisme', 'Astigmatismo'), b('La còrnia té una curvatura irregular i la visió es deforma.', 'La córnea tiene una curvatura irregular y la visión se deforma.')],
      ['cataracta', b('Cataracta', 'Catarata'), b('El cristal·lí es torna opac.', 'El cristalino se vuelve opaco.')],
      ['glaucoma2', b('Glaucoma'), b('Augmenta la pressió intraocular i es lesiona el nervi òptic.', 'Aumenta la presión intraocular y se lesiona el nervio óptico.')],
      ['conjuntivitis2', b('Conjuntivitis'), b('Inflamació de la conjuntiva: ull vermell i amb secreció.', 'Inflamación de la conjuntiva: ojo rojo y con secreción.')],
      ['daltonisme', b('Daltonisme', 'Daltonismo'), b('Dificultat per distingir alguns colors.', 'Dificultad para distinguir algunos colores.')],
      ['estrabisme', b('Estrabisme', 'Estrabismo'), b('Un ull es desvia i els dos ulls no miren al mateix punt.', 'Un ojo se desvía y los dos ojos no miran al mismo punto.')],
    ],
  },
  {
    id: 'patoida', ra: 4, type: 'match', pick: 6,
    title: b("Patologies de l'oïda", 'Patologías del oído'),
    items: [
      ['otext', b('Otitis externa'), b('Inflamació del conducte auditiu extern (sovint després de banyar-se).', 'Inflamación del conducto auditivo externo (a menudo tras bañarse).')],
      ['otmitja', b('Otitis mitjana', 'Otitis media'), b("Inflamació de l'orella mitjana, sovint després d'un refredat.", 'Inflamación del oído medio, a menudo tras un resfriado.')],
      ['presbiacusia', b('Presbiacúsia', 'Presbiacusia'), b("Pèrdua d'audició lligada a l'edat.", 'Pérdida de audición ligada a la edad.')],
      ['tinnitus', b('Acúfens (tinnitus)', 'Acúfenos (tinnitus)'), b('Se senten xiulets o brunzits sense cap so extern.', 'Se oyen pitidos o zumbidos sin ningún sonido externo.')],
      ['vertigen', b('Vertigen', 'Vértigo'), b("Sensació que tot gira, per alteració de l'equilibri.", 'Sensación de que todo gira, por alteración del equilibrio.')],
      ['tap', b('Tap de cerumen', 'Tapón de cerumen'), b('Acumulació de cera al conducte auditiu.', 'Acumulación de cera en el conducto auditivo.')],
      ['otosclerosi', b('Otosclerosi', 'Otosclerosis'), b("L'estrep queda fix i no transmet la vibració.", 'El estribo queda fijo y no transmite la vibración.')],
    ],
  },
  {
    id: 'funcions', ra: 4, type: 'match', pick: 6,
    title: b('Estructures i funcions', 'Estructuras y funciones'),
    items: [
      ['cons2', b('Cons', 'Conos'), b('Visió dels colors, amb molta llum.', 'Visión de los colores, con mucha luz.')],
      ['bastons', b('Bastons', 'Bastones'), b('Visió amb poca llum, en blanc i negre.', 'Visión con poca luz, en blanco y negro.')],
      ['ciliades', b('Cèl·lules ciliades', 'Células ciliadas'), b('Transformen la vibració del so en impuls nerviós.', 'Transforman la vibración del sonido en impulso nervioso.')],
      ['canals2', b('Canals semicirculars', 'Conductos semicirculares'), b('Equilibri dinàmic: detecten els girs del cap.', 'Equilibrio dinámico: detectan los giros de la cabeza.')],
      ['utricle', b('Utricle i sàccul', 'Utrículo y sáculo'), b('Equilibri estàtic: posició del cap.', 'Equilibrio estático: posición de la cabeza.')],
      ['pacini3', b('Corpuscle de Pacini', 'Corpúsculo de Pacini'), b('Pressió profunda i vibració.', 'Presión profunda y vibración.')],
      ['meissner3', b('Corpuscle de Meissner', 'Corpúsculo de Meissner'), b('Tacte fi i suau.', 'Tacto fino y suave.')],
      ['cristal3', b('Cristal·lí', 'Cristalino'), b('Enfoca la imatge canviant de forma (acomodació).', 'Enfoca la imagen cambiando de forma (acomodación).')],
      ['iris3', b('Iris'), b('Regula la llum que entra a l\'ull.', 'Regula la luz que entra en el ojo.')],
    ],
  },
  {
    id: 'sabors', ra: 4, type: 'match', pick: 5,
    title: b('Els cinc sabors bàsics', 'Los cinco sabores básicos'),
    items: [
      ['dolc', b('Dolç', 'Dulce'), b('Sucres com la glucosa o la sacarosa.', 'Azúcares como la glucosa o la sacarosa.')],
      ['salat', b('Salat', 'Salado'), b('Ions sodi de la sal comuna.', 'Iones sodio de la sal común.')],
      ['acid', b('Àcid', 'Ácido'), b('Ions hidrogen: llimona, vinagre.', 'Iones hidrógeno: limón, vinagre.')],
      ['amarg', b('Amarg', 'Amargo'), b('Cafè, quinina i molts medicaments.', 'Café, quinina y muchos medicamentos.')],
      ['umami', b('Umami'), b('Glutamat: brou, formatge curat.', 'Glutamato: caldo, queso curado.')],
    ],
  },
];
