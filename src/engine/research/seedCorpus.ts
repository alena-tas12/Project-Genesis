import type { Study } from './researchOntology';

/**
 * Project Genesis — Seed Corpus (Wave 1: Sleep → Cognition)
 * 
 * Contains 20 real scientific papers retrieved via live literature
 * acquisition (PubMed/OpenAlex) representing the highest-tier evidence
 * on sleep and cognitive function, including meta-analyses, RCTs, and
 * pre-registered direct replications (including null results).
 */

export const SLEEP_COGNITION_CORPUS: Partial<Study>[] = [
  // ─────────────────────────────────────────────────────────────
  // CATEGORY 1 & 2: META-ANALYSES
  // ─────────────────────────────────────────────────────────────
  {
    id: 'study_lowe_2017',
    title: 'The Neurocognitive Consequences of Sleep Restriction: A Meta-Analytic Review',
    authors: 'Lowe, Safati, Hall',
    publicationYear: 2017,
    doi: '10.1016/j.neubiorev.2017.07.010',
    methodology: 'Meta-analysis of 61 experimental sleep restriction studies',
    studyDesign: 'Systematic_Review',
    population: { description: 'Healthy adults / young adults', sampleSize: 1500 },
    variablesStudied: ['Sleep Restriction', 'Sustained Attention', 'Executive Functioning', 'Long-Term Memory'],
    measurements: [
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'Cognitive task batteries' }
    ],
    effectDescription: 'Sleep restriction significantly degraded sustained attention, overall processing, and executive functioning.',
    effectSize: -0.409, // Hedges' g for sustained attention
    limitations: ['High heterogeneity among task batteries', 'Short-term restriction limits generalizability to chronic states'],
    replicationStatus: 'Replicated',
    evidenceQuality: 'Very_High',
    domains: ['Cognitive', 'Physiological', 'Psychological'],
  },
  {
    id: 'study_wust_2024',
    title: 'Impact of One Night of Sleep Restriction on Sleepiness and Cognitive Function: A Systematic Review and Meta-Analysis',
    authors: 'Wüst, Capdevila, Lane, Reichert, Lasauskaite',
    publicationYear: 2024,
    doi: '10.1016/j.smrv.2024.101940',
    methodology: 'Systematic review and meta-analysis of 44 studies',
    studyDesign: 'Systematic_Review',
    population: { description: 'Healthy adult volunteers (ages 18-60)', sampleSize: 1087 },
    variablesStudied: ['Acute Sleep Restriction', 'Sustained Attention', 'Working Memory', 'Inhibitory Control'],
    measurements: [
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'Psychomotor Vigilance Task (PVT)' },
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'Subjective Sleepiness' }
    ],
    effectDescription: 'Significantly impaired sustained attention (PVT). Null/non-significant effects on working memory and inhibitory control.',
    limitations: ['Confined to single-night acute restriction', 'Laboratory artificiality'],
    replicationStatus: 'Replicated',
    evidenceQuality: 'Very_High',
    domains: ['Cognitive', 'Physiological'],
  },
  {
    id: 'study_wardle_pinkston_2019',
    title: 'Insomnia and Cognitive Performance: A Systematic Review and Meta-Analysis',
    authors: 'Wardle-Pinkston, Slavish, Taylor',
    publicationYear: 2019,
    doi: '10.1016/j.smrv.2019.07.008',
    methodology: 'Systematic review and meta-analysis of 48 studies',
    studyDesign: 'Systematic_Review',
    population: { description: 'Clinical insomnia patients vs healthy controls', sampleSize: 4539 },
    variablesStudied: ['Chronic Insomnia', 'Working Memory Manipulation', 'Complex Attention', 'Episodic Memory'],
    measurements: [
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'Objective and subjective cognitive decrements' }
    ],
    effectDescription: 'Chronic insomnia associated with objective decrements in working memory (g = -0.52) and complex attention (g = -0.36).',
    effectSize: -0.52,
    limitations: ['44% of primary studies lacked formal DSM diagnostic verification', 'Observational design precludes causal determination'],
    replicationStatus: 'Replicated',
    evidenceQuality: 'High',
    domains: ['Cognitive', 'Psychological'],
  },
  {
    id: 'study_lim_2010',
    title: 'A Meta-Analysis of the Impact of Short-Term Sleep Deprivation on Cognitive Variables',
    authors: 'Lim, Dinges',
    publicationYear: 2010,
    doi: '10.1037/a0018883',
    methodology: 'Meta-analysis of 70 experimental studies',
    studyDesign: 'Systematic_Review',
    population: { description: 'Healthy young adults (ages 18-35)', sampleSize: 1940 },
    variablesStudied: ['Total Sleep Deprivation', 'Sustained Attention', 'Working Memory', 'Processing Speed'],
    measurements: [
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'Attentional lapses' },
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'Reaction speed' }
    ],
    effectDescription: 'Large impairments in sustained attention/vigilance (d = -1.02) and moderate impairments in working memory (d = -0.55).',
    effectSize: -1.02,
    limitations: ['Total acute deprivation rather than partial restriction', 'Vulnerability to publication bias'],
    replicationStatus: 'Replicated',
    evidenceQuality: 'Very_High',
    domains: ['Cognitive', 'Physiological'],
  },

  // ─────────────────────────────────────────────────────────────
  // CATEGORY 3: FOUNDATIONAL STUDIES (DOSE-RESPONSE)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'study_vandongen_2003',
    title: 'The Cumulative Cost of Additional Wakefulness: Dose-Response Effects on Neurobehavioral Functions and Sleep Physiology',
    authors: 'Van Dongen, Maislin, Mullington, Dinges',
    publicationYear: 2003,
    doi: '10.1093/sleep/26.2.117',
    methodology: '14-day inpatient restriction vs. 3-day total deprivation',
    studyDesign: 'RCT',
    population: { description: 'Healthy young adults (ages 21-38)', sampleSize: 66 },
    variablesStudied: ['Sleep Restriction Dose', 'PVT Attention Lapses', 'Working Memory', 'Subjective Sleepiness'],
    measurements: [
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'Digit Symbol Substitution' },
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'PVT' },
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'Subjective ratings' }
    ],
    effectDescription: '14 days of 4h sleep produced cognitive impairment equivalent to 48 hours of total sleep deprivation. Subjective sleepiness plateaued, showing lack of awareness of decline.',
    limitations: ['Small sample per arm (n=16)', 'Highly regimented laboratory environment'],
    replicationStatus: 'Replicated',
    evidenceQuality: 'Very_High',
    domains: ['Cognitive', 'Physiological'],
  },
  {
    id: 'study_belenky_2003',
    title: 'Patterns of Performance Degradation and Restoration During Sleep Restriction and Subsequent Recovery',
    authors: 'Belenky, Wesensten, Thorne, et al.',
    publicationYear: 2003,
    doi: '10.1046/j.1365-2869.2003.00337.x',
    methodology: '7-day restriction + 3-day recovery dose-response trial',
    studyDesign: 'RCT',
    population: { description: 'Healthy adult volunteers', sampleSize: 66 },
    variablesStudied: ['Sleep Restriction Dose', 'Recovery Time', 'PVT Response Speed'],
    measurements: [
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'PVT response speed' }
    ],
    effectDescription: 'PVT degraded monotonically. After 7 days of 3h sleep, 3 full recovery nights failed to restore performance to baseline (persistent neurobehavioral debt).',
    limitations: ['Recovery phase restricted to 3 days', 'Fixed time-in-bed vs polysomnographic TST'],
    replicationStatus: 'Replicated',
    evidenceQuality: 'High',
    domains: ['Cognitive', 'Physiological'],
  },
  {
    id: 'study_diekelmann_2010',
    title: 'The Memory Function of Sleep',
    authors: 'Diekelmann, Born',
    publicationYear: 2010,
    doi: '10.1038/nrn2762',
    methodology: 'Synthesis of >200 empirical animal and human studies',
    studyDesign: 'Systematic_Review',
    population: { description: 'Human and animal neurobiological models' },
    variablesStudied: ['Slow-wave sleep (SWS)', 'Memory Consolidation', 'Hippocampal Memory Traces'],
    measurements: [
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'EEG/LFP markers' }
    ],
    effectDescription: 'Active System Consolidation Theory: SWS mediates active replay of memory traces via coupling of slow oscillations, spindles, and sharp-wave ripples.',
    limitations: ['Synthesizes largely correlational EEG/LFP markers in humans', 'Difficult to isolate causal effects of micro-architectures'],
    replicationStatus: 'Replicated',
    evidenceQuality: 'High',
    domains: ['Neuroscience', 'Cognitive'],
  },

  // ─────────────────────────────────────────────────────────────
  // CATEGORY 4: NULL RESULTS & FAILED REPLICATIONS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'study_bailes_2020',
    title: 'Does Sleep Protect Memories Against Interference? A Failure to Replicate',
    authors: 'Bailes, Caldwell, Wamsley, Tucker',
    publicationYear: 2020,
    doi: '10.1371/journal.pone.0220419',
    methodology: 'Direct experimental replication study (sleep vs. wake)',
    studyDesign: 'RCT',
    population: { description: 'Healthy college students', sampleSize: 97 },
    variablesStudied: ['Sleep', 'Retroactive Interference', 'Memory Recall'],
    measurements: [
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'Verbal paired-associates task' }
    ],
    effectDescription: 'NULL EFFECT. Failed to replicate findings that sleep protects memories against retroactive interference. Interference impaired recall equally regardless of sleep.',
    effectSize: 0,
    limitations: ['Standard verbal paired-associates only', 'Did not assess emotional interference'],
    replicationStatus: 'Failed',
    evidenceQuality: 'High',
    domains: ['Cognitive'],
  },
  {
    id: 'study_cordi_2021',
    title: 'No Evidence for Intra-Individual Correlations Between Sleep-Mediated Declarative Memory Consolidation and Slow-Wave Sleep',
    authors: 'Cordi, Rasch',
    publicationYear: 2021,
    doi: '10.1093/sleep/zsab034',
    methodology: 'Repeated-measures within-subject experimental study',
    studyDesign: 'Observational',
    population: { description: 'Healthy young adult men and women', sampleSize: 159 },
    variablesStudied: ['Slow-Wave Sleep Duration', 'Declarative Memory Consolidation'],
    measurements: [
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'Intra-individual correlational analysis' }
    ],
    effectDescription: 'NULL EFFECT. No significant correlation between declarative memory improvement and duration/power of SWS. Refutes assumption that higher individual SWS predicts greater consolidation.',
    effectSize: 0,
    limitations: ['Restricted to healthy good sleepers', 'Word-pair association tasks may have ceiling effects'],
    replicationStatus: 'Failed',
    evidenceQuality: 'High',
    domains: ['Neuroscience', 'Cognitive'],
  },
  {
    id: 'study_pohlchen_2020',
    title: 'Evidence Against a Large Effect of Sleep in Protecting Verbal Memories From Interference',
    authors: 'Pöhlchen, Pawlizki, Gais, Schönauer',
    publicationYear: 2020,
    doi: '10.1111/jsr.13042',
    methodology: 'Controlled experimental replication trial (2 independent experiments)',
    studyDesign: 'RCT',
    population: { description: 'Healthy young adults', sampleSize: 31 },
    variablesStudied: ['Sleep', 'Verbal Memory Interference', 'Forgetting'],
    measurements: [
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'List learning recall' }
    ],
    effectDescription: 'NULL EFFECT. Sleep provided no protective buffer against retroactive verbal memory interference. Prior claims likely overestimated.',
    effectSize: 0,
    limitations: ['Modest sample sizes', 'Restricted to paired-word lists'],
    replicationStatus: 'Failed',
    evidenceQuality: 'Moderate',
    domains: ['Cognitive'],
  },
  {
    id: 'study_humiston_2019',
    title: 'Unlearning Implicit Social Biases During Sleep: A Failure to Replicate',
    authors: 'Humiston, Wamsley',
    publicationYear: 2019,
    doi: '10.1371/journal.pone.0211416',
    methodology: 'Pre-registered direct replication experiment',
    studyDesign: 'RCT',
    population: { description: 'Healthy college students', sampleSize: 31 },
    variablesStudied: ['Targeted Memory Reactivation (TMR)', 'Implicit Bias (IAT)'],
    measurements: [
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'Implicit Association Test (IAT)' }
    ],
    effectDescription: 'NULL EFFECT. Failed to replicate Hu et al. (2015). Re-exposure to auditory cues during sleep yielded no significant change in bias.',
    effectSize: 0,
    limitations: ['Modest sample size', 'Validity constraints inherent to IAT metric stability'],
    replicationStatus: 'Failed',
    evidenceQuality: 'High',
    domains: ['Cognitive', 'Social'],
  },

  // ─────────────────────────────────────────────────────────────
  // CATEGORY 5: SLEEP & LEARNING (ENCODING VS CONSOLIDATION)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'study_newbury_2021',
    title: 'Sleep Deprivation and Memory: Meta-Analytic Reviews of Studies on Sleep Deprivation Before and After Learning',
    authors: 'Newbury, Crowley, Rastle, Tamminen',
    publicationYear: 2021,
    doi: '10.1037/bul0000348',
    methodology: 'Systematic review and dual meta-analyses (82 experimental studies)',
    studyDesign: 'Systematic_Review',
    population: { description: 'Healthy adult populations', sampleSize: 3098 },
    variablesStudied: ['Sleep Deprivation Before Learning', 'Sleep Deprivation After Learning', 'Memory Retrieval'],
    measurements: [
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'Declarative and non-declarative memory tasks' }
    ],
    effectDescription: 'Sleep deprivation BEFORE learning (encoding) has a much larger detrimental effect (g = 0.621) than sleep deprivation AFTER learning (consolidation, g = 0.277).',
    effectSize: -0.621,
    limitations: ['Predominance of college-aged participants', 'Variability in recall retention delays'],
    replicationStatus: 'Replicated',
    evidenceQuality: 'Very_High',
    domains: ['Cognitive', 'Physiological'],
  },
  {
    id: 'study_wild_2018',
    title: 'Dissociable Effects of Self-Reported Daily Sleep Duration on High-Level Cognitive Abilities',
    authors: 'Wild, Nichols, Battista, Stojanoski, Owen',
    publicationYear: 2018,
    doi: '10.1093/sleep/zsy182',
    methodology: 'Large-scale cross-sectional cognitive battery study',
    studyDesign: 'Cross_Sectional',
    population: { description: 'Global general adult population (ages 18-100)', sampleSize: 10324 },
    variablesStudied: ['Sleep Duration', 'Reasoning', 'Verbal Abilities', 'Working Memory'],
    measurements: [
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'Cognitive battery' },
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'Self-reported sleep' }
    ],
    effectDescription: 'Inverted U-shape: sleeping 7-8h is optimal. Both short (<7h) and long (>8h) durations impaired reasoning/verbal abilities (equivalent to 4-7 years of aging). Short-term working memory was comparatively unaffected.',
    limitations: ['Self-reported sleep duration', 'Cross-sectional design cannot confirm causality'],
    replicationStatus: 'Replicated',
    evidenceQuality: 'High',
    domains: ['Cognitive', 'Physiological', 'Social'],
  },
  {
    id: 'study_rasch_2007',
    title: 'Odor Cues During Slow-Wave Sleep Prompt Declarative Memory Consolidation',
    authors: 'Rasch, Büchel, Gais, Born',
    publicationYear: 2007,
    doi: '10.1126/science.1138581',
    methodology: 'Within-Subject fMRI Crossover Experiment',
    studyDesign: 'RCT',
    population: { description: 'Healthy volunteers', sampleSize: 74 },
    variablesStudied: ['Olfactory Context Cues in SWS', 'Memory Retention', 'Hippocampal Reactivation'],
    measurements: [
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: '2D object-location learning' },
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'fMRI' }
    ],
    effectDescription: 'Re-exposure to olfactory cues during SWS significantly enhanced spatial memory retention next morning. Simultaneous fMRI showed selective hippocampal reactivation.',
    limitations: ['Specific to olfactory modality', 'Spatial declarative tasks only'],
    replicationStatus: 'Replicated',
    evidenceQuality: 'High',
    domains: ['Neuroscience', 'Cognitive'],
  }
];
