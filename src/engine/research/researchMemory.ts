import * as fs from 'fs';
import * as path from 'path';

export interface SearchHistoryRecord {
  query: string;
  source: string;
  timestamp: string;
  retrievedIdentifiers: string[];
  relevanceScore?: number;
}

export interface KnowledgeVersion {
  versionId: string;
  timestamp: string;
  studiesAdded: number;
  studiesUpdated: number;
  studiesRetracted: number;
  claimsAdded: number;
  claimsModified: number;
  claimsDowngraded: number;
  edgesAdded: number;
  gapsAdded: number;
  gapsResolved: number;
}

export class ResearchMemory {
  private dbPath = path.join(process.cwd(), 'genesis_research_memory.json');
  private memory: {
    history: SearchHistoryRecord[];
    versions: KnowledgeVersion[];
    retractedIds: string[];
  } = { history: [], versions: [], retractedIds: [] };

  constructor() {
    this.load();
  }

  private load() {
    if (fs.existsSync(this.dbPath)) {
      this.memory = JSON.parse(fs.readFileSync(this.dbPath, 'utf-8'));
    }
  }

  private save() {
    fs.writeFileSync(this.dbPath, JSON.stringify(this.memory, null, 2));
  }

  recordSearch(record: SearchHistoryRecord) {
    this.memory.history.push(record);
    this.save();
  }

  hasSearched(query: string): boolean {
    return this.memory.history.some(h => h.query === query);
  }

  getPreviouslyRetrievedIdentifiers(): Set<string> {
    const ids = new Set<string>();
    this.memory.history.forEach(h => h.retrievedIdentifiers.forEach(id => ids.add(id)));
    return ids;
  }

  recordKnowledgeVersion(version: KnowledgeVersion) {
    this.memory.versions.push(version);
    this.save();
  }

  markRetracted(id: string) {
    if (!this.memory.retractedIds.includes(id)) {
      this.memory.retractedIds.push(id);
      this.save();
    }
  }

  isRetracted(id: string): boolean {
    return this.memory.retractedIds.includes(id);
  }

  getLatestVersion(): KnowledgeVersion | undefined {
    return this.memory.versions[this.memory.versions.length - 1];
  }
}
