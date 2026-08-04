export type ArchitecturePresetId = 
  | 'traditional' 
  | 'montessori' 
  | 'finnish' 
  | 'japanese' 
  | 'ai_assisted' 
  | 'waldorf' 
  | 'reggio_emilia' 
  | 'ib_diploma' 
  | 'harkness' 
  | 'sudbury' 
  | 'singapore_mastery' 
  | 'prussian_industrial'
  | 'south_korea_suneung'
  | 'germany_dual_vet'
  | 'france_baccalaureat'
  | 'china_gaokao'
  | 'india_nep2020'
  | 'custom';

export type EducationLifeStage = 
  | 'early_childhood'      // Ages 0-5
  | 'primary'              // Ages 6-14
  | 'secondary'            // Ages 15-18
  | 'undergraduate'        // Ages 18-22
  | 'postgraduate'         // Ages 22-26
  | 'doctoral'             // Ages 26-32
  | 'lifelong_upskilling'; // Ages 32-75

export type DegreeLevel = 
  | 'None'
  | 'HighSchoolDiploma'
  | 'VocationalCertificate'
  | 'AssociatesDegree'
  | 'BachelorsDegree'
  | 'MastersDegree'
  | 'DoctoratePhD'
  | 'ExecutiveMicroCredential';

export interface EducationalArchitecture {
  id: string;
  name: string;
  presetId: ArchitecturePresetId;
  description: string;
  
  // Core Policy Parameters
  examWeightPct: number;              // 0 to 100
  homeworkHoursPerDay: number;       // 0 to 8
  aiIntegrationLevel: number;        // 0 (banned) to 100 (full AI tutor)
  studentAutonomyPct: number;        // 0 (rigid schedule) to 100 (self-directed)
  teacherAutonomyPct: number;        // 0 (prescribed curriculum) to 100 (full freedom)
  classSize: number;                 // 5 to 50
  masteryThresholdPct: number;      // 50% to 95%
  fundingPerStudentUSD: number;     // e.g. 2000 to 25000
  wellbeingFocusPct: number;         // 0 to 100
  collaborativeLearningPct: number;  // 0 to 100
  interdisciplinaryPct: number;      // 0 to 100
}

export interface KnowledgeNode {
  id: string;
  title: string;
  category: 'STEM' | 'Humanities' | 'Social' | 'Arts' | 'Practical' | 'Ethics';
  difficulty: number;                // 1 to 10
  prerequisiteIds: string[];         // Directed graph edges
  retentionHalfLifeDays: number;     // Ebbinghaus memory decay parameter (e.g. 30 days)
  transferFactor: number;            // How much mastering this boosts related nodes (0 to 1)
  masteryReq: number;                // 0 to 1
}

export interface KnowledgeGraph {
  id: string;
  name: string;
  nodes: KnowledgeNode[];
}

export interface StudentAgent {
  id: string;
  name: string;
  age: number;
  gradeLevel: number;
  
  // Lifelong Continuum & Degree Pipeline
  lifeStage: EducationLifeStage;
  degreeLevel: DegreeLevel;
  entranceExamScore: number;          // Gatekeeper exam rating (0 to 100)
  
  // Geographical & Commute Factors
  commuteDistanceKm: number;
  commuteTimeMins: number;
  transportMode: 'walk' | 'bike' | 'bus' | 'car';
  geoCoordinates: { x: number; y: number }; // Offset relative to campus center
  
  // Knowledge & Memory
  knowledgeMastery: Record<string, number>; // nodeId -> mastery (0 to 1)
  memoryRetention: Record<string, number>;  // nodeId -> retention decay state (0 to 1)
  
  // Psychological & Biological Dynamic States (0 to 100)
  curiosity: number;
  stress: number;
  motivation: number;
  discipline: number;
  confidence: number;
  health: number;
  burnout: number;
  energy: number;                           // Daily stamina / fatigue level (0 to 100)
  socialSat: number;                        // Social interaction satisfaction from breaks (0 to 100)
  
  // Social & Career
  relationships: number;                    // Peer connectivity strength (0 to 100)
  careerGoal: string;
  inequalityFactor: number;                // Socio-economic starting baseline (0 to 100)
}

export interface TeacherAgent {
  id: string;
  name: string;
  teachingAbility: number;                  // 0 to 100
  subjectMastery: number;                 // 0 to 100
  bias: number;                           // 0 to 100 (unconscious bias impact)
  mentoringCapacity: number;              // 0 to 100
  burnout: number;                        // 0 to 100
  researchOutput: number;                 // 0 to 100
  experienceYears: number;
  adaptability: number;                   // 0 to 100
}

export interface EconomyState {
  jobsAvailable: number;
  skillDemand: Record<string, number>;    // category -> demand score (0 to 100)
  innovationIndex: number;                // 0 to 100
  gdpProxy: number;                       // Nominal GDP per capita proxy ($)
  entrepreneurshipRate: number;           // % of population founding ventures
  hiringRate: number;                     // % job placement rate
  automationResilience: number;           // 0 to 100
}

export interface SocietyState {
  happinessIndex: number;                // 0 to 100
  wellbeingIndex: number;                // 0 to 100
  crimeProxy: number;                    // 0 to 100 (lower is better)
  researchBreakthroughs: number;         // Cumulative count
  socialCohesion: number;                // 0 to 100
  socialMobilityIndex: number;           // 0 to 100
}

export interface TimeSeriesPoint {
  day: number;
  year: number;
  avgKnowledgePct: number;
  avgStress: number;
  avgMotivation: number;
  avgBurnout: number;
  gdpProxy: number;
  happinessIndex: number;
  innovationIndex: number;
  socialMobilityIndex: number;
}

export type DailyRoutinePeriod = 
  | 'commute_morning'
  | 'instruction_1'
  | 'recess_break'
  | 'instruction_2'
  | 'lunch_break'
  | 'study_period'
  | 'commute_evening';

export interface WorldState {
  id: string;
  name: string;
  architecture: EducationalArchitecture;
  day: number;
  month: number;
  year: number;
  seed: number;
  
  // Daily Schedule & Routines
  timeOfDay: string;                       // e.g. "12:30 PM"
  currentRoutinePeriod: DailyRoutinePeriod;
  
  students: StudentAgent[];
  teachers: TeacherAgent[];
  knowledgeGraph: KnowledgeGraph;
  economy: EconomyState;
  society: SocietyState;
  
  history: TimeSeriesPoint[];
}

export interface FrameworkResult {
  id: string;
  title: string;
  summary: string;
  keyInsights: string[];
  metrics: Record<string, string | number>;
  details: string;
}

export interface ResearchFrameworkPackage {
  fiveQuestions: FrameworkResult;
  firstPrinciples: FrameworkResult;
  dependencyAnalysis: FrameworkResult;
  contextSurvival: FrameworkResult;
  environmentAnalysis: FrameworkResult;
  incentiveAnalysis: FrameworkResult;
  failureAnalysis: FrameworkResult;
  emergenceAnalysis: FrameworkResult;
}
