const fs = require('fs');
const glob = require('glob');
const path = require('path');

const dir = 'src/engine/research';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Corpus.ts'));

for (const file of files) {
  const filepath = path.join(dir, file);
  let code = fs.readFileSync(filepath, 'utf-8');

  // Replace validationState: '...' with evidenceStatus: '...'
  code = code.replace(/validationState:\s*'Theoretical'/g, "epistemicCategory: 'THEORETICAL'");
  code = code.replace(/validationState:\s*'Hypothesized'/g, "epistemicCategory: 'HYPOTHESIS'");
  code = code.replace(/validationState:\s*'Contested'/g, "evidenceStatus: 'DISPUTED'");
  code = code.replace(/validationState:\s*'Mixed_Evidence'/g, "evidenceStatus: 'MIXED'");
  code = code.replace(/validationState:\s*'Supported'/g, "evidenceStatus: 'SUPPORTED'");
  code = code.replace(/validationState:\s*'Established'/g, "evidenceStatus: 'SUPPORTED'"); // Close enough for now
  
  fs.writeFileSync(filepath, code);
  console.log('Fixed', file);
}
