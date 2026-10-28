import { PsychicMark, BahnungEdge, PartialDrive, AxiomDefinition, GlossaryEntry } from '../types';

export const INITIAL_MARKS: PsychicMark[] = [
  {
    id: 'n',
    name: 'Núcleo de la Fantasía (n)',
    freudConcept: 'Urverdrängung / Fantasía Primaria',
    u: Math.PI * 0.45,
    v: Math.PI * 0.35,
    charge: 12.0,
    state: 'activo',
    isPrimary: true,
    separable: false,
    neckLength: 2.8, // 2*pi*epsilon >= ell_min
    geodesicCurvature: 2.5, // 1 / epsilon
    clinicalDescription: 'Fantasía primaria indestructible. Sumidero rodeado por la pared de angustia (radio epsilon). Jamás fue consciente ni puede ser recordada: se repite en acto (Agieren).'
  },
  {
    id: 'p1',
    name: 'Marca Traumática p₁ (Escena Seducción)',
    freudConcept: 'Vorstellungsrepräsentanz traumática reprimida',
    u: Math.PI * 1.25,
    v: Math.PI * 0.7,
    charge: 7.5,
    state: 'latente',
    separable: true,
    neckLength: 0.85, // Cuello operable
    geodesicCurvature: 1.8,
    clinicalDescription: 'Huella mnémica de experiencia precoz displacentera. Separable mediante cuello quirúrgico: pasible de elaboración analítica.'
  },
  {
    id: 'p2',
    name: 'Marca p₂ (Complejo Hostil Fraterno)',
    freudConcept: 'Rivalidad y odio reprimido',
    u: Math.PI * 0.85,
    v: Math.PI * 1.3,
    charge: 5.2,
    state: 'activo',
    separable: true,
    neckLength: 1.1,
    geodesicCurvature: 1.4,
    clinicalDescription: 'Complejo hostil hacia el rival que moviliza contrainvestidura (Seitenbesetzung). Participa en circuitos pulsionales activos.'
  },
  {
    id: 'p3',
    name: 'Marca p₃ (Trauma Castigo / Culpa)',
    freudConcept: 'Sentimiento inconsciente de culpa',
    u: Math.PI * 1.7,
    v: Math.PI * 0.45,
    charge: 3.8,
    state: 'latente',
    separable: true,
    neckLength: 0.95,
    geodesicCurvature: 1.1,
    clinicalDescription: 'Inscripción pasible de reactivación nachträglich ante castigo o reproche adulto. Puede experimentar salto brusco de carga.'
  },
  {
    id: 'p4',
    name: 'Marca p₄ (Grito Acústico Primordial)',
    freudConcept: 'Complejo del Nebenmensch (Resto auditivo)',
    u: Math.PI * 0.15,
    v: Math.PI * 0.85,
    charge: 6.0,
    state: 'activo',
    separable: true,
    neckLength: 1.3,
    geodesicCurvature: 1.6,
    clinicalDescription: 'Resto sonoro inasimilable del prójimo auxiliar. Muy próximo al orificio de la cúspide c.'
  }
];

export const INITIAL_EDGES: BahnungEdge[] = [
  { id: 'e1', sourceId: 'p1', targetId: 'p2', weight: 4.8, activeFlow: 2.1 },
  { id: 'e2', sourceId: 'p2', targetId: 'p3', weight: 3.5, activeFlow: 1.4 },
  { id: 'e3', sourceId: 'p3', targetId: 'p4', weight: 5.2, activeFlow: 3.2 },
  { id: 'e4', sourceId: 'p4', targetId: 'p1', weight: 4.1, activeFlow: 2.7 },
  // Notice: no loaded edges to n, as Axiom 3 dictates: w(e) = 0 for edges to primary mark n!
];

