/**
 * Project Genesis — Philosophical Registry
 * 
 * Philosophy is a parallel knowledge system, not reduced to numbers.
 * This module defines positions, questions, empirical connections,
 * and tensions between philosophical frameworks.
 */

// ─────────────────────────────────────────────────────────────
// PHILOSOPHICAL POSITIONS
// ─────────────────────────────────────────────────────────────

export type PhilosophicalDomain =
  | 'Free_Will'
  | 'Agency'
  | 'Identity'
  | 'Consciousness'
  | 'Meaning'
  | 'Ethics'
  | 'Epistemology'
  | 'Phenomenology'
  | 'Philosophy_of_Mind'
  | 'Philosophy_of_Science'
  | 'Philosophy_of_Education';

export interface PhilosophicalPosition {
  id: string;
  name: string;
  domain: PhilosophicalDomain;
  description: string;
  keyArguments: string[];
  keyProponents: string[];
  empiricalConnections: string[];  // IDs of mechanisms/variables this connects to
  tensions: string[];              // IDs of conflicting positions
  implications: string[];          // What follows from this position
}

// ─────────────────────────────────────────────────────────────
// PHILOSOPHICAL QUESTIONS
// ─────────────────────────────────────────────────────────────

export interface PhilosophicalQuestion {
  id: string;
  question: string;
  domain: PhilosophicalDomain;
  positions: PhilosophicalPosition[];
  empiricalOperationalizations: {
    psychological: string[];
    neuroscientific: string[];
    behavioural: string[];
    educational: string[];
  };
  genesisImplications: string[];  // How this question affects Genesis modelling decisions
}

// ─────────────────────────────────────────────────────────────
// FOUNDATIONAL PHILOSOPHICAL POSITIONS
// ─────────────────────────────────────────────────────────────

export const FOUNDATIONAL_POSITIONS: PhilosophicalPosition[] = [
  // Free Will
  {
    id: 'phil_libertarian_fw',
    name: 'Libertarian Free Will',
    domain: 'Free_Will',
    description: 'Agents have genuine causal power to initiate actions not fully determined by prior causes.',
    keyArguments: ['Agent causation', 'Phenomenology of choice', 'Moral responsibility requires alternatives'],
    keyProponents: ['Robert Kane', 'Timothy O\'Connor'],
    empiricalConnections: ['decision_making', 'executive_control'],
    tensions: ['phil_hard_determinism'],
    implications: ['Genesis agents must have genuine choice points, not merely pseudo-random selection'],
  },
  {
    id: 'phil_compatibilism',
    name: 'Compatibilism',
    domain: 'Free_Will',
    description: 'Free will is compatible with determinism. An action is free if it flows from the agent\'s own desires and reasoning, even if those are determined.',
    keyArguments: ['Freedom as acting on one\'s own reasons', 'Reactive attitudes require responsibility', 'Determinism does not undermine agency'],
    keyProponents: ['Daniel Dennett', 'Harry Frankfurt', 'P. F. Strawson'],
    empiricalConnections: ['motivation', 'self_regulation', 'executive_control'],
    tensions: ['phil_libertarian_fw', 'phil_hard_determinism'],
    implications: ['Genesis can model agents as determined systems while still attributing meaningful agency'],
  },
  {
    id: 'phil_hard_determinism',
    name: 'Hard Determinism',
    domain: 'Free_Will',
    description: 'All events, including human decisions, are fully determined by prior causes. Free will is an illusion.',
    keyArguments: ['Causal closure of physics', 'Neuroscience of decision-making (Libet)', 'No room for uncaused causes'],
    keyProponents: ['Derk Pereboom', 'Sam Harris'],
    empiricalConnections: ['neural_networks', 'reward_systems', 'predictive_processing'],
    tensions: ['phil_libertarian_fw', 'phil_compatibilism'],
    implications: ['Genesis simulations are inherently deterministic (given seed); this position is the default computational assumption'],
  },

  // Agency
  {
    id: 'phil_embodied_agency',
    name: 'Embodied Agency',
    domain: 'Agency',
    description: 'Agency is grounded in bodily experience, not abstract computation. The body shapes perception, cognition, and action.',
    keyArguments: ['Sensorimotor coupling', 'Enactivism', 'Somatic markers (Damasio)'],
    keyProponents: ['Evan Thompson', 'Francisco Varela', 'Antonio Damasio'],
    empiricalConnections: ['interoception', 'arousal', 'emotion_regulation', 'allostatic_load'],
    tensions: ['phil_computational_mind'],
    implications: ['Genesis must model physiological state as constitutive of cognition, not merely an input to it'],
  },
  {
    id: 'phil_computational_mind',
    name: 'Computational Theory of Mind',
    domain: 'Philosophy_of_Mind',
    description: 'The mind is an information-processing system. Mental states are computational states.',
    keyArguments: ['Turing computation', 'Fodor\'s language of thought', 'Functionalism'],
    keyProponents: ['Jerry Fodor', 'Hilary Putnam', 'Alan Turing'],
    empiricalConnections: ['working_memory', 'attention', 'reasoning', 'decision_making'],
    tensions: ['phil_embodied_agency'],
    implications: ['Genesis can represent cognition as computation, but must acknowledge the embodiment critique'],
  },

  // Identity
  {
    id: 'phil_narrative_identity',
    name: 'Narrative Identity',
    domain: 'Identity',
    description: 'Personal identity is constituted by the stories a person tells about themselves. Identity is an ongoing narrative, not a fixed essence.',
    keyArguments: ['Life as story', 'Temporal self-constitution', 'Meaning through narrative coherence'],
    keyProponents: ['Paul Ricoeur', 'Dan McAdams', 'Charles Taylor'],
    empiricalConnections: ['self_concept', 'identity', 'emotional_memory', 'psychological_development'],
    tensions: [],
    implications: ['Genesis agents could have narrative-based identity rather than static trait vectors'],
  },

  // Meaning
  {
    id: 'phil_existential_meaning',
    name: 'Existential Meaning-Making',
    domain: 'Meaning',
    description: 'Meaning is not given but constructed through engagement with the world, relationships, and projects.',
    keyArguments: ['Existence precedes essence', 'Authenticity', 'Meaning through commitment'],
    keyProponents: ['Jean-Paul Sartre', 'Viktor Frankl', 'Martin Heidegger'],
    empiricalConnections: ['motivation', 'resilience', 'identity', 'self_concept'],
    tensions: [],
    implications: ['Genesis must not reduce meaning to a numerical variable. Meaning is a modulatory condition affecting motivation, resilience, and identity.'],
  },

  // Epistemology
  {
    id: 'phil_scientific_realism',
    name: 'Scientific Realism',
    domain: 'Epistemology',
    description: 'Scientific theories aim to give true descriptions of the world. Successful theories are approximately true.',
    keyArguments: ['No miracles argument', 'Inference to the best explanation', 'Convergence of evidence'],
    keyProponents: ['Hilary Putnam', 'Richard Boyd'],
    empiricalConnections: [],
    tensions: ['phil_constructive_empiricism'],
    implications: ['Genesis treats empirically validated mechanisms as approximately true, not merely instrumentally useful'],
  },
  {
    id: 'phil_constructive_empiricism',
    name: 'Constructive Empiricism',
    domain: 'Epistemology',
    description: 'Science aims to give empirically adequate theories, not necessarily true ones. We should be agnostic about unobservable entities.',
    keyArguments: ['Underdetermination', 'Empirical adequacy suffices', 'Ontological parsimony'],
    keyProponents: ['Bas van Fraassen'],
    empiricalConnections: [],
    tensions: ['phil_scientific_realism'],
    implications: ['Genesis models are tools for prediction and understanding, not claims about ultimate reality'],
  },
];

