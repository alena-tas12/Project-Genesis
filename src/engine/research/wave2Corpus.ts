import type { Study } from './researchOntology';

/**
 * Project Genesis — Wave 2 Corpus (Autonomous Expansion)
 * 
 * Studies discovered autonomously by Genesis Research Subagents
 * targeting the 'Missing_Moderators' gap identified in Wave 1.
 */

export const WAVE_2_CORPUS: Partial<Study>[] = [
  {
    id: 'study_viola_2007',
    title: 'PER3 Polymorphism Predicts Sleep Structure and Waking Performance',
    authors: 'Viola et al.',
    publicationYear: 2007,
    doi: '10.1016/j.cub.2007.01.073',
    methodology: 'Genetic genotyping and 40h total sleep deprivation',
    studyDesign: 'RCT',
    population: { description: 'Healthy young adults (PER3 4/4 vs 5/5)', sampleSize: 24 },
    variablesStudied: ['Sleep Deprivation', 'Sustained Attention', 'PER3_VNTR', 'Working Memory'],
    measurements: [
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'PVT' },
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'Genotyping' }
    ],
    effectDescription: 'PER3 5/5 carriers showed massive PVT lapse escalation and severe WM decrement. PER3 4/4 carriers maintained vigilance (Resilience).',
    limitations: ['Small sample size per genotype', 'Laboratory conditions'],
    replicationStatus: 'Replicated',
    evidenceQuality: 'High',
    domains: ['Biological', 'Cognitive', 'Neuroscience'],
  },
  {
    id: 'study_duffy_2009',
    title: 'Aging Attenuates the Effect of Sleep Deprivation on Vigilance',
    authors: 'Duffy et al.',
    publicationYear: 2009,
    doi: '10.1111/j.1532-5415.2009.02303.x',
    methodology: '26h constant routine wakefulness comparing age cohorts',
    studyDesign: 'Observational', // Cross-sectional cohort comparison under experimental condition
    population: { description: 'Young adults (18-32y) vs Older adults (60-76y)', sampleSize: 29 },
    variablesStudied: ['Sleep Deprivation', 'Sustained Attention', 'Age_Stage'],
    measurements: [
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'PVT lapses' },
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'Reaction time variability' }
    ],
    effectDescription: 'Contrary to intuition, healthy older adults are highly resilient to acute sleep loss. Younger adults suffer severe attentional lapse escalation.',
    limitations: ['Extremely healthy older adult criteria may induce survivorship bias'],
    replicationStatus: 'Replicated',
    evidenceQuality: 'High',
    domains: ['Developmental', 'Cognitive', 'Physiological'],
  },
  {
    id: 'study_killgore_2007',
    title: 'The Trait of Extraversion Predicts Vulnerability to Sleep Deprivation',
    authors: 'Killgore et al.',
    publicationYear: 2007,
    doi: '10.1111/j.1365-2869.2007.00615.x',
    methodology: '77 hours of continuous sleep deprivation with personality inventory',
    studyDesign: 'Observational', 
    population: { description: 'Healthy military personnel', sampleSize: 23 },
    variablesStudied: ['Sleep Deprivation', 'Sustained Attention', 'Extraversion_Score'],
    measurements: [
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'PVT' },
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'NEO-PI-R' },
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'EPQ' }
    ],
    effectDescription: 'Higher extraversion strongly predicted faster and larger declines in PVT response speed. Introversion conferred cognitive resilience.',
    limitations: ['Military cohort may restrict personality variance', 'Small sample size'],
    replicationStatus: 'Replicated',
    evidenceQuality: 'Moderate',
    domains: ['Psychological', 'Cognitive'],
  },
  {
    id: 'study_schmidt_2009',
    title: 'Homeostatic Sleep Pressure and Responses to Sustained Attention in the Suprachiasmatic Area',
    authors: 'Schmidt et al.',
    publicationYear: 2009,
    doi: '10.1126/science.1167337',
    methodology: 'fMRI PVT during varying homeostatic sleep pressures',
    studyDesign: 'Observational',
    population: { description: 'Extreme chronotype adults (Evening vs Morning)', sampleSize: 31 },
    variablesStudied: ['Sleep Pressure', 'Sustained Attention', 'Chronotype_Alignment'],
    measurements: [
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'fMRI' },
      { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: 'PVT' }
    ],
    effectDescription: 'Evening types maintained higher vigilance and LC/SCN activation under high evening sleep load compared to morning types.',
    limitations: ['Extreme chronotypes only, excluding intermediate types'],
    replicationStatus: 'Replicated',
    evidenceQuality: 'High',
    domains: ['Neuroscience', 'Physiological', 'Cognitive'],
  }
];