export const PARTIAL_DRIVES: PartialDrive[] = [
  {
    id: 'oral',
    name: 'Pulsin Oral',
    lacanName: 'Trieb oral (pecho/incorporacin)',
    radius: 0.55,
    color: '#f59e0b', // amber
    speed: 1.2,
    description: 'Circuito concntrico en torno a la pared de angustia. No corta el orificio de la cspide.',
    passesThroughCusp: false
  },
  {
    id: 'anal',
    name: 'Pulsin Anal',
    lacanName: 'Trieb anal (retencin/expulsin)',
    radius: 0.75,
    color: '#84cc16', // lime
    speed: 0.85,
    description: 'Circuito concntrico ms externo. Mantiene ndice de giro w = 1 alrededor de n.',
    passesThroughCusp: false
  },
  {
    id: 'escopica',
    name: 'Pulsin Escpica',
    lacanName: 'Trieb escpico (la mirada/espectador)',
    radius: 0.95,
    color: '#06b6d4', // cyan
    speed: 1.5,
    description: 'Soporte del lugar de espectador (fundamental en la fase 3 de "Pegan a un nio").',
    passesThroughCusp: false
  },
  {
    id: 'invocante',
    name: 'Pulsin Invocante',
    lacanName: 'Trieb invocante (la voz / el odo)',
    radius: 0.65,
    color: '#ec4899', // pink/rose
    speed: 1.1,
    description: 'Circuito deformado C_inv que atraviesa el orificio de la cspide c (B_? y B_+). Es la NICA pulsin directamente observable en la emisin vocal y(t)!',
    passesThroughCusp: true
  }
];

