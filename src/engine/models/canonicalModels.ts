// @ts-nocheck
import { MathematicalModel } from './ModelLibrary';

export const CANONICAL_MODELS: MathematicalModel[] = [
  {
    id: 'mod_sleep_attention',
    name: 'Circadian-Attention Interaction',
    domain: 'Bio-Cognitive',
    equations: [
      {
        variable: 'fatigue',
        computeDerivative: (state, params) => {
          // Fatigue increases over time if not sleeping
          return 0.05 - (state['circadian_rhythm'] || 0) * 0.02;
        }
      },
      {
        variable: 'attention',
        computeDerivative: (state, params) => {
          // Attention decreases as fatigue increases
          const f = state['fatigue'] || 0;
          return -0.1 * f;
        }
      }
    ],
    assumptions: ['Linear decay of attention with fatigue'],
    parameters: [],
    calibrationStatus: 'UNINITIALIZED',
    validationStatus: 'UNTESTED'
  },
  {
    id: 'mod_stress_load',
    name: 'Allostatic Cognitive Load',
    domain: 'Psychological-Cognitive',
    equations: [
      {
        variable: 'cognitive_load',
        computeDerivative: (state, params) => {
          return (state['stress'] || 0) * 0.05 + (state['task_difficulty'] || 0) * 0.05 - (state['attention'] || 1) * 0.02;
        }
      },
      {
        variable: 'stress',
        computeDerivative: (state, params) => {
          // Stress reduces slowly if load is low, increases if high
          const load = state['cognitive_load'] || 0;
          return (load > 0.5) ? 0.01 : -0.01;
        }
      }
    ],
    assumptions: ['Stress and cognitive load form a feedback loop'],
    parameters: [],
    calibrationStatus: 'UNINITIALIZED',
    validationStatus: 'UNTESTED'
  }
];
