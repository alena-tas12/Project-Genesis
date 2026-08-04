import type { StudentAgent, EducationalArchitecture, KnowledgeGraph, DailyRoutinePeriod, EducationLifeStage, DegreeLevel } from '../types';
import { PRNG } from '../prng';

export class StudentEngine {
  static generatePopulation(count: number, graph: KnowledgeGraph, prng: PRNG): StudentAgent[] {
    const names = [
      'Alex', 'Elena', 'Hiroshi', 'Sofia', 'Marcus', 'Aria', 'Chen', 'Zoe',
      'Liam', 'Maya', 'Kaito', 'Olivia', 'Ethan', 'Chloe', 'Noah', 'Amara',
      'Lucas', 'Freja', 'Mateo', 'Yuki', 'Gabriel', 'Ananya', 'Leo', 'Mia',
      'Tariq', 'Sora', 'Dante', 'Noa', 'Fatima', 'Dmitri', 'Carlos', 'Mei',
      'Kenji', 'Amina', 'Kwame', 'Sven', 'Astrid', 'Lucia', 'Rohan', 'Ji-won'
    ];

    const careers = [
      'Quantum Computing Researcher', 'Biomedical Engineer', 'AI Ethics Architect',
      'Entrepreneur & Founder', 'Policy Analyst', 'Space Systems Engineer',
      'Environmental Scientist', 'Software Architect', 'Educator', 'Roboticist'
    ];

    const transportModes: Array<'walk' | 'bike' | 'bus' | 'car'> = ['walk', 'bike', 'bus', 'car'];

    const students: StudentAgent[] = [];

    for (let i = 0; i < count; i++) {
      const name = `${names[i % names.length]} ${String.fromCharCode(65 + (i % 26))}.`;
      const inequalityFactor = prng.clamp(prng.gaussian(50, 18), 10, 90);
      
      const age = prng.intRange(15, 45); // Lifelong continuum cohort
      
      // Determine Life Stage & Degree Level based on Age
      let lifeStage: EducationLifeStage = 'secondary';
      let degreeLevel: DegreeLevel = 'HighSchoolDiploma';

      if (age <= 18) {
        lifeStage = 'secondary';
        degreeLevel = 'None';
      } else if (age <= 22) {
        lifeStage = 'undergraduate';
        degreeLevel = 'HighSchoolDiploma';
      } else if (age <= 26) {
        lifeStage = 'postgraduate';
        degreeLevel = 'BachelorsDegree';
      } else if (age <= 32) {
        lifeStage = 'doctoral';
        degreeLevel = 'MastersDegree';
      } else {
        lifeStage = 'lifelong_upskilling';
        degreeLevel = i % 2 === 0 ? 'DoctoratePhD' : 'ExecutiveMicroCredential';
      }

      // Gatekeeper Entrance Exam Score
      const entranceExamScore = prng.clamp(prng.gaussian(68, 15), 20, 99);

      // Distance from school / university campus (0.5 to 18 km)
      const commuteDistanceKm = Number(prng.range(0.5, 18.0).toFixed(1));
      const transportMode = transportModes[i % transportModes.length];
      
      let speedKmH = 4;
      if (transportMode === 'bike') speedKmH = 15;
      else if (transportMode === 'bus') speedKmH = 22;
      else if (transportMode === 'car') speedKmH = 35;

      const commuteTimeMins = Math.round((commuteDistanceKm / speedKmH) * 60);

      const angle = prng.range(0, 2 * Math.PI);
      const geoCoordinates = {
        x: Number((commuteDistanceKm * Math.cos(angle)).toFixed(2)),
        y: Number((commuteDistanceKm * Math.sin(angle)).toFixed(2))
      };

      const knowledgeMastery: Record<string, number> = {};
      const memoryRetention: Record<string, number> = {};

      graph.nodes.forEach(node => {
        if (node.prerequisiteIds.length === 0) {
          const base = (inequalityFactor / 100) * 0.4 + prng.range(0.1, 0.3);
          knowledgeMastery[node.id] = prng.clamp(base, 0.05, 0.8);
          memoryRetention[node.id] = knowledgeMastery[node.id];
        } else {
          knowledgeMastery[node.id] = 0;
          memoryRetention[node.id] = 0;
        }
      });

      students.push({
        id: `student-${i + 1}`,
        name,
        age,
        gradeLevel: age <= 18 ? age - 5 : 12 + Math.min(6, age - 18),
        lifeStage,
        degreeLevel,
        entranceExamScore,
        commuteDistanceKm,
        commuteTimeMins,
        transportMode,
        geoCoordinates,
        knowledgeMastery,
        memoryRetention,
        curiosity: prng.clamp(prng.gaussian(65, 15), 20, 95),
        stress: prng.clamp(prng.gaussian(30, 10), 5, 75),
        motivation: prng.clamp(prng.gaussian(70, 15), 20, 98),
        discipline: prng.clamp(prng.gaussian(60, 15), 15, 95),
        confidence: prng.clamp(prng.gaussian(60, 15), 15, 95),
        health: prng.clamp(prng.gaussian(85, 10), 40, 100),
        burnout: prng.clamp(prng.gaussian(15, 8), 0, 50),
        energy: prng.clamp(100 - (commuteTimeMins * 0.4), 40, 100),
        socialSat: prng.clamp(prng.gaussian(65, 15), 20, 95),
        relationships: prng.clamp(prng.gaussian(65, 15), 20, 98),
        careerGoal: careers[i % careers.length],
        inequalityFactor
      });
    }

    return students;
  }

