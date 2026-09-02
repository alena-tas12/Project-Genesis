/**
 * Project Genesis — Autonomous Research Loop
 * 
 * This engine powers Wave 2 and beyond. It analyzes the existing
 * Knowledge Graph to discover what is missing, contradictory, or 
 * weakly supported, and autonomously generates new ResearchQueries.
 */

import type { GenesisKnowledgeGraph } from './knowledgeGraph';
import type { 
  ResearchQuery, 
  ResearchGap
} from './researchOntology';

export class AutonomousResearchLoop {
  private kg: GenesisKnowledgeGraph;

  constructor(kg: GenesisKnowledgeGraph) {
    this.kg = kg;
  }

  /**
   * Evaluates the graph and generates a prioritized queue of research queries.
   */
  public generateResearchQueue(): ResearchQuery[] {
    const gaps = this.identifyResearchGaps();
    const queries = this.convertGapsToQueries(gaps);
    return this.prioritizeQueries(queries);
  }

  /**
   * Scans the knowledge graph for various types of research gaps.
   */
  public identifyResearchGaps(): ResearchGap[] {
    const gaps: ResearchGap[] = [];
    let gapCounter = 0;

    // 1. Missing Variables (Discovered from literature but absent in core models)
    const missingVars = this.kg.getMissingVariables();
    for (const mv of missingVars) {
      gapCounter++;
      gaps.push({
        id: `gap_${gapCounter}`,
        description: `Variable '${mv.variableName}' frequently mentioned in literature but lacks formalized edges.`,
        domain: mv.domains[0] || 'Unknown',
        relatedVariables: [mv.variableName],
        gapType: 'Mechanism_Unknown',
        priority: mv.priority,
        discoveredBy: 'Gap_Detection_Algorithm',
        suggestedSearchTerms: [mv.variableName, ...mv.suggestedRelationships]
      });
    }

    // 2. Contradictions (Conflicting evidence requiring resolution)
    const contradictions = this.kg.getContradictions();
    for (const c of contradictions) {
      const claimSet = this.kg.claimSets.get(c.claimSetId);
      if (!claimSet) continue;

      gapCounter++;
      gaps.push({
        id: `gap_${gapCounter}`,
        description: `Contradiction in ${claimSet.sourceVariable} → ${claimSet.targetVariable}. Dimensions to investigate: ${c.investigatedDimensions.join(', ')}`,
        domain: 'Complex_Systems',
        relatedVariables: [claimSet.sourceVariable, claimSet.targetVariable],
        gapType: 'Contradictory_Evidence',
        priority: 'Critical',
        discoveredBy: 'Gap_Detection_Algorithm',
        suggestedSearchTerms: [
          `"${claimSet.sourceVariable}"`,
          `"${claimSet.targetVariable}"`,
          ...(c.investigatedDimensions.filter(d => d !== 'Unknown'))
        ]
      });
    }

    // 3. Weak Evidence / Replication Gaps (Edges with Low confidence)
    for (const edge of this.kg.edges.values()) {
      if (edge.confidence < 0.4 || edge.studyCount < 2) {
        gapCounter++;
        gaps.push({
          id: `gap_${gapCounter}`,
          description: `Weak evidence for ${edge.sourceVariable} → ${edge.targetVariable} (Confidence: ${edge.confidence}, Studies: ${edge.studyCount})`,
          domain: edge.domains[0] || 'Unknown',
          relatedVariables: [edge.sourceVariable, edge.targetVariable],
          gapType: 'Insufficient_Replication',
          priority: 'Medium',
          discoveredBy: 'Gap_Detection_Algorithm',
          suggestedSearchTerms: [`"${edge.sourceVariable}" AND "${edge.targetVariable}"`]
        });
      }

      // 4. Missing Moderators (Check if relationship is context-dependent)
      if (edge.moderators.length === 0 && edge.studyCount > 3) {
        gapCounter++;
        gaps.push({
          id: `gap_${gapCounter}`,
          description: `Relationship ${edge.sourceVariable} → ${edge.targetVariable} lacks known moderators. Individual differences likely exist.`,
          domain: edge.domains[0] || 'Unknown',
          relatedVariables: [edge.sourceVariable, edge.targetVariable],
          gapType: 'Missing_Moderators',
          priority: 'High',
          discoveredBy: 'Gap_Detection_Algorithm',
          suggestedSearchTerms: [
            `"${edge.sourceVariable}" AND "${edge.targetVariable}" AND (moderator OR individual differences OR age OR gender OR context)`
          ]
        });
      }
    }

    return gaps;
  }

  /**
   * Translates abstract research gaps into concrete, executable queries.
   */
  private convertGapsToQueries(gaps: ResearchGap[]): ResearchQuery[] {
    return gaps.map((gap, index) => {
      return {
        id: `query_${Date.now()}_${index}`,
        description: `Investigating ${gap.gapType}: ${gap.description}`,
        domains: [gap.domain],
        variables: gap.relatedVariables,
        searchQueryString: gap.suggestedSearchTerms.join(' '),
        priority: gap.priority
      } as ResearchQuery & { searchQueryString: string; priority: string };
    });
  }

  /**
   * Sorts the research queue based on priority and systemic importance.
   */
  private prioritizeQueries(queries: (ResearchQuery & { priority: string })[]): ResearchQuery[] {
    const priorityWeight: Record<string, number> = {
      'Critical': 4,
      'High': 3,
      'Medium': 2,
      'Low': 1
    };

    return queries.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
  }
}
