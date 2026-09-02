import type { StateSpace, MathematicalModel, ModelLibrary } from '../models/ModelLibrary';
import type { HumanState } from './DynamicHumanSystem';
import { ParameterCalibrationEngine } from './parameterCalibration';

export interface SimulationEnvironment {
  time: number;
  dt: number;
  agents: HumanState[];
  models: MathematicalModel[];
  globalParameters: Record<string, Record<string, number>>; // modelId -> {paramName -> value}
}

export class GenesisRuntime {
  private paramEngine = new ParameterCalibrationEngine();

  /**
   * Initializes the simulation environment by sampling a fixed set of parameters
   * for the models, so that parameters remain constant across the simulation run
   * (unless specifically modeled as stochastic processes).
   */
  public initializeEnvironment(agents: HumanState[], models: MathematicalModel[], dt: number = 0.1): SimulationEnvironment {
    const globalParameters: Record<string, Record<string, number>> = {};
    for (const model of models) {
      globalParameters[model.id] = this.paramEngine.sampleParameterSet(model);
    }

    return {
      time: 0,
      dt,
      agents,
      models,
      globalParameters
    };
  }

  /**
   * Step the simulation forward by delta-t using the 4th-order Runge-Kutta method.
   */
  public step(env: SimulationEnvironment): SimulationEnvironment {
    const nextAgents = env.agents.map(agent => this.stepAgentRK4(agent, env));
    
    return {
      ...env,
      time: env.time + env.dt,
      agents: nextAgents
    };
  }

  private stepAgentRK4(agent: HumanState, env: SimulationEnvironment): HumanState {
    const dt = env.dt;
    let currentState = { ...agent.state };

    for (const modelId of agent.activeModels) {
      const model = env.models.find(m => m.id === modelId);
      if (!model) continue;

      const params = env.globalParameters[modelId];

      // RK4 requires calculating k1, k2, k3, k4 for all variables in the system simultaneously
      // To keep prototype manageable, we compute derivatives treating other variables as constant at current step
      const k1 = this.computeDerivatives(model, currentState, params);
      
      const stateK2 = this.addState(currentState, this.scaleState(k1, dt / 2));
      const k2 = this.computeDerivatives(model, stateK2, params);

      const stateK3 = this.addState(currentState, this.scaleState(k2, dt / 2));
      const k3 = this.computeDerivatives(model, stateK3, params);

      const stateK4 = this.addState(currentState, this.scaleState(k3, dt));
      const k4 = this.computeDerivatives(model, stateK4, params);

      // y_{n+1} = y_n + dt/6 * (k1 + 2k2 + 2k3 + k4)
      for (const eq of model.equations) {
        const dVar = (dt / 6) * (k1[eq.variable] + 2 * k2[eq.variable] + 2 * k3[eq.variable] + k4[eq.variable]);
        currentState[eq.variable] = currentState[eq.variable] + dVar;
        // Clamp to avoid NaN or infinite explosions in uncalibrated prototypes
        currentState[eq.variable] = Math.max(-10, Math.min(10, currentState[eq.variable])); 
      }
    }

    return {
      ...agent,
      state: currentState
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