export const AXIOMS_DATA: AxiomDefinition[] = [
  {
    number: 1,
    title: 'Ding / Real (Soporte No Representable)',
    freudSource: 'Entwurf einer Psychologie (1895), pp. 415-416 [VT]',
    statusBadge: 'VT',
    statement: 'El aparato psquico se despliega sobre una superficie compacta S de tipo Horn Torus con cspide c = (0,0,0). La superficie encarna el resto inasimilable del complejo del prjimo (Nebenmensch), lo Real no reducible a representacin.',
    mathDefinition: 'S = T_1: \\quad (x^2 + y^2 + z^2) = 2\\sqrt{x^2+y^2}. \\quad \\text{En torno a } c: \\; s \\approx z^2/2.',
    clinicalSignificance: 'El inconsciente freudiano no flota en el vaco: posee un soporte que excede lo psquico, la Cosa freudiana (Das Ding), que ningn anlisis puede transformar en mera representacin de palabra.',
    objects: ['Horn Torus S', 'Cspide c', 'Nebenmensch', 'Das Ding']
  },
  {
    number: 2,
    title: 'Marcas VR (Vorstellungsreprsentanzen)',
    freudSource: 'Carta a Fliess 2.5.1897 [VT]; Lo Inconsciente (1915) [VW]',
    statusBadge: 'VT',
    statement: 'Existe un conjunto discreto V = V_T \\cup \\{n\\} \\subset S \\setminus \\{c\\} de marcas con curvatura concentrada y carga a_i \\ge 0. Se distinguen las marcas traumticas reprimidas V_T (elaborables) de la marca primaria n (ncleo indestructible).',
    mathDefinition: 'V = \\{p_1, \\dots, p_k\\} \\cup \\{n\\}, \\quad a_i \\ge 0, \\quad \\sigma_i \\in \\{\\text{latente}, \\text{activo}\\}.',
    clinicalSignificance: 'No todo recuerdo reprimido es del mismo orden. El ncleo de la fantasa no es una representacin reprimida ms: es una marca primaria nunca antes consciente.',
    objects: ['V_T (trauma recuperable)', 'n (marca primaria)', 'Carga a_i']
  },
  {
    number: 3,
    title: 'Red de Facilitacin (Bahnung) \\Gamma',
    freudSource: 'Entwurf einer Psychologie (1895), Parte I [VT]',
    statusBadge: 'VT',
    statement: 'La memoria no es una coleccin de copias ni imgenes estticas, sino grados de permeabilidad (Bahnung) entre barreras de contacto (Kontaktschranken), formalizado como un grafo ponderado \\Gamma = (V, E, w).',
    mathDefinition: '\\Gamma = (V, E, w), \\quad w(e) \\ge 0. \\quad w(e) = 0 \\; \\forall e \\sim n.',
    clinicalSignificance: 'El recuerdo es el recorrido de una va facilitada. Las aristas se realizan como geodsicas sobre la superficie. La marca primaria n no tiene aristas cargadas, impidiendo su captura directa.',
    objects: ['Grafo \\Gamma', 'Pesos w(e)', 'Kontaktschranken']
  },
  {
    number: 4,
    title: 'Pulsin (Trieb) y Dinmica de Cantidad Q',
    freudSource: 'Entwurf (1895) [VT]; Principio de Inercia y Constancia',
    statusBadge: 'VT',
    statement: 'La pulsin es un flujo de cantidad Q que circula exclusivamente por los circuitos del subgrafo \\Gamma_\\theta cuyos pesos superan el umbral w \\ge \\theta. Obedece al principio de constancia bajo estmulo endgeno constante s.',
    mathDefinition: '\\frac{dQ}{dt} = -L_\\theta Q + s, \\quad L_\\theta = D_\\theta - W_\\theta.',
    clinicalSignificance: 'Diferencia esencial de niveles: el Icc estructural es atemporal, pero la pulsin es dinmica y recorre vas en el tiempo psquico.',
    objects: ['Cantidad Q', 'Triebfeder s', 'Laplaciano L_\\theta']
  },
  {
    number: 5,
    title: 'Ncleo de la Fantasa y Ciclo Lmite de Angustia',
    freudSource: 'Pegan a un nio (1919), Fase 2 [VW]; Inhibicin, sntoma y angustia (1926)',
    statusBadge: 'VW',
    statement: 'La marca primaria n es un sumidero hacia el cual la pulsin converge, pero una barrera de angustia en radio \\epsilon > 0 la repele, configurando un ciclo lmite atractor C_\\epsilon.',
    mathDefinition: '\\dot{r} = -\\alpha(r - \\epsilon), \\quad \\dot{\\theta} = \\omega, \\quad C_\\epsilon = \\{r = \\epsilon\\}.',
    clinicalSignificance: 'La pulsin bordea perpetuamente el ncleo sin tocarlo. La angustia seal acta como pared rgida (k_g = 1/\\epsilon).',
    objects: ['Sumidero n', 'Radio de angustia \\epsilon', 'Ciclo lmite C_\\epsilon']
  },
  {
    number: 6,
    title: 'Indestructibilidad Topolgica de la Fantasa',
    freudSource: 'Poincar (Analysis Situs, 1895) [VW]; Recordar, repetir y reelaborar (1914)',
    statusBadge: 'VW',
    statement: 'El circuito de repeticin C_\\epsilon posee ndice de giro w(C_\\epsilon, n) = \\pm 1 y no es contrable en la regin horadada \\Omega. El flujo suave de Ricci no puede anular su clase homotpica.',
    mathDefinition: 'w(C_\\epsilon, n) = \\frac{1}{2\\pi} \\oint_{C_\\epsilon} d\\theta = \\pm 1. \\quad \\text{Exponente de Floquet } -\\alpha < 0.',
    clinicalSignificance: 'La compulsin de repeticin est blindada por estabilidad estructural y topologa: ningn proceso continuo ni elaboracin analtica ordinaria puede destruir el ncleo fantasmtico.',
    objects: ['ndice de giro', 'Estabilidad de Floquet', 'Invariancia homotpica']
  },
  {
    number: 7,
    title: 'Nachtrglichkeit (Accin Diferida)',
    freudSource: 'Cartas a Fliess del 14.2.1897 y 2.5.1897 [VT]',
    statusBadge: 'VT',
    statement: 'Una marca latente se activa cuando un evento posterior E_j eleva su carga a_i mediante una ganancia madurativa g(t) \\ge 1. El circuito ya exista; lo que muta bruscamente es la carga puntual.',
    mathDefinition: 'a_i(t_j^+) = a_i(t_j^-) + g(t_j) \\alpha_{ij} m_j, \\quad g(t) \\ge 1.',
    clinicalSignificance: 'Un recuerdo infantil irritante cobra fuerza desestabilizadora aos despus al madurar el aparato. No altera w, sino la carga puntual que inyecta tensin al sistema.',
    objects: ['Ganancia g(t)', 'Salto de carga a_i', 'Activacin latente']
  },
  {
    number: 8,
    title: 'Atemporalidad del Icc vs Tiempo de la Defensa',
    freudSource: 'Lo Inconsciente (1915) [VW]; Carta 52 [VT]',
    statusBadge: 'VW',
    statement: 'La estructura inconsciente U = (S, V, \\Gamma, n) es atemporal e invariante entre eventos (da_i/dt = 0). El flujo temporal de Ricci pertenece exclusivamente a la contrainvestidura (Gegenbesetzung) en \\Omega.',
    mathDefinition: '\\frac{\\partial g}{\\partial t} = -R g \\quad \\text{en } \\Omega; \\quad \\frac{da_i}{dt} = 0 \\quad \\text{(entre eventos)}.',
    clinicalSignificance: 'Resuelve la gran contradiccin: el Icc no fluye ni envejece en su estructura; lo que fluye en el tiempo es la defensa del Yo y la circulacin de la pulsin.',
    objects: ['U atemporal', 'Flujo de Ricci temporal', 'Contrainvestidura']
  },
  {
    number: 9,
    title: 'La Cspide como Puerto Acstico (Voz y Odo)',
    freudSource: 'Carta 52 [VT]; La Afasia (1891); El yo y el ello (1923, Hrkappe)',
    statusBadge: 'VT',
    statement: 'Lo nico directamente observable del sistema es el flujo que emerge por la cspide c (lo vocalizado y(t)), mientras que el mandato del supery entra como seal u(t). Forman un par de Dirichlet a Neumann.',
    mathDefinition: 'u(t) = K|_B \\; \\text{(lo odo / Supery)}, \\quad y(t) = \\int_B \\partial_\\nu K ds \\; \\text{(voz/sntoma)}.',
    clinicalSignificance: 'El analista no tiene acceso mgico directo al interior del aparato psquico; slo escucha la voz y(t). Reconstruir el interior es resolver un problema inverso de tipo Caldern.',
    objects: ['Puerto c', 'Dirichlet-to-Neumann', 'Voz y(t)', 'Supery u(t)']
  },
  {
    number: 10,
    title: 'Cura Analtica y Ciruga de Perelman',
    freudSource: 'Perelman (2003) [VW]; Freud (Construcciones en el anlisis, 1937)',
    statusBadge: 'VW',
    statement: 'La ciruga analtica solo opera sobre marcas traumticas separables V_T con cuellos delgados (\\ell(\\gamma_i) < \\ell_{min}). La marca primaria n y su ciclo C_\\epsilon estn estrictamente protegidos.',
    mathDefinition: 'V \\mapsto V \\setminus \\{p_i\\}, \\quad \\ell(\\gamma_i) < \\ell_{min}, \\quad 2\\pi\\epsilon \\ge \\ell_{min}.',
    clinicalSignificance: 'El anlisis no puede ni debe prometer "aniquilar la fantasa primaria" o borrar el ncleo del sujeto. Su eficacia radica en desanudar y extirpar marcas traumticas neurticas fijadas, dejando intacto el ncleo originario.',
    objects: ['Ciruga en cuellos', 'Extraccin de V_T', 'Indestructibilidad de n']
  }
];

