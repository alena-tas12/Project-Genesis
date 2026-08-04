import type { TeacherAgent, EducationalArchitecture } from '../types';
import { PRNG } from '../prng';

export class TeacherEngine {
  static generateTeachers(count: number, prng: PRNG): TeacherAgent[] {
    const teacherNames = [
      'Dr. Robert Vance', 'Prof. Sarah Jenkins', 'Amira Al-Mansoor', 'Kenji Sato',
      'Maria Gonzales', 'David Sterling', 'Li Wei', 'Hannah Arendt'
    ];

    const teachers: TeacherAgent[] = [];
    for (let i = 0; i < count; i++) {
      teachers.push({
        id: `teacher-${i + 1}`,
        name: teacherNames[i % teacherNames.length],
        teachingAbility: prng.clamp(prng.gaussian(75, 12), 40, 98),
        subjectMastery: prng.clamp(prng.gaussian(85, 10), 50, 99),
        bias: prng.clamp(prng.gaussian(15, 8), 0, 45),
        mentoringCapacity: prng.clamp(prng.gaussian(70, 15), 30, 95),
        burnout: prng.clamp(prng.gaussian(20, 10), 0, 50),
        researchOutput: prng.clamp(prng.gaussian(60, 20), 10, 95),
        experienceYears: prng.intRange(3, 28),
        adaptability: prng.clamp(prng.gaussian(70, 15), 30, 95)
      });
    }
    return teachers;
  }

  static updateTeacherDay(
    teacher: TeacherAgent,
    arch: EducationalArchitecture,
    prng: PRNG
  ): TeacherAgent {
    const updated = { ...teacher };

    // Burnout accumulates with large class size & low teacher autonomy
    const workloadStress = (arch.classSize / 30) * 0.15 + (100 - arch.teacherAutonomyPct) * 0.001;
    const fundingSupport = (arch.fundingPerStudentUSD / 15000) * 0.05;

    updated.burnout = prng.clamp(updated.burnout + workloadStress - fundingSupport + prng.range(-0.1, 0.1), 0, 100);

    // Adaptability & Research output
    if (arch.teacherAutonomyPct > 70) {
      updated.researchOutput = prng.clamp(updated.researchOutput + 0.05, 0, 100);
      updated.adaptability = prng.clamp(updated.adaptability + 0.03, 0, 100);
    }

    return updated;
  }
}
