import type { GraphEdge } from '../research/researchOntology';
import { GenesisCore } from '../core/GenesisCore';

export interface TimeSeriesPoint {
  t: number;
  state: Record<string, number>;
}

export interface ValidationTarget {
  variableX: string;
  variableY: string;
  expectedCorrelation: 'POSITIVE' | 'NEGATIVE' | 'NONE';
  minimumEffectSize?: number;
}

export class ValidationEngine {
  /**
   * Compares the simulation output against the empirical targets derived from the active graph.
   * If the simulation fails to reproduce the empirical phenomena, it publishes a VALIDATION_FAILED event.
   */
  public async validateSimulation(simId: string, modelId: string, timeSeries: TimeSeriesPoint[], targets: ValidationTarget[]) {
    const core = GenesisCore.getInstance();
    const failures: string[] = [];

    for (const target of targets) {
      // 1. Compute empirical correlation from the time series
      const correlation = this.computeCorrelation(timeSeries, target.variableX, target.variableY);
      
      // 2. Evaluate against expectations
      let passed = true;
      let actualDirection = 'NONE';
      if (correlation > 0.1) actualDirection = 'POSITIVE';
      if (correlation < -0.1) actualDirection = 'NEGATIVE';

      if (actualDirection !== target.expectedCorrelation) {
        passed = false;
        failures.push(`Expected ${target.expectedCorrelation} correlation between ${target.variableX} and ${target.variableY}, but observed ${actualDirection} (r=${correlation.toFixed(2)})`);
      } else if (target.minimumEffectSize !== undefined && Math.abs(correlation) < target.minimumEffectSize) {
        passed = false;
        failures.push(`Observed effect size (r=${correlation.toFixed(2)}) is weaker than empirical minimum threshold (${target.minimumEffectSize}) between ${target.variableX} and ${target.variableY}`);
      }

      if (!passed) {
        console.log(`[VALIDATION] ❌ Falsified Target: ${target.variableX} -> ${target.variableY}`);
      } else {
        console.log(`[VALIDATION] ✅ Validated Target: ${target.variableX} -> ${target.variableY}`);
      }
    }

    if (failures.length > 0) {
      console.log(`[VALIDATION] Model ${modelId} falsified by simulation ${simId}. Triggering event cascade...`);
      await core.eventBus.publish({
        id: `val_fail_${Date.now()}`,
        type: 'VALIDATION_FAILED',
        timestamp: new Date().toISOString(),
        payload: {
          simId,
          modelId,
          failures
        }
      });
      return false;
    }
    
    return true;
  }

  private computeCorrelation(data: TimeSeriesPoint[], xVar: string, yVar: string): number {
    const xValues = data.map(d => d.state[xVar] || 0);
    const yValues = data.map(d => d.state[yVar] || 0);

    const n = xValues.length;
    if (n === 0) return 0;

    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0);
    const sumY2 = yValues.reduce((sum, y) => sum + y * y, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    if (denominator === 0) return 0;
    return numerator / denominator;
  }

  /**
   * Translates the active knowledge graph into validation targets for the simulation.
   */
  public extractValidationTargets(activeGraph: GraphEdge[]): ValidationTarget[] {
    const targets: ValidationTarget[] = [];
    for (const edge of activeGraph) {
      if (edge.evidenceStatus === 'SUPPORTED' && edge.causalSupport === 'CAUSAL_SUPPORTED') {
        targets.push({
          variableX: edge.source.toLowerCase(),
          variableY: edge.target.toLowerCase(),
          expectedCorrelation: edge.relationshipType === 'INCREASES' ? 'POSITIVE' : 'NEGATIVE',
          minimumEffectSize: edge.effectSize ? edge.effectSize.value * 0.5 : 0.1 // lenient threshold
        });
      }
    }
    return targets;
  }
}
