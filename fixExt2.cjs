const fs = require('fs');

let ext = fs.readFileSync('src/engine/research/evidenceExtraction.ts', 'utf-8');
ext = ext.replace(/id: \`claim_\$\{claimCounter\}\`,/g, 
  "id: `claim_${claimCounter}`,\n      extractionConfidence: 0.9,\n      claimType: 'EMPIRICAL_RESULT',");
ext = ext.replace(/id: \`claim_\$\{claimCounter\}b\`,/g,
  "id: `claim_${claimCounter}b`,\n      extractionConfidence: 0.9,\n      claimType: 'EMPIRICAL_RESULT',");
fs.writeFileSync('src/engine/research/evidenceExtraction.ts', ext);
