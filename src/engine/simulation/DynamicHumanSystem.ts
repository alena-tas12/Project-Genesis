import type { StateSpace, MathematicalModel } from '../models/ModelLibrary';

export type SystemLayer = 
  | 'Biological'
  | 'Physiological'
  | 'Neurological'
  | 'Cognitive'
  | 'Psychological'
  | 'Emotional'
  | 'Behavioural'
  | 'Social';

export interface HumanState {
  id: string;
  name: string;
  state: StateSpace;
  // Models active for this human
  activeModels: string[];
}

export class DynamicHumanSystem {
  
  /**
   * Initializes a human with default state constraints
   */
  public static initializeHuman(id: string, name: string, activeModels: MathematicalModel[]): HumanState {
    const initialState: StateSpace = {};
    const modelIds: string[] = [];

    // Initialize state vectors for all equations in active models
    for (const model of activeModels) {
      modelIds.push(model.id);
      for (const eq of model.equations) {
        if (initialState[eq.variable] === undefined) {
          // Default initial state, could be parameterized
          initialState[eq.variable] = 0.5; // Normalized start
        }
      }
    }

    // Default system variables if not explicitly modeled
    if (initialState['stress'] === undefined) initialState['stress'] = 0.1;
    if (initialState['fatigue'] === undefined) initialState['fatigue'] = 0.0;
    if (initialState['attention'] === undefined) initialState['attention'] = 1.0;

    return {
      id,
      name,
      state: initialState,
      activeModels: modelIds
    };
  }

}
