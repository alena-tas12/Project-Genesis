export type MoSPICadre = 'ISS' | 'SSS' | 'FOD' | 'SDRD' | 'DPD' | 'DIID';

export type BloomsLevel = 'Remembering' | 'Understanding' | 'Applying' | 'Analyzing' | 'Evaluating';

export interface CompetencyDimension {
  id: string;
  name: string;
  category: 'Domain Statistics' | 'Technical & Data Science' | 'Behavioral & Governance';
  description: string;
  currentScorePct: number;
  requiredTargetScorePct: number;
  gapPct: number;
  bloomsLevelTarget: BloomsLevel;
}

export interface MoSPIOfficialProfile {
  id: string;
  name: string;
  designation: string;
  cadre: MoSPICadre;
  postedDivision: string;
  yearsOfService: number;
  competencies: CompetencyDimension[];
  recommendedPathwayId: string;
  overallReadinessIndexPct: number;
}

export interface IGOTCourseSchema {
  courseId: string;
  title: string;
  provider: 'MoSPI NSSTA' | 'iGOT Karmayogi National Portal' | 'DIID Advanced Informatics';
  cadreTarget: MoSPICadre[];
  competencyDomain: string;
  durationHours: number;
  modulesCount: number;
  bloomsFocus: BloomsLevel;
  enrolledOfficialsCount: number;
  completionRatePct: number;
}

export interface AdvancedGeneratedMCQ {
  id: string;
  questionText: string;
  options: { label: string; text: string; isCorrect: boolean }[];
  explanation: string;
  bloomsLevel: BloomsLevel;
  domainCategory: string;
  distractorFallacyType: string;
  difficultyRating: number; // 1 to 5
}

export class MoSPICompetencyFramework {
  static getCadresList(): { cadre: MoSPICadre; name: string; description: string }[] {
    return [
      { cadre: 'ISS', name: 'Indian Statistical Service', description: 'Senior statistical policy makers, survey designers, and national accounts architects.' },
      { cadre: 'SSS', name: 'Subordinate Statistical Service', description: 'Core statistical officers executing field data verification, index compilation, and processing.' },
      { cadre: 'FOD', name: 'Field Operations Division', description: 'Primary field survey enumerators and regional data collection supervisors.' },
      { cadre: 'SDRD', name: 'Survey Design & Research Division', description: 'Sampling design specialists, questionnaire architects, and methodological researchers.' },
      { cadre: 'DPD', name: 'Data Processing Division', description: 'Large-scale electronic survey data validation, tabulation, and database management.' },
      { cadre: 'DIID', name: 'Data Informatics & Innovation Division', description: 'AI/ML adoption, GIS spatial analytics, cloud infrastructure, and open data APIs.' }
    ];
  }

