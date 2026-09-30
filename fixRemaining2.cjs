const fs = require('fs');

let view = fs.readFileSync('src/components/visualizers/HumanSystemNetworkView.tsx', 'utf-8');
view = view.replace(/ValidationState/g, 'EvidenceStatus');
fs.writeFileSync('src/components/visualizers/HumanSystemNetworkView.tsx', view);

let ext = fs.readFileSync('src/engine/research/evidenceExtraction.ts', 'utf-8');
ext = ext.replace(/claim\.limitations\.push/g, 'if(claim.limitations) claim.limitations.push');
fs.writeFileSync('src/engine/research/evidenceExtraction.ts', ext);

let synth = fs.readFileSync('src/engine/research/evidenceSynthesis.ts', 'utf-8');
synth = synth.replace(/lifecycleStage: lifecycle/g, "evidenceStatus: 'UNKNOWN', epistemicCategory: 'EMPIRICAL', lifecycleStage: lifecycle");
fs.writeFileSync('src/engine/research/evidenceSynthesis.ts', synth);
