const fs = require('fs');

let c = fs.readFileSync('src/engine/research/researchOntology.ts', 'utf-8');
c = c.replace(/causalEvidenceType\?: 'Association' \| 'Causal' \| 'Mechanistic' \| 'Temporal_Precedence' \| 'Mediation' \| 'Moderation';/,
  "causalEvidenceType?: 'Association' | 'Causal' | 'Mechanistic' | 'Temporal_Precedence' | 'Mediation' | 'Moderation';\n  limitations?: string[];\n  epistemicCategory?: EpistemicCategory;");
fs.writeFileSync('src/engine/research/researchOntology.ts', c);

let synth = fs.readFileSync('src/engine/research/evidenceSynthesis.ts', 'utf-8');
synth = synth.replace(/lifecycleStage: lifecycle,/, 
  "lifecycleStage: lifecycle,\n    evidenceStatus: 'UNKNOWN',\n    epistemicCategory: 'EMPIRICAL',");
fs.writeFileSync('src/engine/research/evidenceSynthesis.ts', synth);
