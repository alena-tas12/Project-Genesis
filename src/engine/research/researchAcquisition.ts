/**
 * Project Genesis — Research Acquisition Pipeline
 * 
 * Searches scientific databases and returns structured study metadata.
 * This module defines the acquisition interface and a manual/batch
 * ingestion pathway. Live API integration (PubMed, OpenAlex) can be
 * layered on top of these structures.
 */

import type {
  Study,
  ResearchDomain,
  ResearchQuery,
} from './researchOntology';
import { classifyEra, DOMAIN_SUBDOMAIN_MAP } from './researchOntology';

// ─────────────────────────────────────────────────────────────
// SEARCH RESULT (raw, pre-parsed)
// ─────────────────────────────────────────────────────────────

export interface RawSearchResult {
  title: string;
  authors: string;
  year: number;
  doi?: string;
  journal?: string;
  abstract?: string;
  keywords?: string[];
  source: 'PubMed' | 'OpenAlex' | 'arXiv' | 'bioRxiv' | 'Manual';
}

// ─────────────────────────────────────────────────────────────
// DOMAIN CLASSIFICATION
// ─────────────────────────────────────────────────────────────

const DOMAIN_KEYWORD_MAP: Partial<Record<ResearchDomain, string[]>> = {
  Biological: ['gene', 'genetic', 'epigenetic', 'dna', 'rna', 'hormone', 'endocrine', 'immune', 'inflammation', 'metabolism', 'microbiome', 'circadian', 'hpa axis', 'cortisol', 'allostatic', 'neuroplasticity', 'autonomic'],
  Neuroscience: ['neural', 'brain', 'neurotransmit', 'fmri', 'eeg', 'dopamine', 'serotonin', 'prefrontal', 'amygdala', 'hippocampus', 'reward', 'salience', 'executive function', 'interoception', 'consciousness'],
  Cognitive: ['attention', 'working memory', 'long-term memory', 'learning', 'reasoning', 'decision making', 'metacognition', 'cognitive bias', 'cognitive load', 'mental model', 'intelligence', 'creativity', 'perception'],
  Psychological: ['personality', 'motivation', 'self-efficacy', 'self-concept', 'attachment', 'coping', 'stress', 'resilience', 'identity', 'psychopathology', 'individual difference'],
  Emotional: ['emotion', 'affect', 'mood', 'appraisal', 'valence', 'arousal', 'emotion regulation', 'emotional memory', 'alexithymia'],
  Behavioural: ['habit', 'reinforcement', 'avoidance', 'approach', 'behavioural', 'behavioral', 'risk-taking', 'self-regulation', 'behavioural economics'],
  Social: ['peer', 'family', 'social network', 'social identity', 'belonging', 'cooperation', 'conflict', 'theory of mind', 'empathy', 'social cognition'],
  Developmental: ['child', 'adolescen', 'developmental', 'lifespan', 'sensitive period', 'intergenerational', 'aging', 'maturation'],
  Educational: ['pedagogy', 'assessment', 'curriculum', 'teacher', 'spaced repetition', 'testing effect', 'tutoring', 'self-regulated learning', 'educational', 'student'],
  Environmental: ['noise', 'pollution', 'temperature', 'crowding', 'housing', 'air quality', 'climate', 'resource', 'physical environment'],
  Cultural: ['culture', 'cultural', 'cross-cultural', 'acculturation', 'norms', 'values'],
  Economic: ['socioeconomic', 'income', 'poverty', 'inequality', 'employment', 'economic stress'],
  Institutional: ['school', 'university', 'healthcare', 'policy', 'bureaucracy', 'organization', 'surveillance', 'compliance'],
  Digital_Technological: ['screen', 'social media', 'algorithm', 'digital', 'online', 'attention economy', 'smartphone'],
  Philosophical: ['agency', 'free will', 'consciousness', 'phenomenology', 'epistemology', 'ethics', 'meaning', 'identity'],
  Complex_Systems: ['feedback loop', 'emergence', 'nonlinear', 'tipping point', 'self-organiz', 'cascade', 'complex system', 'network dynamic', 'regime shift'],
  Physiological: ['heart rate', 'hrv', 'cortisol', 'blood pressure', 'glucose', 'fatigue', 'sleep', 'circadian', 'autonomic'],
};

/**
 * Classifies which research domains a study belongs to based on its
 * title, abstract, and keywords. A study can belong to multiple domains.
 */
