const fs = require('fs');

let code = fs.readFileSync('src/engine/research/researchOntology.ts', 'utf-8');

// We need to add causalSupport and reviewStatus to Claim.
// Currently Claim has causalEvidenceType, let's replace or augment it.

code = code.replace(
  /causalEvidenceType\?: 'Association' \| 'Causal' \| 'Mechanistic' \| 'Temporal_Precedence' \| 'Mediation' \| 'Moderation';/,
  `causalSupport?: 'CAUSAL_SUPPORTED' | 'CAUSAL_PLAUSIBLE' | 'ASSOCIATIONAL' | 'CAUSAL_INSUFFICIENT' | 'CAUSAL_OVERCLAIM' | 'UNKNOWN' | 'REVIEW_REQUIRED';
  reviewStatus?: 'REVIEW_REQUIRED' | 'APPROVED';`
);

fs.writeFileSync('src/engine/research/researchOntology.ts', code);
console.log('Ontology updated with causalSupport and reviewStatus.');
