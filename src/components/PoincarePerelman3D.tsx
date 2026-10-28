import React, { useState } from 'react';
import { Layers, ShieldAlert, Cpu, AlertOctagon, Sparkles, Orbit, CheckCircle2 } from 'lucide-react';

export const PoincarePerelman3D: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'3d_manifold' | 'extinction' | 's3_myth'>('3d_manifold');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-full shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400">
            Extensión Tridimensional · Topología Diferencial
          </span>
          <h3 className="text-sm font-bold text-slate-100">
            Variedad $M = S^2 \times S^1$, Extinción de Colding-Minicozzi e Imposibilidad de $S^3$
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab('3d_manifold')}
            className={`px-2.5 py-1 text-xs rounded-lg font-mono transition ${
              activeSubTab === '3d_manifold'
                ? 'bg-purple-950 text-purple-300 border border-purple-800'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            $S^2 \times S^1$
          </button>
          <button
            onClick={() => setActiveSubTab('extinction')}
            className={`px-2.5 py-1 text-xs rounded-lg font-mono transition ${
              activeSubTab === 'extinction'
                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Extinción Finita
          </button>
          <button
            onClick={() => setActiveSubTab('s3_myth')}
            className={`px-2.5 py-1 text-xs rounded-lg font-mono transition ${
              activeSubTab === 's3_myth'
                ? 'bg-pink-950 text-pink-300 border border-pink-800'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            El Mito de $S^3$
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {/* SUBTAB 1: M = S^2 x S^1 */}
        {activeSubTab === '3d_manifold' && (
          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 font-mono flex items-center gap-1.5">
                  <Orbit className="w-4 h-4 text-purple-400" />
                  Estructura de la 3-Variedad M = S² × S¹
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  π₁(M) ≅ ℤ
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mientras que el modelo bidimensional trabaja sobre el Horn Torus S por simplicidad de Gauss-Bonnet, la extensión tridimensional canónica se construye sobre el producto M = S² × S¹.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono text-purple-400 uppercase font-semibold block">
                  1. Esqueleto Homotópico:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  El 2-esqueleto de S² × S¹ es homotópicamente equivalente al Horn Torus S. El Real (S) es la armadura del espacio psíquico; la 3-celda abierta desplegada es el espacio donde opera la defensa (Pcc/Cc).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono text-purple-400 uppercase font-semibold block">
                  2. Grupo Fundamental Infinito:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  π₁(M) ≅ ℤ. El lazo que rodea el factor circular S¹ no puede deshacerse por ninguna deformación continua. Es la morada topológica del circuito de repetición pulsional C_ε.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono text-purple-400 uppercase font-semibold block">
                  3. Marcas como Bolas B_δ(p_i):
                </span>
                <p className="text-slate-300 leading-relaxed">
                  En 3D, remover bolas abiertas no altera π₁(M) (π₁(Ω) ≅ ℤ). La frontera de cada marca es una 2-esfera fija donde se prescriben la curvatura media H = h(a_i) y la clase conforme (Gianniotis 2016).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono text-purple-400 uppercase font-semibold block">
                  4. Disociación Espontánea:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  En 3D, los cuellos cilíndricos $S^2 \times I$ pueden estrangularse espontáneamente bajo el flujo de Ricci cuando la curvatura escalar explota. Esto formaliza geométricamente la <em>disociación psicopatológica</em>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: Finite Extinction Time */}
        {activeSubTab === 'extinction' && (
          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 font-mono flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  Teorema de Extinción Finita (Colding & Minicozzi, 2005)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  J. Amer. Math. Soc. [VW]
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Colding y Minicozzi demostraron que en 3-variedades cerradas sin sumandos asféricos, el flujo de Ricci con cirugía se extingue en tiempo finito: el volumen colapsa a cero.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-3">
              <span className="text-amber-400 font-bold block">Cálculo Explícito en S²(ρ) × S¹(L):</span>
              <div className="p-3 bg-slate-900 rounded border border-slate-800 text-slate-200 space-y-2">
                <p>Ric(g) = (1/ρ²) g_S² + 0 · g_S¹</p>
                <p>∂g/∂t = -2 Ric(g) ⟹ d(ρ²)/dt = -2</p>
                <p>ρ²(t) = ρ₀² - 2t ⟹ T_extinción = ρ₀² / 2</p>
              </div>

              <div className="p-3 bg-indigo-950/40 rounded border border-indigo-900/60 text-xs text-slate-300 font-sans leading-relaxed">
                <strong className="text-indigo-300 font-mono block mb-1">
                  Consecuencia Metapsicológica Crucial:
                </strong>
                Si el aparato psíquico estuviese compuesto exclusivamente por la defensa ($Pcc/Cc$ fluyendo libremente sin anclaje), <em>el espacio psíquico colapsaría totalmente en tiempo finito</em>. 
                Es indispensable que la estructura del inconsciente ($U$) actúe como <strong>condición de borde fija y atemporal</strong> para frenar el colapso y preservar la existencia de la variedad psíquica.
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: The Myth of S^3 */}
        {activeSubTab === 's3_myth' && (
          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-300 font-mono flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-pink-400" />
                  La Conjetura de Poincaré y la Imposibilidad del "Yo Totalmente Integrado" ($S^3$)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-800">
                  Perelman (2003)
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ciertas lecturas ingenuas postulan que el final del análisis debería conducir a un "Yo integrado", armónico y cerrado: homeomorfo a la 3-esfera $S^3$. La topología diferencial de este modelo refuta taxativamente esa fantasía.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-pink-950 text-pink-400 shrink-0">
                  <AlertOctagon className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-100">La Conjetura de Poincaré:</h5>
                  <p className="text-slate-300 mt-0.5 leading-relaxed">
                    Toda 3-variedad cerrada y <em>simplemente conexa</em> ($\pi_1 = 0$) es homeomorfa a $S^3$.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-indigo-950 text-indigo-400 shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-100">La Cirugía Prohibida (Proposición 3D-2):</h5>
                  <p className="text-slate-300 mt-0.5 leading-relaxed">
                    Para transformar M = S² × S¹ en S³, sería necesario cortar a lo largo de la esfera esencial Σ₀ = S² × (punto) y sellar ambos bordes con bolas. Pero eso <strong>destruiría π₁(M) ≅ ℤ y extinguiría el circuito de la fantasía</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-200 leading-relaxed">
                <strong className="text-amber-300">Conclusión Clínica Fundamental:</strong>
                <p className="mt-1">
                  El sujeto humano no puede devenir $S^3$. La cura analítica extirpa los quistes traumáticos separables ($V_T$), pero el espacio residual retiene siempre un resto inasimilable ($\pi_1 \neq 0$). <em>La fantasía es lo que impide la integración totalitaria del Yo y sostiene el deseo</em>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
