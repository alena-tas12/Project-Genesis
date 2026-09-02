import { GenesisCore } from '../core/GenesisCore';
import type { TimeSeriesPoint } from './ValidationEngine';
import { GenesisRuntime } from './GenesisRuntime';
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
    
    // In a real system, we would inject the intervention into the GenesisRuntime
    // For this prototype, we'll return a mocked intervened time series
    const timeSeries: TimeSeriesPoint[] = [];
    for (let t = 0; t < duration; t++) {
      let val = Math.sin(t * 0.1);
      if (t >= intervention.timeStart && t <= intervention.timeEnd) {
        val = intervention.fixedValue;
      }
      timeSeries.push({
        t,
        state: {
          [intervention.variable]: val,
          'downstream_effect': val * 0.5 // mock causal effect
        }
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
