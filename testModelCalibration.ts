import { ParameterCalibrationEngine } from './src/engine/simulation/parameterCalibration';
import type { MathematicalModel } from './src/engine/models/ModelLibrary';
import type { GraphEdge } from './src/engine/research/researchOntology';

function runCalibrationTest() {
  const engine = new ParameterCalibrationEngine();

  const model: MathematicalModel = {
    id: 'physio_cognitive_01',
    name: 'Fatigue-Attention Dynamics',
    domain: 'Interdisciplinary',
    calibrationStatus: 'UNINITIALIZED',
    validationStatus: 'UNTESTED',
    assumptions: ['Attention decays proportionally to current fatigue.'],
    parameters: [
      { name: 'fatigue_growth_rate', description: 'Rate of fatigue accumulation', value: { type: 'UNKNOWN' } },
      { name: 'attention_decay_rate', description: 'Effect of fatigue on attention', value: { type: 'UNKNOWN' } }
    ],
    equations: []
  };

  const activeGraph: GraphEdge[] = [
    {
      id: 'edge_01',
      source: 'TaskDuration',
      target: 'Fatigue',
      claimId: 'claim_01',
      relationshipType: 'INCREASES',
      evidenceStatus: 'SUPPORTED',
      weight: 1,
      causalSupport: 'CAUSAL_SUPPORTED',
      reviewStatus: 'VALIDATED',
      effectSize: {
        value: 0.25, // Extracted growth rate
        confidenceInterval: { lower: 0.20, upper: 0.30 }
      },
      provenance: []
    }
  ];

  console.log('--- Initial Model ---');
  console.log(JSON.stringify(model.parameters, null, 2));

  console.log('\n--- Calibrating against Knowledge Graph ---');
  const calibrated = engine.calibrateModel(model, activeGraph);
  console.log(JSON.stringify(calibrated.parameters, null, 2));

  console.log('\nCalibration Status:', calibrated.calibrationStatus);
}

runCalibrationTest();
