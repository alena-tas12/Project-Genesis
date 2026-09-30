import { EventBus, CoreEvent } from './EventBus';
import { DependencyGraph } from './DependencyGraph';
import type { MathematicalModel } from '../models/ModelLibrary';
import { ModelLibrary } from '../models/ModelLibrary';
import type { GraphEdge } from '../research/researchOntology';
import * as fs from 'fs';
import * as path from 'path';

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
    this.loadState();
  }

  public static getInstance(): GenesisCore {
    if (!GenesisCore.instance) {
      GenesisCore.instance = new GenesisCore();
    }
    return GenesisCore.instance;
  }

  public activeGaps: any[] = [];
  
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

    // Listen for new gaps
    this.eventBus.subscribe('RESEARCH_GAP_QUEUED', async (event: CoreEvent) => {
      console.log(`[GenesisCore] Queuing new gap to active memory...`);
      const generatedGap = event.payload.generatedGap || {
        id: `gap_${Date.now()}`,
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
      this.saveState();
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
    this.saveState();
  }

  public saveState() {
    const stateFile = path.join(process.cwd(), 'genesis_core_state.json');
    const state = {
      activeKnowledgeGraph: this.activeKnowledgeGraph,
      activeGaps: this.activeGaps,
      nodes: Array.from((this.dependencyGraph as any).nodes.entries()),
      upstream: Array.from((this.dependencyGraph as any).upstream.entries()),
      downstream: Array.from((this.dependencyGraph as any).downstream.entries())
    };
    fs.writeFileSync(stateFile, JSON.stringify(state, null, 2), 'utf-8');
  }

  public loadState() {
    const stateFile = path.join(process.cwd(), 'genesis_core_state.json');
    if (fs.existsSync(stateFile)) {
      try {
        const state = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
        this.activeKnowledgeGraph = state.activeKnowledgeGraph || [];
        this.activeGaps = state.activeGaps || [];
        if (state.nodes) (this.dependencyGraph as any).nodes = new Map(state.nodes);
        if (state.upstream) (this.dependencyGraph as any).upstream = new Map(state.upstream);
        if (state.downstream) (this.dependencyGraph as any).downstream = new Map(state.downstream);
        console.log(`[GenesisCore] State loaded from disk. Graph size: ${this.activeKnowledgeGraph.length}`);
      } catch (err) {
        console.error(`[GenesisCore] Failed to load state:`, err);
      }
    }
  }
}