export function classifyDomains(result: RawSearchResult): ResearchDomain[] {
  const text = [
    result.title,
    result.abstract ?? '',
    ...(result.keywords ?? []),
  ].join(' ').toLowerCase();

  const matched: ResearchDomain[] = [];

  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORD_MAP)) {
    if (keywords && keywords.some(kw => text.includes(kw))) {
      matched.push(domain as ResearchDomain);
    }
  }

  return matched.length > 0 ? matched : ['Complex_Systems']; // Fallback
}

/**
 * Classifies sub-domains within matched domains.
 */
export function classifySubDomains(result: RawSearchResult, domains: ResearchDomain[]): string[] {
  const text = [
    result.title,
    result.abstract ?? '',
    ...(result.keywords ?? []),
  ].join(' ').toLowerCase();

  const matched: string[] = [];

  for (const domain of domains) {
    const subDomains = DOMAIN_SUBDOMAIN_MAP[domain] ?? [];
    for (const sd of subDomains) {
      const searchTerm = sd.replace(/_/g, ' ');
      if (text.includes(searchTerm)) {
        matched.push(sd);
      }
    }
  }

  return matched;
}

// ─────────────────────────────────────────────────────────────
// STUDY METADATA PARSING
// ─────────────────────────────────────────────────────────────

let studyCounter = 0;

/**
 * Converts a raw search result into a structured Genesis Study object.
 * Fields that require human/expert review are left as defaults.
 */
export function parseStudyMetadata(raw: RawSearchResult): Study {
  const domains = classifyDomains(raw);
  const subDomains = classifySubDomains(raw, domains);
  const era = classifyEra(raw.year);

  studyCounter++;

  return {
    id: `study_${studyCounter}_${raw.year}`,
    title: raw.title,
    authors: raw.authors,
    publicationYear: raw.year,
    doi: raw.doi,
    journal: raw.journal,
    abstract: raw.abstract,
    methodology: 'Requires extraction',     // Must be extracted from full text
    studyDesign: 'Other',                    // Must be classified by reviewer
    population: {
      description: 'Requires extraction',
    },
    variablesStudied: [],                    // Must be extracted
    measurements: [],                        // Must be extracted
    effectDescription: 'Requires extraction',
    limitations: [],
    replicationStatus: 'N/A',
    evidenceQuality: 'N/A',
    domains,
    subDomains,
    era,
    keywords: raw.keywords ?? [],
  };
}

// ─────────────────────────────────────────────────────────────
// BATCH MANUAL INGESTION
// ─────────────────────────────────────────────────────────────

/**
 * Ingests a batch of pre-structured studies (e.g., from the SIH audit
 * or manually curated literature). Returns fully typed Study objects.
 */
export function ingestManualStudies(studies: Partial<Study>[]): Study[] {
  return studies.map((s) => {
    studyCounter++;
    const year = s.publicationYear ?? 2000;
    return {
      id: s.id ?? `study_manual_${studyCounter}`,
      title: s.title ?? 'Untitled',
      authors: s.authors ?? 'Unknown',
      publicationYear: year,
      doi: s.doi,
      journal: s.journal,
      abstract: s.abstract,
      methodology: s.methodology ?? 'Not specified',
      studyDesign: s.studyDesign ?? 'Other',
      population: s.population ?? { description: 'Not specified' },
      variablesStudied: s.variablesStudied ?? [],
      measurements: s.measurements ?? [],
      effectDescription: s.effectDescription ?? 'Not specified',
      effectSize: s.effectSize,
      confidenceInterval: s.confidenceInterval,
      pValue: s.pValue,
      limitations: s.limitations ?? [],
      replicationStatus: s.replicationStatus ?? 'N/A',
      evidenceQuality: s.evidenceQuality ?? 'N/A',
      domains: s.domains ?? ['Complex_Systems'],
      subDomains: s.subDomains ?? [],
      era: classifyEra(year),
      keywords: s.keywords ?? [],
    };
  });
}

// ─────────────────────────────────────────────────────────────
// SEARCH QUERY CONSTRUCTION
// ─────────────────────────────────────────────────────────────

/**
 * Constructs a natural-language search query string from a structured
 * ResearchQuery. This can be dispatched to PubMed, OpenAlex, etc.
 */
export function buildSearchTerms(query: ResearchQuery): string {
  const parts: string[] = [];

  if (query.variables && query.variables.length > 0) {
    parts.push(query.variables.join(' AND '));
  }

  if (query.subDomains && query.subDomains.length > 0) {
    parts.push(query.subDomains.map(sd => sd.replace(/_/g, ' ')).join(' OR '));
  }

  if (query.domains.length > 0 && parts.length === 0) {
    // Fallback: use domain names as search terms
    parts.push(query.domains.join(' OR '));
  }

  return parts.join(' ') || query.description;
}
