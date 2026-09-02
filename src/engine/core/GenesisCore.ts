import { EventBus, CoreEvent } from './EventBus';
import { DependencyGraph } from './DependencyGraph';
import type { MathematicalModel } from '../models/ModelLibrary';
import { ModelLibrary } from '../models/ModelLibrary';
import type { GraphEdge } from '../research/researchOntology';

export class GenesisCore {
  private static instance: GenesisCore;
  
  public readonly eventBus: EventBus;
  public readonly dependencyGraph: DependencyGraph;
  public readonly modelLibrary: ModelLibrary;
  
  public activeKnowledgeGraph: GraphEdge[] = [];
  
  private constructor() {
    this.eventBus = new EventBus();
    this.dependencyGraph = new DependencyGraph();
    this.modelLibrary = new ModelLibrary();
    this.setupCoreSubscribers();
  }

  public static getInstance(): GenesisCore {
    if (!GenesisCore.instance) {
      GenesisCore.instance = new GenesisCore();
    }
    return GenesisCore.instance;
  }

  private setupCoreSubscribers() {
    // Listen for source retractions to trigger cascades
    this.eventBus.subscribe('SOURCE_RETRACTED', async (event: CoreEvent) => {
      const sourceId = event.payload.sourceId;
      console.log(`[GenesisCore] Processing retraction cascade for source: ${sourceId}`);
      
      const affected = this.dependencyGraph.cascadeInvalidate(sourceId, 'RETRACTED');
      console.log(`[GenesisCore] Cascade affected ${affected.length} nodes downstream.`);
      
      // If a model or parameter was invalidated, we might need a new gap
      const staleModels = affected.filter(id => this.dependencyGraph.getNodeStatus(id) === 'UNKNOWN' || this.dependencyGraph.getNodeStatus(id) === 'STALE');
      
      if (staleModels.length > 0) {
        await this.eventBus.publish({
          id: `gap_${Date.now()}`,
          type: 'RESEARCH_GAP_QUEUED',
          timestamp: new Date().toISOString(),
          payload: { reason: 'Upstream evidence retracted. Model recalibration required.', affectedNodes: staleModels }
        });
      }
    });
  }

  /**
   * Safe mutation of knowledge graph. Binds into the dependency graph.
   */
  public addEvidenceEdge(edge: GraphEdge, sourceDoi: string) {
    this.activeKnowledgeGraph.push(edge);
    
    // Wire dependencies: EDGE -> SOURCE
    this.dependencyGraph.registerNode(sourceDoi, 'SOURCE');
    this.dependencyGraph.registerNode(edge.id, 'EDGE');
    this.dependencyGraph.addDependency(edge.id, sourceDoi);

    this.eventBus.publish({
      id: `evt_${Date.now()}`,
      type: 'GRAPH_MUTATED',
      timestamp: new Date().toISOString(),
      payload: { edgeId: edge.id }
    });
  }
}
