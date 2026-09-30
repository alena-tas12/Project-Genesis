import { GenesisCore } from './src/engine/core/GenesisCore';
import { ValidationEngine } from './src/engine/simulation/ValidationEngine';
import { GapDiscoveryEngine } from './src/engine/research/gapDiscovery';
import { ResearchMemory } from './src/engine/research/researchMemory';
import type { TimeSeriesPoint, ValidationTarget } from './src/engine/simulation/ValidationEngine';
import * as fs from 'fs';

async function runScientificFeedbackLoopTest() {
  console.log('=============================================');
  console.log('GENESIS MILESTONE 2: SCIENTIFIC FEEDBACK LOOP');
  console.log('=============================================');

  const core = GenesisCore.getInstance();
  const validator = new ValidationEngine();
  const memory = new ResearchMemory();
  const gapEngine = new GapDiscoveryEngine(memory);
  
  // 1. Setup Gap Discovery to listen for failures
  gapEngine.setupValidationListener();

  let gapQueued = false;
  core.eventBus.subscribe('RESEARCH_GAP_QUEUED', (event) => {
    console.log(`\n[EVENT BUS] Intercepted RESEARCH_GAP_QUEUED event:`);
    console.log(`Reason: ${event.payload.reason}`);
    console.log(`Generated Gap JSON: ${event.payload.generatedGap}`);
    gapQueued = true;
  });

  // 2. Mock a simulation output (deliberately flawed to trigger falsification)
  // The simulation expects Fatigue to INCREASE Attention, which is empirically wrong.
  const mockTimeSeries: TimeSeriesPoint[] = [];
  for (let t = 0; t < 10; t++) {
    mockTimeSeries.push({
      t,
      state: {
        fatigue: t * 0.1, // fatigue goes 0.0 -> 0.9
        attention: t * 0.1 // attention goes 0.0 -> 0.9 (positive correlation)
      }
    });
  }

  // 3. Define the empirical target (based on Knowledge Graph)
  // The scientific literature says Fatigue and Attention have a NEGATIVE correlation.
  const empiricalTargets: ValidationTarget[] = [
    {
      variableX: 'fatigue',
      variableY: 'attention',
      expectedCorrelation: 'NEGATIVE',
      minimumEffectSize: 0.2
    }
  ];

  console.log('\n[TEST] 1. Running Validation Engine on Simulation Output...');
  const isValid = await validator.validateSimulation('sim_run_999', 'physio_cognitive_flawed', mockTimeSeries, empiricalTargets);

  // Allow event bus to settle
  await new Promise(resolve => setTimeout(resolve, 500));

  if (!isValid && gapQueued) {
    console.log('\n[SUCCESS] The validation engine correctly falsified the simulation against empirical targets and autonomously spawned a research gap to fix the model.');
  } else {
    console.log('\n[FAILED] The feedback loop did not trigger correctly.');
  }
}

runScientificFeedbackLoopTest();
