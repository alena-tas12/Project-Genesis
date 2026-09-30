import { GenesisCore } from './src/engine/core/GenesisCore';
import { ParameterCalibrationEngine } from './src/engine/simulation/parameterCalibration';
import type { MathematicalModel } from './src/engine/models/ModelLibrary';

async function runCoreIntegrationTest() {
  console.log('=============================================');
  console.log('GENESIS CORE INTEGRATION & CASCADE TEST');
  console.log('=============================================');

  const core = GenesisCore.getInstance();

  // 1. Setup Mock System
  const sourceId = 'doi:10.1234/test.paper';
  const edgeId = 'edge_01';
  const modelId = 'physio_cognitive_01';
  const paramId = 'param_fatigue_growth';
  const simId = 'sim_run_104';

  console.log('\n[TEST] 1. Initializing System and Dependency Graph...');
  
  // Registering nodes
  core.dependencyGraph.registerNode(sourceId, 'SOURCE');
  core.dependencyGraph.registerNode(edgeId, 'EDGE');
  core.dependencyGraph.registerNode(modelId, 'MODEL');
  core.dependencyGraph.registerNode(paramId, 'PARAMETER');
  core.dependencyGraph.registerNode(simId, 'SIMULATION');

  // Wire Dependencies: SOURCE <- EDGE <- MODEL <- PARAMETER <- SIMULATION
  core.dependencyGraph.addDependency(edgeId, sourceId);
  core.dependencyGraph.addDependency(modelId, edgeId);
  core.dependencyGraph.addDependency(paramId, modelId);
  core.dependencyGraph.addDependency(simId, paramId);

  console.log(`- Simulation Node Status: ${core.dependencyGraph.getNodeStatus(simId)}`);
  console.log(`- Parameter Node Status: ${core.dependencyGraph.getNodeStatus(paramId)}`);

  // 2. Setup Event Listener for Gaps
  let gapQueued = false;
  core.eventBus.subscribe('RESEARCH_GAP_QUEUED', (event) => {
    console.log(`\n[EVENT BUS] Received RESEARCH_GAP_QUEUED:`);
    console.log(`Reason: ${event.payload.reason}`);
    console.log(`Affected Nodes: ${event.payload.affectedNodes.join(', ')}`);
    gapQueued = true;
  });

  // 3. Trigger Retraction Cascade
  console.log(`\n[TEST] 2. Injecting Source Retraction for ${sourceId}...`);
  await core.eventBus.publish({
    id: `retract_${Date.now()}`,
    type: 'SOURCE_RETRACTED',
    timestamp: new Date().toISOString(),
    payload: { sourceId }
  });

  // 4. Assertions
  console.log('\n[TEST] 3. Verifying Cascade Integrity...');
  const newSimStatus = core.dependencyGraph.getNodeStatus(simId);
  const newParamStatus = core.dependencyGraph.getNodeStatus(paramId);
  
  console.log(`- Simulation Node Status is now: ${newSimStatus}`);
  console.log(`- Parameter Node Status is now: ${newParamStatus}`);

  if (newSimStatus === 'STALE' && newParamStatus === 'UNKNOWN' && gapQueued) {
    console.log('\n[SUCCESS] The cascade properly traced from the retracted source to the downstream simulation and autonomously spawned a research gap to recalibrate the model.');
  } else {
    console.log('\n[FAILED] Cascade did not propagate correctly.');
  }
}

runCoreIntegrationTest();
