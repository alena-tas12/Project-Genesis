
import { GenesisCore } from '../core/GenesisCore';
import type { EpistemicCategory, Provenance } from '../core/ontology';

export interface NetworkNode {
  id: string;
  type: 'PERSON' | 'GROUP' | 'INSTITUTION' | 'CONCEPT';
  label: string;
  metadata: Record<string, any>;
  state: Record<string, number>;
  epistemicStatus?: EpistemicCategory;
  provenance?: Provenance;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export type NetworkEdgeType = 
  | 'FRIENDSHIP' | 'AUTHORITY' | 'MENTORSHIP' | 'KINSHIP' 
  | 'AFFECTION' | 'HOSTILITY' | 'INFORMATION_FLOW' | 'INFLUENCE'
  | 'SUPPORT' | 'CONFLICT' | 'INFERRED';

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  type: NetworkEdgeType;
  weight: number; 
  directed: boolean;
  metadata: Record<string, any>;
  epistemicStatus?: EpistemicCategory;
  provenance?: Provenance;
}

export interface NetworkTopology {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  timestamp: number;
}

export class NetworkEngine {
  private topology: NetworkTopology;

  constructor(initialTopology?: NetworkTopology) {
    this.topology = initialTopology || { nodes: [], edges: [], timestamp: 0 };
  }

  public getTopology(): NetworkTopology {
    return this.topology;
  }

  public addNode(node: NetworkNode) {
    if (!this.topology.nodes.find(n => n.id === node.id)) {
      node.x = node.x ?? Math.random() * 800 - 400;
      node.y = node.y ?? Math.random() * 600 - 300;
      node.vx = 0;
      node.vy = 0;
      this.topology.nodes.push(node);
      GenesisCore.getInstance().eventBus.publish({ type: 'NODE_CREATED', source: 'NetworkEngine', payload: { node } });
    }
  }

  public addEdge(edge: NetworkEdge) {
    if (!this.topology.edges.find(e => e.id === edge.id)) {
      this.topology.edges.push(edge);
      GenesisCore.getInstance().eventBus.publish({ type: 'EDGE_CREATED', source: 'NetworkEngine', payload: { edge } });
    }
  }

  public removeNode(id: string) {
    this.topology.nodes = this.topology.nodes.filter(n => n.id !== id);
    this.topology.edges = this.topology.edges.filter(e => e.source !== id && e.target !== id);
    GenesisCore.getInstance().eventBus.publish({ type: 'NODE_REMOVED', source: 'NetworkEngine', payload: { id } });
  }

  public removeEdge(id: string) {
    this.topology.edges = this.topology.edges.filter(e => e.id !== id);
    GenesisCore.getInstance().eventBus.publish({ type: 'EDGE_REMOVED', source: 'NetworkEngine', payload: { id } });
  }

  public step(dt: number) {
    this.topology.timestamp += dt;

    const stateDeltas: Record<string, Record<string, number>> = {};
    this.topology.nodes.forEach(n => { stateDeltas[n.id] = {}; });

    for (const edge of this.topology.edges) {
      if (edge.type === 'INFORMATION_FLOW' && edge.weight > 0) {
        const src = this.topology.nodes.find(n => n.id === edge.source);
        const tgt = this.topology.nodes.find(n => n.id === edge.target);
        if (src && tgt) {
          for (const key in src.state) {
             if (tgt.state[key] !== undefined) {
               const diff = src.state[key] - tgt.state[key];
               stateDeltas[tgt.id][key] = (stateDeltas[tgt.id][key] || 0) + (diff * edge.weight * 0.1 * dt);
               if (!edge.directed) {
                 stateDeltas[src.id][key] = (stateDeltas[src.id][key] || 0) - (diff * edge.weight * 0.1 * dt);
               }
             }
          }
        }
      }
    }

    for (const n of this.topology.nodes) {
      for (const key in stateDeltas[n.id]) {
        n.state[key] += stateDeltas[n.id][key];
      }
    }

    this.runForceLayoutTick(0.5);
  }

  private runForceLayoutTick(alpha: number = 0.1) {
    const nodes = this.topology.nodes;
    const edges = this.topology.edges;
    
    const REPULSION = 1000;
    const ATTRACTION = 0.05;
    const SPRING_LENGTH = 150;
    const DAMPING = 0.8;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i];
        const n2 = nodes[j];
        if (n1.x === undefined || n1.y === undefined || n2.x === undefined || n2.y === undefined) continue;

        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const distSq = dx * dx + dy * dy || 1;
        
        if (distSq < 90000) { 
          const dist = Math.sqrt(distSq);
          const force = REPULSION / distSq;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          n1.vx = (n1.vx || 0) + fx * alpha;
          n1.vy = (n1.vy || 0) + fy * alpha;
          n2.vx = (n2.vx || 0) - fx * alpha;
          n2.vy = (n2.vy || 0) - fy * alpha;
        }
      }
    }

    for (const edge of edges) {
      const src = nodes.find(n => n.id === edge.source);
      const tgt = nodes.find(n => n.id === edge.target);
      if (src && tgt && src.x !== undefined && src.y !== undefined && tgt.x !== undefined && tgt.y !== undefined) {
        const dx = tgt.x - src.x;
        const dy = tgt.y - src.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (dist - SPRING_LENGTH) * ATTRACTION;
        
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        
        const weightMult = Math.abs(edge.weight) || 0.1;

        src.vx = (src.vx || 0) + fx * alpha * weightMult;
        src.vy = (src.vy || 0) + fy * alpha * weightMult;
        tgt.vx = (tgt.vx || 0) - fx * alpha * weightMult;
        tgt.vy = (tgt.vy || 0) - fy * alpha * weightMult;
      }
    }

    for (const n of nodes) {
      if (n.x !== undefined && n.y !== undefined) {
         n.vx = (n.vx || 0) - (n.x * 0.01 * alpha);
         n.vy = (n.vy || 0) - (n.y * 0.01 * alpha);
      }
    }

    for (const n of nodes) {
      if (n.x !== undefined && n.y !== undefined && n.vx !== undefined && n.vy !== undefined) {
        n.vx *= DAMPING;
        n.vy *= DAMPING;
        n.x += n.vx;
        n.y += n.vy;
      }
    }
  }
}
