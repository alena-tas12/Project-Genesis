import type { StateSpace, MathematicalModel } from '../models/ModelLibrary';

export type SystemLayer = 
  | 'Biological'
  | 'Physiological'
  | 'Neurological'
  | 'Cognitive'
  | 'Psychological'
  | 'Emotional'
  | 'Behavioural'
  | 'Social'
  | 'Environmental';

export interface LayerState {
  layer: SystemLayer;
  variables: StateSpace;
}

export interface HumanState {
  id: string;
  name: string;
  layers: Record<SystemLayer, StateSpace>;
  activeModels: string[];
}

export class DynamicHumanSystem {
  
  /**
   * Initializes a complex human with decoupled but interacting layers
   */
  public static initializeHuman(id: string, name: string, activeModels: MathematicalModel[]): HumanState {
    const layers: Record<SystemLayer, StateSpace> = {
      Biological: { circadian_rhythm: 1.0, homeostasis: 1.0 },
      Physiological: { fatigue: 0.0, arousal: 0.5 },
      Neurological: { dopamine_level: 0.5, cortisol_level: 0.1 },
      Cognitive: { attention: 1.0, memory_consolidation: 0.5, cognitive_load: 0.2 },
      Psychological: { self_efficacy: 0.8, motivation: 0.7 },
      Emotional: { stress: 0.1, valence: 0.5, arousal_affect: 0.5 },
      Behavioural: { physical_activity: 0.3, task_engagement: 0.8 },
      Social: { peer_support: 0.6, social_pressure: 0.2 },
      Environmental: { ambient_noise: 0.1, task_difficulty: 0.5 }
    };
    
    const modelIds: string[] = [];

    // Initialize custom state vectors from models
    for (const model of activeModels) {
      modelIds.push(model.id);
      for (const eq of model.equations) {
        // Attempt to place in a default layer if not mapped
        if (layers.Physiological[eq.variable] === undefined) {
          layers.Physiological[eq.variable] = 0.5; // fallback injection
        }
      }
    }

    return {
      id,
      name,
      layers,
      activeModels: modelIds
    };
  }
}
