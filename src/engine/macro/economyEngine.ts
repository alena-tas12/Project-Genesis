import type { EconomyState, StudentAgent, EducationalArchitecture } from '../types';

export class EconomyEngine {
  static initEconomy(): EconomyState {
    return {
      jobsAvailable: 12500,
      skillDemand: {
        STEM: 85,
        Humanities: 65,
        Social: 70,
        Arts: 60,
        Practical: 90,
        Ethics: 80
      },
      innovationIndex: 55,
      gdpProxy: 42000, // Nominal GDP per capita proxy
      entrepreneurshipRate: 8.5,
      hiringRate: 72,
      automationResilience: 50
    };
  }

  static updateEconomy(
    prev: EconomyState,
    students: StudentAgent[],
    arch: EducationalArchitecture
  ): EconomyState {
    const count = students.length || 1;
    
    // Calculate average mastery per category across students
    const avgCuriosity = students.reduce((sum, s) => sum + s.curiosity, 0) / count;
    const avgMotivation = students.reduce((sum, s) => sum + s.motivation, 0) / count;
    const avgConfidence = students.reduce((sum, s) => sum + s.confidence, 0) / count;

    // Innovation index driven by curiosity, STEM mastery, and interdisciplinary focus
    const newInnovation = 40 + (avgCuriosity * 0.3) + (arch.interdisciplinaryPct * 0.2) + (arch.aiIntegrationLevel * 0.1);
    
    // Entrepreneurship rate
    const newEntrepreneurship = 5 + (avgConfidence * 0.1) + (arch.studentAutonomyPct * 0.08);

    // GDP Proxy calculation based on innovation, skill matching, and workforce productivity
    const growthRate = ((newInnovation / 100) * 0.04) + ((avgMotivation / 100) * 0.03) - 0.01;
    const newGdp = prev.gdpProxy * (1 + growthRate / 365);

    // Automation resilience
    const newAutomationResilience = 30 + (arch.collaborativeLearningPct * 0.3) + (arch.interdisciplinaryPct * 0.4);

    return {
      ...prev,
      innovationIndex: Number(Math.min(100, Math.max(0, newInnovation)).toFixed(2)),
      gdpProxy: Math.round(newGdp),
      entrepreneurshipRate: Number(Math.min(30, Math.max(1, newEntrepreneurship)).toFixed(1)),
      hiringRate: Number(Math.min(98, Math.max(40, 60 + (avgMotivation * 0.3))).toFixed(1)),
      automationResilience: Number(Math.min(100, Math.max(10, newAutomationResilience)).toFixed(1))
    };
  }
}
