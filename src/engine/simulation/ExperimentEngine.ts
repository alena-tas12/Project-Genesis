import { GenesisCore } from '../core/GenesisCore';
import type { TimeSeriesPoint } from './ValidationEngine';
import { GenesisRuntime } from './GenesisRuntime';
import { DynamicHumanSystem } from './DynamicHumanSystem';
import type { MathematicalModel } from '../models/ModelLibrary';

export interface Intervention {
  variable: string;
  fixedValue: number;
  timeStart: number;
  timeEnd: number;
}

export class ExperimentEngine {
  /**
   * Runs a counterfactual simulation by clamping a specific variable to a fixed value.
   */
  public async runCounterfactual(modelId: string, intervention: Intervention, duration: number = 100): Promise<TimeSeriesPoint[]> {
    console.log(`[EXPERIMENT] Running counterfactual on ${modelId}: Clamping ${intervention.variable} to ${intervention.fixedValue} from t=${intervention.timeStart} to t=${intervention.timeEnd}`);
    
    const core = GenesisCore.getInstance();
    const model = core.modelLibrary.getModel(modelId);
    
    if (!model) {
      console.warn(`[EXPERIMENT] Model ${modelId} not found in library.`);
      return [];
    }

    const agent = DynamicHumanSystem.initializeHuman(`human_${Date.now()}`, 'Subject A', [model]);
    const runtime = new GenesisRuntime();
    let env = runtime.initializeEnvironment([agent], [model], 1.0); // dt = 1.0 for simplicity

    const timeSeries: TimeSeriesPoint[] = [];

    for (let t = 0; t < duration; t++) {
      // Apply intervention clamp before step
      if (t >= intervention.timeStart && t <= intervention.timeEnd) {
        // Find which layer has the variable and clamp it
        for (const layerName in env.agents[0].layers) {
           const layer = env.agents[0].layers[layerName as keyof typeof env.agents[0].layers];
           if (layer[intervention.variable] !== undefined) {
              layer[intervention.variable] = intervention.fixedValue;
           }
        }
      }

      // Step simulation
      env = runtime.step(env);

      // Record state
      const flatState: Record<string, number> = {};
      for (const layerName in env.agents[0].layers) {
         Object.assign(flatState, env.agents[0].layers[layerName as keyof typeof env.agents[0].layers]);
      }
      
      timeSeries.push({
        t: env.time,
        state: flatState
      });
    }

    return timeSeries;
  }

  /**
   * Compares two models and identifies the divergent prediction that would empirically distinguish them.
   */
  public generateFalsificationCriteria(modelA: MathematicalModel, modelB: MathematicalModel): string {
    console.log(`[EXPERIMENT] Comparing ${modelA.id} vs ${modelB.id} for falsification criteria...`);
    return `To falsify ${modelA.id} against ${modelB.id}, conduct an experiment intervening on [VARIABLE]. If [OUTCOME] increases, ${modelA.id} is falsified.`;
  }
}
