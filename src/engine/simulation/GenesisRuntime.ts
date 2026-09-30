// @ts-nocheck
import type { StateSpace, MathematicalModel, ModelLibrary } from '../models/ModelLibrary';
import type { HumanState } from './DynamicHumanSystem';
import { ParameterCalibrationEngine } from './parameterCalibration';
import { NetworkEngine, NetworkTopology } from './NetworkEngine';

export interface SimulationEnvironment {
  time: number;
  dt: number;
  agents: HumanState[];
  models: MathematicalModel[];
  globalParameters: Record<string, Record<string, number>>; // modelId -> {paramName -> value}
  network: NetworkTopology;
}

export class GenesisRuntime {
  private paramEngine = new ParameterCalibrationEngine();
  private networkEngine = new NetworkEngine();

  /**
   * Initializes the simulation environment by sampling a fixed set of parameters
   * for the models, so that parameters remain constant across the simulation run
   * (unless specifically modeled as stochastic processes).
   */
  public initializeEnvironment(agents: HumanState[], models: MathematicalModel[], dt: number = 0.1, initialNetwork?: NetworkTopology): SimulationEnvironment {
    const globalParameters: Record<string, Record<string, number>> = {};
    for (const model of models) {
      globalParameters[model.id] = this.paramEngine.sampleParameterSet(model);
    }
    
    this.networkEngine = new NetworkEngine(initialNetwork);
    
    // Auto-populate network with agents
    for (const agent of agents) {
      this.networkEngine.addNode({
        id: agent.id,
        type: 'PERSON',
        label: agent.name,
        metadata: {},
        state: agent.layers.Psychological as any || {}
      });
    }

    return {
      time: 0,
      dt,
      agents,
      models,
      globalParameters,
      network: this.networkEngine.getTopology()
    };
  }

  /**
   * Step the simulation forward by delta-t using the 4th-order Runge-Kutta method.
   */
  public step(env: SimulationEnvironment): SimulationEnvironment {
    const nextAgents = env.agents.map(agent => this.stepAgentRK4(agent, env));
    
    this.networkEngine.step(env.dt);
    
    return {
      ...env,
      time: env.time + env.dt,
      agents: nextAgents,
      network: this.networkEngine.getTopology()
    };
  }

  private stepAgentRK4(agent: HumanState, env: SimulationEnvironment): HumanState {
    const dt = env.dt;
    // Flatten all layers into a single StateSpace for the RK4 solver
    let currentState: StateSpace = {};
    for (const layerName in agent.layers) {
      Object.assign(currentState, agent.layers[layerName as keyof typeof agent.layers]);
    }

    for (const modelId of agent.activeModels) {
      const model = env.models.find(m => m.id === modelId);
      if (!model) continue;

      const params = env.globalParameters[modelId];

      const k1 = this.computeDerivatives(model, currentState, params);
      
      const stateK2 = this.addState(currentState, this.scaleState(k1, dt / 2));
      const k2 = this.computeDerivatives(model, stateK2, params);

      const stateK3 = this.addState(currentState, this.scaleState(k2, dt / 2));
      const k3 = this.computeDerivatives(model, stateK3, params);

      const stateK4 = this.addState(currentState, this.scaleState(k3, dt));
      const k4 = this.computeDerivatives(model, stateK4, params);

      for (const eq of model.equations) {
        const dVar = (dt / 6) * (k1[eq.variable] + 2 * k2[eq.variable] + 2 * k3[eq.variable] + k4[eq.variable]);
        currentState[eq.variable] = currentState[eq.variable] + dVar;
        currentState[eq.variable] = Math.max(-10, Math.min(10, currentState[eq.variable])); 
      }
    }

    // Write the updated flat state back into the layered structure
    const updatedLayers = { ...agent.layers };
    for (const layerName in updatedLayers) {
      const layer = updatedLayers[layerName as keyof typeof updatedLayers];
      for (const varName in layer) {
        if (currentState[varName] !== undefined) {
          layer[varName] = currentState[varName];
        }
      }
    }

    return {
      ...agent,
      layers: updatedLayers
    };
  }

  private computeDerivatives(model: MathematicalModel, state: StateSpace, params: Record<string, number>): StateSpace {
    const derivatives: StateSpace = {};
    for (const eq of model.equations) {
      derivatives[eq.variable] = eq.computeDerivative(state, params);
    }
    return derivatives;
  }

  private addState(a: StateSpace, b: StateSpace): StateSpace {
    const result: StateSpace = { ...a };
    for (const key in b) {
      result[key] = (result[key] || 0) + b[key];
    }
    return result;
  }

  private scaleState(a: StateSpace, scalar: number): StateSpace {
    const result: StateSpace = {};
    for (const key in a) {
      result[key] = a[key] * scalar;
    }
    return result;
  }
}
