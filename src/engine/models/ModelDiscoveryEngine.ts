import { GenesisCore } from '../core/GenesisCore';
import type { MathematicalModel } from './ModelLibrary';

export class ModelDiscoveryEngine {
  /**
   * Compares multiple models against the active knowledge graph and selects the best fit.
   */
  public async discoverBestModel(competingModels: MathematicalModel[]): Promise<MathematicalModel | null> {
    const core = GenesisCore.getInstance();
    console.log(`[MODEL DISCOVERY] Evaluating ${competingModels.length} competing models against the Knowledge Graph...`);
    
    let bestModel: MathematicalModel | null = null;
    let highestScore = -1;

    for (const model of competingModels) {
      // Calculate real empirical support score based on the knowledge graph
      let supportedEdges = 0;
      let totalEdgesNeeded = model.equations.length;

      for (const eq of model.equations) {
         const hasSupport = core.activeKnowledgeGraph.some(edge => 
            edge.targetVariable.toLowerCase() === eq.variable.toLowerCase() && 
            edge.evidenceStatus === 'SUPPORTED'
         );
         if (hasSupport) supportedEdges++;
      }

      const supportScore = totalEdgesNeeded > 0 ? (supportedEdges / totalEdgesNeeded) : 0;
      console.log(`- Model ${model.id} empirical support score: ${supportScore.toFixed(2)} (${supportedEdges}/${totalEdgesNeeded} equations supported)`);
      
      if (supportScore > highestScore) {
        highestScore = supportScore;
        bestModel = model;
      }
    }

    if (highestScore < 0.3) {
      console.log(`[MODEL DISCOVERY] ⚠️ No existing model is sufficiently supported (Max score: ${highestScore.toFixed(2)}).`);
      return null;
    }

    console.log(`[MODEL DISCOVERY] ✅ Selected ${bestModel?.id} as the dominant model (Score: ${highestScore.toFixed(2)}).`);
    return bestModel;
  }
}
