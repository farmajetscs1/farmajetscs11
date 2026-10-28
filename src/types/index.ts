export type MarkState = 'latente' | 'activo' | 'quirurgico_removido';

export interface PsychicMark {
  id: string;
  name: string;
  freudConcept: string;
  u: number; // parametric u [0, 2pi)
  v: number; // parametric v [0, 2pi)
  charge: number; // a_i
  state: MarkState;
  isPrimary?: boolean; // n (núcleo indestructible)
  separable: boolean;
  neckLength: number; // l(gamma_i)
  geodesicCurvature: number; // k_g = h(a_i)
  clinicalDescription: string;
}

export interface BahnungEdge {
  id: string;
  sourceId: string;
  targetId: string;
  weight: number; // w(e) Bahnung facilitation
  activeFlow: number; // quantity Q flowing
}

export interface PartialDrive {
  id: 'oral' | 'anal' | 'escopica' | 'invocante';
  name: string;
  lacanName: string;
  radius: number; // epsilon_k
  color: string;
  speed: number;
  description: string;
  passesThroughCusp: boolean;
}

export interface GaussBonnetState {
  interiorCurvatureIntegral: number; // \int_\Omega K dA
  boundaryCurvatureIntegral: number; // \int_{\partial\Omega} k_g ds
  eulerCharacteristic: number; // \chi(\Omega)
  totalConserved: number; // 2 * pi * \chi(\Omega)
}

export interface VoiceSignalPoint {
  time: number;
  u: number; // lo oido / superyo K|_B
  y: number; // lo vocalizado \int_B \partial_\nu K ds
  symptom: number; // y_sint(t) = y(t) - y_0(t)
}

export interface AxiomDefinition {
  number: number;
  title: string;
  freudSource: string;
  statusBadge: 'VT' | 'VW' | 'P' | 'A' | 'M';
  statement: string;
  mathDefinition: string;
  clinicalSignificance: string;
  objects: string[];
}

export interface GlossaryEntry {
  german: string;
  spanish: string;
  source: string;
  explanation: string;
  mathAnalog: string;
}
