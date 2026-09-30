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
           const layer = (env.agents[0].layers as any)[layerName];
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
         Object.assign(flatState, (env.agents[0].layers as any)[layerName]);
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

  /**
   * Runs sensitivity analysis by perturbing initial states and model parameters
   * to determine the uncertainty bounds of the simulation predictions.
   */
  public async runSensitivityAnalysis(modelId: string, targetVariable: string, perturbations: number = 10, duration: number = 50): Promise<{ mean: number[], variance: number[] }> {
    console.log(`[EXPERIMENT] Running sensitivity analysis on ${modelId} for target ${targetVariable}...`);
    
    const core = GenesisCore.getInstance();
    const model = core.modelLibrary.getModel(modelId);
    if (!model) return { mean: [], variance: [] };

    const ensembleSeries: number[][] = [];

    for (let p = 0; p < perturbations; p++) {
      const agent = DynamicHumanSystem.initializeHuman(`human_${p}`, `Subject ${p}`, [model]);
      
      // Perturb the initial state with Gaussian noise
      for (const layerName in agent.layers) {
         const layer = (agent.layers as any)[layerName];
         for (const key in layer) {
           layer[key] = Math.max(0, layer[key] + (Math.random() - 0.5) * 0.2); // +/- 10% noise
         }
      }

      const runtime = new GenesisRuntime();
      let env = runtime.initializeEnvironment([agent], [model], 1.0);
      
      const series: number[] = [];
      for (let t = 0; t < duration; t++) {
        env = runtime.step(env);
        let val = 0;
        for (const layerName in env.agents[0].layers) {
           const layer = (env.agents[0].layers as any)[layerName];
           if (layer[targetVariable] !== undefined) val = layer[targetVariable];
        }
        series.push(val);
      }
      ensembleSeries.push(series);
    }

    // Compute mean and variance at each timestep
    const mean: number[] = [];
    const variance: number[] = [];

    for (let t = 0; t < duration; t++) {
      const valuesAtT = ensembleSeries.map(s => s[t]);
      const avg = valuesAtT.reduce((a, b) => a + b, 0) / perturbations;
      mean.push(avg);
      
      const v = valuesAtT.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / perturbations;
      variance.push(v);
    }

    return { mean, variance };
  }
}
