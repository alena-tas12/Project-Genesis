const fs = require('fs');

let v = fs.readFileSync('src/components/visualizers/HumanSystemNetworkView.tsx', 'utf-8');
v = v.replace(/validationState: 'Hypothesized'/g, "validationState: 'UNKNOWN'");
v = v.replace(/validationState: 'Supported'/g, "validationState: 'SUPPORTED'");
v = v.replace(/validationState: 'Established'/g, "validationState: 'SUPPORTED'");
v = v.replace(/epistemicCategory: 'PERSONAL_OBSERVATION'/g, "epistemicCategory: 'PERSONAL_OBSERVATION'");
fs.writeFileSync('src/components/visualizers/HumanSystemNetworkView.tsx', v);

let ext = fs.readFileSync('src/engine/research/evidenceExtraction.ts', 'utf-8');
ext = ext.replace(/claim\.limitations\.push\((.*?)\);/g, 'if (claim.limitations) { claim.limitations.push($1); }');
ext = ext.replace(/claim\.limitations\.push/g, 'if (claim.limitations) claim.limitations.push');
fs.writeFileSync('src/engine/research/evidenceExtraction.ts', ext);

let synth = fs.readFileSync('src/engine/research/evidenceSynthesis.ts', 'utf-8');
synth = synth.replace(/lifecycleStage: lifecycle/g, "evidenceStatus: 'UNKNOWN', epistemicCategory: 'EMPIRICAL', lifecycleStage: lifecycle");
fs.writeFileSync('src/engine/research/evidenceSynthesis.ts', synth);
