import type { Study } from './researchOntology';

export interface QualityAssessment {
  score: number; // 0 to 1
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  flags: string[];
}

export class ScientificQualityEngine {
  /**
   * Evaluates the methodological rigor of a study.
   */
  public evaluateStudy(study: Study): QualityAssessment {
    let score = 0.5;
    const flags: string[] = [];

    // 1. Methodology Check
    if (study.studyDesign) {
      const design = study.studyDesign.toLowerCase();
      if (design.includes('meta-analysis') || design.includes('systematic review')) {
        score += 0.3;
      } else if (design.includes('randomized controlled trial') || design.includes('rct')) {
        score += 0.2;
      } else if (design.includes('observational') || design.includes('cross-sectional')) {
        score -= 0.1;
        flags.push('Observational design limits causal inference');
      }
    }

    // 2. Sample Size Check
    if (study.sampleSize) {
      if (study.sampleSize > 1000) score += 0.1;
      else if (study.sampleSize < 50) {
        score -= 0.15;
        flags.push('Small sample size (< 50) reduces statistical power');
      }
    }

    // 3. Claims versus Design Check (Overclaim detection)
    if (study.studyDesign?.toLowerCase().includes('observational') && study.keyFinding?.toLowerCase().includes('causes')) {
      score -= 0.2;
      flags.push('Causal overclaim: Observational study uses causal language');
    }

    // Bound score
    score = Math.max(0, Math.min(1, score));

    let confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
    if (score >= 0.7) confidenceLevel = 'HIGH';
    if (score <= 0.4) confidenceLevel = 'LOW';

    return { score, confidenceLevel, flags };
  }
}
