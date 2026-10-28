import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Shield,
  Activity,
  ArrowRight,
  Sparkles,
  Zap,
  Ear,
  MessageSquare,
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';

interface VoiceSuperegoCircuitProps {
  onInjectSuperegoVoice: (magnitude: number) => void;
  isRicciFlowing: boolean;
  onToggleRicciFlow: () => void;
}

export const VoiceSuperegoCircuit: React.FC<VoiceSuperegoCircuitProps> = ({
  onInjectSuperegoVoice,
  isRicciFlowing,
  onToggleRicciFlow
}) => {
  // Metapsychological State Sliders
  const [superegoIntensity, setSuperegoIntensity] = useState<number>(5.0); // u(t) = K|_B
  const [contrainvestiduraStrength, setContrainvestiduraStrength] = useState<number>(6.5); // Gegenbesetzung absorption in Omega
  const [invocativeDriveCharge, setInvocativeDriveCharge] = useState<number>(7.2); // C_inv drive flow
  const [wordBindingPcc, setWordBindingPcc] = useState<number>(5.5); // Wortvorstellung binding b_j (Sach + Wort)

  // Audio synthesis state
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);

  // Computed Outputs
  // When contrainvestidura is high, it absorbs tension: symptom is low, voice is sublimated
  // When contrainvestidura fails relative to drive + superego, symptom explodes
  const drivePressure = invocativeDriveCharge * 0.6 + superegoIntensity * 0.8;
  const defenseResistance = contrainvestiduraStrength * 0.9 + wordBindingPcc * 0.4;
  const rawSymptom = Math.max(0, drivePressure - defenseResistance);
  const symptomNormalized = Math.min(10, rawSymptom * 1.5);
  const consciousUtterance = Math.max(
    1,
    Math.min(10, (wordBindingPcc * 0.7 + (defenseResistance - rawSymptom) * 0.3))
  );

  // Dynamic clinical state diagnosis
  let clinicalState = 'Pensamiento Sublimado / Neutralizado';
  let clinicalColor = 'text-emerald-400';
  let clinicalBg = 'bg-emerald-950/40 border-emerald-800/60';
  let clinicalDescription =
    'La contrainvestidura (Gegenbesetzung) en Ω absorbe y redistribuye la tensión del mandato superyoico y de la pulsión invocante. La salida vocal y(t) se articula en representaciones de palabra ordenadas (Wortvorstellungen).';

  if (symptomNormalized > 6.0) {
    clinicalState = 'Irrupción Sintomática / Reproche Punitivo';
    clinicalColor = 'text-red-400';
    clinicalBg = 'bg-red-950/40 border-red-800/60';
    clinicalDescription =
      'Falla o rigidez de la contrainvestidura: la voz del Superyó atraviesa sin absorción suficiente. Emerge como sentimiento inconsciente de culpa abrumador, imperativo categórico feroz o síntoma vocal (tartamudez, afonía conversiva o alucinación acústica).';
  } else if (symptomNormalized > 2.5) {
    clinicalState = 'Tensión Neurótica / Conflicto Preconsciente';
    clinicalColor = 'text-amber-400';
    clinicalBg = 'bg-amber-950/40 border-amber-800/60';
    clinicalDescription =
      'La defensa gasta elevada curvatura (Aufwand de Gauss-Bonnet). Hay lapsus linguae, inhibición tímida de la voz o necesidad de castigo, pero el lazo palabra-cosa aún contiene la descarga.';
  }

  // Web Audio Synthesis of the Invocative Sound / Voice Resonance
  const toggleAudio = () => {
    if (isAudioActive) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsAudioActive(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // Dual harmonic oscillator for the Superyo timbre
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        // Base pitch influenced by superego & drive
        osc.frequency.setValueAtTime(110 + superegoIntensity * 12, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        // Filter frequency represents contrainvestidura absorption
        filter.frequency.setValueAtTime(300 + (10 - contrainvestiduraStrength) * 120, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.08, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        oscRef.current = osc;
        filterRef.current = filter;
        gainRef.current = gain;
        setIsAudioActive(true);
      } catch (err) {
        console.error('AudioContext not allowed or supported', err);
      }
    }
  };

  // Update audio parameters on slider changes
  useEffect(() => {
    if (isAudioActive && audioCtxRef.current && oscRef.current && filterRef.current) {
      const now = audioCtxRef.current.currentTime;
      oscRef.current.frequency.setTargetAtTime(110 + superegoIntensity * 14 + invocativeDriveCharge * 6, now, 0.1);
      filterRef.current.frequency.setTargetAtTime(250 + (10 - contrainvestiduraStrength) * 160 + symptomNormalized * 80, now, 0.1);
    }
  }, [superegoIntensity, invocativeDriveCharge, contrainvestiduraStrength, symptomNormalized, isAudioActive]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const handlePulseSuperego = () => {
    onInjectSuperegoVoice(superegoIntensity);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-full shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-pink-950 text-pink-400 border border-pink-800/60 shadow-lg">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100">
                La Voz: Superyó, Pulsión Invocante y Salida al Pcc/Cc
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-950 text-pink-300 border border-pink-800">
                Axiomas 9, 11, 13 & 14
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              El tránsito del mandato acústico a través de la contrainvestidura (Gegenbesetzung) hacia la conciencia
            </p>
          </div>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={toggleAudio}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-2 shadow border ${
            isAudioActive
              ? 'bg-pink-600 hover:bg-pink-500 text-white border-pink-500'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
          }`}
        >
          {isAudioActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>{isAudioActive ? 'Audio Activo (Resonancia)' : 'Activar Audio Síntesis'}</span>
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-5">
        {/* Visual Metapsychological Pipeline Flow */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
            Arquitectura del Circuito de la Voz (De la Cúspide al Pcc/Cc):
          </span>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
            {/* Step 1: Superyó Input u(t) */}
            <div className="p-3 rounded-xl bg-pink-950/30 border border-pink-800/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-pink-400 font-bold mb-1">
                  <Ear className="w-3.5 h-3.5" />
                  <span>1. Oído / Superyó</span>
                </div>
                <span className="text-[10px] font-mono text-pink-300/80 block">Dato Dirichlet: u(t) = K|_B</span>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                  Mandato punitivo o protector heredado del <em>Nebenmensch</em> (El yo y el ello, 1923: <em>Hörkappe</em>).
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-pink-900/40 text-[10px] font-mono text-pink-400">
                Entrada en B_ (Cuerno inferior)
              </div>
            </div>

            {/* Step 2: Invocative Drive C_inv */}
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-purple-400 font-bold mb-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span>2. Pulsión Invocante</span>
                </div>
                <span className="text-[10px] font-mono text-purple-300/80 block">Circuito C_inv</span>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                  Gira en torno al núcleo n, pero hace una excursión que <em>penetra y atraviesa el orificio c</em> (Axioma 13).
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-purple-900/40 text-[10px] font-mono text-purple-400">
                Pulsión audible en acto
              </div>
            </div>

            {/* Step 3: Contrainvestidura (Ricci Flow in Omega) */}
            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-800/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-indigo-400 font-bold mb-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>3. Contrainvestidura</span>
                </div>
                <span className="text-[10px] font-mono text-indigo-300/80 block">∂g/∂t = -R g en Ω</span>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                  Gegenbesetzung del Yo. Gasto (Aufwand de Gauss-Bonnet) que absorbe la crudeza del mandato.
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-indigo-900/40 text-[10px] font-mono text-indigo-400">
                Filtro amortiguador
              </div>
            </div>

            {/* Step 4: Word Presentation (Wortvorstellung) */}
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>4. Ligazón Pcc</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-300/80 block">Pares S-I: (s_j, φ_j)</span>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                  Wortvorstellung + Sachvorstellung (Carta 52). La imagen sonora se anuda al sentido en el Preconsciente.
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-cyan-900/40 text-[10px] font-mono text-cyan-400">
                Traducción a lenguaje
              </div>
            </div>

            {/* Step 5: Observable Vocal Utterance & Symptom */}
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>5. Voz Observable</span>
                </div>
                <span className="text-[10px] font-mono text-amber-300/80 block">Flujo Neumann: y(t)</span>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                  Lo que sale por B_+: emisión vocal y residuo no absorbido: y_sint(t) = y(t) - y_0(t).
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-amber-900/40 text-[10px] font-mono text-amber-400">
                Salida a la conciencia
              </div>
            </div>
          </div>
        </div>

        {/* Live Clinical Status & Metapsychological Conflict Monitor */}
        <div className={`p-4 rounded-xl border ${clinicalBg} transition-all duration-300`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold font-mono uppercase tracking-wider ${clinicalColor}`}>
                Estado Clínico Dinámico: {clinicalState}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-slate-400">
                Síntoma y_sint: <strong className={clinicalColor}>{symptomNormalized.toFixed(1)}/10</strong>
              </span>
              <span className="text-slate-400">
                Voz Consciente: <strong className="text-slate-200">{consciousUtterance.toFixed(1)}/10</strong>
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{clinicalDescription}</p>
        </div>

        {/* Interactive Sliders: Balancing the Drive, Defense and Words */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Controls: Forces of Drive & Superego */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-pink-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Ear className="w-3.5 h-3.5" /> Fuerzas de Excitación (Superyó & Pulsión)
            </h4>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Intensidad del Mandato Superyoico u(t):</span>
                <span className="font-mono text-pink-400">{superegoIntensity.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={superegoIntensity}
                onChange={e => setSuperegoIntensity(parseFloat(e.target.value))}
                className="w-full accent-pink-500"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">
                Severidad moral/arquetípica que entra como condición de Dirichlet en el puerto c.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Carga de la Pulsión Invocante (C_inv):</span>
                <span className="font-mono text-purple-400">{invocativeDriveCharge.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={invocativeDriveCharge}
                onChange={e => setInvocativeDriveCharge(parseFloat(e.target.value))}
                className="w-full accent-purple-500"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">
                Excitación pulsional que busca salir por el orificio de la palabra.
              </p>
            </div>

            <button
              onClick={handlePulseSuperego}
              className="w-full py-2 bg-pink-600 hover:bg-pink-500 text-white font-medium text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Inyectar Golpe de Voz del Superyó
            </button>
          </div>

          {/* Controls: Defense & Preconscious Binding */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Mecanismos de Defensa & Preconsciente
            </h4>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Fuerza de Contrainvestidura (Gegenbesetzung):</span>
                <span className="font-mono text-indigo-400">{contrainvestiduraStrength.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={contrainvestiduraStrength}
                onChange={e => setContrainvestiduraStrength(parseFloat(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">
                Capacidad del flujo de Ricci en Ω para amortiguar y redistribuir la curvatura.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Ligazón con Wortvorstellung (Pares S-I):</span>
                <span className="font-mono text-cyan-400">{wordBindingPcc.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={wordBindingPcc}
                onChange={e => setWordBindingPcc(parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">
                Fuerza del enlace entre la imagen acústica y la representación de cosa en el Pcc.
              </p>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-300">Relajación de Ricci Activa:</span>
              <button
                onClick={onToggleRicciFlow}
                className={`px-3 py-1 rounded-lg font-mono text-[11px] font-semibold transition ${
                  isRicciFlowing
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {isRicciFlowing ? '∂g/∂t Activo' : 'Detenido'}
              </button>
            </div>
          </div>
        </div>

        {/* Theoretical Anchors and Source Citations */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
          <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold block">
            Fundamentos Metapsicológicos de la Tesis (Fuentes Verificadas [VT]):
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <strong className="text-slate-100 block mb-0.5">El yo y el ello (1923)</strong>
              El Superyó se erige como heredero de los mandatos parentales acústicos. Freud describe la <em>Hörkappe</em> (casquete acústico) como el polo privilegiado del Yo.
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <strong className="text-slate-100 block mb-0.5">Carta 52 & Afasia (1891)</strong>
              La conciencia y la memoria se excluyen. Lo observable en el Preconsciente pasa necesariamente por la palabra hablada/oída (<em>Klangbild</em> e imagen sonora).
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <strong className="text-slate-100 block mb-0.5">Entwurf & Lo Inconsciente (1915)</strong>
              La contrainvestidura (<em>Seitenbesetzung / Gegenbesetzung</em>) no es una barrera estática: es un proceso activo que paga un costo energético (<em>Aufwand</em>) para frenar la irrupción pulsional.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
