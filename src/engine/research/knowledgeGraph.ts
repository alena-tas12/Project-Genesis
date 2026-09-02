/**
 * Project Genesis — Knowledge Graph
 * 
 * The accumulated scientific knowledge of Genesis.
 * Stores studies, claims, synthesized edges, contradictions,
 * philosophical constructs, and missing variables.
 * 
 * Provides query, ingestion, path-finding, and coverage analysis.
 */

import type {
  Study,
  Claim,
  ClaimSet,
  ContradictionReport,
  KnowledgeEdge,
  MissingVariable,
  ResearchDomain,
} from './researchOntology';
import type { PhilosophicalPosition, PhilosophicalQuestion } from './philosophicalRegistry';
import { extractClaims } from './evidenceExtraction';
import {
  groupClaimsByRelationship,
  detectContradictions,
  synthesizeEvidence,
  identifyMissingVariables,
} from './evidenceSynthesis';

// ─────────────────────────────────────────────────────────────
// MODEL REVISION HISTORY
// ─────────────────────────────────────────────────────────────

export interface ModelRevision {
  id: string;
  timestamp: string;
  description: string;
  addedStudies: string[];
  addedEdges: string[];
  resolvedContradictions: string[];
  addedVariables: string[];
}

// ─────────────────────────────────────────────────────────────
// KNOWLEDGE GRAPH
// ─────────────────────────────────────────────────────────────

let revisionCounter = 0;

export class GenesisKnowledgeGraph {
  // Core data stores
  public studies: Map<string, Study> = new Map();
  public claims: Map<string, Claim> = new Map();
  public claimSets: Map<string, ClaimSet> = new Map();
  public edges: Map<string, KnowledgeEdge> = new Map();
  public contradictions: Map<string, ContradictionReport> = new Map();
  public missingVariables: MissingVariable[] = [];

  // Philosophical knowledge system (parallel, not reduced to numbers)
  public philosophicalPositions: Map<string, PhilosophicalPosition> = new Map();
  public philosophicalQuestions: Map<string, PhilosophicalQuestion> = new Map();

  // Model revision history
  public revisions: ModelRevision[] = [];

  // Variables currently in the model
  public modelVariables: Set<string> = new Set();

  // ───────────────────────────────────────────────────────────
  // INGESTION
  // ───────────────────────────────────────────────────────────

  /**
   * Full ingestion pipeline: study → claims → synthesis → edges.
   * Returns a summary of what was added.
   */
  addStudy(study: Study): ModelRevision {
    // 1. Store the study
    this.studies.set(study.id, study);

    // 2. Extract claims
    const newClaims = extractClaims(study);
    for (const claim of newClaims) {
      this.claims.set(claim.id, claim);
    }

    // 3. Re-synthesize all claim sets (because new claims may affect existing sets)
    const allClaims = [...this.claims.values()];
    const newClaimSets = groupClaimsByRelationship(allClaims);

    // 4. Update claim sets and detect contradictions
    const addedEdgeIds: string[] = [];
    const resolvedContradictionIds: string[] = [];

    for (const cs of newClaimSets) {
      this.claimSets.set(cs.id, cs);

      const contradiction = detectContradictions(cs);
      if (contradiction) {
        this.contradictions.set(contradiction.id, contradiction);
      }

      // 5. Synthesize into knowledge edges
      const edge = synthesizeEvidence(cs, contradiction, study.domains);
      this.edges.set(edge.id, edge);
      addedEdgeIds.push(edge.id);
    }

    // 6. Track variables
    for (const claim of newClaims) {
      this.modelVariables.add(claim.sourceVariable);
      this.modelVariables.add(claim.targetVariable);
    }

    // 7. Discover missing variables
    this.missingVariables = identifyMissingVariables(
      [...this.modelVariables],
      allClaims,
      study.domains
    );

    // 8. Record revision
    revisionCounter++;
    const revision: ModelRevision = {
      id: `revision_${revisionCounter}`,
      timestamp: new Date().toISOString(),
      description: `Ingested study: ${study.title}`,
      addedStudies: [study.id],
      addedEdges: addedEdgeIds,
      resolvedContradictions: resolvedContradictionIds,
      addedVariables: newClaims.map(c => c.sourceVariable)
        .concat(newClaims.map(c => c.targetVariable))
        .filter(v => v !== 'unknown'),
    };
    this.revisions.push(revision);

    return revision;
  }

