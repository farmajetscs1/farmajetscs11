import React, { useState } from 'react';
import { PsychicMark, BahnungEdge, GaussBonnetState, VoiceSignalPoint } from '../types';
import {
  Activity,
  Zap,
  Scissors,
  Volume2,
  Sliders,
  ShieldAlert,
  HelpCircle,
  Play,
  Pause,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface RicciFlowDashboardProps {
  marks: PsychicMark[];
  edges: BahnungEdge[];
  selectedMarkId: string | null;
  onSelectMark: (id: string) => void;
  onTriggerNachtraglichkeit: (markId: string, magnitude: number, gain: number) => void;
  onPerformSurgery: (markId: string) => void;
  onResetManifold: () => void;
  isRicciFlowing: boolean;
  onToggleRicciFlow: () => void;
  gaussBonnet: GaussBonnetState;
  driveFlowRate: number;
  onChangeDriveRate: (rate: number) => void;
  driveThreshold: number; // theta
  onChangeDriveThreshold: (theta: number) => void;
  voiceSignals: VoiceSignalPoint[];
  onInjectSuperegoVoice: (magnitude: number) => void;
}

export const RicciFlowDashboard: React.FC<RicciFlowDashboardProps> = ({
  marks,
  edges,
  selectedMarkId,
  onSelectMark,
  onTriggerNachtraglichkeit,
  onPerformSurgery,
  onResetManifold,
  isRicciFlowing,
  onToggleRicciFlow,
  gaussBonnet,
  driveFlowRate,
  onChangeDriveRate,
  driveThreshold,
  onChangeDriveThreshold,
  voiceSignals,
  onInjectSuperegoVoice
}) => {
  const [activeTab, setActiveTab] = useState<'nachtrag' | 'gauss' | 'surgery' | 'cusp' | 'drives'>('nachtrag');
  const [nachtragMagnitude, setNachtragMagnitude] = useState<number>(4.5);
  const [nachtragGain, setNachtragGain] = useState<number>(2.2); // g(t) >= 1
  const [superegoTone, setSuperegoTone] = useState<number>(3.0);
  const [notification, setNotification] = useState<string | null>(null);

  const selectedMark = marks.find(m => m.id === selectedMarkId) || marks[1] || marks[0];

  const handleTrigger = () => {
    if (!selectedMark) return;
    onTriggerNachtraglichkeit(selectedMark.id, nachtragMagnitude, nachtragGain);
    setNotification(
      `¡Nachträglichkeit ejecutada en ${selectedMark.name}! Carga incrementada con ganancia madurativa g = ${nachtragGain.toFixed(1)}.`
    );
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSurgery = (id: string) => {
    onPerformSurgery(id);
    setNotification(`Cirugía de Perelman completada: cuello extirpado y sellado con casquete suave.`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-full shadow-2xl overflow-hidden">
      {/* Dashboard Header & Tabs */}
      <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('nachtrag')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'nachtrag'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Nachträglichkeit
          </button>
          <button
            onClick={() => setActiveTab('gauss')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'gauss'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Gasto / Gauss-Bonnet
          </button>
          <button
            onClick={() => setActiveTab('surgery')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'surgery'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            Cirugía (Cura)
          </button>
          <button
            onClick={() => setActiveTab('cusp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'cusp'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            Puerto Voz / Cúspide
          </button>
          <button
            onClick={() => setActiveTab('drives')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'drives'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Pulsión Q
          </button>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleRicciFlow}
            title={isRicciFlowing ? 'Pausar relajación de Ricci' : 'Activar flujo de Ricci en Omega'}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition flex items-center gap-1.5 shadow ${
              isRicciFlowing
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {isRicciFlowing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isRicciFlowing ? 'Ricci ON' : 'Ricci OFF'}
          </button>
          <button
            onClick={onResetManifold}
            title="Restablecer marcas y estado inicial del aparato psíquico"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="bg-indigo-950/90 border-b border-indigo-700/50 px-4 py-2 text-xs text-indigo-200 flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Tab Contents */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {/* TAB 1: Nachträglichkeit */}
        {activeTab === 'nachtrag' && (
          <div className="space-y-4">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Axioma 7: Nachträglichkeit (Acción Diferida)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  Freud a Fliess (1897) [VT]
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Una vivencia infantil latente deviene traumática <em>a posteriori</em>. El aparato crece, madura y, ante un estímulo posterior $E_j$, se produce un salto repentino en la carga de la marca:
              </p>
              <div className="mt-2 p-2 bg-slate-900 rounded font-mono text-[11px] text-amber-200 border border-slate-800 text-center">
                a_i(t_j⁺) = a_i(t_j⁻) + g(t_j) · α_ij · m_j  (g(t) ≥ 1)
              </div>
            </div>

            {/* Select Mark */}
            <div>
              <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                Seleccionar Marca a Reactivar ($p_i \in V$):
              </label>
              <div className="grid grid-cols-2 gap-2">
                {marks
                  .filter(m => m.state !== 'quirurgico_removido')
                  .map(mark => (
                    <button
                      key={mark.id}
                      onClick={() => onSelectMark(mark.id)}
                      className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                        mark.id === selectedMarkId
                          ? 'border-amber-500 bg-amber-500/10 text-white shadow-lg'
                          : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-semibold truncate">{mark.name}</span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                            mark.isPrimary
                              ? 'bg-pink-950 text-pink-300 border border-pink-800'
                              : mark.state === 'activo'
                              ? 'bg-red-950 text-red-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {mark.state}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>Carga $a_{mark.id}$: {mark.charge.toFixed(1)}</span>
                        <span>$k_g$: {mark.geodesicCurvature.toFixed(2)}</span>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Event Sliders */}
            <div className="space-y-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Magnitud del Estímulo Actual ($m_j$):</span>
                  <span className="font-mono text-amber-300">{nachtragMagnitude.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={nachtragMagnitude}
                  onChange={e => setNachtragMagnitude(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Ganancia Madurativa ($g(t) \ge 1$):</span>
                  <span className="font-mono text-amber-300">x{nachtragGain.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="0.1"
                  value={nachtragGain}
                  onChange={e => setNachtragGain(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  <em>Carta del 14.2.1897</em>: En la pubertad o adultez, el aparato ha crecido; una huella infantil secreta mayor descarga que la vivencia original.
                </p>
              </div>

              <button
                onClick={handleTrigger}
                className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-semibold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                Desencadenar Salto de Carga (Nachträglichkeit)
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Gauss-Bonnet & Aufwand */}
        {activeTab === 'gauss' && (
          <div className="space-y-4">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" /> Teorema de Gauss-Bonnet y Gasto (Aufwand)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  Entwurf pp. 408-409 [VT]
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                En el Entwurf, el Yo gasta energía propia (*Seitenbesetzung / Aufwand*) para sofocar la irrupción del recuerdo displacentero. En el modelo, este gasto se formaliza como una ley de conservación estricta:
              </p>
              <div className="mt-2.5 p-2 bg-slate-900 rounded font-mono text-[11px] text-indigo-200 border border-slate-800 text-center">
                ∫_Ω K dA + ∫_(∂Ω) k_g ds = 2π χ(Ω) = -2π(k + 1)
              </div>
            </div>

            {/* Live Conservation Meter */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                <span>Balance Energético de la Defensa (Conservado)</span>
                <span className="font-mono text-emerald-400">{gaussBonnet.totalConserved.toFixed(2)}</span>
              </div>

              {/* Stacked Bar visualization */}
              <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className="bg-indigo-600 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(5, (Math.abs(gaussBonnet.interiorCurvatureIntegral) / 40) * 100)
                    )}%`
                  }}
                  title="Integral interior de curvatura"
                />
                <div
                  className="bg-amber-500 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(5, (gaussBonnet.boundaryCurvatureIntegral / 40) * 100)
                    )}%`
                  }}
                  title="Curvatura geodésica del borde"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-900/50">
                  <span className="text-slate-400 block text-[10px]">Tensión Interior (∫_Ω K dA):</span>
                  <span className="text-indigo-300 font-bold text-sm">
                    {gaussBonnet.interiorCurvatureIntegral.toFixed(2)}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-900/50">
                  <span className="text-slate-400 block text-[10px]">Rigidez Borde (∫_∂Ω k_g ds):</span>
                  <span className="text-amber-300 font-bold text-sm">
                    {gaussBonnet.boundaryCurvatureIntegral.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-300 border border-slate-800 leading-relaxed">
                <strong className="text-indigo-300">Deducción Clínica del Modelo:</strong>
                <p className="mt-1">
                  Cuando una marca traumática se reactiva y k_g = h(a_i) sube en su periferia, la defensa no puede pagar localmente de forma aislada: <em>la integral de curvatura en todo Ω debe reorganizarse globalmente</em>. De ahí que la emergencia de un síntoma afecte el tono afectivo global del sujeto.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Perelman Surgery */}
        {activeTab === 'surgery' && (
          <div className="space-y-4">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5" /> Axioma 10: Cirugía y Cura Analítica
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Perelman (2003) [VW]
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                La cura analítica es análoga a la cirugía de Perelman: detecta un cuello estrangulado (longitud ℓ(γ_i) &lt; ℓ_min), corta la pieza traumática p_i ∈ V_T, sella con un casquete liso y deja que el flujo de Ricci suavice la cicatriz.
              </p>
              <div className="mt-2.5 p-2 bg-slate-900 rounded font-mono text-[11px] text-emerald-300 border border-slate-800 text-center">
                V → V \ (p_i),  ℓ(γ_i) &lt; ℓ_min,  2πε ≥ ℓ_min  (n indestructible)
              </div>
            </div>

            {/* List of Marks with Surgery option */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-slate-300 block">
                Marcas Psíquicas y Operabilidad Clínica:
              </span>
              {marks.map(mark => (
                <div
                  key={mark.id}
                  className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                    mark.state === 'quirurgico_removido'
                      ? 'bg-slate-950/40 border-slate-900 opacity-50'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-200 truncate">{mark.name}</span>
                      {mark.isPrimary && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-800">
                          Núcleo Primario (Inoperable)
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-3">
                      <span>Cuello $\ell$: {mark.neckLength.toFixed(2)}</span>
                      <span>Separable: {mark.separable ? 'Sí' : 'No'}</span>
                      <span>Estado: {mark.state}</span>
                    </div>
                  </div>

                  {mark.separable && mark.state !== 'quirurgico_removido' ? (
                    <button
                      onClick={() => handleSurgery(mark.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg shadow transition flex items-center gap-1 shrink-0"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      Extirpar
                    </button>
                  ) : mark.isPrimary ? (
                    <span className="text-[10px] font-mono text-pink-400 bg-pink-950/60 px-2 py-1 rounded border border-pink-900/60 shrink-0">
                      Topológicamente Protegido
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500 px-2 py-1 shrink-0">
                      Removido
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Cusp & Dirichlet-to-Neumann Port */}
        {activeTab === 'cusp' && (
          <div className="space-y-4">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" /> Axioma 9: Cúspide c como Puerto Acústico
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-800">
                  Carta 52; Hörkappe 1923 [VT]
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                El analista solo escucha la voz y(t) que sale por el orificio B = B_+ ∪ B_-. El mandato superyoico entra como dato de Dirichlet u(t) = K|_B. Reconstruir el interior es resolver el problema inverso de Calderón.
              </p>
              <div className="mt-2.5 p-2 bg-slate-900 rounded font-mono text-[11px] text-pink-300 border border-slate-800 text-center">
                u(t) = K|_B (Oído / Superyó),  y(t) = ∫_B (∂_ν K) ds (Voz / Síntoma)
              </div>
            </div>

            {/* Live Acoustic Signals Monitor */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">Emisión Vocal y(t) vs Síntoma y_sint(t)</span>
                <span className="font-mono text-pink-400 text-[10px]">Par Dirichlet-Neumann</span>
              </div>

              {/* Mini SVG Signal Scope */}
              <div className="w-full h-28 bg-slate-900/90 rounded-lg border border-slate-800 overflow-hidden relative p-1">
                <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <line x1="0" y1="40" x2="200" y2="40" stroke="#334155" strokeDasharray="2,2" strokeWidth="0.8" />

                  {/* Superego In u(t) */}
                  <polyline
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="1.5"
                    points={voiceSignals
                      .map((p, idx) => `${(idx / (voiceSignals.length - 1)) * 200},${40 - p.u * 3.5}`)
                      .join(' ')}
                  />

                  {/* Vocal Output y(t) */}
                  <polyline
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    points={voiceSignals
                      .map((p, idx) => `${(idx / (voiceSignals.length - 1)) * 200},${40 - p.y * 3.5}`)
                      .join(' ')}
                  />

                  {/* Symptom y_sint */}
                  <polyline
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.2"
                    strokeDasharray="3,2"
                    points={voiceSignals
                      .map((p, idx) => `${(idx / (voiceSignals.length - 1)) * 200},${40 - p.symptom * 5.0}`)
                      .join(' ')}
                  />
                </svg>

                <div className="absolute bottom-1 right-2 flex items-center gap-3 text-[9px] font-mono">
                  <span className="text-pink-400 flex items-center gap-1">
                    <span className="w-2 h-0.5 bg-pink-400 inline-block" /> u(t) Superyó
                  </span>
                  <span className="text-cyan-400 flex items-center gap-1">
                    <span className="w-2 h-0.5 bg-cyan-400 inline-block" /> y(t) Voz
                  </span>
                  <span className="text-amber-400 flex items-center gap-1">
                    <span className="w-2 h-0.5 bg-amber-400 inline-block" /> y_{'sint'} Síntoma
                  </span>
                </div>
              </div>

              {/* Superego Intervention */}
              <div className="pt-1 flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="0.5"
                  value={superegoTone}
                  onChange={e => setSuperegoTone(parseFloat(e.target.value))}
                  className="flex-1 accent-pink-500"
                />
                <button
                  onClick={() => onInjectSuperegoVoice(superegoTone)}
                  className="px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-medium rounded-lg shadow transition shrink-0"
                >
                  Inyectar Voz Superyó
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Drives & Bahnung Quantity Q */}
        {activeTab === 'drives' && (
          <div className="space-y-4">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" /> Axioma 4: Pulsión y Dinámica de Cantidad Q
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Entwurf (1895) [VT]
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                La pulsión es una circulación de cantidad Q que solo recorre aristas de facilitación (*Bahnung*) cuyo peso supera el umbral θ. Ecuación de difusión Laplaciana sobre el grafo:
              </p>
              <div className="mt-2.5 p-2 bg-slate-900 rounded font-mono text-[11px] text-cyan-300 border border-slate-800 text-center">
                dQ/dt = -L_θ Q + s,  L_θ = D_θ - W_θ
              </div>
            </div>

            {/* Drive Controls */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Umbral de Facilitación (θ):</span>
                  <span className="font-mono text-cyan-400">{driveThreshold.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  step="0.2"
                  value={driveThreshold}
                  onChange={e => onChangeDriveThreshold(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Aristas con w &lt; θ quedan bloqueadas para la pulsión activa.
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Velocidad del Flujo Pulsional ($dQ/dt$):</span>
                  <span className="font-mono text-cyan-400">{driveFlowRate.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3"
                  step="0.1"
                  value={driveFlowRate}
                  onChange={e => onChangeDriveRate(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] font-semibold text-slate-300 mb-2 block">
                  Pulsiones Parciales Concétricas alrededor de n (Axioma 11):
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-amber-950/30 border border-amber-800/40 text-amber-200">
                    <strong>Oral:</strong> Radio $\epsilon_1 = 0.55$, no corta la cúspide.
                  </div>
                  <div className="p-2 rounded bg-lime-950/30 border border-lime-800/40 text-lime-200">
                    <strong>Anal:</strong> Radio $\epsilon_2 = 0.75$, retención/expulsión.
                  </div>
                  <div className="p-2 rounded bg-cyan-950/30 border border-cyan-800/40 text-cyan-200">
                    <strong>Escópica:</strong> Radio $\epsilon_3 = 0.95$, posición espectador.
                  </div>
                  <div className="p-2 rounded bg-pink-950/30 border border-pink-800/40 text-pink-200">
                    <strong>Invocante (C_inv):</strong> ¡Pasa por el orificio de c!
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
