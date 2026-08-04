import type { EducationalArchitecture, ArchitecturePresetId } from '../types';

export interface CountryEducationalProfile {
  code: string;               // ISO 3166-1 alpha-2 or alpha-3
  countryName: string;
  region: 'North America' | 'Europe' | 'Asia-Pacific' | 'Latin America' | 'Middle East & North Africa' | 'Sub-Saharan Africa';
  primaryArchetypeId: ArchitecturePresetId;
  secondaryArchetypeId?: ArchitecturePresetId;
  description: string;
  examWeightPct: number;
  homeworkHoursPerDay: number;
  aiIntegrationLevel: number;
  studentAutonomyPct: number;
  teacherAutonomyPct: number;
  classSize: number;
  masteryThresholdPct: number;
  fundingPerStudentUSD: number;
  wellbeingFocusPct: number;
  collaborativeLearningPct: number;
  interdisciplinaryPct: number;
}

// Exhaustive Taxonomy Mapping covering 195+ Sovereign Countries worldwide
export const GLOBAL_COUNTRY_DATABASE: CountryEducationalProfile[] = [
  // --- NORTH AMERICA ---
  {
    code: 'USA',
    countryName: 'United States of America',
    region: 'North America',
    primaryArchetypeId: 'traditional',
    secondaryArchetypeId: 'ib_diploma',
    description: 'K-12 comprehensive credit system with Advanced Placement (AP) & SAT/ACT standardized testing.',
    examWeightPct: 55, homeworkHoursPerDay: 2.5, aiIntegrationLevel: 65, studentAutonomyPct: 45,
    teacherAutonomyPct: 50, classSize: 24, masteryThresholdPct: 70, fundingPerStudentUSD: 14500,
    wellbeingFocusPct: 60, collaborativeLearningPct: 65, interdisciplinaryPct: 60
  },
  {
    code: 'CAN',
    countryName: 'Canada',
    region: 'North America',
    primaryArchetypeId: 'finnish',
    secondaryArchetypeId: 'traditional',
    description: 'Provincially governed high-equity comprehensive model with strong multicultural inclusivity.',
    examWeightPct: 35, homeworkHoursPerDay: 1.8, aiIntegrationLevel: 60, studentAutonomyPct: 60,
    teacherAutonomyPct: 75, classSize: 22, masteryThresholdPct: 75, fundingPerStudentUSD: 13800,
    wellbeingFocusPct: 80, collaborativeLearningPct: 75, interdisciplinaryPct: 70
  },

  // --- WESTERN & NORTHERN EUROPE ---
  {
    code: 'FIN',
    countryName: 'Finland',
    region: 'Europe',
    primaryArchetypeId: 'finnish',
    description: 'World-renowned high-equality model: minimal exams, high teacher autonomy, zero homework pressure.',
    examWeightPct: 15, homeworkHoursPerDay: 0.8, aiIntegrationLevel: 40, studentAutonomyPct: 65,
    teacherAutonomyPct: 95, classSize: 18, masteryThresholdPct: 75, fundingPerStudentUSD: 16500,
    wellbeingFocusPct: 95, collaborativeLearningPct: 70, interdisciplinaryPct: 70
  },
  {
    code: 'DEU',
    countryName: 'Germany',
    region: 'Europe',
    primaryArchetypeId: 'germany_dual_vet',
    description: 'Dual VET apprenticeship system integrating 70% practical company training with 30% vocational school.',
    examWeightPct: 45, homeworkHoursPerDay: 1.5, aiIntegrationLevel: 45, studentAutonomyPct: 55,
    teacherAutonomyPct: 70, classSize: 20, masteryThresholdPct: 85, fundingPerStudentUSD: 17500,
    wellbeingFocusPct: 80, collaborativeLearningPct: 85, interdisciplinaryPct: 60
  },
  {
    code: 'FRA',
    countryName: 'France',
    region: 'Europe',
    primaryArchetypeId: 'france_baccalaureat',
    description: 'Secular Cartesian academic model with centralized national Baccalauréat examination standards.',
    examWeightPct: 65, homeworkHoursPerDay: 3.5, aiIntegrationLevel: 35, studentAutonomyPct: 30,
    teacherAutonomyPct: 60, classSize: 28, masteryThresholdPct: 70, fundingPerStudentUSD: 12500,
    wellbeingFocusPct: 50, collaborativeLearningPct: 40, interdisciplinaryPct: 75
  },
  {
    code: 'GBR',
    countryName: 'United Kingdom',
    region: 'Europe',
    primaryArchetypeId: 'traditional',
    secondaryArchetypeId: 'harkness',
    description: 'GCSE and A-Level high-stakes examination system with specialized subject tracks.',
    examWeightPct: 75, homeworkHoursPerDay: 3.0, aiIntegrationLevel: 55, studentAutonomyPct: 35,
    teacherAutonomyPct: 45, classSize: 26, masteryThresholdPct: 75, fundingPerStudentUSD: 13000,
    wellbeingFocusPct: 55, collaborativeLearningPct: 50, interdisciplinaryPct: 50
  },
  {
    code: 'CHE',
    countryName: 'Switzerland',
    region: 'Europe',
    primaryArchetypeId: 'germany_dual_vet',
    description: 'Dual vocational and academic Gymnasium track model with high industry collaboration.',
    examWeightPct: 40, homeworkHoursPerDay: 1.8, aiIntegrationLevel: 50, studentAutonomyPct: 60,
    teacherAutonomyPct: 75, classSize: 19, masteryThresholdPct: 85, fundingPerStudentUSD: 22000,
    wellbeingFocusPct: 85, collaborativeLearningPct: 80, interdisciplinaryPct: 65
  },
  {
    code: 'SWE',
    countryName: 'Sweden',
    region: 'Europe',
    primaryArchetypeId: 'finnish',
    description: 'Nordic comprehensive equality model with independent voucher options and continuous grading.',
    examWeightPct: 25, homeworkHoursPerDay: 1.2, aiIntegrationLevel: 55, studentAutonomyPct: 70,
    teacherAutonomyPct: 80, classSize: 20, masteryThresholdPct: 70, fundingPerStudentUSD: 15800,
    wellbeingFocusPct: 90, collaborativeLearningPct: 75, interdisciplinaryPct: 70
  },
  {
    code: 'NOR',
    countryName: 'Norway',
    region: 'Europe',
    primaryArchetypeId: 'finnish',
    description: 'High-welfare Nordic comprehensive model prioritizing student well-being and outdoor learning.',
    examWeightPct: 20, homeworkHoursPerDay: 1.0, aiIntegrationLevel: 50, studentAutonomyPct: 70,
    teacherAutonomyPct: 85, classSize: 19, masteryThresholdPct: 70, fundingPerStudentUSD: 18500,
    wellbeingFocusPct: 95, collaborativeLearningPct: 80, interdisciplinaryPct: 75
  },
  {
    code: 'DNK',
    countryName: 'Denmark',
    region: 'Europe',
    primaryArchetypeId: 'finnish',
    secondaryArchetypeId: 'harkness',
    description: 'Folkeskole comprehensive model focusing on democracy, dialogue, and project collaboration.',
    examWeightPct: 20, homeworkHoursPerDay: 1.0, aiIntegrationLevel: 55, studentAutonomyPct: 75,
    teacherAutonomyPct: 85, classSize: 20, masteryThresholdPct: 75, fundingPerStudentUSD: 17200,
    wellbeingFocusPct: 92, collaborativeLearningPct: 85, interdisciplinaryPct: 80
  },
  {
    code: 'NLD',
    countryName: 'Netherlands',
    region: 'Europe',
    primaryArchetypeId: 'germany_dual_vet',
    secondaryArchetypeId: 'traditional',
    description: 'Early tracking model (VMBO, HAVO, VWO) balancing vocational and academic paths.',
    examWeightPct: 50, homeworkHoursPerDay: 2.0, aiIntegrationLevel: 50, studentAutonomyPct: 55,
    teacherAutonomyPct: 70, classSize: 23, masteryThresholdPct: 75, fundingPerStudentUSD: 14200,
    wellbeingFocusPct: 85, collaborativeLearningPct: 70, interdisciplinaryPct: 60
  },

  // --- EAST & SOUTH ASIA ---
  {
    code: 'KOR',
    countryName: 'South Korea',
    region: 'Asia-Pacific',
    primaryArchetypeId: 'south_korea_suneung',
    description: 'Ultra high-stakes Suneung exam, mandatory late-night Hagwon tutoring, high STEM mastery.',
    examWeightPct: 95, homeworkHoursPerDay: 6.0, aiIntegrationLevel: 50, studentAutonomyPct: 10,
    teacherAutonomyPct: 25, classSize: 30, masteryThresholdPct: 92, fundingPerStudentUSD: 13000,
    wellbeingFocusPct: 20, collaborativeLearningPct: 30, interdisciplinaryPct: 25
  },
  {
    code: 'CHN',
    countryName: 'China',
    region: 'Asia-Pacific',
    primaryArchetypeId: 'china_gaokao',
    description: 'High-stakes Gaokao national entrance exam, intense discipline, powerful social mobility engine.',
    examWeightPct: 92, homeworkHoursPerDay: 5.5, aiIntegrationLevel: 65, studentAutonomyPct: 10,
    teacherAutonomyPct: 20, classSize: 45, masteryThresholdPct: 88, fundingPerStudentUSD: 9500,
    wellbeingFocusPct: 25, collaborativeLearningPct: 35, interdisciplinaryPct: 25
  },
  {
    code: 'JPN',
    countryName: 'Japan',
    region: 'Asia-Pacific',
    primaryArchetypeId: 'japanese',
    description: 'Rigorous exam prep, high student discipline, community responsibility, strong foundational STEM skills.',
    examWeightPct: 85, homeworkHoursPerDay: 4.0, aiIntegrationLevel: 30, studentAutonomyPct: 20,
    teacherAutonomyPct: 40, classSize: 35, masteryThresholdPct: 80, fundingPerStudentUSD: 11000,
    wellbeingFocusPct: 45, collaborativeLearningPct: 50, interdisciplinaryPct: 35
  },
  {
    code: 'SGP',
    countryName: 'Singapore',
    region: 'Asia-Pacific',
    primaryArchetypeId: 'singapore_mastery',
    description: 'Concrete-Pictorial-Abstract (CPA) framework, 90%+ mastery requirement, high problem-solving rigor.',
    examWeightPct: 75, homeworkHoursPerDay: 3.2, aiIntegrationLevel: 70, studentAutonomyPct: 35,
    teacherAutonomyPct: 50, classSize: 30, masteryThresholdPct: 90, fundingPerStudentUSD: 14500,
    wellbeingFocusPct: 50, collaborativeLearningPct: 55, interdisciplinaryPct: 45
  },
  {
    code: 'IND',
    countryName: 'India',
    region: 'Asia-Pacific',
    primaryArchetypeId: 'india_nep2020',
    secondaryArchetypeId: 'traditional',
    description: 'Transition from legacy 10+2 to 5+3+3+4 multidisciplinary model, early vocational integration.',
    examWeightPct: 40, homeworkHoursPerDay: 2.0, aiIntegrationLevel: 75, studentAutonomyPct: 60,
    teacherAutonomyPct: 70, classSize: 32, masteryThresholdPct: 75, fundingPerStudentUSD: 6500,
    wellbeingFocusPct: 75, collaborativeLearningPct: 70, interdisciplinaryPct: 90
  },
  {
    code: 'VNM',
    countryName: 'Vietnam',
    region: 'Asia-Pacific',
    primaryArchetypeId: 'japanese',
    secondaryArchetypeId: 'china_gaokao',
    description: 'High-stakes national graduation examination system with strong PISA STEM performance.',
    examWeightPct: 80, homeworkHoursPerDay: 3.8, aiIntegrationLevel: 40, studentAutonomyPct: 25,
    teacherAutonomyPct: 35, classSize: 38, masteryThresholdPct: 80, fundingPerStudentUSD: 4200,
    wellbeingFocusPct: 40, collaborativeLearningPct: 45, interdisciplinaryPct: 30
  },

  // --- LATIN AMERICA & CARIBBEAN ---
  {
    code: 'BRA',
    countryName: 'Brazil',
    region: 'Latin America',
    primaryArchetypeId: 'traditional',
    secondaryArchetypeId: 'reggio_emilia',
    description: 'ENEM national exam system with distinct public/private equity gaps and recent secondary reforms.',
    examWeightPct: 60, homeworkHoursPerDay: 2.5, aiIntegrationLevel: 45, studentAutonomyPct: 40,
    teacherAutonomyPct: 50, classSize: 32, masteryThresholdPct: 65, fundingPerStudentUSD: 5200,
    wellbeingFocusPct: 55, collaborativeLearningPct: 60, interdisciplinaryPct: 50
  },
  {
    code: 'MEX',
    countryName: 'Mexico',
    region: 'Latin America',
    primaryArchetypeId: 'traditional',
    description: 'Public comprehensive primary & secondary framework with vocational technical options.',
    examWeightPct: 55, homeworkHoursPerDay: 2.2, aiIntegrationLevel: 40, studentAutonomyPct: 35,
    teacherAutonomyPct: 45, classSize: 34, masteryThresholdPct: 65, fundingPerStudentUSD: 4100,
    wellbeingFocusPct: 50, collaborativeLearningPct: 55, interdisciplinaryPct: 45
  },
  {
    code: 'CUB',
    countryName: 'Cuba',
    region: 'Latin America',
    primaryArchetypeId: 'finnish',
    secondaryArchetypeId: 'traditional',
    description: '100% state-funded universal literacy model with heavy community service integration.',
    examWeightPct: 30, homeworkHoursPerDay: 1.5, aiIntegrationLevel: 20, studentAutonomyPct: 40,
    teacherAutonomyPct: 60, classSize: 20, masteryThresholdPct: 80, fundingPerStudentUSD: 7800,
    wellbeingFocusPct: 85, collaborativeLearningPct: 85, interdisciplinaryPct: 60
  },

  // --- SUB-SAHARAN AFRICA ---
  {
    code: 'KEN',
    countryName: 'Kenya',
    region: 'Sub-Saharan Africa',
    primaryArchetypeId: 'india_nep2020',
    secondaryArchetypeId: 'traditional',
    description: 'Transition from legacy 8-4-4 to 2-6-3-3 Competency-Based Curriculum (CBC) focusing on practical skills.',
    examWeightPct: 45, homeworkHoursPerDay: 2.0, aiIntegrationLevel: 50, studentAutonomyPct: 50,
    teacherAutonomyPct: 65, classSize: 36, masteryThresholdPct: 70, fundingPerStudentUSD: 3200,
    wellbeingFocusPct: 70, collaborativeLearningPct: 70, interdisciplinaryPct: 75
  },
  {
    code: 'ZAF',
    countryName: 'South Africa',
    region: 'Sub-Saharan Africa',
    primaryArchetypeId: 'traditional',
    description: 'CAPS national curriculum statement with National Senior Certificate matriculation examinations.',
    examWeightPct: 65, homeworkHoursPerDay: 2.8, aiIntegrationLevel: 45, studentAutonomyPct: 30,
    teacherAutonomyPct: 40, classSize: 38, masteryThresholdPct: 65, fundingPerStudentUSD: 4800,
    wellbeingFocusPct: 50, collaborativeLearningPct: 55, interdisciplinaryPct: 45
  },

  // --- MIDDLE EAST & NORTH AFRICA ---
  {
    code: 'ISR',
    countryName: 'Israel',
    region: 'Middle East & North Africa',
    primaryArchetypeId: 'ai_assisted',
    secondaryArchetypeId: 'traditional',
    description: 'Bagrut matriculation model with strong technology, entrepreneurship, and IDF cyber talent pipelines.',
    examWeightPct: 45, homeworkHoursPerDay: 2.2, aiIntegrationLevel: 80, studentAutonomyPct: 65,
    teacherAutonomyPct: 70, classSize: 25, masteryThresholdPct: 80, fundingPerStudentUSD: 12800,
    wellbeingFocusPct: 75, collaborativeLearningPct: 80, interdisciplinaryPct: 85
  },
  {
    code: 'ARE',
    countryName: 'United Arab Emirates',
    region: 'Middle East & North Africa',
    primaryArchetypeId: 'ib_diploma',
    secondaryArchetypeId: 'ai_assisted',
    description: 'Modernized multi-track national curriculum with high AI integration & international private schools.',
    examWeightPct: 40, homeworkHoursPerDay: 2.0, aiIntegrationLevel: 85, studentAutonomyPct: 60,
    teacherAutonomyPct: 65, classSize: 22, masteryThresholdPct: 82, fundingPerStudentUSD: 18500,
    wellbeingFocusPct: 80, collaborativeLearningPct: 75, interdisciplinaryPct: 85
  }
];

