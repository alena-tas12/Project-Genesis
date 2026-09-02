export type NodeType = 'SOURCE' | 'CLAIM' | 'EDGE' | 'MODEL' | 'PARAMETER' | 'SIMULATION' | 'GAP';

export interface DependencyNode {
  id: string;
  type: NodeType;
  status: 'ACTIVE' | 'STALE' | 'RETRACTED' | 'UNKNOWN' | 'REQUIRES_REVIEW';
}

export class DependencyGraph {
  private nodes: Map<string, DependencyNode> = new Map();
  // adjacency list: A -> B means A is DEPENDENT ON B. 
  // (e.g. Simulation -> Parameter -> Model -> Edge -> Claim -> Source)
  private upstream: Map<string, Set<string>> = new Map();
  // A -> B means A SUPPORTS B. 
  private downstream: Map<string, Set<string>> = new Map();

  public registerNode(id: string, type: NodeType) {
    if (!this.nodes.has(id)) {
      this.nodes.set(id, { id, type, status: 'ACTIVE' });
      this.upstream.set(id, new Set());
      this.downstream.set(id, new Set());
    }
  }

  public addDependency(dependentId: string, supportingId: string) {
    if (!this.nodes.has(dependentId) || !this.nodes.has(supportingId)) {
      throw new Error(`Nodes must be registered before adding dependency: ${dependentId} -> ${supportingId}`);
    }
    this.upstream.get(dependentId)!.add(supportingId);
    this.downstream.get(supportingId)!.add(dependentId);
  }

  public getNodeStatus(id: string): string | undefined {
    return this.nodes.get(id)?.status;
  }

  /**
   * Invalidates a node and cascades the invalidation downstream.
   * e.g., if Source is retracted, Claims become REQUIRES_REVIEW, Parameters become UNKNOWN, Simulations become STALE.
   */
  public cascadeInvalidate(sourceId: string, baseStatus: DependencyNode['status'] = 'RETRACTED'): string[] {
    const affectedNodes: string[] = [];
    const queue = [sourceId];
    
    // Set the root status
    if (this.nodes.has(sourceId)) {
      this.nodes.get(sourceId)!.status = baseStatus;
    }

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      affectedNodes.push(currentId);

      const dependents = this.downstream.get(currentId) || new Set();
      for (const depId of dependents) {
        const node = this.nodes.get(depId)!;
        let newStatus: DependencyNode['status'] = 'REQUIRES_REVIEW';
        
        if (node.type === 'PARAMETER') newStatus = 'UNKNOWN';
        if (node.type === 'SIMULATION') newStatus = 'STALE';
        if (node.type === 'EDGE') newStatus = 'REQUIRES_REVIEW';
        
        if (node.status !== newStatus) {
          node.status = newStatus;
          queue.push(depId);
        }
      }
    }

    return affectedNodes;
  }
}
