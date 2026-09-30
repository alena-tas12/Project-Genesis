import { EventBus } from './EventBus';
import type { CoreEvent } from './EventBus';
import { DependencyGraph } from './DependencyGraph';
import { ModelLibrary } from '../models/ModelLibrary';
import type { GraphEdge, Claim, Provenance } from '../research/researchOntology';
import { CANONICAL_MODELS } from '../models/canonicalModels';
import type { NetworkTopology } from '../simulation/NetworkEngine';

export class GenesisCore {
  private static instance: GenesisCore;
  
  public readonly eventBus: EventBus;
  public readonly dependencyGraph: DependencyGraph;
  public readonly modelLibrary: ModelLibrary;
  
  public activeKnowledgeGraph: GraphEdge[] = [];
  public activeNetwork: NetworkTopology = { nodes: [], edges: [], timestamp: 0 };
  
  public activeGaps: any[] = [];
  public evidenceRecords: any[] = [];
  public claims: Claim[] = [];
  public provenanceRecords: Provenance[] = [];
  public parameters: any[] = [];
  public experiments: any[] = [];
  public validationResults: any[] = [];
  public versions: any[] = [];
  
  private constructor() {
    this.eventBus = new EventBus();
    this.dependencyGraph = new DependencyGraph();
    this.modelLibrary = new ModelLibrary();
    CANONICAL_MODELS.forEach(m => this.modelLibrary.registerModel(m));
    this.setupCoreSubscribers();
  }

  public static getInstance(): GenesisCore {
    if (!GenesisCore.instance) {
      GenesisCore.instance = new GenesisCore();
    }
    return GenesisCore.instance;
  }

  private setupCoreSubscribers() {
    this.eventBus.subscribe('SOURCE_RETRACTED', async (event: CoreEvent) => {
      this.processInvalidationCascade(event.payload.sourceId, 'RETRACTED');
    });

    this.eventBus.subscribe('VALIDATION_FALSIFIED', async (event: CoreEvent) => {
      this.processInvalidationCascade(event.payload.sourceId, 'FALSIFIED');
    });

    this.eventBus.subscribe('RESEARCH_GAP_QUEUED', async (event: CoreEvent) => {
      const generatedGap = event.payload.generatedGap || {
        id: 'gap_' + Date.now(),
        description: event.payload.reason,
        domain: 'Interdisciplinary',
        relatedVariables: [],
        gapType: 'Contradiction_Resolution',
        priority: 'High',
        discoveredBy: 'Core_Event_Bus',
        status: 'UNADDRESSED',
        dateIdentified: new Date().toISOString()
      };
      this.activeGaps.push(generatedGap);
      await this.saveState();
    });
  }

  private processInvalidationCascade(sourceId: string, triggerReason: string) {
      console.log('[GenesisCore] Processing invalidation cascade for source: ' + sourceId + ' (Reason: ' + triggerReason + ')');
      
      const affectedIds = this.dependencyGraph.cascadeInvalidate(sourceId, 'RETRACTED');
      console.log('[GenesisCore] Cascade affected ' + affectedIds.length + ' nodes downstream.');
      
      // Update actual canonical arrays
      affectedIds.forEach(id => {
          // Update Parameters
          const param = this.parameters.find(p => p.id === id);
          if (param) param.epistemicStatus = 'REQUIRES_RECALIBRATION';

          // Update Claims
          const claim = this.claims.find(c => c.id === id);
          if (claim) claim.epistemicCategory = 'UNKNOWN';

          // Update Network Edges
          const edge = this.activeNetwork.edges.find(e => e.id === id);
          if (edge) edge.epistemicStatus = 'INVALIDATED';

          // Update Knowledge Graph Edges
          const kgEdge = this.activeKnowledgeGraph.find(e => e.id === id);
          if (kgEdge) kgEdge.epistemicStatus = 'INVALIDATED';
      });

      const staleModels = affectedIds.filter(id => this.dependencyGraph.getNodeStatus(id) === 'UNKNOWN' || this.dependencyGraph.getNodeStatus(id) === 'STALE');
      
      if (staleModels.length > 0) {
        this.eventBus.publish({
          id: 'gap_' + Date.now(),
          type: 'RESEARCH_GAP_QUEUED',
          timestamp: new Date().toISOString(),
          payload: { reason: 'Upstream evidence ' + triggerReason + '. Model recalibration required.', affectedNodes: staleModels }
        });
      }

      this.saveState();
  }

  public async saveState() {}
  public async loadStateAsync() {}
}