export const GLOSSARY_TERMS: GlossaryEntry[] = [
  {
    german: 'Vorstellung',
    spanish: 'Representacin',
    source: 'Entwurf (1895), Metapsicologa (1915)',
    explanation: 'Unidad elemental del pensamiento psquico susceptible de investidura.',
    mathAnalog: 'Configuracin en el espacio de estados.'
  },
  {
    german: 'Vorstellungsreprsentanz (VR)',
    spanish: 'Representante-de-la-representacin',
    source: 'Carta 2.5.1897; 1915',
    explanation: 'Delegacin psquica de la pulsin en el inconsciente.',
    mathAnalog: 'Punto puntual p_i con curvatura y carga concentrada a_i.'
  },
  {
    german: 'Bahnung',
    spanish: 'Facilitacin',
    source: 'Entwurf (1895), Parte I',
    explanation: 'Disminucin de la resistencia en una barrera de contacto entre neuronas tras el paso de cantidad Q. Soporte fsico de la memoria.',
    mathAnalog: 'Peso w(e) de la arista en el grafo \\Gamma.'
  },
  {
    german: 'Kontaktschranke',
    spanish: 'Barrera de contacto',
    source: 'Entwurf (1895)',
    explanation: 'Punto de contacto interfacial entre neuronas (anticipacin freudiana de la sinapsis).',
    mathAnalog: 'Aristas del grafo y contacto singular en la cspide c.'
  },
  {
    german: 'Besetzung / Gegenbesetzung',
    spanish: 'Investidura / Contrainvestidura',
    source: 'Entwurf (Seitenbesetzung, p. 408); 1915',
    explanation: 'Energa psquica ligada a una representacin, y el gasto reactivo que el Yo mantiene para frenar lo reprimido.',
    mathAnalog: 'Carga a_i en el borde y flujo de Ricci actuando sobre la variedad \\Omega.'
  },
  {
    german: 'Nachtrglichkeit',
    spanish: 'Accin diferida (a posteriori)',
    source: 'Cartas a Fliess (1897), Caso Juanito, Hombre de los Lobos',
    explanation: 'Una vivencia adquiere significacin y potencia traumtica con posterioridad en funcin del desarrollo psicosexual.',
    mathAnalog: 'Salto discreto en la carga a_i con factor de maduracin g(t) \\ge 1.'
  },
  {
    german: 'Das Ding',
    spanish: 'La Cosa',
    source: 'Entwurf (1895), pp. 415-416',
    explanation: 'La parte constante e inasimilable del complejo del prjimo (Nebenmensch), irreductible a representacin.',
    mathAnalog: 'La superficie basal S (Horn Torus) y lo Real.'
  },
  {
    german: 'Urverdrngung',
    spanish: 'Represin primaria',
    source: '1915 (La Represin)',
    explanation: 'Fijacin primordial de la pulsin a una primera marca no consciente, que atrae a lo reprimido secundario.',
    mathAnalog: 'Marca primaria n (sumidero) y radio de angustia \\epsilon.'
  },
  {
    german: 'Aufwand',
    spanish: 'Gasto / Costo energtico de la defensa',
    source: 'Entwurf (1895), pp. 408-409',
    explanation: 'El costo continuo que el Yo paga con su propia energa para sostener la contrainvestidura.',
    mathAnalog: 'Teorema de Gauss-Bonnet: redistribucin forzada de curvatura \\int_\\Omega K dA.'
  },
  {
    german: 'Hrkappe',
    spanish: 'Casquete acstico',
    source: 'El yo y el ello (1923)',
    explanation: 'El Yo se apoya preferentemente en el extremo acstico; el Supery hereda el contacto oral-auditivo con el padre.',
    mathAnalog: 'Borde B de la cspide c (puerto de Dirichlet-to-Neumann).'
  }
];