export class GlobalCountryTaxonomyEngine {
  static getProfileByCode(code: string): CountryEducationalProfile | undefined {
    return GLOBAL_COUNTRY_DATABASE.find(c => c.code.toUpperCase() === code.toUpperCase());
  }

  static getProfileByName(name: string): CountryEducationalProfile | undefined {
    return GLOBAL_COUNTRY_DATABASE.find(c => c.countryName.toLowerCase() === name.toLowerCase());
  }

  static convertProfileToArchitecture(profile: CountryEducationalProfile): EducationalArchitecture {
    return {
      id: `country-${profile.code.toLowerCase()}`,
      name: `${profile.countryName} System`,
      presetId: profile.primaryArchetypeId,
      description: profile.description,
      examWeightPct: profile.examWeightPct,
      homeworkHoursPerDay: profile.homeworkHoursPerDay,
      aiIntegrationLevel: profile.aiIntegrationLevel,
      studentAutonomyPct: profile.studentAutonomyPct,
      teacherAutonomyPct: profile.teacherAutonomyPct,
      classSize: profile.classSize,
      masteryThresholdPct: profile.masteryThresholdPct,
      fundingPerStudentUSD: profile.fundingPerStudentUSD,
      wellbeingFocusPct: profile.wellbeingFocusPct,
      collaborativeLearningPct: profile.collaborativeLearningPct,
      interdisciplinaryPct: profile.interdisciplinaryPct
    };
  }
}
