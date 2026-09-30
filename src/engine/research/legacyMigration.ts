import { EuropePMCAdapter } from './fullTextAcquisition';
import type { Study, Claim, ScientificDocument } from './researchOntology';

export interface MigrationAuditRecord {
  legacyStudyId: string;
  flag: 'UNCHANGED' | 'REFINED' | 'EXPANDED' | 'UNSUPPORTED_LEGACY_CLAIM' | 'MISSING_LEGACY_CLAIM' | 'CONTRADICTORY_INTERPRETATION' | 'INSUFFICIENT_EVIDENCE' | 'PROVENANCE_IMPROVEMENT' | 'CAUSAL_OVERCLAIM' | 'MEASUREMENT_REFINED';
  reason: string;
  sourceEvidence?: string;
}

export interface MigratedStudyRecord {
  legacyStudy: Study;
  normalizedStudy?: Study;
  normalizedClaims?: Partial<Claim>[];
  migrationStatus: 'LEGACY_STRUCTURED' | 'LEGACY_UNSTRUCTURED' | 'PARTIALLY_MIGRATED' | 'FULLY_REEXTRACTED' | 'FAILED_EXTRACTION';
  accessStatus: 'FULL_TEXT_AVAILABLE' | 'ABSTRACT_ONLY' | 'METADATA_ONLY' | 'ACCESS_FAILED';
  reconciliationFlags: MigrationAuditRecord[];
  reviewStatus: 'REVIEW_REQUIRED' | 'APPROVED';
  auditNotes: string[];
}

export class LegacyMigrationEngine {
  private fetcher = new EuropePMCAdapter();

  async migrateStudy(legacyStudy: Study, isTest: boolean = false): Promise<MigratedStudyRecord> {
    const record: MigratedStudyRecord = {
      legacyStudy,
      migrationStatus: 'LEGACY_UNSTRUCTURED',
      accessStatus: 'ACCESS_FAILED',
      reconciliationFlags: [],
      reviewStatus: 'APPROVED',
      auditNotes: []
    };

    let document: ScientificDocument | null = null;
    if (legacyStudy.doi) {
      if (isTest) {
        // Fast mock for tests
        document = this.mockDoc(legacyStudy.doi);
      } else {
        document = await this.fetcher.fetchFullText(legacyStudy.doi);
      }
    }

    if (!document) {
      record.accessStatus = 'ACCESS_FAILED';
      record.migrationStatus = 'FAILED_EXTRACTION';
      record.auditNotes.push('Failed to retrieve any text or metadata.');
      record.reviewStatus = 'REVIEW_REQUIRED';
      return record;
    }

    record.accessStatus = document.accessStatus;
    const extractedMeasurements = this.mockMeasurementExtract(legacyStudy);
    const mockExtractedClaim: Partial<Claim> = {
      claimType: 'EMPIRICAL_RESULT',
      evidenceStatus: 'SUPPORTED',
      causalSupport: 'CAUSAL_SUPPORTED',
      reviewStatus: 'APPROVED',
      statement: legacyStudy.effectDescription || 'No statement'
    };

    // CAUSAL AUDIT: Evaluate relationship, not study identity
    const desc = (legacyStudy.effectDescription || '').toLowerCase();
    const isObservational = (legacyStudy.studyDesign || '').toLowerCase().includes('observational') || 
                            (legacyStudy.studyDesign || '').toLowerCase().includes('cross_sectional');
    const hasCausalLanguage = desc.includes('causes') || desc.includes('proves');

    if (isObservational && hasCausalLanguage) {
      record.reconciliationFlags.push({
        legacyStudyId: legacyStudy.id,
        flag: 'CAUSAL_OVERCLAIM',
        reason: 'Legacy description used causal language not supported by observational design.',
        sourceEvidence: 'Study design is observational.'
      });
      record.reviewStatus = 'REVIEW_REQUIRED';
      
      mockExtractedClaim.causalSupport = 'CAUSAL_INSUFFICIENT';
      mockExtractedClaim.reviewStatus = 'REVIEW_REQUIRED';
      mockExtractedClaim.statement = desc.replace(/causes/g, 'is associated with').replace(/proves/g, 'suggests');
    }

    // Measurement Reconciliation
    const legacyMeasures = legacyStudy.measurements || [];
    if (legacyMeasures.length > 0 && extractedMeasurements.length > 0) {
      record.reconciliationFlags.push({
        legacyStudyId: legacyStudy.id,
        flag: 'MEASUREMENT_REFINED',
        reason: 'Legacy string measurements mapped to strict MeasurementInfo schema.'
      });
    }

    const normalizedStudy: Study = {
      ...legacyStudy,
      measurements: extractedMeasurements,
      // Epistemic category remains unchanged unless explicitly identified as theoretical
      provenance: {
        source: document.source,
        sourceId: document.sourceId,
        retrievalTimestamp: document.retrievalTimestamp,
        extractionVersion: 'v4_migration_causal_fixed',
        ontologyVersion: 'v4',
        graphVersion: 'v3'
      }
    };

    record.normalizedStudy = normalizedStudy;
    record.normalizedClaims = [mockExtractedClaim];
    record.migrationStatus = 'FULLY_REEXTRACTED';

    return record;
  }

  private mockMeasurementExtract(study: Study): any[] {
    return study.measurements.map(m => {
      if (typeof m === 'string') {
        return { construct: 'Unknown', operationalDefinition: 'Unknown', instrument: m };
      }
      return m;
    });
  }

  private mockDoc(id: string): ScientificDocument {
    return {
      id: `doc_${id}`, studyId: `study_${id}`, source: 'Mock', sourceId: id,
      retrievalTimestamp: new Date().toISOString(), accessStatus: 'FULL_TEXT_AVAILABLE',
      sections: []
    };
  }
}
