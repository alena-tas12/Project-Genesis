const fs = require('fs');

// Fix evidenceExtraction.ts
let code = fs.readFileSync('src/engine/research/evidenceExtraction.ts', 'utf-8');
code = code.replace(/id: \`claim_\$\{claimCounter\}\`,/, 
  "id: `claim_${claimCounter}`,\n      extractionConfidence: 0.9,\n      claimType: 'EMPIRICAL_RESULT',");
code = code.replace(/id: \`claim_\$\{claimCounter\}b\`,/,
  "id: `claim_${claimCounter}b`,\n      extractionConfidence: 0.9,\n      claimType: 'EMPIRICAL_RESULT',");
fs.writeFileSync('src/engine/research/evidenceExtraction.ts', code);

// Fix liveAcquisition.ts
let liveCode = fs.readFileSync('src/engine/research/liveAcquisition.ts', 'utf-8');
liveCode = liveCode.replace(/keywords: \[\]\n\s*\};/, "keywords: [],\n          source: 'PubMed'\n        };");
liveCode = liveCode.replace(/keywords: \(item\.concepts \|\| \[\]\)\.map\(\(c: any\) => c\.display_name\)\n\s*\};/, "keywords: (item.concepts || []).map((c: any) => c.display_name),\n      source: 'OpenAlex'\n    };");
// Also remove Provenance import since it is unused
liveCode = liveCode.replace(/, Provenance /, ' ');
fs.writeFileSync('src/engine/research/liveAcquisition.ts', liveCode);
