import React, { useState } from 'react';
import { BookOpen, Search, Bookmark, ChevronRight, FileCheck, HelpCircle } from 'lucide-react';

interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  keyPoints: string[];
  excerpt: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: 'Capítulo 1: Introducción y Axiomas de Método',
    subtitle: 'Axiomas M1 a M7: Reglas de analogía controlada, primacía de fuentes y etiquetado',
    keyPoints: [
      'M1 (Analogía, no identidad): No se afirma que la psique "sea" una variedad riemanniana.',
      'M2 (Primacía de fuentes): Cotejo directo con el texto alemán de Imago (Aus den Anfängen).',
      'M3 (Separación de niveles): La pulsión sobre la superficie vs el flujo en el espacio de métricas.',
      'M4 (El Icc no fluye): La estructura U es atemporal; el tiempo t pertenece a la defensa.',
      'M5 (Fantasía primaria no operable): n no puede extirparse mediante cirugía.',
      'M6 (Contingencia del análisis): El problema inverso de reconstrucción puede no tener unicidad.',
      'M7 (Etiquetado estricto): [VT], [VW], [A], [P], [M] para auditar la certeza.'
    ],
    excerpt:
      'Esta tesis se ocupa de una pregunta que atraviesa la historia del psicoanálisis y la matemática: ¿es posible formalizar aspectos de la metapsicología freudiana con herramientas tomadas de la geometría diferencial y la topología, sin pretender que la psique sea una variedad ni que el inconsciente sea un flujo de Ricci? El resultado es un modelo analógico estricto: un diccionario controlado entre conceptos freudianos y objetos geométricos.'
  },
  {
    id: 2,
    title: 'Capítulo 2: Freud: el Proyecto y el Aparato Psíquico',
    subtitle: 'Formalización mínima a partir del Entwurf (1895), cartas a Fliess y la Afasia (1891)',
    keyPoints: [
      'Principio de inercia (Q → 0) y principio de constancia como antecedentes de flujos gradiente.',
      'Bahnung (facilitación) en las barreras de contacto: la memoria como pesos de un grafo, no copias.',
      'El Nebenmensch y Das Ding (pp. 415-416 Imago): el resto inasimilable como soporte (Superficie S).',
      'Carta 52: representaciones de palabra (Wortvorstellungen) y separación entre memoria y conciencia.',
      'Nachträglichkeit (14.2.1897): la vivencia infantil secreta mayor descarga al madurar el aparato.',
      'Seitenbesetzung (pp. 408-409): investidura lateral y gasto energético propio (Aufwand).'
    ],
    excerpt:
      'El Proyecto de 1895 es el intento más cercano de Freud a un modelo con magnitudes, principios de extremum y una distinción entre percepción y memoria. La Bahnung permite pensar la memoria como estructura de pesos en una red, no como copia. El Nebenmensch introduce una parte constante del objeto que no se reduce a la representación.'
  },
  {
    id: 3,
    title: 'Capítulo 3: Poincaré: Analysis Situs, Conjetura e Invención',
    subtitle: 'Grupo fundamental, ciclos límite y el trabajo inconsciente del matemático',
    keyPoints: [
      'Analysis Situs (1895) y grupo fundamental π₁: clasificación de lazos contraíbles y no contraíbles.',
      'Ciclos límite de la dinámica cualitativa: atractor C_ε alrededor de n con exponente de Floquet < 0.',
      'La invención matemática (1908): testimonio de Poincaré sobre el trabajo inconsciente de incubación.',
      'Hadamard (1945): las cuatro fases (preparación, incubación, iluminación, verificación).',
      'La conjetura de Poincaré: horizonte de lo simplemente conexo (S³).'
    ],
    excerpt:
      'Poincaré aporta tres piezas capitales: el lenguaje de lazos de π₁ para formalizar la repetición que no se puede deshacer; los ciclos límite como atractores de la pulsión; y el testimonio capital de que la invención depende de un trabajo inconsciente que prepara la iluminación consciente.'
  },
  {
    id: 4,
    title: 'Capítulo 4: Flujo de Ricci y Entropía de Perelman',
    subtitle: 'Ecuación de flujo, cirugía de cuellos, extinción finita y flujo con borde (Gianniotis)',
    keyPoints: [
      'Ecuación del flujo: ∂g/∂t = -2 Ric(g). En dimensión 2: ∂g/∂t = -R g; ∂K/∂t = ΔK + 2K².',
      'Entropía de Perelman (funcional W): flujo gradiente monótono; ausencia de breathers u órbitas periódicas en el espacio de métricas.',
      'Cirugía en 3-variedades: corte de cuellos cilíndricos y sellado con casquetes esféricos.',
      'Extinción finita (Colding-Minicozzi 2005): colapso inevitable si no existe borde fijo.',
      'Flujo con borde prescrito (Gianniotis 2016): garantía de existencia y unicidad con curvatura prescrita.'
    ],
    excerpt:
      'Perelman demostró que el flujo de Ricci es de tipo gradiente respecto de un funcional monótono. Las singularidades canónicas son estrangulamientos de cuellos, los cuales se operan mediante cirugía. En dimensión 3, la defensa colapsaría el espacio psíquico en tiempo finito a menos que el inconsciente actúe como condición de frontera rígida.'
  },
  {
    id: 5,
    title: 'Capítulo 5: La Analogía Axiomática',
    subtitle: 'Los 10 axiomas, definiciones, Gauss-Bonnet, pulsiones parciales y marcas S-I',
    keyPoints: [
      'Axioma 1 a 4: Ding (S), Marcas VR (V), Grafo de facilitación Γ, Pulsión (dQ/dt = -L_θ Q + s).',
      'Axioma 5 y 6: Núcleo n como sumidero, radio de angustia ε, ciclo límite C_ε, indestructibilidad.',
      'Axioma 7 y 8: Nachträglichkeit con ganancia g(t) ≥ 1; estructura U atemporal vs defensa temporal.',
      'Axioma 9 y 10: Cúspide c como puerto Dirichlet-Neumann; cirugía analítica solo sobre V_T.',
      'Teorema de Gauss-Bonnet: ∫_Ω K dA + ∫_{∂Ω} k_g ds = -2π(k+1) como balance estricto del Aufwand.',
      'Pulsiones parciales concéntricas y circuito invocante deformado C_{inv} que cruza el orificio.'
    ],
    excerpt:
      'El corazón de la tesis: diez axiomas que articulan la metapsicología freudiana con la geometría diferencial. El flujo de Ricci actúa exclusivamente en la región consciente/preconsciente Ω, con las marcas inconscientes como frontera fija. Toda reactivación de una marca por Nachträglichkeit fuerza una redistribución global de curvatura (Aufwand).'
  },
  {
    id: 6,
    title: 'Capítulo 6: Cirugía, Fantasía y «Pegan a un niño»',
    subtitle: 'Revisión crítica de las tres fases (Freud 1919) y el problema inverso de Calderón',
    keyPoints: [
      'Corrección teórica: Tanto la Fase 1 como la Fase 2 son construcciones; ninguna es recuerdo recuperable.',
      'Fase 2 («Yo soy azotado/a por el padre»): Núcleo primario n y ciclo C_ε indestructible.',
      'Fase 1 («Mi padre pega al niño que odio»): Organización fija de la red que encamina la pulsión.',
      'Fase 3 («Pegan a un niño»): La forma manifiesta observable en la voz y(t).',
      'El problema inverso: Reconstruir el interior (g, w, n) a partir del operador Dirichlet-Neumann en la cúspide.'
    ],
    excerpt:
      'La fantasía de paliza demuestra que la fantasía no es un trauma reprimido que el paciente pueda recordar. Es una construcción teórica indispensable para dar cuenta de la salida sintomática observable. La cirugía analítica desactiva marcas neuróticas, pero la fantasía originaria permanece protegida por topología.'
  },
  {
    id: 7,
    title: 'Capítulo 7: Límites y Objeciones',
    subtitle: 'Auditoría rigurosa de 18 tensiones internas, problemas abiertos y límites de validez',
    keyPoints: [
      'Singularidad de la cúspide: Resuelta al fluir la familia T_r (r < 1) o S \\ {c}.',
      'Dimensión 2 vs 3: 2D para Gauss-Bonnet; 3D para π₁ infinito y cuello espontáneo.',
      'Atemporalidad vs Flujo: Resuelta al restringir el flujo a Ω y fijar U.',
      'Repetición vs Monotonicidad de Perelman: Resuelta al distinguir niveles de dinámica.',
      'Regla de reorganización de aristas tras cirugía: Problema abierto.',
      'Exclusión deliberada: No se modela la transferencia ni la segunda tópica como regiones separadas.'
    ],
    excerpt:
      'Una tesis de analogía formal se valida por lo que declara no sostener. Este capítulo inventaría las 18 tensiones internas y clasifica cada una con su estado: resuelta, parcial, postulada o abierta. Quien objete el modelo encontrará aquí la cartografía exacta de sus bordes.'
  },
  {
    id: 8,
    title: 'Capítulo 8: Conclusiones',
    subtitle: 'Lo que se sostuvo, lo que quedó abierto y el valor del hospedaje geométrico',
    keyPoints: [
      'Se construyó un diccionario axiomático coherente y trazable.',
      'Se demostró la compatibilidad entre la atemporalidad freudiana y la evolución por EDP.',
      'Se formalizó la indestructibilidad de la fantasía frente a la extirpabilidad del trauma.',
      'Se probó que el final del análisis no es la 3-esfera S³ (Yo integrado sin resto), sino un espacio con lazo irreductible.'
    ],
    excerpt:
      'Lo que permanece, cuando se apaga el flujo de la defensa, no es la 3-esfera. Es un espacio con resto: con lazo, con núcleo, con marcas. El modelo no promete la integración totalitaria. Promete un lenguaje en el que esa imposibilidad se puede enunciar sin metáfora vaga.'
  }
];

