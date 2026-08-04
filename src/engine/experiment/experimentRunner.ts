import type { WorldState } from '../types';
import { Simulator } from '../simulation/simulator';
import { PRESET_ARCHITECTURES } from '../architecture/presetArchitectures';

export interface ExperimentRunResult {
  id: string;
  name: string;
  worlds: WorldState[];
  comparisonMatrix: Array<{
    worldName: string;
    presetId: string;
    avgKnowledgePct: number;
    avgStress: number;
    avgMotivation: number;
    avgBurnout: number;
    gdpProxy: number;
    happinessIndex: number;
    innovationIndex: number;
    socialMobilityIndex: number;
  }>;
}

export class ExperimentRunner {
  static createMultiWorldExperiment(
    baseSeed: number = 42,
    studentCount: number = 30,
    presetIds: string[] = ['traditional', 'montessori', 'finnish', 'japanese', 'ai_assisted']
  ): ExperimentRunResult {
    const worlds: WorldState[] = presetIds.map(presetId => {
      const arch = PRESET_ARCHITECTURES[presetId] || PRESET_ARCHITECTURES.traditional;
      return Simulator.createWorld(arch.name, arch, studentCount, baseSeed);
    });

    return {
      id: `exp-${Date.now()}`,
      name: 'Comparative Study of 5 Closed Educational Architectures',
      worlds,
      comparisonMatrix: []
    };
  }

  // Fast forward all comparative worlds by N days and generate side-by-side comparison matrix
  static runExperimentDays(experiment: ExperimentRunResult, days: number): ExperimentRunResult {
    const updatedWorlds = experiment.worlds.map(w => Simulator.fastForward(w, days));

    const comparisonMatrix = updatedWorlds.map(w => {
      const count = w.students.length || 1;
      const totalMasterySum = w.students.reduce((sum, s) => {
        const vals = Object.values(s.knowledgeMastery);
        return sum + (vals.reduce((a, b) => a + b, 0) / (vals.length || 1));
      }, 0);

      const avgKnowledgePct = Math.round((totalMasterySum / count) * 100);
      const avgStress = Math.round(w.students.reduce((sum, s) => sum + s.stress, 0) / count);
      const avgMotivation = Math.round(w.students.reduce((sum, s) => sum + s.motivation, 0) / count);
      const avgBurnout = Math.round(w.students.reduce((sum, s) => sum + s.burnout, 0) / count);

      return {
        worldName: w.name,
        presetId: w.architecture.presetId,
        avgKnowledgePct,
        avgStress,
        avgMotivation,
        avgBurnout,
        gdpProxy: w.economy.gdpProxy,
        happinessIndex: w.society.happinessIndex,
        innovationIndex: w.economy.innovationIndex,
        socialMobilityIndex: w.society.socialMobilityIndex
      };
    });

    return {
      ...experiment,
      worlds: updatedWorlds,
      comparisonMatrix
    };
  }
}
