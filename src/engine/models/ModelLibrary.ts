export type ParameterValue = 
  | { type: 'KNOWN'; value: number; uncertainty: number; sourceEdgeId: string }
  | { type: 'UNKNOWN' };

export interface ModelParameter {
  name: string;
  description: string;
  value: ParameterValue;
}

export interface StateSpace {
  [variableName: string]: number;
}

export interface DifferentialEquation {
  variable: string;
  // Compute dy/dt given the current state and parameter set
  computeDerivative: (state: StateSpace, params: Record<string, number>) => number;
}

export interface MathematicalModel {
  id: string;
  name: string;
  domain: string;
  equations: DifferentialEquation[];
  assumptions: string[];
  parameters: ModelParameter[];
  calibrationStatus: 'CALIBRATED' | 'UNINITIALIZED' | 'PARTIAL';
  validationStatus: 'VALIDATED' | 'FALSIFIED' | 'UNTESTED';
}

export class ModelLibrary {
  private models: Map<string, MathematicalModel> = new Map();

  registerModel(model: MathematicalModel) {
    this.models.set(model.id, model);
  }

  getModel(id: string): MathematicalModel | undefined {
    return this.models.get(id);
  }

  getAllModels(): MathematicalModel[] {
    return Array.from(this.models.values());
  }
}