  static getSampleMoSPIOfficials(): MoSPIOfficialProfile[] {
    return [
      {
        id: 'off-101',
        name: 'Dr. Rajesh Sharma, ISS',
        designation: 'Deputy Director General',
        cadre: 'ISS',
        postedDivision: 'SDRD Kolkata',
        yearsOfService: 16,
        overallReadinessIndexPct: 78,
        recommendedPathwayId: 'path-iss-ai-gis',
        competencies: [
          { id: 'c1', name: 'National Accounts & GDP Computation', category: 'Domain Statistics', description: 'SNA 2008 standards & Gross Value Added estimation', currentScorePct: 92, requiredTargetScorePct: 95, gapPct: 3, bloomsLevelTarget: 'Evaluating' },
          { id: 'c2', name: 'AI & ML for Survey Imputation', category: 'Technical & Data Science', description: 'Random Forests & Neural Nets for missing survey data imputation', currentScorePct: 45, requiredTargetScorePct: 85, gapPct: 40, bloomsLevelTarget: 'Applying' },
          { id: 'c3', name: 'GIS Spatial Remote Sensing', category: 'Technical & Data Science', description: 'Integrating QGIS & satellite imagery into agricultural crop yield estimation', currentScorePct: 38, requiredTargetScorePct: 80, gapPct: 42, bloomsLevelTarget: 'Applying' },
          { id: 'c4', name: 'Big Data Cloud Pipelines', category: 'Technical & Data Science', description: 'Spark/Hadoop infrastructure for real-time Consumer Price Index ingestion', currentScorePct: 50, requiredTargetScorePct: 75, gapPct: 25, bloomsLevelTarget: 'Understanding' }
        ]
      },
      {
        id: 'off-102',
        name: 'Priya Sundaram, SSS',
        designation: 'Senior Statistical Officer',
        cadre: 'SSS',
        postedDivision: 'FOD Regional Office Chennai',
        yearsOfService: 8,
        overallReadinessIndexPct: 64,
        recommendedPathwayId: 'path-sss-field-digital',
        competencies: [
          { id: 'c5', name: 'CAPI Digital Data Collection', category: 'Domain Statistics', description: 'Computer-Assisted Personal Interviewing handheld survey validation', currentScorePct: 80, requiredTargetScorePct: 90, gapPct: 10, bloomsLevelTarget: 'Applying' },
          { id: 'c6', name: 'Automated Anomaly & Outlier Detection', category: 'Technical & Data Science', description: 'Python Isolation Forests for flagging falsified or erroneous survey rows', currentScorePct: 30, requiredTargetScorePct: 75, gapPct: 45, bloomsLevelTarget: 'Applying' },
          { id: 'c7', name: 'Industrial Statistics (ASI / IIP)', category: 'Domain Statistics', description: 'Annual Survey of Industries & Index of Industrial Production compilation', currentScorePct: 75, requiredTargetScorePct: 85, gapPct: 10, bloomsLevelTarget: 'Analyzing' }
        ]
      }
    ];
  }

  static getIGOTCourseCatalog(): IGOTCourseSchema[] {
    return [
      {
        courseId: 'igot-mospi-401',
        title: 'Advanced AI & Machine Learning for Official Survey Imputation',
        provider: 'DIID Advanced Informatics',
        cadreTarget: ['ISS', 'SDRD', 'DPD', 'DIID'],
        competencyDomain: 'AI & ML for Survey Imputation',
        durationHours: 36,
        modulesCount: 8,
        bloomsFocus: 'Applying',
        enrolledOfficialsCount: 1420,
        completionRatePct: 84
      },
      {
        courseId: 'igot-mospi-402',
        title: 'GIS Remote Sensing & Spatial Sampling for National Surveys',
        provider: 'MoSPI NSSTA',
        cadreTarget: ['ISS', 'SSS', 'FOD', 'SDRD'],
        competencyDomain: 'GIS Spatial Remote Sensing',
        durationHours: 24,
        modulesCount: 6,
        bloomsFocus: 'Analyzing',
        enrolledOfficialsCount: 2150,
        completionRatePct: 91
      },
      {
        courseId: 'igot-mospi-403',
        title: 'CAPI Mobile Survey Validation & Real-Time Anomaly Flagging',
        provider: 'iGOT Karmayogi National Portal',
        cadreTarget: ['SSS', 'FOD', 'DPD'],
        competencyDomain: 'Automated Anomaly & Outlier Detection',
        durationHours: 18,
        modulesCount: 5,
        bloomsFocus: 'Applying',
        enrolledOfficialsCount: 4800,
        completionRatePct: 89
      }
    ];
  }

