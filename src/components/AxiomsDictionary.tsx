import React, { useState } from 'react';
import { AXIOMS_DATA, GLOSSARY_TERMS } from '../data/thesisData';
import { AxiomDefinition } from '../types';
import { BookOpen, Search, ShieldCheck, CheckCircle2, AlertTriangle, Layers, ChevronRight, FileText } from 'lucide-react';

export const AxiomsDictionary: React.FC = () => {
  const [selectedAxiomNumber, setSelectedAxiomNumber] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'axioms' | 'propositions' | 'glossary'>('axioms');

  const selectedAxiom = AXIOMS_DATA.find(a => a.number === selectedAxiomNumber) || AXIOMS_DATA[0];

  const filteredGlossary = GLOSSARY_TERMS.filter(
    item =>
      item.german.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.spanish.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.explanation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'VT':
        return 'bg-emerald-950 text-emerald-300 border-emerald-700/60';
      case 'VW':
        return 'bg-indigo-950 text-indigo-300 border-indigo-700/60';
      case 'A':
        return 'bg-purple-950 text-purple-300 border-purple-700/60';
      case 'P':
        return 'bg-amber-950 text-amber-300 border-amber-700/60';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getBadgeDescription = (badge: string) => {
    switch (badge) {
      case 'VT':
        return '[VT] Verificado en texto alemán original (Imago, Aus den Anfängen)';
      case 'VW':
        return '[VW] Verificado en literatura matemática o fuente primaria digital';
      case 'A':
        return '[A] Decisión axiomática del autor del modelo';
      case 'P':
        return '[P] Hipótesis o interpretación analógica propuesta';
      case 'M':
        return '[M] Citado de memoria / pendiente de cotejo página a página';
      default:
        return '';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-full shadow-2xl overflow-hidden">
      {/* Subheader Navigation */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('axioms')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'axioms'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Los 10 Axiomas
          </button>
          <button
            onClick={() => setActiveTab('propositions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'propositions'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Proposiciones & Teoremas
          </button>
          <button
            onClick={() => setActiveTab('glossary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'glossary'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Glosario Alemán-Español
          </button>
        </div>

        {activeTab === 'glossary' && (
          <div className="relative w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar término..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* TAB 1: 10 AXIOMS */}
        {activeTab === 'axioms' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
            {/* Axiom Selector Sidebar */}
            <div className="md:col-span-5 space-y-1.5 overflow-y-auto max-h-[520px] pr-1">
              {AXIOMS_DATA.map(ax => (
                <button
                  key={ax.number}
                  onClick={() => setSelectedAxiomNumber(ax.number)}
                  className={`w-full text-left p-2.5 rounded-xl border transition flex items-center justify-between ${
                    ax.number === selectedAxiomNumber
                      ? 'bg-indigo-600/20 border-indigo-500/60 text-slate-100 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-400">Ax {ax.number}</span>
                      <span className="text-xs font-medium truncate">{ax.title}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase shrink-0 ${getBadgeStyle(
                      ax.statusBadge
                    )}`}
                  >
                    {ax.statusBadge}
                  </span>
                </button>
              ))}
            </div>

            {/* Axiom Detail Panel */}
            <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400">
                      Axioma {selectedAxiom.number} del Modelo Ricci-Freud
                    </span>
                    <h3 className="text-sm font-bold text-slate-100">{selectedAxiom.title}</h3>
                  </div>
                  <div className="flex flex-col items-end">
                    <span
                      title={getBadgeDescription(selectedAxiom.statusBadge)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase cursor-help ${getBadgeStyle(
                        selectedAxiom.statusBadge
                      )}`}
                    >
                      [{selectedAxiom.statusBadge}]
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Fuente Primaria Freudiana:
                  </span>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-xs text-amber-200/90 font-mono">
                    {selectedAxiom.freudSource}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Enunciado del Axioma:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    {selectedAxiom.statement}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Formalización Diferencial y Geométrica:
                  </span>
                  <div className="p-2.5 rounded bg-indigo-950/40 border border-indigo-900/60 font-mono text-xs text-indigo-200">
                    {selectedAxiom.mathDefinition}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Significancia en la Clínica y Metapsicología:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedAxiom.clinicalSignificance}
                  </p>
                </div>
              </div>

              {/* Objects Involved */}
              <div className="pt-2 border-t border-slate-800 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-500 font-mono">Objetos:</span>
                {selectedAxiom.objects.map((obj, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    {obj}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROPOSITIONS & THEOREMS */}
        {activeTab === 'propositions' && (
          <div className="space-y-4">
            {/* Prop 1 */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-emerald-400 font-mono">
                  Proposición 1 (Indestructibilidad Topológica del Fantasma)
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Poincaré / Perelman
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                El circuito de la fantasía C_ε = (r = ε) alrededor del núcleo n no es contraíble en la superficie horadada Ω (índice de giro w(C_ε, n) = ±1). Posee exponente de Floquet -α &lt; 0 (estabilidad estructural). Bajo el flujo suave de Ricci ∂g/∂t = -R g, la topología y las clases de homotopía se preservan estrictamente. Por ende, <em>el circuito de la fantasía primaria es indestructible por evolución continua o defensa</em>.
              </p>
            </div>

            {/* Prop 2 */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-indigo-400 font-mono">
                  Proposición 2 (Ley de Conservación de Curvatura y Aufwand)
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  Gauss-Bonnet
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Para la variedad con borde Ω, el teorema de Gauss-Bonnet establece que ∫_Ω K dA + ∫_(∂Ω) k_g ds = 2π χ(Ω) = -2π(k + 1). Como χ(Ω) es invariante topológico, cuando un recuerdo reprimido se activa por *Nachträglichkeit* y su curvatura geodésica k_g = h(a_i) sube, <em>la integral de curvatura interior en todo Ω debe disminuir en idéntica proporción</em>. El gasto de la defensa (*Aufwand*) es obligatoriamente global y redistributivo.
              </p>
            </div>

            {/* Prop 3 */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-400 font-mono">
                  Proposición 3 (Alcance y Límite de la Cirugía Analítica)
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  Perelman (Cirugía de Cuellos)
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Si una marca traumática p_i ∈ V_T es separable por un cuello γ_i (longitud ℓ(γ_i) &lt; ℓ_min), la cirugía extirpa el disco D_i y lo sella con un casquete liso. Dado que D_i no contiene a n (2πε ≥ ℓ_min), <em>la cirugía admisible no altera la clase de homotopía ni el índice de giro de C_ε</em>. La cura analítica desactiva síntomas y recuerdos reprimidos, pero deja intacto el soporte fantasmtico del sujeto.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: GERMAN-SPANISH GLOSSARY */}
        {activeTab === 'glossary' && (
          <div className="space-y-2.5">
            {filteredGlossary.map((entry, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-300 font-mono">{entry.german}</span>
                    <span className="text-xs text-slate-400">→</span>
                    <span className="text-xs font-semibold text-slate-200">{entry.spanish}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{entry.source}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{entry.explanation}</p>
                <div className="mt-1.5 pt-1.5 border-t border-slate-900 flex items-center gap-1.5 text-[11px] font-mono text-indigo-400">
                  <span className="text-slate-500">Equivalente geométrico:</span>
                  <span>{entry.mathAnalog}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
