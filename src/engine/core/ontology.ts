/**
 * Project Genesis — Core Ontology (Phase 2 + Research Engine aligned)
 * 
 * Re-exports key types from the research ontology for backward
 * compatibility with existing UI components.
 */

// Re-export the canonical types from the research engine
export type {
  EpistemicCategory,
  ValidationState,
  ResearchDomain,
  TemporalEvidenceEra,
  TheoryLifecycleStage,
  Study,
  Claim,
  ClaimSet,
  ContradictionReport,
  KnowledgeEdge,
  MissingVariable,
  Population,
} from '../research/researchOntology';

// ─────────────────────────────────────────────────────────────
// CORE GENESIS TYPES (used by UI and simulation layers)
// ─────────────────────────────────────────────────────────────

export type TimeScale = 'Milliseconds' | 'Seconds' | 'Minutes' | 'Hours' | 'Days' | 'Months' | 'Years' | 'Generational';

export interface Uncertainty {
  confidence: number;
  variance?: number;
  notes: string;
}

export interface Variable {
  id: string;
  name: string;
  type: 'Continuous' | 'Categorical' | 'Binary' | 'NetworkState';
  measurementModel?: string;
}

export interface Mechanism {
  id: string;
  name: string;
  description: string;
  formulaType: 'Exact' | 'Heuristic' | 'Placeholder';
  limitations: string[];
}

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'Causal' | 'Associational' | 'Modulatory' | 'Feedback_Dampening' | 'Feedback_Amplifying' | 'Emergent' | 'Conditional';
  direction: 'Unidirectional' | 'Bidirectional';
  strength: number;
  timeScale: TimeScale;
  conditions: string[];
  moderators: string[];
  mediators: string[];
  confounders: string[];
  mechanismId?: string;
  uncertainty: Uncertainty;
}

export interface Model {
  id: string;
  name: string;
  description: string;
  variables: Variable[];
  relationships: Relationship[];
  mechanisms: Mechanism[];
  limitations: string[];
}