export const BEATEN_CHILD_PHASES = [
  {
    phase: 1,
    title: 'Fase 1: "Mi padre est pegando al nio (que yo odio)"',
    subtitle: 'Construccin terica de Freud',
    character: 'Sdica, rivalidad fraterna',
    agent: 'El padre',
    patient: 'El hermano / rival (otro nio)',
    consciousState: 'Inaccesible directamente; casi nunca recordada por el paciente.',
    modelAnalog: 'Estructura organizativa fija del subgrafo \\Gamma que encamina la pulsin hacia el circuito de repeticin. No es separable por ciruga.',
    clinicalDetail: 'Freud destaca que los pacientes apenas traen recuerdos vagos. Es una construccin previa del analista que da cuenta de la posterior derivacin del deseo edpico incestuoso reprimido.'
  },
  {
    phase: 2,
    title: 'Fase 2: "Yo soy azotado/a por el padre"',
    subtitle: 'Construccin radical del anlisis (Urverdrngung)',
    character: 'Masoquista, culpa inconsciente y satisfaccin ertica',
    agent: 'El padre',
    patient: 'El propio sujeto ("Yo")',
    consciousState: 'NUNCA fue consciente, nunca existi como recuerdo consciente en la vida del sujeto.',
    modelAnalog: 'La marca primaria n y el ciclo lmite indestructible C_\\epsilon. Punto comn de giro de las pulsiones parciales.',
    clinicalDetail: 'Es la fase central y ms grvida de consecuencias. Demuestra la atemporalidad e indestructibilidad del ncleo fantasmtico. La ciruga est prohibida en esta clase.'
  },
  {
    phase: 3,
    title: 'Fase 3: "Pegan a un nio (varios nios estn siendo azotados)"',
    subtitle: 'nica forma manifiesta y consciente',
    character: 'Espectador voyeurista / excitacin sexual despersonalizada',
    agent: 'Figura sustituta (maestro, autoridad, tutor)',
    patient: 'Nios indeterminados (otros)',
    consciousState: 'S trada activamente por el paciente en la consulta analtica.',
    modelAnalog: 'La seal observable y(t) emitida por el orificio de la cspide c y acoplada a la pulsin invocante y escpica.',
    clinicalDetail: 'El sujeto se coloca como mero espectador con excitacin sexual masturbatoria. Es el sntoma visible que el anlisis toma como punto de partida para resolver el problema inverso.'
  }
];
