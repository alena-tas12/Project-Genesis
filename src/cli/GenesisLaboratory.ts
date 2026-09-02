import { GenesisCore } from '../engine/core/GenesisCore';
import { ExperimentEngine } from '../engine/simulation/ExperimentEngine';
import { ModelDiscoveryEngine } from '../engine/models/ModelDiscoveryEngine';
import { ScientificQualityEngine } from '../engine/research/ScientificQualityEngine';

export class GenesisLaboratory {
  private core: GenesisCore;
  private experimentEngine: ExperimentEngine;
  private discoveryEngine: ModelDiscoveryEngine;
  private qualityEngine: ScientificQualityEngine;

  constructor() {
    this.core = GenesisCore.getInstance();
    this.experimentEngine = new ExperimentEngine();
    this.discoveryEngine = new ModelDiscoveryEngine();
    this.qualityEngine = new ScientificQualityEngine();
  }

  public displayDashboard() {
    console.log('\n======================================================');
    console.log('                 GENESIS LABORATORY                 ');
    console.log('======================================================');
    console.log(`Active Knowledge Graph Edges: ${this.core.activeKnowledgeGraph.length}`);
    console.log(`Pending Research Gaps:        ${this.core.activeGaps.length}`);
    console.log(`Registered Models:            ${this.core.modelLibrary.getAllModels().length}`);
    console.log('------------------------------------------------------');
  }

  public async runFullEnvironmentTest() {
    this.displayDashboard();
    console.log('[LABORATORY] Commencing Full Environment Diagnostic...');
    
    // 1. Mock a loaded model
    const mockModel = {
      id: 'mock_cognitive_model',
      name: 'Mock Cognitive Model',
      type: 'ODE',
      domain: 'Cognitive',
      description: 'Mock',
      parameters: [],
      variables: [],
      equations: [],
      assumptions: [],
      epistemicCategory: 'COMPUTATIONAL',
      validationStatus: 'PENDING',
      provenance: []
    } as any;

    // 2. Discover Best Model
    console.log('\n--- 1. AUTOMATIC MODEL DISCOVERY ---');
    await this.discoveryEngine.discoverBestModel([mockModel]);

    // 3. Evaluate Paper Quality
    console.log('\n--- 2. SCIENTIFIC QUALITY & BIAS ENGINE ---');
    const mockStudy = { studyDesign: 'observational', sampleSize: 30, keyFinding: 'fatigue causes low attention' } as any;
    const quality = this.qualityEngine.evaluateStudy(mockStudy);
    console.log(`Quality Score: ${quality.score}`);
    console.log(`Confidence: ${quality.confidenceLevel}`);
    console.log(`Flags: ${quality.flags.join(', ')}`);

    // 4. Run Experiment
    console.log('\n--- 3. EXPERIMENT ENGINE ---');
    const criteria = this.experimentEngine.generateFalsificationCriteria(mockModel, { id: 'alt_model' } as any);
    console.log(criteria);

    const timeSeries = await this.experimentEngine.runCounterfactual('mock_cognitive_model', {
      variable: 'fatigue',
      fixedValue: 0.0,
      timeStart: 10,
      timeEnd: 50
    });
    console.log(`Ran counterfactual experiment. Time series length: ${timeSeries.length} points.`);

    console.log('\n======================================================');
    console.log('            ENVIRONMENT DIAGNOSTIC COMPLETE           ');
    console.log('======================================================\n');
  }
}

// Execute
const lab = new GenesisLaboratory();
lab.runFullEnvironmentTest().catch(console.error);
