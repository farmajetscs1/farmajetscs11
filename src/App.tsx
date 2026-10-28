import React, { useState, useEffect, useRef } from 'react';
import {
  INITIAL_MARKS,
  INITIAL_EDGES,
  PARTIAL_DRIVES
} from './data/thesisData';
import { PsychicMark, BahnungEdge, GaussBonnetState, VoiceSignalPoint } from './types';
import { HornTorus3D } from './components/HornTorus3D';
import { RicciFlowDashboard } from './components/RicciFlowDashboard';
import { AxiomsDictionary } from './components/AxiomsDictionary';
import { BeatenChildCase } from './components/BeatenChildCase';
import { PoincarePerelman3D } from './components/PoincarePerelman3D';
import { ThesisReader } from './components/ThesisReader';
import { VoiceSuperegoCircuit } from './components/VoiceSuperegoCircuit';
import {
  Brain,
  Activity,
  Layers,
  BookOpen,
  Orbit,
  Sparkles,
  Volume2,
  Sliders,
  Scissors,
  HelpCircle,
  Eye,
  Maximize2
} from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'lab' | 'voice_circuit' | 'axioms' | 'case' | 'manifold3d' | 'thesis'>('lab');

  // Simulation State
  const [marks, setMarks] = useState<PsychicMark[]>(INITIAL_MARKS);
  const [edges, setEdges] = useState<BahnungEdge[]>(INITIAL_EDGES);
  const [selectedMarkId, setSelectedMarkId] = useState<string | null>('p1');
  const [isRicciFlowing, setIsRicciFlowing] = useState<boolean>(true);
  const [driveFlowRate, setDriveFlowRate] = useState<number>(1.0);
  const [driveThreshold, setDriveThreshold] = useState<number>(3.0); // theta

  // 3D Visualizer Options
  const [viewMode, setViewMode] = useState<'curvature' | 'solid' | 'wireframe'>('curvature');
  const [showDrives, setShowDrives] = useState<boolean>(true);
  const [showEdges, setShowEdges] = useState<boolean>(true);
  const [showCuspCutaway, setShowCuspCutaway] = useState<boolean>(false);
  const [rRatio, setRRatio] = useState<number>(0.98); // Horn torus approximation r -> R

  // Cusp Acoustic Voice Signals Array
  const [voiceSignals, setVoiceSignals] = useState<VoiceSignalPoint[]>(() => {
    const pts: VoiceSignalPoint[] = [];
    for (let t = 0; t < 40; t++) {
      const uVal = Math.sin(t * 0.2) * 1.5;
      const yVal = Math.cos(t * 0.25) * 2.0 + Math.sin(t * 0.1) * 0.8;
      pts.push({
        time: t,
        u: uVal,
        y: yVal,
        symptom: Math.max(0, Math.sin(t * 0.35) * 1.8)
      });
    }
    return pts;
  });

  // Calculate Gauss-Bonnet State Live
  const activeMarks = marks.filter(m => m.state !== 'quirurgico_removido');
  const kMarks = activeMarks.length;
  // S less c has chi = 0 (annulus). With k marks and n excised, chi = -(k + 1)
  const eulerChi = -(kMarks + 1);
  const totalConserved = 2 * Math.PI * eulerChi;

  // Boundary curvature sum \int_{\partial\Omega} k_g ds
  const boundaryIntegral = activeMarks.reduce((acc, m) => acc + m.geodesicCurvature * 2 * Math.PI * 0.35, 0);
  // Interior curvature \int_\Omega K dA = 2*pi*chi - boundaryIntegral
  const interiorIntegral = totalConserved - boundaryIntegral;

  const gaussBonnet: GaussBonnetState = {
    interiorCurvatureIntegral: interiorIntegral,
    boundaryCurvatureIntegral: boundaryIntegral,
    eulerCharacteristic: eulerChi,
    totalConserved: totalConserved
  };

  // Simulation Loop for Acoustic Signals and Ricci Relaxation
  useEffect(() => {
    const interval = setInterval(() => {
      setVoiceSignals(prev => {
        const lastT = prev[prev.length - 1]?.time || 0;
        const newT = lastT + 1;

        // Drive flow & active mark charges contribute to voice y(t)
        const activeChargeSum = marks
          .filter(m => m.state === 'activo')
          .reduce((acc, m) => acc + m.charge, 0);

        const newU = Math.sin(newT * 0.25) * 1.8 + Math.cos(newT * 0.08) * 0.5;
        const newY =
          Math.cos(newT * 0.3) * (1.8 + activeChargeSum * 0.08) +
          Math.sin(newT * 0.15) * 1.2;
        const newSymptom = Math.max(0, (newY - 1.2) * 0.7);

        return [...prev.slice(1), { time: newT, u: newU, y: newY, symptom: newSymptom }];
      });

      // If Ricci flow is active, gently diffuse excess tension across marks
      if (isRicciFlowing) {
        setMarks(prevMarks =>
          prevMarks.map(m => {
            if (m.isPrimary) return m; // n is immutable
            if (m.state === 'activo' && m.charge > 4.0) {
              // gradual relaxation
              const newCharge = Math.max(4.0, m.charge - 0.015);
              return {
                ...m,
                charge: newCharge,
                geodesicCurvature: 1.0 + (newCharge / 20) * 1.2
              };
            }
            return m;
          })
        );
      }
    }, 150);

    return () => clearInterval(interval);
  }, [isRicciFlowing, marks]);

  // Handler: Nachträglichkeit (Deferred Action Trigger)
  const handleTriggerNachtraglichkeit = (markId: string, magnitude: number, gain: number) => {
    setMarks(prev =>
      prev.map(m => {
        if (m.id === markId) {
          const delta = gain * magnitude * 0.8;
          const newCharge = m.charge + delta;
          const newCurvature = 1.0 + (newCharge / 20) * 1.5;
          return {
            ...m,
            charge: newCharge,
            state: 'activo',
            geodesicCurvature: newCurvature
          };
        }
        return m;
      })
    );

    // Increase flow on edges connected to this mark
    setEdges(prevEdges =>
      prevEdges.map(e => {
        if (e.sourceId === markId || e.targetId === markId) {
          return { ...e, activeFlow: e.activeFlow + 1.8 };
        }
        return e;
      })
    );
  };

  // Handler: Surgery (Cura Analítica de Perelman)
  const handlePerformSurgery = (markId: string) => {
    const target = marks.find(m => m.id === markId);
    if (!target || target.isPrimary || !target.separable) return;

    setMarks(prev =>
      prev.map(m => {
        if (m.id === markId) {
          return {
            ...m,
            state: 'quirurgico_removido',
            charge: 0,
            geodesicCurvature: 0
          };
        }
        return m;
      })
    );

    // Drop edges connected to the excised mark
    setEdges(prevEdges =>
      prevEdges.map(e => {
        if (e.sourceId === markId || e.targetId === markId) {
          return { ...e, activeFlow: 0, weight: 0.2 };
        }
        return e;
      })
    );
  };

  // Handler: Reset Manifold
  const handleResetManifold = () => {
    setMarks(INITIAL_MARKS);
    setEdges(INITIAL_EDGES);
  };

  // Handler: Inject Superego Voice
  const handleInjectSuperegoVoice = (magnitude: number) => {
    setVoiceSignals(prev =>
      prev.map(p => ({
        ...p,
        u: p.u + (Math.random() - 0.5) * magnitude * 2.0
      }))
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Main Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50 px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-600 text-white shadow-lg shadow-indigo-500/20">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight text-white">
                Inconsciente Dinámico
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                Flujo de Ricci & Freud
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Modelo analógico formal a partir de Poincaré, Perelman y el Entwurf de 1895
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('lab')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'lab'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Laboratorio 3D & Dinámica
          </button>
          <button
            onClick={() => setActiveTab('voice_circuit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'voice_circuit'
                ? 'bg-pink-600 text-white shadow'
                : 'text-pink-300 hover:text-white hover:bg-pink-950/40'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            La Voz & Superyó (Pcc/Cc)
          </button>
          <button
            onClick={() => setActiveTab('axioms')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'axioms'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            10 Axiomas & Glosario
          </button>
          <button
            onClick={() => setActiveTab('case')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'case'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            «Pegan a un niño»
          </button>
          <button
            onClick={() => setActiveTab('manifold3d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'manifold3d'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            Variedad S² × S¹
          </button>
          <button
            onClick={() => setActiveTab('thesis')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'thesis'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Tesis Completa
          </button>
        </nav>
      </header>

      {/* Main View Area */}
      <main className="flex-1 p-4 max-w-[1600px] w-full mx-auto flex flex-col overflow-hidden">
        {activeTab === 'lab' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-100px)] min-h-[640px]">
            {/* Left Column: Interactive 3D Horn Torus View (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-2 h-full">
              {/* 3D Visualizer Controls Bar */}
              <div className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">Render:</span>
                  <button
                    onClick={() => setViewMode('curvature')}
                    className={`px-2 py-0.5 rounded transition ${
                      viewMode === 'curvature' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Curvatura K
                  </button>
                  <button
                    onClick={() => setViewMode('solid')}
                    className={`px-2 py-0.5 rounded transition ${
                      viewMode === 'solid' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Sólido
                  </button>
                  <button
                    onClick={() => setViewMode('wireframe')}
                    className={`px-2 py-0.5 rounded transition ${
                      viewMode === 'wireframe' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Malla
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-300">
                    <input
                      type="checkbox"
                      checked={showDrives}
                      onChange={e => setShowDrives(e.target.checked)}
                      className="rounded accent-pink-500"
                    />
                    Pulsiones
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-300">
                    <input
                      type="checkbox"
                      checked={showEdges}
                      onChange={e => setShowEdges(e.target.checked)}
                      className="rounded accent-indigo-500"
                    />
                    Bahnung $\Gamma$
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-300">
                    <input
                      type="checkbox"
                      checked={showCuspCutaway}
                      onChange={e => setShowCuspCutaway(e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                    Corte Orificio $c$
                  </label>
                </div>
              </div>

              {/* 3D WebGL Canvas Component */}
              <div className="flex-1 w-full min-h-[400px]">
                <HornTorus3D
                  marks={marks}
                  edges={edges}
                  partialDrives={PARTIAL_DRIVES}
                  selectedMarkId={selectedMarkId}
                  onSelectMark={setSelectedMarkId}
                  onSurgeryMark={handlePerformSurgery}
                  isRicciFlowing={isRicciFlowing}
                  driveFlowRate={driveFlowRate}
                  viewMode={viewMode}
                  showDrives={showDrives}
                  showEdges={showEdges}
                  showCuspCutaway={showCuspCutaway}
                  rRatio={rRatio}
                />
              </div>
            </div>

            {/* Right Column: Metapsychology & Differential Dashboard (5 cols) */}
            <div className="lg:col-span-5 h-full">
              <RicciFlowDashboard
                marks={marks}
                edges={edges}
                selectedMarkId={selectedMarkId}
                onSelectMark={setSelectedMarkId}
                onTriggerNachtraglichkeit={handleTriggerNachtraglichkeit}
                onPerformSurgery={handlePerformSurgery}
                onResetManifold={handleResetManifold}
                isRicciFlowing={isRicciFlowing}
                onToggleRicciFlow={() => setIsRicciFlowing(!isRicciFlowing)}
                gaussBonnet={gaussBonnet}
                driveFlowRate={driveFlowRate}
                onChangeDriveRate={setDriveFlowRate}
                driveThreshold={driveThreshold}
                onChangeDriveThreshold={setDriveThreshold}
                voiceSignals={voiceSignals}
                onInjectSuperegoVoice={handleInjectSuperegoVoice}
              />
            </div>
          </div>
        )}

        {activeTab === 'voice_circuit' && (
          <div className="flex-1 h-[calc(100vh-100px)] min-h-[640px]">
            <VoiceSuperegoCircuit
              onInjectSuperegoVoice={handleInjectSuperegoVoice}
              isRicciFlowing={isRicciFlowing}
              onToggleRicciFlow={() => setIsRicciFlowing(!isRicciFlowing)}
            />
          </div>
        )}

        {activeTab === 'axioms' && (
          <div className="flex-1 h-[calc(100vh-100px)] min-h-[640px]">
            <AxiomsDictionary />
          </div>
        )}

        {activeTab === 'case' && (
          <div className="flex-1 h-[calc(100vh-100px)] min-h-[640px]">
            <BeatenChildCase />
          </div>
        )}

        {activeTab === 'manifold3d' && (
          <div className="flex-1 h-[calc(100vh-100px)] min-h-[640px]">
            <PoincarePerelman3D />
          </div>
        )}

        {activeTab === 'thesis' && (
          <div className="flex-1 h-[calc(100vh-100px)] min-h-[640px]">
            <ThesisReader />
          </div>
        )}
      </main>
    </div>
  );
}
