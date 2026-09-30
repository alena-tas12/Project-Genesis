import type { GraphEdge } from '../research/researchOntology';
import type { MathematicalModel, ParameterValue } from '../models/ModelLibrary';

export class ParameterCalibrationEngine {
  
  /**
   * Attempts to calibrate a given model using the active evidence graph.
   * If an edge specifies an effect size, it bounds the parameter.
   * Otherwise, the parameter is marked UNKNOWN.
   */
  public calibrateModel(model: MathematicalModel, activeGraph: GraphEdge[]): MathematicalModel {
    const calibratedModel = { ...model };
    let fullyCalibrated = true;
    let anyCalibrated = false;

    calibratedModel.parameters = model.parameters.map(param => {
      // Find a matching edge in the active graph that supports this parameter
      // For instance, parameter "fatigue_recovery_rate" might map to an edge 
      // between "Sleep" and "Fatigue".
      // This is a naive matching strategy for the prototype.
      const supportingEdge = activeGraph.find(edge => 
        edge.source.toLowerCase().includes(param.name.split('_')[0]) ||
        edge.target.toLowerCase().includes(param.name.split('_')[0])
      );

      if (supportingEdge && supportingEdge.effectSize) {
        anyCalibrated = true;
        // In a real system, the effect size needs translation to parameter scales.
        // We use the effect size value as a proxy for the parameter value.
        const value = supportingEdge.effectSize.value;
        // Construct standard error / uncertainty if available, or assume moderate uncertainty
        const uncertainty = supportingEdge.effectSize.confidenceInterval ? 
          Math.abs(supportingEdge.effectSize.confidenceInterval.upper - supportingEdge.effectSize.confidenceInterval.lower) / 4 : 
          0.1;
        
        return {
          ...param,
          value: {
            type: 'KNOWN',
            value,
            uncertainty,
            sourceEdgeId: supportingEdge.id
          } as ParameterValue
        };
      }

      fullyCalibrated = false;
      return {
        ...param,
        value: { type: 'UNKNOWN' } as ParameterValue
      };
    });

    if (fullyCalibrated) {
      calibratedModel.calibrationStatus = 'CALIBRATED';
    } else if (anyCalibrated) {
      calibratedModel.calibrationStatus = 'PARTIAL';
    } else {
      calibratedModel.calibrationStatus = 'UNINITIALIZED';
    }

    return calibratedModel;
  }

  /**
   * Utility to sample a concrete parameter set for simulation, taking uncertainty into account.
   * Uses a Gaussian approximation for uncertainty.
   */
  public sampleParameterSet(model: MathematicalModel): Record<string, number> {
    const params: Record<string, number> = {};
    for (const p of model.parameters) {
      if (p.value.type === 'KNOWN') {
        // Sample from Normal(mu, sigma)
        params[p.name] = this.sampleNormal(p.value.value, p.value.uncertainty);
      } else {
        // Fallback default or explode
        params[p.name] = 0; 
      }
    }
    return params;
  }

  private sampleNormal(mu: number, sigma: number): number {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * sigma + mu;
  }
}