export const ThesisReader: React.FC = () => {
  const [selectedChapterId, setSelectedChapterId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentChapter = CHAPTERS.find(c => c.id === selectedChapterId) || CHAPTERS[0];

  const filteredChapters = CHAPTERS.filter(
    c =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-full shadow-2xl overflow-hidden">
      {/* Top Bar */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-slate-200">
            Tesis Completa: Flujo de Ricci y Metapsicología Freudiana (2026)
          </span>
        </div>

        <div className="relative w-56">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar en la tesis..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Main Reading Layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Chapter Index Sidebar */}
        <div className="md:col-span-4 border-r border-slate-800 bg-slate-950/70 p-3 overflow-y-auto space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold px-1 block mb-2">
            Índice de Capítulos (8 Capítulos)
          </span>
          {filteredChapters.map(ch => (
            <button
              key={ch.id}
              onClick={() => setSelectedChapterId(ch.id)}
              className={`w-full text-left p-2.5 rounded-xl border transition ${
                ch.id === selectedChapterId
                  ? 'bg-indigo-600/20 border-indigo-500 text-slate-100 shadow'
                  : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span className="text-[10px] font-mono text-indigo-400 block font-semibold">
                Capítulo {ch.id}
              </span>
              <h5 className="text-xs font-semibold truncate mt-0.5">{ch.title.split(':')[1] || ch.title}</h5>
              <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{ch.subtitle}</p>
            </button>
          ))}
        </div>

        {/* Chapter Reader View */}
        <div className="md:col-span-8 p-6 overflow-y-auto bg-slate-900 space-y-5">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
              Edición Unificada · Octubre 2026
            </span>
            <h2 className="text-lg font-bold text-slate-100 mt-1">{currentChapter.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">{currentChapter.subtitle}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
            "{currentChapter.excerpt}"
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
              Tesis Principales y Proposiciones Demostradas:
            </h4>
            <div className="space-y-2">
              {currentChapter.keyPoints.map((pt, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5"
                >
                  <span className="font-mono text-indigo-400 font-bold shrink-0">{i + 1}.</span>
                  <span className="leading-relaxed">{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