  /**
   * Batch ingestion of multiple studies.
   */
  addStudies(studies: Study[]): ModelRevision[] {
    return studies.map(s => this.addStudy(s));
  }

  // ───────────────────────────────────────────────────────────
  // QUERIES
  // ───────────────────────────────────────────────────────────

  /**
   * Given two variables, returns all known paths connecting them
   * through the graph, with evidence quality at each edge.
   */
  queryPath(source: string, target: string, maxDepth: number = 5): KnowledgeEdge[][] {
    const paths: KnowledgeEdge[][] = [];
    const visited = new Set<string>();

    const dfs = (current: string, path: KnowledgeEdge[], depth: number) => {
      if (depth > maxDepth) return;
      if (current === target && path.length > 0) {
        paths.push([...path]);
        return;
      }

      visited.add(current);

      for (const edge of this.edges.values()) {
        if (edge.sourceVariable === current && !visited.has(edge.targetVariable)) {
          path.push(edge);
          dfs(edge.targetVariable, path, depth + 1);
          path.pop();
        }
      }

      visited.delete(current);
    };

    dfs(source, [], 0);
    return paths;
  }

  /**
   * Returns all active contradictions requiring investigation.
   */
  getContradictions(): ContradictionReport[] {
    return [...this.contradictions.values()].filter(
      c => c.resolutionStatus === 'Unresolved' || c.resolutionStatus === 'Partially_Resolved'
    );
  }

  /**
   * Returns variables frequently mentioned in evidence but absent from the model.
   */
  getMissingVariables(): MissingVariable[] {
    return this.missingVariables;
  }

  /**
   * Returns how well-covered a domain is in terms of studies, claims, and edges.
   */
  getEvidenceCoverage(domain: ResearchDomain): {
    studyCount: number;
    claimCount: number;
    edgeCount: number;
    contradictionCount: number;
    averageConfidence: number;
  } {
    const domainStudies = [...this.studies.values()].filter(s => s.domains.includes(domain));
    const domainStudyIds = new Set(domainStudies.map(s => s.id));
    const domainClaims = [...this.claims.values()].filter(c => domainStudyIds.has(c.studyId));
    const domainEdges = [...this.edges.values()].filter(e => e.domains.includes(domain));
    const domainContradictions = [...this.contradictions.values()].filter(c => {
      const cs = this.claimSets.get(c.claimSetId);
      return cs && cs.claims.some(claim => domainStudyIds.has(claim.studyId));
    });

    const avgConfidence = domainEdges.length > 0
      ? domainEdges.reduce((sum, e) => sum + e.confidence, 0) / domainEdges.length
      : 0;

    return {
      studyCount: domainStudies.length,
      claimCount: domainClaims.length,
      edgeCount: domainEdges.length,
      contradictionCount: domainContradictions.length,
      averageConfidence: Math.round(avgConfidence * 100) / 100,
    };
  }

  // ───────────────────────────────────────────────────────────
  // PHILOSOPHICAL KNOWLEDGE
  // ───────────────────────────────────────────────────────────

  addPhilosophicalPosition(position: PhilosophicalPosition): void {
    this.philosophicalPositions.set(position.id, position);
  }

  addPhilosophicalQuestion(question: PhilosophicalQuestion): void {
    this.philosophicalQuestions.set(question.id, question);
  }

  // ───────────────────────────────────────────────────────────
  // STATISTICS
  // ───────────────────────────────────────────────────────────

  getStats(): {
    totalStudies: number;
    totalClaims: number;
    totalEdges: number;
    totalContradictions: number;
    totalMissingVariables: number;
    totalRevisions: number;
    domainCoverage: Record<string, number>;
  } {
    const domainCoverage: Record<string, number> = {};
    for (const study of this.studies.values()) {
      for (const domain of study.domains) {
        domainCoverage[domain] = (domainCoverage[domain] ?? 0) + 1;
      }
    }

    return {
      totalStudies: this.studies.size,
      totalClaims: this.claims.size,
      totalEdges: this.edges.size,
      totalContradictions: this.contradictions.size,
      totalMissingVariables: this.missingVariables.length,
      totalRevisions: this.revisions.length,
      domainCoverage,
    };
  }
}
