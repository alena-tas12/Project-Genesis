const fs = require('fs');
let code = fs.readFileSync('src/engine/research/gapPrioritization.ts', 'utf-8');
code = code.replace(/import \{ ResearchGap \} from '\.\/researchOntology';/, "import type { ResearchGap } from './researchOntology';");
// remove unused graphMetrics
code = code.replace(/gap: ResearchGap, graphMetrics: any/, 'gap: ResearchGap');
fs.writeFileSync('src/engine/research/gapPrioritization.ts', code);

let liveCode = fs.readFileSync('src/engine/research/liveAcquisition.ts', 'utf-8');
liveCode = liveCode.replace(/import \{ ResearchQuery, Study \}/, "import type { ResearchQuery, Study }");
liveCode = liveCode.replace(/source: 'PubMed'/g, "source: 'PubMed' as const");
liveCode = liveCode.replace(/source: 'OpenAlex'/g, "source: 'OpenAlex' as const");
fs.writeFileSync('src/engine/research/liveAcquisition.ts', liveCode);
