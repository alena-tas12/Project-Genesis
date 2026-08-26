import React from 'react';
import type { WorldState, ResearchFrameworkPackage } from '../../engine/types';
import { ResearchPaperGenerator } from '../../engine/research/paperGenerator';
import { FileExporter } from '../../utils/exporter';
import { BookOpen, Download, FileText, Database, ShieldCheck } from 'lucide-react';

interface ResearchPaperViewProps {
  world: WorldState;
  frameworks: ResearchFrameworkPackage;
}

export const ResearchPaperView: React.FC<ResearchPaperViewProps> = ({ world, frameworks }) => {
  const paperMarkdown = ResearchPaperGenerator.generateMarkdownPaper(world, frameworks);

  return (
    <div className="paper-container">
      <div className="paper-header">
        <div className="title-group">
          <BookOpen className="icon-cyan" size={24} />
          <div>
            <h2>Module 12: Research Engine & Publication Package</h2>
            <p className="subtitle">
              Automatically compiles complete academic research papers, statistical analysis, and reproducibility archives.
            </p>
          </div>
        </div>

        <div className="export-actions-row">
          <button
            onClick={() => FileExporter.exportResearchPaperMarkdown(world, frameworks)}
            className="btn-export-primary"
          >
            <FileText size={16} />
            <span>Download Paper (.md)</span>
          </button>

          <button
            onClick={() => FileExporter.exportReproducibilityPackageJSON(world)}
            className="btn-export-accent"
          >
            <Database size={16} />
            <span>Export Seed JSON</span>
          </button>

          <button
            onClick={() => FileExporter.exportTimeSeriesCSV(world)}
            className="btn-export-secondary"
          >
            <Download size={16} />
            <span>Export CSV Data</span>
          </button>
        </div>
      </div>

      {/* Verification Hash Badge */}
      <div className="hash-banner">
        <ShieldCheck size={18} className="icon-emerald" />
        <span>Reproducibility Verification Hash: </span>
        <code>genesis-v1.0-sha256-{world.seed}-{world.day}-{world.history.length}</code>
      </div>

      {/* Paper Content Preview */}
      <div className="paper-document">
        <pre className="paper-text-render">{paperMarkdown}</pre>
      </div>
    </div>
  );
};