  static updateStudentDay(
    student: StudentAgent,
    arch: EducationalArchitecture,
    graph: KnowledgeGraph,
    avgTeacherQuality: number,
    prng: PRNG,
    routinePeriod: DailyRoutinePeriod = 'instruction_1'
  ): StudentAgent {
    const updated = { ...student };

    // Gatekeeper entrance exam stress factor
    const examPressureFactor = (arch.examWeightPct / 100) * 15;
    const commuteStressPen = (student.commuteTimeMins / 60) * 8;
    const homeworkStress = (arch.homeworkHoursPerDay / 4) * 12;
    const autonomyRelief = (arch.studentAutonomyPct / 100) * 8;
    const wellbeingRelief = (arch.wellbeingFocusPct / 100) * 12;

    let breakRecovery = 0;
    if (routinePeriod === 'recess_break' || routinePeriod === 'lunch_break') {
      breakRecovery = (arch.wellbeingFocusPct / 100) * 15 + (arch.collaborativeLearningPct / 100) * 10;
      updated.socialSat = prng.clamp(updated.socialSat + 8, 0, 100);
      updated.energy = prng.clamp(updated.energy + 12, 0, 100);
    }

    const netDailyStress = (homeworkStress + examPressureFactor + commuteStressPen - autonomyRelief - wellbeingRelief - breakRecovery) * 0.1;
    updated.stress = prng.clamp(updated.stress + netDailyStress + prng.range(-0.5, 0.5), 5, 100);

    if (updated.stress > 70) {
      updated.burnout = prng.clamp(updated.burnout + 0.35 * (updated.stress / 70), 0, 100);
      updated.motivation = prng.clamp(updated.motivation - 0.25, 5, 100);
    } else {
      updated.burnout = prng.clamp(updated.burnout - 0.2, 0, 100);
    }

    // Dynamic Lifelong Degree Progression & Entrance Exam Updating
    const avgMastery = Object.values(updated.knowledgeMastery).reduce((a, b) => a + b, 0) / (graph.nodes.length || 1);
    updated.entranceExamScore = prng.clamp((avgMastery * 70) + (updated.discipline * 0.3), 10, 100);

    // Degree Promotion Logic
    if (avgMastery > 0.85 && updated.degreeLevel === 'HighSchoolDiploma' && updated.age >= 18) {
      updated.degreeLevel = 'BachelorsDegree';
      updated.lifeStage = 'undergraduate';
    } else if (avgMastery > 0.92 && updated.degreeLevel === 'BachelorsDegree' && updated.age >= 22) {
      updated.degreeLevel = 'MastersDegree';
      updated.lifeStage = 'postgraduate';
    } else if (avgMastery > 0.96 && updated.degreeLevel === 'MastersDegree' && updated.age >= 26) {
      updated.degreeLevel = 'DoctoratePhD';
      updated.lifeStage = 'doctoral';
    }

    // Curiosity & Learning
    const aiBoost = (arch.aiIntegrationLevel / 100) * 0.15;
    const autonomyBoost = (arch.studentAutonomyPct / 100) * 0.2;
    const burnoutPenalty = (updated.burnout / 100) * 0.4;
    const energyFactor = (updated.energy / 100);

    updated.curiosity = prng.clamp(updated.curiosity + autonomyBoost - burnoutPenalty + prng.range(-0.2, 0.2), 10, 100);
    updated.motivation = prng.clamp(updated.motivation + aiBoost + (avgTeacherQuality / 100) * 0.1 - burnoutPenalty, 5, 100);

    const learningRateBase = (updated.motivation / 100) * (updated.curiosity / 100) * (avgTeacherQuality / 100) * energyFactor;
    const aiEfficiencyMultiplier = 1 + (arch.aiIntegrationLevel / 100) * 0.6;
    const classSizeEfficiencyMultiplier = Math.max(0.6, 1.4 - (arch.classSize / 35));

    const effectiveDailyLearningPower = 0.015 * learningRateBase * aiEfficiencyMultiplier * classSizeEfficiencyMultiplier;

    graph.nodes.forEach(node => {
      let prereqsSatisfied = true;

      for (const reqId of node.prerequisiteIds) {
        const prereqLevel = updated.knowledgeMastery[reqId] || 0;
        if (prereqLevel < (arch.masteryThresholdPct / 100)) {
          prereqsSatisfied = false;
        }
      }

      if (prereqsSatisfied || node.prerequisiteIds.length === 0) {
        const currentMastery = updated.knowledgeMastery[node.id] || 0;
        const gain = effectiveDailyLearningPower * (1 - currentMastery) * (1 / Math.sqrt(node.difficulty));
        const newMastery = prng.clamp(currentMastery + gain, 0, 1);
        updated.knowledgeMastery[node.id] = newMastery;
        updated.memoryRetention[node.id] = newMastery;
      } else {
        const currentMastery = updated.knowledgeMastery[node.id] || 0;
        if (currentMastery > 0) {
          const decayRate = 1 / (node.retentionHalfLifeDays * (1 + (arch.collaborativeLearningPct / 100) * 0.5));
          updated.memoryRetention[node.id] = Math.max(0, (updated.memoryRetention[node.id] || currentMastery) * (1 - decayRate));
        }
      }
    });

    updated.confidence = prng.clamp((avgMastery * 60) + (updated.motivation * 0.2) + (100 - updated.stress) * 0.2, 10, 100);

    return updated;
  }
}
