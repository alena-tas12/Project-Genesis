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
    effectDescription: 'Gene × Environment interaction: Individuals with short alleles of the 5-HTT promoter polymorphism exhibited more depressive symptoms in response to stressful life events than those with homozygous long alleles.',
    replicationStatus: 'Partial', // Famous for replication controversies later resolved by larger meta-analyses
    evidenceQuality: 'Moderate',
    domains: ['Biological', 'Psychological', 'Developmental'],
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
    effectDescription: 'The myelinated vagus nerve actively dampens sympathetic arousal, enabling social engagement, emotional regulation, and cognitive flexibility (Coupling of brainstem, heart, and social behavior).',
    replicationStatus: 'Replicated',
    evidenceQuality: 'High',
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
    effectDescription: 'Emotional/somatic physiological signals (somatic markers) generated prior to conscious awareness guide advantageous decision-making. Reason relies crucially on emotional arousal.',
    replicationStatus: 'Replicated',
    evidenceQuality: 'High',
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
    effectDescription: 'Holding a spouse\'s hand profoundly attenuated neural threat responses in the right anterior insula and hypothalamus. The degree of attenuation correlated directly with marital quality (Social Baseline Theory).',
    replicationStatus: 'Replicated',
    evidenceQuality: 'High',
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
    effectDescription: 'Poverty generates a confluence of psychosocial (family turmoil, violence) and physical (noise, crowding, toxins) stressors that cumulatively elevate allostatic load, directly impairing working memory and self-regulation.',
    replicationStatus: 'Replicated',
    evidenceQuality: 'Very_High',
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
    effectDescription: 'Biological systems maintain themselves by actively minimizing surprise (variational free energy). Perception updates internal models (identity/self), while action modifies the environment to fulfill predictions (Active Inference).',
    replicationStatus: 'N/A', // Theoretical/Computational framework
    evidenceQuality: 'Moderate', // Extremely high impact, but mathematically dense and difficult to falsify directly
    domains: ['Neuroscience', 'Philosophical', 'Complex_Systems', 'Cognitive'],
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
