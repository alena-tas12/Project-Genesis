import type { KnowledgeGraph } from '../types';

export const DEFAULT_KNOWLEDGE_GRAPH: KnowledgeGraph = {
  id: 'standard-curriculum-dag',
  name: 'Unified Multidisciplinary Knowledge Graph',
  nodes: [
    // STEM - Math & Logic
    {
      id: 'math-arithmetic',
      title: 'Basic Arithmetic & Number Theory',
      category: 'STEM',
      difficulty: 1,
      prerequisiteIds: [],
      retentionHalfLifeDays: 120,
      transferFactor: 0.9,
      masteryReq: 0.8
    },
    {
      id: 'math-algebra',
      title: 'Algebraic Structures & Functions',
      category: 'STEM',
      difficulty: 3,
      prerequisiteIds: ['math-arithmetic'],
      retentionHalfLifeDays: 90,
      transferFactor: 0.85,
      masteryReq: 0.75
    },
    {
      id: 'math-calculus',
      title: 'Differential & Integral Calculus',
      category: 'STEM',
      difficulty: 6,
      prerequisiteIds: ['math-algebra'],
      retentionHalfLifeDays: 60,
      transferFactor: 0.8,
      masteryReq: 0.7
    },
    {
      id: 'cs-programming',
      title: 'Algorithmic Thinking & Software Engineering',
      category: 'STEM',
      difficulty: 5,
      prerequisiteIds: ['math-algebra'],
      retentionHalfLifeDays: 90,
      transferFactor: 0.85,
      masteryReq: 0.7
    },
    {
      id: 'cs-ai-ml',
      title: 'Artificial Intelligence & Neural Networks',
      category: 'STEM',
      difficulty: 8,
      prerequisiteIds: ['cs-programming', 'math-calculus'],
      retentionHalfLifeDays: 45,
      transferFactor: 0.9,
      masteryReq: 0.75
    },

    // STEM - Physical Sciences
    {
      id: 'sci-physics-classical',
      title: 'Classical Mechanics & Thermodynamics',
      category: 'STEM',
      difficulty: 5,
      prerequisiteIds: ['math-algebra'],
      retentionHalfLifeDays: 75,
      transferFactor: 0.75,
      masteryReq: 0.7
    },
    {
      id: 'sci-quantum',
      title: 'Quantum Mechanics & Modern Physics',
      category: 'STEM',
      difficulty: 9,
      prerequisiteIds: ['sci-physics-classical', 'math-calculus'],
      retentionHalfLifeDays: 40,
      transferFactor: 0.8,
      masteryReq: 0.7
    },

    // Humanities & Social Sciences
    {
      id: 'hum-literacy',
      title: 'Critical Reading & Textual Analysis',
      category: 'Humanities',
      difficulty: 2,
      prerequisiteIds: [],
      retentionHalfLifeDays: 150,
      transferFactor: 0.8,
      masteryReq: 0.8
    },
    {
      id: 'hum-rhetoric',
      title: 'Rhetoric, Logic & Argumentation',
      category: 'Humanities',
      difficulty: 4,
      prerequisiteIds: ['hum-literacy'],
      retentionHalfLifeDays: 110,
      transferFactor: 0.85,
      masteryReq: 0.75
    },
    {
      id: 'hum-history-global',
      title: 'World History & Institutional Evolution',
      category: 'Social',
      difficulty: 4,
      prerequisiteIds: ['hum-literacy'],
      retentionHalfLifeDays: 90,
      transferFactor: 0.7,
      masteryReq: 0.65
    },
    {
      id: 'soc-economics',
      title: 'Microeconomics, Macroeconomics & Markets',
      category: 'Social',
      difficulty: 6,
      prerequisiteIds: ['math-algebra', 'hum-history-global'],
      retentionHalfLifeDays: 70,
      transferFactor: 0.8,
      masteryReq: 0.7
    },

    // Ethics, Philosophy & Practical Skills
    {
      id: 'eth-ethics-philosophy',
      title: 'Moral Philosophy & Epistemology',
      category: 'Ethics',
      difficulty: 6,
      prerequisiteIds: ['hum-rhetoric'],
      retentionHalfLifeDays: 120,
      transferFactor: 0.85,
      masteryReq: 0.7
    },
    {
      id: 'prac-collaboration',
      title: 'Team Dynamics & Leadership',
      category: 'Practical',
      difficulty: 3,
      prerequisiteIds: [],
      retentionHalfLifeDays: 200,
      transferFactor: 0.9,
      masteryReq: 0.8
    },
    {
      id: 'prac-entrepreneurship',
      title: 'Venture Creation & Product Design',
      category: 'Practical',
      difficulty: 7,
      prerequisiteIds: ['soc-economics', 'prac-collaboration', 'cs-programming'],
      retentionHalfLifeDays: 90,
      transferFactor: 0.85,
      masteryReq: 0.7
    }
  ]
};
