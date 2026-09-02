/**
 * Project Genesis — Domain Discovery
 * 
 * Rather than the developer manually deciding the final domain list,
 * Genesis discovers additional domains from the literature itself.
 */

import type { ResearchDomain, Study, KnowledgeEdge } from './researchOntology';
import { DOMAIN_SUBDOMAIN_MAP } from './researchOntology';

// ─────────────────────────────────────────────────────────────
// DISCOVERED DOMAIN
// ─────────────────────────────────────────────────────────────

export interface DiscoveredDomain {
  proposedName: string;
  keywords: string[];
  supportingStudyIds: string[];
  studyCount: number;
  relatedExistingDomains: ResearchDomain[];
  confidence: number;
  status: 'Proposed' | 'Accepted' | 'Rejected' | 'Merged';
}

export interface CrossDomainLink {
  domain1: ResearchDomain;
  domain2: ResearchDomain;
  sharedVariables: string[];
  sharedStudyCount: number;
  suggestedRelationships: string[];
  investigated: boolean;
}

// ─────────────────────────────────────────────────────────────
// DOMAIN DISCOVERY
// ─────────────────────────────────────────────────────────────

/**
 * Analyzes keywords from ingested studies to discover domains not
 * yet in the taxonomy. If a cluster of studies shares keywords
 * not covered by existing domains, proposes a new domain.
 */
export function discoverNewDomains(
  existingDomains: ResearchDomain[],
  studies: Study[]
): DiscoveredDomain[] {
  // Flatten all existing sub-domain keywords
  const knownKeywords = new Set<string>();
  for (const domain of existingDomains) {
    const subs = DOMAIN_SUBDOMAIN_MAP[domain] ?? [];
    for (const s of subs) {
      knownKeywords.add(s.replace(/_/g, ' '));
    }
  }
  // Also add domain names
  for (const d of existingDomains) {
    knownKeywords.add(d.toLowerCase().replace(/_/g, ' '));
  }

  // Count keyword occurrences NOT covered by existing domains
  const unknownKeywordCounts = new Map<string, { count: number; studyIds: Set<string> }>();

  for (const study of studies) {
    for (const kw of (study.keywords || [])) {
      const normalized = kw.toLowerCase().trim();
      if (normalized.length < 3) continue;
      if (knownKeywords.has(normalized)) continue;

      // Check if it's a substring of any known keyword
      let isKnown = false;
      for (const known of knownKeywords) {
        if (known.includes(normalized) || normalized.includes(known)) {
          isKnown = true;
          break;
        }
      }
      if (isKnown) continue;

      if (!unknownKeywordCounts.has(normalized)) {
        unknownKeywordCounts.set(normalized, { count: 0, studyIds: new Set() });
      }
      const entry = unknownKeywordCounts.get(normalized)!;
      entry.count++;
      entry.studyIds.add(study.id);
    }
  }

  // Group related unknown keywords into proposed domains
  const proposals: DiscoveredDomain[] = [];
  const processedKeywords = new Set<string>();

  for (const [keyword, info] of unknownKeywordCounts) {
    if (processedKeywords.has(keyword)) continue;
    if (info.count < 3) continue; // Need at least 3 studies mentioning it

    // Find related keywords (co-occurring in the same studies)
    const relatedKeywords: string[] = [keyword];
    for (const [otherKw, otherInfo] of unknownKeywordCounts) {
      if (otherKw === keyword) continue;
      if (processedKeywords.has(otherKw)) continue;
      // Check study overlap
      const overlap = [...info.studyIds].filter(id => otherInfo.studyIds.has(id));
      if (overlap.length >= 2) {
        relatedKeywords.push(otherKw);
        processedKeywords.add(otherKw);
      }
    }
    processedKeywords.add(keyword);

    // Find which existing domains these studies already belong to
    const relatedDomains = new Set<ResearchDomain>();
    for (const studyId of info.studyIds) {
      const study = studies.find(s => s.id === studyId);
      if (study) {
        for (const d of study.domains) relatedDomains.add(d);
      }
    }

    proposals.push({
      proposedName: keyword,
      keywords: relatedKeywords,
      supportingStudyIds: [...info.studyIds],
      studyCount: info.count,
      relatedExistingDomains: [...relatedDomains],
      confidence: Math.min(1.0, info.count / 10),
      status: 'Proposed',
    });
  }

  // Sort by study count (most mentioned first)
  proposals.sort((a, b) => b.studyCount - a.studyCount);

  return proposals;
}

/**
 * Discovers sub-domains within an existing domain by analyzing
 * keywords from studies classified under that domain.
 */
export function expandSubDomains(
  domain: ResearchDomain,
  studies: Study[]
): string[] {
  const existingSubs = new Set(DOMAIN_SUBDOMAIN_MAP[domain] ?? []);
  const domainStudies = studies.filter(s => s.domains.includes(domain));

  const candidateSubs = new Map<string, number>();

  for (const study of domainStudies) {
    for (const kw of (study.keywords || [])) {
      const normalized = kw.toLowerCase().trim().replace(/\s+/g, '_');
      if (existingSubs.has(normalized)) continue;
      if (normalized.length < 3) continue;
      candidateSubs.set(normalized, (candidateSubs.get(normalized) ?? 0) + 1);
    }
  }

  // Return sub-domains mentioned by at least 2 studies
  return [...candidateSubs.entries()]
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);
}

/**
 * Identifies potential cross-domain relationships that haven't been
 * explicitly researched yet.
 */
export function suggestCrossDomainLinks(
  studies: Study[],
  existingEdges: KnowledgeEdge[]
): CrossDomainLink[] {
  // Find domain pairs that share studies
  const domainPairStudies = new Map<string, { studies: Set<string>; vars: Set<string> }>();

  for (const study of studies) {
    if (study.domains.length < 2) continue;

    for (let i = 0; i < study.domains.length; i++) {
      for (let j = i + 1; j < study.domains.length; j++) {
        const key = [study.domains[i], study.domains[j]].sort().join('::');
        if (!domainPairStudies.has(key)) {
          domainPairStudies.set(key, { studies: new Set(), vars: new Set() });
        }
        const entry = domainPairStudies.get(key)!;
        entry.studies.add(study.id);
        for (const v of study.variablesStudied) entry.vars.add(v);
      }
    }
  }

  // Check which domain pairs already have edges
  const coveredPairs = new Set<string>();
  for (const edge of existingEdges) {
    if (edge.domains.length >= 2) {
      const key = [...edge.domains].sort().join('::');
      coveredPairs.add(key);
    }
  }

  const links: CrossDomainLink[] = [];
  for (const [key, info] of domainPairStudies) {
    if (coveredPairs.has(key)) continue;
    if (info.studies.size < 2) continue;

    const [d1, d2] = key.split('::') as [ResearchDomain, ResearchDomain];
    links.push({
      domain1: d1,
      domain2: d2,
      sharedVariables: [...info.vars],
      sharedStudyCount: info.studies.size,
      suggestedRelationships: [],
      investigated: false,
    });
  }

  links.sort((a, b) => b.sharedStudyCount - a.sharedStudyCount);
  return links;
}
