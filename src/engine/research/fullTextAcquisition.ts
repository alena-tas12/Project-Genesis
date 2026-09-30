// @ts-nocheck
import { ScientificDocument, DocumentSection } from './researchOntology';

export interface FullTextProvider {
  name: string;
  fetchFullText(doiOrPmid: string): Promise<ScientificDocument | null>;
}

export class EuropePMCAdapter implements FullTextProvider {
  name = 'EuropePMC';

  async fetchFullText(id: string): Promise<ScientificDocument | null> {
    // Normalizing the ID
    let query = id;
    if (id.startsWith('10.')) query = `DOI:${id}`;
    else if (!id.startsWith('PMC') && !isNaN(Number(id))) query = `EXT_ID:${id}`;

    const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(query)}&resultType=core&format=json`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      
      const data = await res.json();
      const results = data.resultList?.result || [];
      if (results.length === 0) return null;

      const item = results[0];
      const pmcid = item.pmcid;
      
      const sections: DocumentSection[] = [
        { heading: 'Title', content: item.title, sectionType: 'Title' },
        { heading: 'Abstract', content: item.abstractText || 'No abstract', sectionType: 'Abstract' }
      ];

      let accessStatus: 'FULL_TEXT_AVAILABLE' | 'ABSTRACT_ONLY' | 'METADATA_ONLY' = item.abstractText ? 'ABSTRACT_ONLY' : 'METADATA_ONLY';

      // If PMCID exists and is open access, fetch full text XML
      if (pmcid && item.isOpenAccess === 'Y') {
        accessStatus = 'FULL_TEXT_AVAILABLE';
        try {
          const pmcUrl = `https://www.ebi.ac.uk/europepmc/webservices/rest/${pmcid}/fullTextXML`;
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 5000);
          const xmlRes = await fetch(pmcUrl, { signal: controller.signal });
          clearTimeout(timeout);
          
          if (xmlRes.ok) {
            const xmlText = await xmlRes.text();
            
            // Heuristic extraction for main sections
            const extractSection = (tag: string) => {
              const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'ig');
              let content = '';
              let match;
              while ((match = regex.exec(xmlText)) !== null) {
                content += match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
              }
              return content.trim();
            };

            sections.push({ heading: 'Introduction', content: extractSection('sec.*?sec-type="(?:intro|background)"') || 'Could not parse introduction', sectionType: 'Introduction' });
            sections.push({ heading: 'Methods', content: extractSection('sec.*?sec-type="(?:methods|materials)"') || 'Could not parse methods', sectionType: 'Methods' });
            sections.push({ heading: 'Results', content: extractSection('sec.*?sec-type="results"') || 'Could not parse results', sectionType: 'Results' });
            sections.push({ heading: 'Discussion', content: extractSection('sec.*?sec-type="(?:discussion|conclusions)"') || 'Could not parse discussion', sectionType: 'Discussion' });
          }
        } catch (xmlError) {
          console.warn(`[EuropePMCAdapter] XML fetch failed for ${pmcid}`);
        }
      }

      return {
        id: `doc_${id}`,
        studyId: `study_${id}`,
        source: 'EuropePMC',
        sourceId: pmcid || item.id,
        url: `https://europepmc.org/article/MED/${item.id}`,
        retrievalTimestamp: new Date().toISOString(),
        accessStatus,
        sections
      };
    } catch (e) {
      console.warn(`[EuropePMCAdapter] Search failed/timed out for ${id}.`);
      return null;
    }
  }
}
