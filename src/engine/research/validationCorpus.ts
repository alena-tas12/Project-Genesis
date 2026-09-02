import type { Study } from './researchOntology';

/**
 * Project Genesis - Research Acquisition Validation Corpus
 * 
 * Target: Ego-Depletion Controversy (Willpower as a limited resource)
 * Purpose: Verifying Genesis correctly extracts and models conflicting evidence,
 * replication failures, and competing models (Baumeister's Resource Model vs. 
 * Inzlicht's Process Model), rather than collapsing them into a single "fact".
 */

export const VALIDATION_CORPUS: Partial<Study>[] = [
  {
    id: 'study_baumeister_1998',
    title: 'Ego Depletion: Is the Active Self a Limited Resource?',
    authors: 'Baumeister, Bratslavsky, Muraven, Tice',
    publicationYear: 1998,
    doi: '10.1037/0022-3514.74.5.1252',
    methodology: 'Experimental manipulation of self-control tasks (e.g., radish vs chocolate)',
    studyDesign: 'RCT',
    population: { description: 'University undergraduate students' },
    variablesStudied: ['Self-Control Exertion', 'Task Persistence', 'Willpower'],
    measurements: ['Time spent on unsolvable puzzles', 'Task persistence duration'],
    effectDescription: 'Initial hypothesis proposing the Resource Model of Self-Control: Exerting self-control in an initial task depletes a shared global resource (ego depletion), directly impairing performance on subsequent self-control tasks.',
    replicationStatus: 'Failed', // Now known to be failed, though historically highly cited
    validationState: 'Hypothesized',
    evidenceQuality: 'Moderate',
    domains: ['Psychological', 'Cognitive', 'Behavioural'],
  },
  {
    id: 'study_hagger_2010',
    title: 'Ego Depletion and the Strength Model of Self-Control: A Meta-Analysis',
    authors: 'Hagger, Wood, Stiff, Chatzisarantis',
    publicationYear: 2010,
    doi: '10.1037/a0019486',
    methodology: 'Meta-analysis of 198 published ego-depletion experiments',
    studyDesign: 'Meta_Analysis',
    population: { description: 'Various laboratory samples' },
    variablesStudied: ['Self-Control Exertion', 'Subsequent Self-Control', 'Ego Depletion'],
    measurements: ['Effect size (Cohen\'s d) across sequential task paradigms'],
    effectDescription: 'Provided strong meta-analytic support (d = 0.62) for the ego-depletion effect, establishing the Resource Model as the dominant framework in psychology for nearly a decade.',
    replicationStatus: 'Failed', // Re-analyses showed severe publication bias
    validationState: 'Contested',
    evidenceQuality: 'High', // High at the time, later methodologically critiqued
    domains: ['Psychological', 'Cognitive', 'Methodological'],
  },
  {
    id: 'study_inzlicht_2014',
    title: 'Why self-control seems (but may not be) limited',
    authors: 'Inzlicht, Schmeichel',
    publicationYear: 2014,
    doi: '10.1016/j.tics.2012.01.004',
    methodology: 'Theoretical synthesis and model comparison',
    studyDesign: 'Systematic_Review', // Theoretical/review
    population: { description: 'Human subjects in self-control paradigms' },
    variablesStudied: ['Self-Control Exertion', 'Motivation', 'Attention Allocation'],
    measurements: ['Motivational shifts', 'Attentional bias'],
    effectDescription: 'Proposes the Process Model of Self-Control as a competing explanation to the Resource Model: Self-control declines not because a resource is depleted, but because motivation and attention shift from "have-to" goals to "want-to" goals.',
    replicationStatus: 'Partial',
    validationState: 'Supported',
    evidenceQuality: 'High',
    domains: ['Psychological', 'Cognitive', 'Emotional', 'Complex_Systems'],
  },
  {
    id: 'study_hagger_2016',
    title: 'A Multilab Preregistered Replication of the Ego-Depletion Effect',
    authors: 'Hagger et al. (23 independent laboratories)',
    publicationYear: 2016,
    doi: '10.1177/1745691616652873',
    methodology: 'Preregistered Multilab Registered Replication Report (RRR)',
    studyDesign: 'Meta_Analysis', // Multilab replication
    population: { description: '2,141 participants across 23 labs globally' },
    variablesStudied: ['Self-Control Exertion', 'Task Persistence', 'Ego Depletion'],
    measurements: ['Sequential task paradigm (Sripada et al. protocol)'],
    effectDescription: 'Massive, methodologically rigorous replication attempt found a meta-analytic effect size of exactly zero (d = 0.04) for the ego-depletion effect, contradicting the 2010 meta-analysis and exposing severe publication bias.',
    replicationStatus: 'N/A', // This is the replication itself
    validationState: 'Established', // The null finding is highly validated
    evidenceQuality: 'Very_High',
    domains: ['Methodological', 'Psychological', 'Cognitive'],
  }
];
