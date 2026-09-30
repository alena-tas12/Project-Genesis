import { GenesisCore } from './GenesisCore';
import { AutonomousResearchCycle } from '../research/autonomousCycle';
import { ModelDiscoveryEngine } from '../models/ModelDiscoveryEngine';
import { ExperimentEngine } from '../simulation/ExperimentEngine';
import { ValidationEngine } from '../simulation/ValidationEngine';
import { GenesisRuntime as SimulationRuntime } from '../simulation/GenesisRuntime';
import { DynamicHumanSystem } from '../simulation/DynamicHumanSystem';

export class GenesisOrchestrator {
  private static instance: GenesisOrchestrator;
  public core: GenesisCore;
  
  private researchEngine: AutonomousResearchCycle;
  private discoveryEngine: ModelDiscoveryEngine;
  private experimentEngine: ExperimentEngine;
  private validationEngine: ValidationEngine;
  public simulationRuntime: SimulationRuntime;
  public simulationEnvironment: any = null;

  private constructor() {
    this.core = GenesisCore.getInstance();
    this.researchEngine = new AutonomousResearchCycle();
    this.discoveryEngine = new ModelDiscoveryEngine();
    this.experimentEngine = new ExperimentEngine();
    this.validationEngine = new ValidationEngine();
    this.simulationRuntime = new SimulationRuntime();
  }

  public static getInstance(): GenesisOrchestrator {
    if (!GenesisOrchestrator.instance) {
      GenesisOrchestrator.instance = new GenesisOrchestrator();
    }
    return GenesisOrchestrator.instance;
  }

  public startSimulation() {
    const models = this.core.modelLibrary.getAllModels();
    const trisha = DynamicHumanSystem.initializeHuman('h_001', 'Trisha', models);
    const anwesha = DynamicHumanSystem.initializeHuman('h_002', 'Anwesha', models);
    const princess = DynamicHumanSystem.initializeHuman('h_003', 'Princess', models);
    const alena = DynamicHumanSystem.initializeHuman('h_base', 'ALENA Baseline', models);
    
    // Seed initial network state from core, or initialize empty if first run
    this.simulationEnvironment = this.simulationRuntime.initializeEnvironment([trisha, anwesha, princess, alena], models, 0.1, this.core.activeNetwork);
    
    // Wire up initial network topology if it's empty
    const network = this.simulationEnvironment.network;
    if (network && network.edges.length === 0) {
      network.edges.push({ id: 'e_01', source: 'h_001', target: 'h_002', type: 'FRIENDSHIP', weight: 0.8, directed: false, metadata: {} });
      network.edges.push({ id: 'e_02', source: 'h_002', target: 'h_003', type: 'FRIENDSHIP', weight: 0.6, directed: false, metadata: {} });
      network.edges.push({ id: 'e_03', source: 'h_001', target: 'h_003', type: 'FRIENDSHIP', weight: 0.5, directed: false, metadata: {} });
      network.edges.push({ id: 'e_04', source: 'h_base', target: 'h_001', type: 'MENTORSHIP', weight: 0.9, directed: true, metadata: {} });
    }

    console.log(`[Orchestrator] Simulation Environment Started with ${models.length} models and ${network?.edges.length || 0} edges.`);
  }

  public stepSimulation() {
    if (!this.simulationEnvironment) this.startSimulation();
    this.simulationEnvironment = this.simulationRuntime.step(this.simulationEnvironment);
    
    // Sync back to canonical core persistence
    this.core.activeNetwork = this.simulationEnvironment.network;
    
    return this.simulationEnvironment;
  }

  /**
   * Complete end-to-end cycle:
   * 1. Research gaps -> Literature
   * 2. Literature -> Extracted claims/edges
   * 3. Claims -> Updated Knowledge Graph (handled by AutonomousResearchCycle internals communicating with GenesisCore)
   * 4. Graph -> Recalibrate Models
   * 5. Models -> Run Simulation
   * 6. Simulation -> Validation -> Gaps
   */
  public async executeFullScientificCycle(cycleId: string): Promise<any> {
    console.log(`[Orchestrator] Starting Full Scientific Cycle: ${cycleId}`);
    const results: any = { cycleId };

    // 1. Research Phase
    const gapsToResearch = this.core.activeGaps.filter(g => g.status === 'UNADDRESSED');
    if (gapsToResearch.length > 0) {
      console.log(`[Orchestrator] Researching ${gapsToResearch.length} unaddressed gaps...`);
      results.research = await this.researchEngine.runCycle(cycleId, gapsToResearch, { topK: 3 });
      // Gaps are saved inside runCycle
    } else {
      console.log(`[Orchestrator] No unaddressed gaps. Skipping research phase.`);
    }

    // 2. Model Discovery Phase
    console.log(`[Orchestrator] Recalibrating model structures based on canonical state...`);
    // Pass registered models to see if evidence supports them
    const allModels = this.core.modelLibrary.getAllModels();
    results.discovery = await this.discoveryEngine.discoverBestModel(allModels);

    // 3. Simulation & Validation Phase
    console.log(`[Orchestrator] Validating models against empirical bounds...`);
    results.validation = [];
    const validationTargets = this.validationEngine.extractValidationTargets(this.core.activeKnowledgeGraph);

    for (const model of allModels) {
      if (!model.equations || model.equations.length === 0) continue;
      
      // Run a brief simulation using the model
      const timeSeries = await this.experimentEngine.runCounterfactual(model.id, {
        variable: model.equations[0].variable,
        fixedValue: 1.0,
        timeStart: 0,
        timeEnd: 10
      });

      const passed = await this.validationEngine.validateSimulation(`sim_${Date.now()}`, model.id, timeSeries, validationTargets);
      
      results.validation.push({ modelId: model.id, passed });
    }

    await this.core.saveState();
    console.log(`[Orchestrator] Cycle ${cycleId} complete. State saved.`);
    return results;
  }
}
