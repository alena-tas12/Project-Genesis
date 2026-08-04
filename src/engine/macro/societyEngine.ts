import type { SocietyState, StudentAgent, TeacherAgent, EducationalArchitecture } from '../types';

export class SocietyEngine {
  static initSociety(): SocietyState {
    return {
      happinessIndex: 65,
      wellbeingIndex: 68,
      crimeProxy: 18,
      researchBreakthroughs: 12,
      socialCohesion: 60,
      socialMobilityIndex: 55
    };
  }

  static updateSociety(
    prev: SocietyState,
    students: StudentAgent[],
    teachers: TeacherAgent[],
    arch: EducationalArchitecture
  ): SocietyState {
    const studentCount = students.length || 1;
    const avgStress = students.reduce((sum, s) => sum + s.stress, 0) / studentCount;
    const avgBurnout = students.reduce((sum, s) => sum + s.burnout, 0) / studentCount;
    const avgRelationships = students.reduce((sum, s) => sum + s.relationships, 0) / studentCount;
    
    // Low income inequality bridging factor
    const avgInequalityGap = students.reduce((sum, s) => sum + Math.abs(s.inequalityFactor - 50), 0) / studentCount;

    const happiness = 50 + (arch.wellbeingFocusPct * 0.3) + (avgRelationships * 0.2) - (avgStress * 0.2) - (avgBurnout * 0.2);
    const wellbeing = 45 + (arch.wellbeingFocusPct * 0.45) - (avgBurnout * 0.3);
    
    // Crime proxy inversely proportional to wellbeing, social cohesion, and education access
    const crime = Math.max(2, 35 - (wellbeing * 0.25) - (arch.collaborativeLearningPct * 0.1));

    // Social mobility
    const mobility = 30 + (arch.studentAutonomyPct * 0.3) + (arch.fundingPerStudentUSD / 25000 * 30) - (avgInequalityGap * 0.2);

    // Research breakthroughs accumulate over time from high-performing teachers and curious students
    const teacherResearchSum = teachers.reduce((sum, t) => sum + t.researchOutput, 0);
    const breakthroughChance = (teacherResearchSum / (teachers.length || 1)) * 0.0005;
    const newBreakthroughs = prev.researchBreakthroughs + (Math.random() < breakthroughChance ? 1 : 0);

    return {
      happinessIndex: Math.min(100, Math.max(10, Math.round(happiness))),
      wellbeingIndex: Math.min(100, Math.max(10, Math.round(wellbeing))),
      crimeProxy: Math.min(60, Math.max(1, Number(crime.toFixed(1)))),
      researchBreakthroughs: newBreakthroughs,
      socialCohesion: Math.min(100, Math.max(10, Math.round(40 + (arch.collaborativeLearningPct * 0.4) + (avgRelationships * 0.2)))),
      socialMobilityIndex: Math.min(100, Math.max(10, Math.round(mobility)))
    };
  }
}
