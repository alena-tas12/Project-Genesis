import { GenesisRuntime } from './src/engine/simulation/GenesisRuntime';
import { DynamicHumanSystem } from './src/engine/simulation/DynamicHumanSystem';
import type { MathematicalModel } from './src/engine/models/ModelLibrary';
import * as fs from 'fs';

function runSimulationTest() {
  const runtime = new GenesisRuntime();

  const model: MathematicalModel = {
    id: 'physio_cognitive_01',
    name: 'Fatigue-Attention Dynamics',
    domain: 'Interdisciplinary',
    calibrationStatus: 'PARTIAL',
    validationStatus: 'UNTESTED',
    assumptions: ['Attention decays proportionally to current fatigue.'],
    parameters: [
      { name: 'fatigue_growth_rate', description: 'Rate of fatigue accumulation', value: { type: 'KNOWN', value: 0.25, uncertainty: 0.0, sourceEdgeId: 'edge_01' } },
      { name: 'attention_decay_rate', description: 'Effect of fatigue on attention', value: { type: 'KNOWN', value: 0.1, uncertainty: 0.0, sourceEdgeId: 'mock' } },
      { name: 'attention_recovery', description: 'Baseline attention recovery', value: { type: 'KNOWN', value: 0.05, uncertainty: 0.0, sourceEdgeId: 'mock' } }
    ],
    equations: [
      {
        variable: 'fatigue',
        // d(fatigue)/dt = growth_rate * (1 - fatigue)
        computeDerivative: (state, params) => params['fatigue_growth_rate'] * (1 - state['fatigue'])
      },
      {
        variable: 'attention',
        // d(attention)/dt = recovery_rate * (1 - attention) - decay_rate * fatigue * attention
        computeDerivative: (state, params) => params['attention_recovery'] * (1 - state['attention']) - params['attention_decay_rate'] * state['fatigue'] * state['attention']
      }
    ]
  };

  const agent = DynamicHumanSystem.initializeHuman('subject_1', 'Test Subject', [model]);
  // Override initial conditions for test
  agent.state['fatigue'] = 0.0;
  agent.state['attention'] = 1.0;

  let env = runtime.initializeEnvironment([agent], [model], 0.5); // dt = 0.5 hours

  const log: any[] = [];
  log.push({ t: env.time, fatigue: env.agents[0].state['fatigue'], attention: env.agents[0].state['attention'] });

  for (let i = 0; i < 20; i++) {
    env = runtime.step(env);
    log.push({ t: env.time, fatigue: env.agents[0].state['fatigue'], attention: env.agents[0].state['attention'] });
  }

  const csvHeader = 'Time,Fatigue,Attention\n';
  const csvRows = log.map(r => `${r.t.toFixed(1)},${r.fatigue.toFixed(3)},${r.attention.toFixed(3)}`).join('\n');
  
  fs.writeFileSync('genesis_simulation_test.csv', csvHeader + csvRows);
  console.log('Simulation complete. Output written to genesis_simulation_test.csv');
  console.log(csvHeader + csvRows);
}

runSimulationTest();
