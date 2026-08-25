export interface OfficialStatisticianCompetency {
  domain: string;
  category: 'Data Collection' | 'Big Data & ML' | 'GIS & Spatial Analytics' | 'Cloud Computing' | 'Survey Methodology' | 'Policy Dissemination';
  currentLevelPct: number;    // 0 to 100
  targetRequiredLevelPct: number; // 0 to 100
  gapPct: number;             // target - current
}

export interface IGOTCourseRecommendation {
  courseId: string;
  courseTitle: string;
  domain: string;
  provider: 'MoSPI NSSTA' | 'iGOT Karmayogi' | 'DIID Advanced AI';
  durationHours: number;
  relevanceScorePct: number;
  alignedJobRoles: string[];
}

export interface GeneratedQuizMCQ {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  domainTag: string;
}

export class KarmayogiEngine {
  static assessCompetencyGaps(_agentRole: string): OfficialStatisticianCompetency[] {
    const defaultDomains = [
      { domain: 'Survey Sampling & Design', category: 'Survey Methodology', current: 65, target: 90 },
      { domain: 'National Accounts & Index Numbers', category: 'Data Collection', current: 70, target: 85 },
      { domain: 'AI & Machine Learning for Official Stats', category: 'Big Data & ML', current: 35, target: 80 },
      { domain: 'GIS & Remote Sensing Data Integration', category: 'GIS & Spatial Analytics', current: 40, target: 85 },
      { domain: 'Cloud Data Informatics & Security', category: 'Cloud Computing', current: 45, target: 75 },
      { domain: 'Data Dissemination & Policy Analytics', category: 'Policy Dissemination', current: 60, target: 90 }
    ];

    return defaultDomains.map(d => {
      const gap = Math.max(0, d.target - d.current);
      return {
        domain: d.domain,
        category: d.category as any,
        currentLevelPct: d.current,
        targetRequiredLevelPct: d.target,
        gapPct: gap
      };
    });
  }

  static getRecommendedCourses(_gaps: OfficialStatisticianCompetency[]): IGOTCourseRecommendation[] {
    const courseCatalog: IGOTCourseRecommendation[] = [
      {
        courseId: 'igot-101',
        courseTitle: 'Applied Machine Learning in Official Statistics',
        domain: 'AI & Machine Learning for Official Stats',
        provider: 'DIID Advanced AI',
        durationHours: 24,
        relevanceScorePct: 96,
        alignedJobRoles: ['Statistical Officer', 'Data Scientist', 'Policy Analyst']
      },
      {
        courseId: 'igot-102',
        courseTitle: 'GIS Spatial Analytics for Census & Economic Surveys',
        domain: 'GIS & Remote Sensing Data Integration',
        provider: 'MoSPI NSSTA',
        durationHours: 18,
        relevanceScorePct: 92,
        alignedJobRoles: ['Survey Director', 'Field Statistician', 'GIS Specialist']
      },
      {
        courseId: 'igot-103',
        courseTitle: 'Modern Sampling Methodologies & Big Data Analytics',
        domain: 'Survey Sampling & Design',
        provider: 'iGOT Karmayogi',
        durationHours: 30,
        relevanceScorePct: 88,
        alignedJobRoles: ['Deputy Director General', 'Statistical Officer']
      },
      {
        courseId: 'igot-104',
        courseTitle: 'Cloud Data Architecture & Open API Dissemination',
        domain: 'Cloud Data Informatics & Security',
        provider: 'iGOT Karmayogi',
        durationHours: 15,
        relevanceScorePct: 85,
        alignedJobRoles: ['IT Director', 'Data Manager']
      }
    ];

    return courseCatalog;
  }

  static generateMCQsFromText(_learningMaterialText: string): GeneratedQuizMCQ[] {
    // Parser to convert uploaded learning text into structured MCQs for MoSPI Capacity Building
    return [
      {
        id: 'mcq-1',
        question: 'Which sampling technique is most effective for reducing variance in heterogeneous national economic surveys?',
        options: [
          'Simple Random Sampling without replacement',
          'Stratified Random Sampling with proportional allocation',
          'Convenience Cluster Sampling',
          'Systematic Unweighted Sampling'
        ],
        correctOptionIndex: 1,
        explanation: 'Stratified Random Sampling partitions heterogeneous populations into homogeneous strata, significantly minimizing sampling error variance.',
        difficulty: 'Intermediate',
        domainTag: 'Survey Sampling & Design'
      },
      {
        id: 'mcq-2',
        question: 'In official statistical dissemination, what primary advantage does satellite GIS remote sensing data provide?',
        options: [
          'Eliminates the need for field enumerators completely',
          'Provides high-frequency spatial estimation of crop yield and urban expansion',
          'Replaces national consumer price index calculations',
          'Guarantees zero non-response bias in household surveys'
        ],
        correctOptionIndex: 1,
        explanation: 'Remote sensing GIS data offers real-time spatial estimates for agricultural and land use statistics.',
        difficulty: 'Advanced',
        domainTag: 'GIS & Spatial Analytics'
      },
      {
        id: 'mcq-3',
        question: 'According to MoSPI DIID standards, how does AI-assisted automated data validation improve survey processing?',
        options: [
          'By automatically deleting incomplete survey forms',
          'By detecting logical inconsistencies, outlier responses, and imputation anomalies in real-time',
          'By bypassing confidentiality protection protocols',
          'By converting all qualitative responses into fixed integer ranks'
        ],
        correctOptionIndex: 1,
        explanation: 'AI validation algorithms flag statistical anomalies and impute missing data while maintaining survey integrity.',
        difficulty: 'Advanced',
        domainTag: 'AI & Machine Learning for Official Stats'
      }
    ];
  }
}
