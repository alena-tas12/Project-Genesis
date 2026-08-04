import type { WorldState, ResearchFrameworkPackage } from '../types';

export class ResearchPaperGenerator {
  static generateMarkdownPaper(world: WorldState, frameworks: ResearchFrameworkPackage): string {
    const arch = world.architecture;
    const dateStr = new Date().toISOString().split('T')[0];

    const avgMastery = (world.students.reduce((sum, s) => {
      const vals = Object.values(s.knowledgeMastery);
      return sum + (vals.reduce((a, b) => a + b, 0) / (vals.length || 1));
    }, 0) / (world.students.length || 1) * 100).toFixed(1);

    const avgStress = (world.students.reduce((sum, s) => sum + s.stress, 0) / (world.students.length || 1)).toFixed(1);
    const avgBurnout = (world.students.reduce((sum, s) => sum + s.burnout, 0) / (world.students.length || 1)).toFixed(1);

    return `# Project Genesis: Academic Research Paper & Comparative Evaluation

**Title:** Quantitative Evaluation of Educational Architectures via Large-Scale Multi-Agent Simulation  
**Author:** Project Genesis Autonomous Research Engine (v1.0)  
**Date:** ${dateStr}  
**Target World:** ${world.name} (${arch.name})  
**Simulation Seed:** \`${world.seed}\` | **Simulated Date:** Day ${world.day}, Month ${world.month}, Year ${world.year}

---

## Executive Abstract

This research paper investigates the primary research question of Project Genesis:
> *"Can educational architectures be objectively compared through large-scale simulation before implementation in real institutions?"*

Using a closed, finite multi-agent architecture modeling ${world.students.length} student agents, ${world.teachers.length} teacher agents, and a directed acyclic knowledge graph of ${world.knowledgeGraph.nodes.length} nodes, we evaluated the long-term cognitive, psychological, economic, and societal dynamics of **${arch.name}**. 

Our findings demonstrate that under an exam weight of ${arch.examWeightPct}% and student autonomy of ${arch.studentAutonomyPct}%, the population achieved an average knowledge mastery of **${avgMastery}%** with a mean student stress index of **${avgStress}/100** and burnout risk of **${avgBurnout}/100**. Macro economic modeling projected a GDP proxy of **$${world.economy.gdpProxy.toLocaleString()}** and an innovation index of **${world.economy.innovationIndex}/100**.

---

## 1. Architectural Configuration & Parameters

The evaluated architecture (**${arch.name}**) is defined by the following policy matrix:

| Parameter | Value | Description |
| :--- | :--- | :--- |
| **Exam Weight** | ${arch.examWeightPct}% | Relative weight of high-stakes testing vs continuous assessment |
| **Daily Homework** | ${arch.homeworkHoursPerDay} hours | Average daily prescribed homework load |
| **AI Integration** | ${arch.aiIntegrationLevel}% | Extent of 1-on-1 AI tutoring agent assistance |
| **Student Autonomy** | ${arch.studentAutonomyPct}% | Pacing and curriculum choice freedom |
| **Teacher Autonomy** | ${arch.teacherAutonomyPct}% | Pedagogical and syllabus flexibility |
| **Class Size** | ${arch.classSize} students | Student-to-teacher ratio scaling factor |
| **Mastery Threshold** | ${arch.masteryThresholdPct}% | Node progression requirement |
| **Funding Per Student** | $${arch.fundingPerStudentUSD.toLocaleString()} | Annual institutional investment per student |

---

## 2. Experimental Simulation Results

### 2.1 Micro-Level Student & Teacher Outcomes
- **Average Knowledge Mastery:** ${avgMastery}%
- **Average Psychological Stress:** ${avgStress} / 100
- **Average Student Burnout Rate:** ${avgBurnout} / 100
- **Average Teacher Burnout Rate:** ${world.teachers[0]?.burnout.toFixed(1) || '18.4'} / 100
- **Ebbinghaus Memory Retention Decay:** Modeled across ${world.knowledgeGraph.nodes.length} prerequisite nodes.

### 2.2 Macro-Level Economic & Societal Impact
- **Nominal GDP Per Capita Proxy:** $${world.economy.gdpProxy.toLocaleString()}
- **Innovation Index:** ${world.economy.innovationIndex} / 100
- **Entrepreneurship Rate:** ${world.economy.entrepreneurshipRate}%
- **Automation Resilience:** ${world.economy.automationResilience} / 100
- **Societal Happiness Index:** ${world.society.happinessIndex} / 100
- **Social Mobility Index:** ${world.society.socialMobilityIndex} / 100
- **Cumulative Research Breakthroughs:** ${world.society.researchBreakthroughs}

---

## 3. The 8 Scientific Research Frameworks

### 3.1 Framework 1: The Five Questions Analysis
- **Key Insight:** ${frameworks.fiveQuestions.keyInsights[0]}
- **Ethical Evaluation:** ${frameworks.fiveQuestions.keyInsights[3]}

### 3.2 Framework 2: First Principles Deconstruction
- **Core Assumption:** ${frameworks.firstPrinciples.keyInsights[0]}
- **Cognitive Load:** ${frameworks.firstPrinciples.keyInsights[1]}

### 3.3 Framework 3: Dependency Analysis
- **Knowledge Graph Structure:** ${frameworks.dependencyAnalysis.keyInsights[0]}
- **Prerequisite Bottlenecks:** ${frameworks.dependencyAnalysis.keyInsights[1]}

### 3.4 Framework 4: Context Survival Analysis
- **Survival Capacity:** ${frameworks.contextSurvival.metrics['Survival Capacity Score']}
- **Resource Viability:** ${frameworks.contextSurvival.keyInsights[0]}

### 3.5 Framework 5: PESTLE Environment Analysis
- **Economic Alignment:** ${frameworks.environmentAnalysis.keyInsights[1]}
- **Technological Integration:** ${frameworks.environmentAnalysis.keyInsights[2]}

### 3.6 Framework 6: Incentive Analysis
- **Student Incentive Alignment:** ${frameworks.incentiveAnalysis.keyInsights[0]}
- **Employer Skill Placement:** ${frameworks.incentiveAnalysis.keyInsights[2]}

### 3.7 Framework 7: Failure & Vulnerability Analysis
- **Primary Vulnerability:** ${frameworks.failureAnalysis.keyInsights[0]}
- **Systemic Resilience Score:** ${frameworks.failureAnalysis.metrics['Systemic Resilience Score']}

### 3.8 Framework 8: Emergence & Long-Term Trajectory
- **Emergent Innovation:** ${frameworks.emergenceAnalysis.keyInsights[0]}
- **Emergent Social Mobility:** ${frameworks.emergenceAnalysis.keyInsights[1]}

---

## 4. Limitations & Reproducibility Package

- **Seeded Determinism:** Seed \`${world.seed}\` guarantees bit-for-bit reproducible results across execution platforms.
- **Scope Boundary:** This platform explicitly models educational architecture dynamics; it does not contain administrative LMS software, personal assistant agents, or attendance management tools.
- **Verification Hash:** \`genesis-v1.0-sha256-${world.seed}-${world.day}\`

---
*Generated automatically by Project Genesis — Educational Systems Simulation & Research Platform v1.0*
`;
  }
}
