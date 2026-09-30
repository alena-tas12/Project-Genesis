import type { ResearchQuery, Study } from './researchOntology';
import { parseStudyMetadata } from './researchAcquisition';

export interface ResearchAcquisitionProvider {
  name: string;
  search(query: ResearchQuery): Promise<Study[]>;
  fetchById(id: string): Promise<Study | null>;
}

export class PubMedAdapter implements ResearchAcquisitionProvider {
  name = 'PubMed';

  async search(query: ResearchQuery): Promise<Study[]> {
    const term = encodeURIComponent(query.searchQueryString || query.description);
    const max = query.maxResults || 5;
    const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${term}&retmax=${max}&retmode=json`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      const ids = data.esearchresult?.idlist || [];
      if (ids.length === 0) return [];

      return this.fetchSummaries(ids);
    } catch (e) {
      console.error('[PubMedAdapter] Search failed:', e);
      return [];
    }
  }

  async fetchById(id: string): Promise<Study | null> {
    const studies = await this.fetchSummaries([id]);
    return studies.length > 0 ? studies[0] : null;
  }

  private async fetchSummaries(ids: string[]): Promise<Study[]> {
    const idStr = ids.join(',');
    const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${idStr}&retmode=json`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      const results = data.result || {};

      const studies: Study[] = [];
      for (const id of ids) {
        const item = results[id];
        if (!item) continue;

        const raw = {
          title: item.title,
          authors: (item.authors || []).map((a: any) => a.name).join(', '),
          year: parseInt(item.pubdate?.substring(0, 4) || '2000', 10),
          doi: (item.articleids || []).find((a: any) => a.idtype === 'doi')?.value,
          journal: item.source,
          abstract: 'Abstract unavailable in eSummary (Requires eFetch)',
          keywords: [],
          source: 'PubMed' as const
        };

        const study = parseStudyMetadata(raw);
        study.pmid = id;
        study.provenance = {
          source: 'PubMed' as const,
          sourceId: id,
          retrievalTimestamp: new Date().toISOString(),
          extractionVersion: 'v2_epistemic',
          ontologyVersion: 'v2',
          graphVersion: 'v1'
        };
        studies.push(study);
      }
      return studies;
    } catch (e) {
      console.error('[PubMedAdapter] Fetch summaries failed:', e);
      return [];
    }
  }
}

export class OpenAlexAdapter implements ResearchAcquisitionProvider {
  name = 'OpenAlex';

  async search(query: ResearchQuery): Promise<Study[]> {
    const term = encodeURIComponent(query.searchQueryString || query.description);
    const max = query.maxResults || 5;
    // We search across title/abstract.
    const url = `https://api.openalex.org/works?search=${term}&per-page=${max}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      const results = data.results || [];

      return results.map((item: any) => this.mapOpenAlexToStudy(item));
    } catch (e) {
      console.error('[OpenAlexAdapter] Search failed:', e);
      return [];
    }
  }

  async fetchById(id: string): Promise<Study | null> {
    const url = `https://api.openalex.org/works/${id}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      return this.mapOpenAlexToStudy(data);
    } catch (e) {
      console.error('[OpenAlexAdapter] Fetch by ID failed:', e);
      return null;
    }
  }

  private mapOpenAlexToStudy(item: any): Study {
    // Reconstruct abstract from inverted index
    let abstract = 'Unavailable';
    if (item.abstract_inverted_index) {
      const index = item.abstract_inverted_index;
      const words: string[] = [];
      for (const [word, positions] of Object.entries(index)) {
        (positions as number[]).forEach(pos => {
          words[pos] = word;
        });
      }
      abstract = words.join(' ');
    }

    const raw = {
      title: item.title || 'Untitled',
      authors: (item.authorships || []).map((a: any) => a.author?.display_name).join(', '),
      year: item.publication_year || 2000,
      doi: item.doi,
      journal: item.primary_location?.source?.display_name,
      abstract,
      keywords: (item.concepts || []).map((c: any) => c.display_name),
      source: 'OpenAlex' as const
    };

    const study = parseStudyMetadata(raw);
    study.openAlexId = item.id;
    study.provenance = {
      source: 'OpenAlex' as const,
      sourceId: item.id,
      retrievalTimestamp: new Date().toISOString(),
      extractionVersion: 'v2_epistemic',
      ontologyVersion: 'v2',
      graphVersion: 'v1'
    };
    return study;
  }
}

// Deduplication Engine
export class SourceDeduplicator {
  private seenIds = new Set<string>();
  private seenDois = new Set<string>();

  add(study: Study): boolean {
    if (study.doi) {
      const normDoi = study.doi.toLowerCase().trim();
      if (this.seenDois.has(normDoi)) return false;
      this.seenDois.add(normDoi);
    }
    if (study.pmid) {
      if (this.seenIds.has(`pmid:${study.pmid}`)) return false;
      this.seenIds.add(`pmid:${study.pmid}`);
    }
    if (study.openAlexId) {
      if (this.seenIds.has(study.openAlexId)) return false;
      this.seenIds.add(study.openAlexId);
    }
    return true;
  }

  reset() {
    this.seenIds.clear();
    this.seenDois.clear();
  }
}

// Main Orchestrator
export class LiveAcquisitionEngine {
  private providers: ResearchAcquisitionProvider[] = [
    new PubMedAdapter(),
    new OpenAlexAdapter()
  ];
  private deduplicator = new SourceDeduplicator();

  async executeLiveSearch(query: ResearchQuery): Promise<Study[]> {
    const allResults: Study[] = [];
    
    // Concurrently search all providers
    const promises = this.providers.map(p => p.search(query));
    const results = await Promise.allSettled(promises);

    for (const res of results) {
      if (res.status === 'fulfilled') {
        for (const study of res.value) {
          if (this.deduplicator.add(study)) {
            allResults.push(study);
          }
        }
      }
    }

    return allResults;
  }
}
