const fs = require('fs');

let v = fs.readFileSync('src/components/visualizers/HumanSystemNetworkView.tsx', 'utf-8');
v = v.replace(/ValidationState/g, 'EvidenceStatus');
v = v.replace(/"Hypothesized"/g, '"UNKNOWN"');
v = v.replace(/"Supported"/g, '"SUPPORTED"');
v = v.replace(/"Established"/g, '"SUPPORTED"');
v = v.replace(/"Mixed_Evidence"/g, '"MIXED"');
v = v.replace(/"Theoretical"/g, '"UNKNOWN"');
v = v.replace(/"Contested"/g, '"DISPUTED"');
fs.writeFileSync('src/components/visualizers/HumanSystemNetworkView.tsx', v);

let ext = fs.readFileSync('src/engine/research/evidenceExtraction.ts', 'utf-8');
ext = ext.replace(/claim\.limitations\.push\((.*?)\);/g, 'if (claim.limitations) { claim.limitations.push($1); }');
fs.writeFileSync('src/engine/research/evidenceExtraction.ts', ext);

let synth = fs.readFileSync('src/engine/research/evidenceSynthesis.ts', 'utf-8');
synth = synth.replace(/lifecycleStage: lifecycle/g, `evidenceStatus: 'UNKNOWN',
    epistemicCategory: 'EMPIRICAL',
    lifecycleStage: lifecycle`);
fs.writeFileSync('src/engine/research/evidenceSynthesis.ts', synth);
