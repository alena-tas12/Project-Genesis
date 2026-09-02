/**
 * Project Genesis - Core Structural Ontology
 * 
 * Defines the fundamental entities, states, relationships, timescales, 
 * evidence types, and causal/associational links for the entire system.
 */

export type LayerType = 
  | 'Biological' 
  | 'Physiological' 
  | 'Cognitive' 
  | 'Psychological' 
  | 'Emotional' 
  | 'Behavioural' 
  | 'Social_Relational' 
  | 'Environmental' 
  | 'Educational' 
  | 'Institutional';

export type TimeScale = 'Milliseconds' | 'Seconds' | 'Minutes' | 'Hours' | 'Days' | 'Months' | 'Years' | 'Generational';

export type EvidenceType = 'Empirical_Validated' | 'Theoretical' | 'Personal_Observation' | 'Synthetic_Assumption';
export type ValidationState = 'Validated' | 'Falsified' | 'Pending' | 'Unsupported' | 'Timescale_Mismatch';

export interface Uncertainty {
  confidence: number; // 0.0 (pure guess) to 1.0 (physical law)
  variance?: number;
  notes: string;
}

export interface Evidence {
  source: string;
  type: EvidenceType;
  validationState: ValidationState;
}

export interface Variable {
  id: string;
  name: string;
  type: 'Continuous' | 'Categorical' | 'Binary' | 'NetworkState';
  currentValue: any;
}

export interface State {
  id: string;
  name: string;
  variables: Variable[];
}

export interface Entity {
  id: string;
  name: string;
  layer: LayerType;
  states: State[];
  description: string;
}

export interface Relationship {
  id: string;
  sourceId: string; // ID of an Entity or Mechanism
  targetId: string; // ID of an Entity or Mechanism
  type: 'Causal' | 'Associational' | 'Modulatory' | 'Feedback' | 'Emergent';
  direction: 'Unidirectional' | 'Bidirectional';
  strength: number; // -1.0 to 1.0
  timeScale: TimeScale;
  evidence: Evidence;
  uncertainty: Uncertainty;
}

export interface Mechanism {
  id: string;
  name: string;
  description: string;
  formulaType: 'Exact' | 'Heuristic' | 'Placeholder';
  evidence: Evidence;
}

export interface Hypothesis {
  id: string;
  statement: string;
  proposedMechanismId?: string;
  evidence: Evidence;
  uncertainty: Uncertainty;
}

export interface Event {
  id: string;
  timestamp: number;
  description: string;
  triggerId?: string;
}

export interface Observation {
  id: string;
  subjectId: string;
  content: string;
  timestamp: number;
}

export interface Outcome {
  id: string;
  metric: string;
  value: any;
  timeScale: TimeScale;
}

export interface Network {
  id: string;
  name: string;
  entities: Entity[];
  relationships: Relationship[];
  mechanisms: Mechanism[];
  hypotheses: Hypothesis[];
}

export interface Simulation {
  id: string;
  networkId: string;
  tickRate: TimeScale;
  duration: number;
  outcomes: Outcome[];
}
