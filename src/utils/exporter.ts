import type { WorldState, ResearchFrameworkPackage } from '../engine/types';
import { ResearchPaperGenerator } from '../engine/research/paperGenerator';

export class FileExporter {
  static downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static exportResearchPaperMarkdown(world: WorldState, frameworks: ResearchFrameworkPackage) {
    const paper = ResearchPaperGenerator.generateMarkdownPaper(world, frameworks);
    this.downloadFile(paper, `Project_Genesis_Paper_${world.architecture.presetId}.md`, 'text/markdown');
  }

  static exportReproducibilityPackageJSON(world: WorldState) {
    const packageData = {
      platform: 'Project Genesis v1.0',
      timestamp: new Date().toISOString(),
      seed: world.seed,
      architecture: world.architecture,
      day: world.day,
      month: world.month,
      year: world.year,
      studentCount: world.students.length,
      teacherCount: world.teachers.length,
      economy: world.economy,
      society: world.society,
      historySnapshotCount: world.history.length,
      verificationHash: `genesis-v1.0-${world.seed}-${world.day}-${world.history.length}`
    };

    const jsonStr = JSON.stringify(packageData, null, 2);
    this.downloadFile(jsonStr, `Genesis_Reproducibility_Package_${world.seed}.json`, 'application/json');
  }

  static exportTimeSeriesCSV(world: WorldState) {
    if (world.history.length === 0) return;

    const headers = [
      'Day', 'Year', 'AvgKnowledgePct', 'AvgStress', 'AvgMotivation', 'AvgBurnout',
      'GDPProxy', 'HappinessIndex', 'InnovationIndex', 'SocialMobilityIndex'
    ];

    const rows = world.history.map(pt => [
      pt.day, pt.year, pt.avgKnowledgePct, pt.avgStress, pt.avgMotivation, pt.avgBurnout,
      pt.gdpProxy, pt.happinessIndex, pt.innovationIndex, pt.socialMobilityIndex
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    this.downloadFile(csvContent, `Genesis_Simulation_TimeSeries_${world.seed}.csv`, 'text/csv');
  }
}
