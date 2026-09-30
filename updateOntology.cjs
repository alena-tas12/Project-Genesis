const fs = require('fs');

let code = fs.readFileSync('src/engine/research/researchOntology.ts', 'utf-8');

// Replace EpistemicCategory and ValidationState with user's specific Enums
code = code.replace(/export type EpistemicCategory =[\s\S]*?;\n\n/, '');

code = code.replace(/export type ValidationState =[\s\S]*?;/, `
export type EvidenceStatus =
  | 'SUPPORTED'
  | 'MIXED'
  | 'CONTRADICTED'
  | 'PRELIMINARY'
  | 'INSUFFICIENT'
  | 'DISPUTED'
  | 'UNKNOWN';

export type EpistemicCategory =
  | 'EMPIRICAL'
  | 'THEORETICAL'
  | 'COMPUTATIONAL'
  | 'PHENOMENOLOGICAL'
  | 'PHILOSOPHICAL'
  | 'PERSONAL_OBSERVATION'
  | 'HYPOTHESIS';
`);

// Fix Study interface and Measurement interface
code = code.replace(/export interface Study \{[\s\S]*?\}\n\n/, `
export interface Provenance {
  source: string;
  sourceId: string;
  query?: string;
  retrievalTimestamp: string;
  extractionVersion: string;
  ontologyVersion: string;
  graphVersion: string;
}

export interface MeasurementInfo {
  construct: string;
  operationalDefinition: string;
  instrument: string;
  measurementError?: string;
  reliability?: string;
  validity?: string;
  population?: Population;
  limitations?: string[];
}

export interface Study {
  id: string;
  title: string;
  authors: string;
  publicationYear: number;
  doi?: string;
  pmid?: string;
  openAlexId?: string;
  sourceDatabase?: string;
  abstract?: string;
  methodology: string;
  studyDesign: 'RCT' | 'Longitudinal' | 'Cross_Sectional' | 'Meta_Analysis' | 'Systematic_Review' | 'Case_Study' | 'Quasi_Experimental' | 'Observational' | 'Computational' | 'Qualitative' | 'Mechanistic' | 'Natural_Experiment' | 'Other';
  population: Population;
  variablesStudied: string[];
  measurements: MeasurementInfo[];
  effectDescription: string;
  effectSize?: number;
  confidenceInterval?: [number, number];
  pValue?: number;
  statisticalInformation?: string;
  moderators: string[];
  mediators: string[];
  limitations: string[];
  replicationStatus: 'Unreplicated' | 'Replicated' | 'Partial' | 'Failed' | 'N/A';
  evidenceStatus?: EvidenceStatus;
  epistemicCategory?: EpistemicCategory;
  evidenceQuality: 'Low' | 'Moderate' | 'High' | 'Very_High' | 'N/A';
  riskOfBias?: string;
  domains: ResearchDomain[];
  subDomains?: string[];
  era?: TemporalEvidenceEra;
  keywords?: string[];
  provenance?: Provenance;
}
\n`);

// Replace Claim and KnowledgeEdge
code = code.replace(/export interface Claim \{[\s\S]*?\}\n\n/, `
export interface Claim {
  id: string;
  studyId: string;
  statement: string;
  sourceVariable: string;
  targetVariable: string;
  direction: ClaimDirection;
  effectSize?: number;
  effectSizeUnit?: string;
  population: Population;
  context: string;
  measurementMethod?: string;
  timescale: string;
  moderators: string[];
  mediators: string[];
  confounders: string[];
  causalEvidenceType?: 'Association' | 'Causal' | 'Mechanistic' | 'Temporal_Precedence' | 'Mediation' | 'Moderation';
}
\n`);

code = code.replace(/export interface KnowledgeEdge \{[\s\S]*?\}\n\n/, `
export interface KnowledgeEdge {
  id: string;
  sourceVariable: string;
  targetVariable: string;
  relationshipType: RelationshipType;
  direction: 'Unidirectional' | 'Bidirectional';
  synthesizedStrength: number;       
  confidence: number;                
  supportingClaimSetId: string;
  contradictionReportIds: string[];
  conditions: string[];              
  moderators: string[];
  mediators: string[];
  timescale: string;
  domains: ResearchDomain[];
  evidenceQuality: 'Low' | 'Moderate' | 'High' | 'Very_High';
  evidenceStatus: EvidenceStatus;
  epistemicCategory: EpistemicCategory;
  studyCount: number;
  earliestEvidence: number;          
  latestEvidence: number;            
  lifecycleStage: TheoryLifecycleStage;
}
\n`);

fs.writeFileSync('src/engine/research/researchOntology.ts', code);
console.log('Successfully updated researchOntology.ts');
