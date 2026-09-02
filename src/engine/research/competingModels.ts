import type { ModelComparison } from './researchOntology';

/**
 * Project Genesis - Competing Models Registry
 * 
 * Tracks phenomenological explanations where multiple scientific
 * models compete to explain the same empirical data. Genesis uses this
 * to prevent early lock-in and to identify conditions under which
 * different models fit best.
 */
export class ModelComparisonEngine {
  private comparisons: Map<string, ModelComparison> = new Map();

  public registerComparison(comparison: ModelComparison) {
    this.comparisons.set(comparison.phenomenon, comparison);
  }

  public updateConfidence(phenomenon: string, evidenceId: string, supportsModelId: string) {
    const comp = this.comparisons.get(phenomenon);
    if (!comp) return;

    const model = comp.models.find(m => m.id === supportsModelId);
    if (model) {
      model.supportingEvidenceIds.push(evidenceId);
      // Recalculate confidence based on ratio of supporting vs contradicting
      // and methodological weight of evidence.
      this.recalculateConfidences(comp);
    }
  }

  private recalculateConfidences(comp: ModelComparison) {
    let totalSupport = 0;
    comp.models.forEach(m => totalSupport += m.supportingEvidenceIds.length);
    
    if (totalSupport === 0) return;

    comp.models.forEach(m => {
      m.confidenceScore = m.supportingEvidenceIds.length / totalSupport;
    });

    if (comp.models.some(m => m.confidenceScore > 0.8)) {
      comp.resolutionStatus = 'Consensus';
    } else {
      comp.resolutionStatus = 'Unresolved';
    }
  }
}
