import React, { useState } from 'react';
import { BEATEN_CHILD_PHASES } from '../data/thesisData';
import { HelpCircle, ArrowRight, Eye, ShieldAlert, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

export const BeatenChildCase: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<number>(2);

  const currentPhase = BEATEN_CHILD_PHASES.find(p => p.phase === selectedPhase) || BEATEN_CHILD_PHASES[1];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-full shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
            Capítulo 6 · Aplicación Clínica Paradigmática
          </span>
          <h3 className="text-sm font-bold text-slate-100">
            «Pegan a un niño» (Ein Kind wird geschlagen, 1919) y el Problema Inverso
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
          Freud GW XII / SE XVII [VW]
        </span>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {/* Core Theoretical Correction Alert */}
        <div className="p-3.5 bg-amber-950/30 border border-amber-800/60 rounded-xl text-xs text-amber-200/90 leading-relaxed">
          <strong className="text-amber-300 font-semibold block mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Corrección Epistemológica Central de la Tesis:
          </strong>
          En borradores preliminares se asignaba erróneamente la Fase 1 a una marca traumática recuperable ($V_T$). 
          El texto freudiano es inequívoco: <em>tanto la Fase 1 como la Fase 2 son CONSTRUCCIONES del analista</em>; ninguna de las dos es un recuerdo consciente recuperable. Solo la Fase 3 es la forma consciente manifestada en la voz $y(t)$.
        </div>

        {/* Phase Selectors */}
        <div className="grid grid-cols-3 gap-2">
          {BEATEN_CHILD_PHASES.map(phase => (
            <button
              key={phase.phase}
              onClick={() => setSelectedPhase(phase.phase)}
              className={`p-3 rounded-xl border text-left transition ${
                phase.phase === selectedPhase
                  ? 'bg-indigo-600/20 border-indigo-500 text-slate-100 shadow-lg'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] font-mono text-indigo-400 block font-bold">Fase {phase.phase}</span>
              <span className="text-xs font-semibold block truncate mt-0.5">{phase.title.split(':')[1] || phase.title}</span>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">{phase.character}</span>
            </button>
          ))}
        </div>

        {/* Detailed Phase Card */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">
                Estatuto Estructural de la Fase {currentPhase.phase}
              </span>
              <h4 className="text-sm font-bold text-slate-100">{currentPhase.title}</h4>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
              {currentPhase.subtitle}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block">Agente / Sujeto:</span>
              <span className="font-medium text-slate-200">{currentPhase.agent}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block">Objeto / Paciente:</span>
              <span className="font-medium text-slate-200">{currentPhase.patient}</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Estatuto Clínico en la Memoria del Paciente:
            </span>
            <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              {currentPhase.consciousState}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Traducción Geométrica en el Modelo Ricci-Horn:
            </span>
            <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-900/60 font-mono text-xs text-indigo-200">
              {currentPhase.modelAnalog}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Desarrollo Metapsicológico Freudiano:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentPhase.clinicalDetail}
            </p>
          </div>
        </div>

        {/* The Inverse Problem of Calderón & Psychoanalytic Construction */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
            <Cpu className="w-4 h-4 text-pink-400" />
            La Construcción Analítica como Problema Inverso de Calderón
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            En <em>Construcciones en el análisis</em> (1937), Freud explica que el analista no descubre recuerdos guardados en un cajón, sino que <strong>construye</strong> el edificio interno a partir de indicios y de lo que el paciente vocaliza.
          </p>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="text-pink-400 font-bold">1. Datos de Frontera:</span>
              <span>El analista solo tiene acceso a $u(t)$ y $y(t)$ en el puerto acústico $B$.</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="text-cyan-400 font-bold">2. Operador Dirichlet-Neumann:</span>
              <span>Λ_g: u ↦ y. Reconstruir el tensor métrico g y los pesos w es el problema inverso.</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="text-amber-400 font-bold">3. Contingencia (Axioma M6):</span>
              <span>La no-unicidad del problema inverso explica formalmente por qué no todo análisis alcanza una construcción certera.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
