import type { WorldState, TimeSeriesPoint, EducationalArchitecture, DailyRoutinePeriod } from '../types';
import { PRNG } from '../prng';
import { StudentEngine } from '../agents/studentEngine';
import { TeacherEngine } from '../agents/teacherEngine';
import { EconomyEngine } from '../macro/economyEngine';
import { SocietyEngine } from '../macro/societyEngine';
import { DEFAULT_KNOWLEDGE_GRAPH } from '../knowledge/presetGraphs';
import { PRESET_ARCHITECTURES } from '../architecture/presetArchitectures';

export class Simulator {
  static createWorld(
    name: string,
    arch: EducationalArchitecture = PRESET_ARCHITECTURES.traditional,
    studentCount: number = 40,
    seed: number = 42
  ): WorldState {
    const prng = new PRNG(seed);
    const knowledgeGraph = DEFAULT_KNOWLEDGE_GRAPH;
    const students = StudentEngine.generatePopulation(studentCount, knowledgeGraph, prng);
    const teachers = TeacherEngine.generateTeachers(Math.max(2, Math.ceil(studentCount / arch.classSize)), prng);
    const economy = EconomyEngine.initEconomy();
    const society = SocietyEngine.initSociety();

    return {
      id: `world-${Math.random().toString(36).substring(2, 9)}`,
      name,
      architecture: arch,
      day: 1,
      month: 1,
      year: 2026,
      seed,
      timeOfDay: '08:30 AM',
      currentRoutinePeriod: 'instruction_1',
      students,
      teachers,
      knowledgeGraph,
      economy,
      society,
      history: []
    };
  }

  static tickDay(world: WorldState): WorldState {
    const prng = new PRNG(world.seed + world.day);

    const routineCycle: Array<{ period: DailyRoutinePeriod; timeStr: string }> = [
      { period: 'commute_morning', timeStr: '07:45 AM' },
      { period: 'instruction_1', timeStr: '09:00 AM' },
      { period: 'recess_break', timeStr: '10:30 AM' },
      { period: 'instruction_2', timeStr: '11:15 AM' },
      { period: 'lunch_break', timeStr: '12:45 PM' },
      { period: 'study_period', timeStr: '02:00 PM' },
      { period: 'commute_evening', timeStr: '04:15 PM' }
    ];

    // Cycle routine period based on day tick
    const currentCycleObj = routineCycle[world.day % routineCycle.length];
    const currentRoutinePeriod = currentCycleObj.period;
    const timeOfDay = currentCycleObj.timeStr;

    const avgTeacherQuality = world.teachers.reduce(
      (sum, t) => sum + (t.teachingAbility * 0.6 + t.subjectMastery * 0.4), 0
    ) / (world.teachers.length || 1);

    // 1. Update Student Agents with Routine & Commute Parameters
    const updatedStudents = world.students.map(student =>
      StudentEngine.updateStudentDay(student, world.architecture, world.knowledgeGraph, avgTeacherQuality, prng, currentRoutinePeriod)
    );

    // 2. Update Teacher Agents
    const updatedTeachers = world.teachers.map(teacher =>
      TeacherEngine.updateTeacherDay(teacher, world.architecture, prng)
    );

    // 3. Update Macro Economy & Society
    const updatedEconomy = EconomyEngine.updateEconomy(world.economy, updatedStudents, world.architecture);
    const updatedSociety = SocietyEngine.updateSociety(world.society, updatedStudents, updatedTeachers, world.architecture);

    let newDay = world.day + 1;
    let newMonth = world.month;
    let newYear = world.year;

    if (newDay > 30) {
      newDay = 1;
      newMonth += 1;
      if (newMonth > 12) {
        newMonth = 1;
        newYear += 1;
      }
    }

    const history = [...world.history];
    if (world.day % 5 === 0 || world.day === 1) {
      const studentCount = updatedStudents.length || 1;
      
      let totalMasterySum = 0;
      let nodeCount = world.knowledgeGraph.nodes.length || 1;

      updatedStudents.forEach(s => {
        const masteryValues = Object.values(s.knowledgeMastery);
        const studentAvg = masteryValues.reduce((a, b) => a + b, 0) / nodeCount;
        totalMasterySum += studentAvg;
      });

      const avgKnowledgePct = Math.round((totalMasterySum / studentCount) * 100);
      const avgStress = Math.round(updatedStudents.reduce((sum, s) => sum + s.stress, 0) / studentCount);
      const avgMotivation = Math.round(updatedStudents.reduce((sum, s) => sum + s.motivation, 0) / studentCount);
      const avgBurnout = Math.round(updatedStudents.reduce((sum, s) => sum + s.burnout, 0) / studentCount);

      const snapshot: TimeSeriesPoint = {
        day: world.day,
        year: newYear,
        avgKnowledgePct,
        avgStress,
        avgMotivation,
        avgBurnout,
        gdpProxy: updatedEconomy.gdpProxy,
        happinessIndex: updatedSociety.happinessIndex,
        innovationIndex: updatedEconomy.innovationIndex,
        socialMobilityIndex: updatedSociety.socialMobilityIndex
      };

      history.push(snapshot);
      if (history.length > 150) {
        history.shift();
      }
    }

    return {
      ...world,
      day: newDay,
      month: newMonth,
      year: newYear,
      timeOfDay,
      currentRoutinePeriod,
      students: updatedStudents,
      teachers: updatedTeachers,
      economy: updatedEconomy,
      society: updatedSociety,
      history
    };
  }

  static fastForward(world: WorldState, days: number): WorldState {
    let current = world;
    for (let i = 0; i < days; i++) {
      current = Simulator.tickDay(current);
    }
    return current;
  }
}