// ─────────────────────────────────────────────────────────────
// FOUNDATIONAL PHILOSOPHICAL QUESTIONS
// ─────────────────────────────────────────────────────────────

export const FOUNDATIONAL_QUESTIONS: PhilosophicalQuestion[] = [
  {
    id: 'q_agency_operationalization',
    question: 'How do different definitions of agency relate to different empirical operationalizations?',
    domain: 'Agency',
    positions: FOUNDATIONAL_POSITIONS.filter(p => p.domain === 'Agency' || p.domain === 'Free_Will'),
    empiricalOperationalizations: {
      psychological: ['perceived control', 'self-efficacy', 'autonomy', 'locus of control'],
      neuroscientific: ['decision processes', 'executive control', 'action initiation', 'prefrontal activity'],
      behavioural: ['observed choice patterns', 'initiative', 'goal-directed behaviour'],
      educational: ['self-regulated learning', 'student autonomy', 'intrinsic motivation'],
    },
    genesisImplications: [
      'Genesis must not conflate philosophical agency with psychological self-efficacy.',
      'Different philosophical positions imply different computational architectures for agent decision-making.',
    ],
  },
  {
    id: 'q_consciousness_simulation',
    question: 'Can a computational simulation meaningfully represent consciousness or subjective experience?',
    domain: 'Consciousness',
    positions: FOUNDATIONAL_POSITIONS.filter(p =>
      p.domain === 'Philosophy_of_Mind' || p.id === 'phil_embodied_agency'
    ),
    empiricalOperationalizations: {
      psychological: ['self-awareness', 'metacognition', 'introspection'],
      neuroscientific: ['global workspace theory', 'integrated information theory', 'neural correlates of consciousness'],
      behavioural: ['reportability', 'flexible behaviour', 'error monitoring'],
      educational: ['reflective learning', 'self-assessment'],
    },
    genesisImplications: [
      'Genesis does NOT claim to simulate consciousness.',
      'Genesis simulates observable/measurable correlates and functional analogues.',
      'The hard problem of consciousness remains outside Genesis scope.',
    ],
  },
  {
    id: 'q_meaning_measurement',
    question: 'Can meaning be measured, or only described?',
    domain: 'Meaning',
    positions: FOUNDATIONAL_POSITIONS.filter(p => p.domain === 'Meaning'),
    empiricalOperationalizations: {
      psychological: ['meaning in life questionnaires', 'purpose scales', 'narrative coherence'],
      neuroscientific: ['reward processing', 'default mode network activity'],
      behavioural: ['persistence', 'goal commitment', 'prosocial behaviour'],
      educational: ['student engagement', 'intrinsic motivation', 'relevance perception'],
    },
    genesisImplications: [
      'Genesis should NOT represent meaning as meaning = 73.4.',
      'Meaning should be a qualitative modulatory condition: present/absent/searching.',
      'Its effects on motivation, resilience, and identity can be modelled empirically.',
    ],
  },
];
