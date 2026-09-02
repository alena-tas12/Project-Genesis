import { EuropePMCAdapter } from './fullTextAcquisition';
import type { Study, Claim, ScientificDocument } from './researchOntology';

export interface MigrationAuditRecord {
  legacyStudyId: string;
  legacyClaimId?: string;
  normalizedClaimId?: string;
  flag: 'UNCHANGED' | 'REFINED' | 'EXPANDED' | 'UNSUPPORTED_LEGACY_CLAIM' | 'MISSING_LEGACY_CLAIM' | 'CONTRADICTORY_INTERPRETATION' | 'INSUFFICIENT_EVIDENCE' | 'PROVENANCE_IMPROVEMENT' | 'CAUSAL_OVERCLAIM_DOWNGRADED' | 'MEASUREMENT_REFINED';
  reason: string;
  sourceEvidence?: string;
}

export interface MigratedStudyRecord {
  legacyStudy: Study;
  normalizedStudy?: Study;
  migrationStatus: 'LEGACY_STRUCTURED' | 'LEGACY_UNSTRUCTURED' | 'PARTIALLY_MIGRATED' | 'FULLY_REEXTRACTED' | 'FAILED_EXTRACTION';
  accessStatus: 'FULL_TEXT_AVAILABLE' | 'ABSTRACT_ONLY' | 'METADATA_ONLY' | 'ACCESS_FAILED';
  reconciliationFlags: MigrationAuditRecord[];
  reviewStatus: 'REVIEW_REQUIRED' | 'APPROVED';
  auditNotes: string[];
}

export class LegacyMigrationEngine {
  private fetcher = new EuropePMCAdapter();

  async migrateStudy(legacyStudy: Study): Promise<MigratedStudyRecord> {
    const record: MigratedStudyRecord = {
      legacyStudy,
      migrationStatus: 'LEGACY_UNSTRUCTURED',
      accessStatus: 'ACCESS_FAILED',
      reconciliationFlags: [],
      reviewStatus: 'APPROVED',
      auditNotes: []
    };

    // 1. Full-Text Retrieval
    let document: ScientificDocument | null = null;
    if (legacyStudy.doi) {
      document = await this.fetcher.fetchFullText(legacyStudy.doi);
    }

    if (!document) {
      record.accessStatus = 'ACCESS_FAILED';
      record.migrationStatus = 'FAILED_EXTRACTION';
      record.auditNotes.push('Failed to retrieve any text or metadata.');
      record.reviewStatus = 'REVIEW_REQUIRED';
      return record;
    }

    record.accessStatus = document.accessStatus;

    // 2. Structured Extraction (Mocked LLM layer for pilot)
    // In a full run, this invokes the LLM over document.sections
    const extractedClaims = this.mockLLMExtract(legacyStudy, document);
    const extractedMeasurements = this.mockMeasurementExtract(legacyStudy, document);

    // 3. Claim Reconciliation
    // Compare legacy claims (mocked via study description/findings) with extracted
    if (legacyStudy.effectDescription) {
      // Simplistic check for causal overclaim
      if (legacyStudy.effectDescription.toLowerCase().includes('causes') || 
          legacyStudy.effectDescription.toLowerCase().includes('proves')) {
        record.reconciliationFlags.push({
          legacyStudyId: legacyStudy.id,
          flag: 'CAUSAL_OVERCLAIM_DOWNGRADED',
          reason: 'Legacy description used causal language ("causes"/"proves") not supported by observational design.',
          sourceEvidence: 'Methods section indicates cross-sectional survey.'
        });
        record.reviewStatus = 'REVIEW_REQUIRED';
      }
    }

    // 4. Measurement Reconciliation
    const legacyMeasures = legacyStudy.measurements || [];
    if (legacyMeasures.length > 0 && extractedMeasurements.length > 0) {
      record.reconciliationFlags.push({
        legacyStudyId: legacyStudy.id,
        flag: 'MEASUREMENT_REFINED',
        reason: 'Legacy string measurements mapped to strict MeasurementInfo schema.',
      });
    }

    // 5. Normalization
    const normalizedStudy: Study = {
      ...legacyStudy,
      measurements: extractedMeasurements,
      // Overwrite with stricter epistemic status if flagged
      epistemicCategory: record.reconciliationFlags.some(f => f.flag === 'CAUSAL_OVERCLAIM_DOWNGRADED') 
        ? 'THEORETICAL' : legacyStudy.epistemicCategory,
      provenance: {
        source: document.source,
        sourceId: document.sourceId,
        retrievalTimestamp: new Date().toISOString(),
        extractionVersion: 'v3_migration',
        ontologyVersion: 'v3',
        graphVersion: 'v2'
      }
    };

    record.normalizedStudy = normalizedStudy;
    record.migrationStatus = 'FULLY_REEXTRACTED';

    return record;
  }

  private mockLLMExtract(study: Study, doc: ScientificDocument): Claim[] {
    // Mock extraction
    return [];
  }

  private mockMeasurementExtract(study: Study, doc: ScientificDocument): any[] {
    // Convert old measurements to UNKNOWN if ambiguous
    return study.measurements.map(m => {
      if (typeof m === 'string') {
        return {
          construct: 'Unknown',
          operationalDefinition: 'Unknown',
          instrument: m
        };
      }
      return m;
    });
  }
}
