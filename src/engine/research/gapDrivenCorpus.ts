import type { Study } from './researchOntology';

/**
 * Project Genesis — Gap-Driven Corpus (Iteration 1)
 * 
 * Target: Cross-Domain Integration (Cognitive ↔ Physiological)
 * Generated via Autonomous Gap-Driven Exploration.
 */

export const GAP_DRIVEN_CORPUS_1: Partial<Study>[] = [
  {
    id: 'study_adam_2017',
    title: 'Diurnal cortisol slopes and mental and physical health outcomes: A systematic review and meta-analysis',
    authors: 'Adam et al.',
    publicationYear: 2017,
    doi: '10.1016/j.psyneuen.2017.05.018',
    methodology: 'Systematic review and meta-analysis of diurnal cortisol patterns',
    studyDesign: 'Meta_Analysis',
    population: { description: 'Lifespan samples (childhood through older adulthood)' },
    variablesStudied: ['Chronic Stress', 'Diurnal Cortisol Slope', 'Cognitive Ability', 'Biological Aging'],
    measurements: [
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'Salivary cortisol' },
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'Cognitive tests' }
    ],
    effectDescription: 'Flatter diurnal cortisol slopes (HPA axis dysregulation) mediate stress-induced cognitive wear-and-tear via sustained glucocorticoid receptor down-regulation.',
    replicationStatus: 'Replicated',
    evidenceQuality: 'Very_High',
    domains: ['Physiological', 'Cognitive', 'Life_History'],
  },
  {
    id: 'study_thayer_2012',
    title: 'A meta-analysis of heart rate variability and neuroimaging studies',
    authors: 'Thayer et al.',
    publicationYear: 2012,
    doi: '10.1016/j.neubiorev.2011.11.009',
    methodology: 'Meta-analysis of neuroimaging and HRV studies',
    studyDesign: 'Meta_Analysis',
    population: { description: 'Healthy adults and anxiety disorder samples' },
    variablesStudied: ['Vagal Tone (HRV)', 'vmPFC Activity', 'Cognitive Flexibility', 'Inhibitory Control'],
    measurements: [
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'ECG (HRV)' },
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'fMRI' }
    ],
    effectDescription: 'Higher resting vagal tone allows for superior cognitive flexibility and sustained attention (Neurovisceral Integration Model). Autonomic output is a bidirectional marker of central executive network integrity.',
    replicationStatus: 'Replicated',
    evidenceQuality: 'Very_High',
    domains: ['Physiological', 'Cognitive', 'Neuroscience'],
  },
  {
    id: 'study_vanherk_2024',
    title: 'Heightened SAM- and HPA-axis activity during acute stress impairs decision-making',
    authors: 'van Herk et al.',
    publicationYear: 2024,
    doi: '10.1016/j.ynstr.2024.100659',
    methodology: 'Systematic review of neuropharmacological mechanisms',
    studyDesign: 'Systematic_Review',
    population: { description: 'Healthy individuals exposed to acute stress' },
    variablesStudied: ['Acute Stress', 'SAM-Axis', 'Prefrontal Cortex', 'Decision Making'],
    measurements: [
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'Neuropharmacology' },
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'Behavioral paradigms' }
    ],
    effectDescription: 'SAM and HPA-axis activation chemically impairs the prefrontal cortex during acute stress, shifting control from cognitive/deliberative to habitual/affective decision-making systems.',
    replicationStatus: 'Replicated',
    evidenceQuality: 'High',
    domains: ['Physiological', 'Cognitive', 'Neuroscience', 'Methodological'],
  },
  {
    id: 'study_wesarg_2022',
    title: 'Childhood adversity and vagal regulation: A systematic review and meta-analysis',
    authors: 'Wesarg et al.',
    publicationYear: 2022,
    doi: '10.1016/j.neubiorev.2022.104920',
    methodology: 'Systematic review and meta-analysis of early life adversity on HRV',
    studyDesign: 'Meta_Analysis',
    population: { description: 'Individuals with a history of childhood adversity' },
    variablesStudied: ['Childhood Adversity', 'Vagally-mediated HRV', 'Self-Regulation'],
    measurements: [
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'Early life stress inventories' },
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'HRV' }
    ],
    effectDescription: 'Early life adversity alters the developmental trajectory of the parasympathetic nervous system, leading to lower resting vagal tone which mediates deficits in cognitive-emotional control.',
    replicationStatus: 'Replicated',
    evidenceQuality: 'High',
    domains: ['Physiological', 'Cognitive', 'Life_History', 'Developmental'],
  }
];