  static parseDocumentAndGenerateNLPQuizzes(_textMaterial: string, numQuestions: number = 4): AdvancedGeneratedMCQ[] {
    // Advanced NLP Parser simulating Bloom's Taxonomy & Distractor Fallacy Algorithms for MoSPI Learning Materials
    const baseQuizzes: AdvancedGeneratedMCQ[] = [
      {
        id: 'nlp-mcq-1',
        questionText: 'In MoSPI NSS rounds, when stratified multi-stage sampling experiences non-response bias in urban strata, which estimation technique minimizes mean squared error?',
        options: [
          { label: 'A', text: 'Unweighted Horvitz-Thompson Estimator without adjustment', isCorrect: false },
          { label: 'B', text: 'Propensity score re-weighting combined with Machine Learning KNN imputation', isCorrect: true },
          { label: 'C', text: 'Complete deletion of non-responding urban sampling units', isCorrect: false },
          { label: 'D', text: 'Substitution with rural adjacent sample responses', isCorrect: false }
        ],
        explanation: 'Propensity score re-weighting paired with KNN imputation adjusts for auxiliary covariate distribution differences in urban strata without introducing systemic selection bias.',
        bloomsLevel: 'Evaluating',
        domainCategory: 'Survey Methodology & AI Imputation',
        distractorFallacyType: 'Deletion Fallacy & Geographical Substitution Error',
        difficultyRating: 4
      },
      {
        id: 'nlp-mcq-2',
        questionText: 'According to System of National Accounts (SNA 2008) guidelines used by MoSPI, how is Gross Value Added (GVA) at basic prices derived from GDP at market prices?',
        options: [
          { label: 'A', text: 'GVA = GDP + Product Taxes - Product Subsidies', isCorrect: false },
          { label: 'B', text: 'GVA = GDP - Product Taxes + Product Subsidies', isCorrect: true },
          { label: 'C', text: 'GVA = GDP + Production Subsidies - Intermediate Consumption', isCorrect: false },
          { label: 'D', text: 'GVA = GDP - Consumption of Fixed Capital', isCorrect: false }
        ],
        explanation: 'GVA at basic prices equals GDP at market prices minus net product taxes (Product Taxes minus Product Subsidies).',
        bloomsLevel: 'Analyzing',
        domainCategory: 'National Accounts',
        distractorFallacyType: 'Sign Inversion & Depreciation Confusion',
        difficultyRating: 3
      },
      {
        id: 'nlp-mcq-3',
        questionText: 'When processing CAPI survey telemetry in MoSPI DIID cloud databases, which statistical anomaly detection method flags falsified enumerator timestamps?',
        options: [
          { label: 'A', text: 'Benford Law Distribution Test on response interval digits paired with Isolation Forests', isCorrect: true },
          { label: 'B', text: 'Simple Moving Average of survey completion time', isCorrect: false },
          { label: 'C', text: 'Pearson correlation between enumerator age and response count', isCorrect: false },
          { label: 'D', text: 'Linear regression against national average household income', isCorrect: false }
        ],
        explanation: 'Benford Law analysis flags unnatural digit distributions in entry timestamps while Isolation Forests detect multivariate operational outliers.',
        bloomsLevel: 'Applying',
        domainCategory: 'Data Informatics & Anomaly Detection',
        distractorFallacyType: 'Irrelevant Demographic Correlation',
        difficultyRating: 5
      },
      {
        id: 'nlp-mcq-4',
        questionText: 'How does incorporating Sentinel-2 Satellite Multispectral GIS Imagery assist the Ministry in estimating agricultural GDP prior to harvest?',
        options: [
          { label: 'A', text: 'By calculating Normalized Difference Vegetation Index (NDVI) anomaly maps linked to crop yield models', isCorrect: true },
          { label: 'B', text: 'By measuring soil temperature via microwave thermal sensors only', isCorrect: false },
          { label: 'C', text: 'By replacing all rural household consumption surveys', isCorrect: false },
          { label: 'D', text: 'By counting individual farm workers automatically', isCorrect: false }
        ],
        explanation: 'NDVI vegetation vigor time-series from Sentinel-2 imagery provides robust early-season crop acreage and yield forecasts for agricultural GVA computation.',
        bloomsLevel: 'Understanding',
        domainCategory: 'GIS & Spatial Analytics',
        distractorFallacyType: 'Over-extrapolation of Remote Sensing Capabilities',
        difficultyRating: 3
      }
    ];

    return baseQuizzes.slice(0, numQuestions);
  }
}
