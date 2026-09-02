import type { Study } from './researchOntology';

/**
 * Project Genesis — Waves 3 to 12 Corpus
 * 
 * Representative foundational studies demonstrating Genesis's 
 * chronological traversal through the 12-Wave Expansion Roadmap.
 * This seeds the Knowledge Graph with cross-domain, physiological,
 * emotional, social, environmental, and complexity dynamics.
 */

export const WAVES_3_12_CORPUS: Partial<Study>[] = [
  // ─────────────────────────────────────────────────────────────
  // WAVE 3: CROSS-DOMAIN INTEGRATION (e.g., Psychoneuroimmunology)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'study_kiecolt_glaser_2002',
    title: 'Psychoneuroimmunology: Psychological Influences on Immune Function and Health',
    authors: 'Kiecolt-Glaser et al.',
    publicationYear: 2002,
    doi: '10.1037/0022-006X.70.3.537',
    methodology: 'Synthesis of stress, immune biomarkers, and health outcomes',
    studyDesign: 'Systematic_Review',
    population: { description: 'General human populations across lifespan' },
    variablesStudied: ['Psychological Stress', 'Inflammation', 'Immune Function'],
    measurements: ['Cytokines (IL-6)', 'Cortisol', 'Self-reported stress'],
    effectDescription: 'Psychological stress directly downregulates cellular immune response and upregulates systemic inflammation, bridging cognitive appraisal with biological vulnerability.',
    replicationStatus: 'Replicated',
    evidenceQuality: 'Very_High',
    domains: ['Psychological', 'Biological', 'Physiological'],
  },

  // ─────────────────────────────────────────────────────────────
  // WAVE 4: DEVELOPMENT & INDIVIDUAL DIFFERENCES
  // ─────────────────────────────────────────────────────────────
  {
    id: 'study_caspi_2003',
    title: 'Influence of Life Stress on Depression: Moderation by a Polymorphism in the 5-HTT Gene',
    authors: 'Caspi et al.',
    publicationYear: 2003,
    doi: '10.1126/science.1083968',
    methodology: 'Longitudinal cohort study (Dunedin Multidisciplinary Health and Development Study)',
    studyDesign: 'Longitudinal',
    population: { description: 'New Zealand birth cohort followed to age 26', sampleSize: 847 },
    variablesStudied: ['Life Stress', 'Depression', '5-HTTLPR Polymorphism'],
    measurements: ['Genotyping', 'Diagnostic interviews', 'Life event calendars'],
    effectDescription: 'Initial hypothesis of Gene × Environment interaction proposing that short alleles of the 5-HTT promoter increase depression vulnerability. Highly influential but subject to massive replication failures and ongoing statistical controversy.',
    replicationStatus: 'Failed', // Meta-analyses later showed null effects or tiny effects requiring massive N
    evidenceStatus: 'MIXED',
    evidenceQuality: 'Moderate',
    domains: ['Biological', 'Psychological', 'Developmental', 'Methodological'],
  },

  // ─────────────────────────────────────────────────────────────
  // WAVE 5: BRAIN / BODY / PHYSIOLOGY COUPLING
  // ─────────────────────────────────────────────────────────────
  {
    id: 'study_porges_2001',
    title: 'The Polyvagal Theory: Phylogenetic Substrates of a Social Nervous System',
    authors: 'Porges, S. W.',
    publicationYear: 2001,
    doi: '10.1016/S0167-8760(01)00162-3',
    methodology: 'Theoretical neurobiological synthesis of autonomic regulation',
    studyDesign: 'Systematic_Review',
    population: { description: 'Phylogenetic comparative / Human physiology' },
    variablesStudied: ['Vagal Tone', 'Autonomic Nervous System', 'Social Engagement'],
    measurements: ['Heart Rate Variability (HRV)', 'Respiratory Sinus Arrhythmia'],
    effectDescription: 'Proposes that the myelinated vagus nerve actively dampens sympathetic arousal, enabling social engagement. Hypothesis suggests coupling of brainstem, heart, and social behavior, though evolutionary mechanisms are heavily debated.',
    replicationStatus: 'Partial',
    epistemicCategory: 'THEORETICAL', // Highly influential but evolutionary/anatomical claims are contested
    evidenceQuality: 'Moderate',
    domains: ['Physiological', 'Neuroscience', 'Emotional', 'Social'],
  },

  // ─────────────────────────────────────────────────────────────
  // WAVE 6: EMOTION / COGNITION / REASONING
  // ─────────────────────────────────────────────────────────────
  {
    id: 'study_damasio_1996',
    title: 'The Somatic Marker Hypothesis and the Possible Functions of the Prefrontal Cortex',
    authors: 'Damasio, A. R.',
    publicationYear: 1996,
    doi: '10.1098/rstb.1996.0125',
    methodology: 'Neuropsychological assessment of ventromedial prefrontal cortex patients',
    studyDesign: 'Case_Study', // Aggregated lesion studies
    population: { description: 'Patients with VMPFC lesions vs healthy controls' },
    variablesStudied: ['Emotion', 'Decision Making', 'Physiological Arousal', 'VMPFC'],
    measurements: ['Iowa Gambling Task', 'Skin Conductance Responses (SCR)'],
    effectDescription: 'Proposes that emotional/somatic physiological signals (somatic markers) generated prior to conscious awareness guide advantageous decision-making. Still actively researched and debated regarding the causal necessity of somatic feedback.',
    replicationStatus: 'Partial',
    evidenceStatus: 'SUPPORTED',
    evidenceQuality: 'Moderate',
    domains: ['Emotional', 'Cognitive', 'Neuroscience', 'Physiological'],
  },

  // ─────────────────────────────────────────────────────────────
  // WAVE 7: SOCIAL / RELATIONAL / CULTURAL SYSTEMS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'study_coan_2006',
    title: 'Lending a Hand: Social Regulation of the Neural Response to Threat',
    authors: 'Coan, Schaefer, Davidson',
    publicationYear: 2006,
    doi: '10.1111/j.1467-9280.2006.01832.x',
    methodology: 'fMRI study of threat anticipation with physical touch',
    studyDesign: 'RCT',
    population: { description: 'Highly satisfied married couples', sampleSize: 16 },
    variablesStudied: ['Social Support (Handholding)', 'Neural Threat Response', 'Relationship Quality'],
    measurements: ['fMRI', 'Electric shock anticipation'],
    effectDescription: 'Holding a spouse\'s hand attenuated neural threat responses in the right anterior insula and hypothalamus. Suggests Social Baseline Theory (that social connection is the baseline metabolic state), though effect sizes vary across replications.',
    replicationStatus: 'Partial',
    evidenceStatus: 'SUPPORTED',
    evidenceQuality: 'Moderate',
    domains: ['Social', 'Emotional', 'Neuroscience'],
  },

  // ─────────────────────────────────────────────────────────────
  // WAVE 8: ENVIRONMENT / INSTITUTIONS / ECONOMICS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'study_mcevans_2003',
    title: 'The Environment of Childhood Poverty',
    authors: 'Evans, G. W.',
    publicationYear: 2004, // Corrected to 2004
    doi: '10.1037/0003-066x.59.2.77',
    methodology: 'Synthesis of ecological and psychosocial impacts of poverty',
    studyDesign: 'Systematic_Review',
    population: { description: 'Low-SES vs Middle-SES youth' },
    variablesStudied: ['Poverty', 'Allostatic Load', 'Environmental Toxins', 'Cognitive Development'],
    measurements: ['Physiological stress markers', 'Cognitive tests', 'Environmental metrics'],
    effectDescription: 'Proposes that poverty generates a confluence of psychosocial and physical stressors that cumulatively elevate allostatic load, correlating with impaired working memory. Highly cited, but causal directionality in humans remains complex.',
    replicationStatus: 'Replicated',
    evidenceStatus: 'SUPPORTED',
    evidenceQuality: 'High',
    domains: ['Economic', 'Environmental', 'Developmental', 'Physiological', 'Cognitive'],
  },

  // ─────────────────────────────────────────────────────────────
  // WAVE 9: CONSCIOUSNESS / SELF / IDENTITY / PHILOSOPHY
  // ─────────────────────────────────────────────────────────────
  {
    id: 'study_friston_2010',
    title: 'The Free-Energy Principle: A Unified Brain Theory?',
    authors: 'Friston, K.',
    publicationYear: 2010,
    doi: '10.1038/nrn2787',
    methodology: 'Computational and theoretical neuroscience framework',
    studyDesign: 'Computational',
    population: { description: 'Theoretical models of biological agents' },
    variablesStudied: ['Predictive Processing', 'Surprise / Free Energy', 'Perception', 'Action'],
    measurements: ['Bayesian updating models'],
    effectDescription: 'Theoretical framework suggesting biological systems maintain themselves by minimizing variational free energy. A highly influential but polarizing mathematical model; critics argue it is overly broad and unfalsifiable.',
    replicationStatus: 'N/A',
    epistemicCategory: 'THEORETICAL', // Grand unifying theory, highly contested
    evidenceQuality: 'Moderate', 
    domains: ['Neuroscience', 'Philosophical', 'Complex_Systems', 'Cognitive', 'Methodological'],
  },

  // ─────────────────────────────────────────────────────────────
  // WAVE 10: COMPLEXITY / NETWORK / DYNAMICAL SYSTEMS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'study_borsboom_2013',
    title: 'A Network Theory of Mental Disorders',
    authors: 'Borsboom, D., Cramer, A. O.',
    publicationYear: 2013,
    doi: '10.1146/annurev-clinpsy-050212-185608',
    methodology: 'Network psychometrics and dynamical systems modeling',
    studyDesign: 'Computational',
    population: { description: 'Clinical populations across psychopathology' },
    variablesStudied: ['Psychopathology', 'Symptom Networks', 'Feedback Loops'],
    measurements: ['Network connectivity', 'Centrality indices', 'Dynamical thresholds'],
    effectDescription: 'Mental disorders are not latent diseases causing symptoms, but rather emergent properties of mutually interacting symptom networks. A disorder occurs when a symptom network crosses a critical threshold into a self-sustaining feedback loop.',
    replicationStatus: 'Replicated',
    evidenceQuality: 'High',
    domains: ['Complex_Systems', 'Psychological', 'Biological'],
  },

  // ─────────────────────────────────────────────────────────────
  // WAVE 11: CAUSAL SYNTHESIS (Competing Models)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'study_kievit_2013',
    title: 'Simpson\'s Paradox in Psychological Science: A Practical Guide',
    authors: 'Kievit et al.',
    publicationYear: 2013,
    doi: '10.3389/fpsyg.2013.00513',
    methodology: 'Statistical modeling of cross-sectional vs longitudinal causal structures',
    studyDesign: 'Systematic_Review',
    population: { description: 'Statistical simulation populations' },
    variablesStudied: ['Causal Inference', 'Simpson\'s Paradox', 'Individual Differences'],
    measurements: ['Between-subject vs Within-subject correlations'],
    effectDescription: 'Demonstrated that cross-sectional group averages frequently reverse when modeled at the intra-individual longitudinal level, highlighting that generalized causal models often fail to capture individual-level causal architectures.',
    replicationStatus: 'Replicated',
    evidenceQuality: 'Very_High',
    domains: ['Complex_Systems', 'Philosophical', 'Psychological'],
  }
];
