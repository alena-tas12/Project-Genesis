const fs = require('fs');
let code = fs.readFileSync('src/engine/research/researchOntology.ts', 'utf-8');

// 1. Update StudyDesign
code = code.replace(/studyDesign: 'RCT' \| 'Longitudinal' \|.*?\| 'Other';/, 
  "studyDesign: 'Systematic_Review' | 'Meta_Analysis' | 'RCT' | 'Quasi_Experimental' | 'Longitudinal' | 'Natural_Experiment' | 'Observational' | 'Cross_Sectional' | 'Mechanistic' | 'Computational' | 'Theoretical' | 'Case_Study' | 'Qualitative' | 'Other';");

// 2. Add ScientificDocument and DocumentSection
const docCode = `
export interface DocumentSection {
  heading: string;
  content: string;
  sectionType: 'Title' | 'Abstract' | 'Introduction' | 'Methods' | 'Results' | 'Discussion' | 'Limitations' | 'Supplementary' | 'Unknown';
}

export interface ScientificDocument {
  id: string;
  studyId: string;
  source: string;
  sourceId: string;
  url?: string;
  retrievalTimestamp: string;
  accessStatus: 'FULL_TEXT_AVAILABLE' | 'ABSTRACT_ONLY' | 'METADATA_ONLY' | 'ACCESS_FAILED';
  sections: DocumentSection[];
  checksum?: string;
}
`;

// 3. Update Claim
code = code.replace(/export interface Claim \{[\s\S]*?\}\n\n/, `
export interface Claim {
  id: string;
  studyId: string;
  documentId?: string;           // Provenance back to document
  sourceSection?: string;        // Provenance back to section
  supportingTextSpan?: string;   // The exact quote
  
  // Extraction metadata
  extractionModel?: string;
  extractionVersion?: string;
  extractionTimestamp?: string;
  extractionConfidence: number;  // Confidence parser got it right
  claimType: 'AUTHOR_CLAIM' | 'EMPIRICAL_RESULT' | 'MODEL_INTERPRETATION' | 'GENESIS_INFERENCE';
  
  // Scientific content
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
  limitations?: string[];
  epistemicCategory?: EpistemicCategory;
  evidenceStatus?: EvidenceStatus; // Scientific confidence
  isNullFinding?: boolean;
}
\n`);

code += docCode;

fs.writeFileSync('src/engine/research/researchOntology.ts', code);
console.log('Updated ontology.');
