import type { WorldState, ResearchFrameworkPackage, FrameworkResult } from '../types';

export class ResearchFrameworkEngine {
  static analyzeWorld(world: WorldState): ResearchFrameworkPackage {
    const arch = world.architecture;
    const students = world.students;
    const studentCount = students.length || 1;

    const avgMastery = students.reduce((sum, s) => {
      const vals = Object.values(s.knowledgeMastery);
      return sum + (vals.reduce((a, b) => a + b, 0) / (vals.length || 1));
    }, 0) / studentCount;

    const avgStress = students.reduce((sum, s) => sum + s.stress, 0) / studentCount;
    const avgBurnout = students.reduce((sum, s) => sum + s.burnout, 0) / studentCount;
    const avgMotivation = students.reduce((sum, s) => sum + s.motivation, 0) / studentCount;

    // Framework 1: Five Questions
    const fiveQuestions: FrameworkResult = {
      id: 'f1-five-questions',
      title: 'Framework 1: The Five Questions Analysis',
      summary: 'Interrogates the core rationale, mechanism, and ethical justification of the educational architecture.',
      keyInsights: [
        `WHAT: Educational system configured under ${arch.name} with ${arch.examWeightPct}% exam weight and ${arch.aiIntegrationLevel}% AI integration.`,
        `WHY: Seeks to maximize student mastery (currently ${(avgMastery * 100).toFixed(1)}%) while maintaining societal cohesion.`,
        `HOW: Directs learning through ${arch.studentAutonomyPct}% student autonomy and ${arch.homeworkHoursPerDay} hrs daily homework load.`,
        `SHOULD THIS: Ethical evaluation shows stress level at ${avgStress.toFixed(1)}/100 and burnout risk at ${avgBurnout.toFixed(1)}/100.`,
        `WHY DO THIS: Long-term trajectory yields $${world.economy.gdpProxy.toLocaleString()} GDP proxy and ${world.society.happinessIndex}/100 happiness.`
      ],
      metrics: {
        'Exam Weight': `${arch.examWeightPct}%`,
        'Student Autonomy': `${arch.studentAutonomyPct}%`,
        'Ethical Burnout Risk': `${avgBurnout.toFixed(1)}/100`,
        'Happiness Proxy': `${world.society.happinessIndex}/100`
      },
      details: `The ${arch.name} operates on the premise that student motivation (${avgMotivation.toFixed(1)}/100) can be sustained when funding ($${arch.fundingPerStudentUSD.toLocaleString()}/student) aligns with learning autonomy.`
    };

    // Framework 2: First Principles
    const firstPrinciples: FrameworkResult = {
      id: 'f2-first-principles',
      title: 'Framework 2: First Principles Deconstruction',
      summary: 'Reduces the architecture to irreducible assumptions about human cognition and institutional organization.',
      keyInsights: [
        'Assumption 1: Knowledge transfer is non-linear and governed by prerequisite mastery constraints.',
        'Assumption 2: Human cognitive load is finite; excess homework induces diminishing returns via stress.',
        'Assumption 3: Intrinsic curiosity outlasts extrinsic exam pressures in long-term skill retention.'
      ],
      metrics: {
        'Irreducible Nodes': world.knowledgeGraph.nodes.length,
        'Cognitive Load Index': `${(arch.homeworkHoursPerDay * 12 + arch.examWeightPct * 0.4).toFixed(1)}`,
        'Intrinsic Motivation Baseline': `${avgMotivation.toFixed(1)}/100`
      },
      details: 'Stripping away administrative artifacts reveals that student knowledge acquisition depends fundamentally on prerequisite node coverage and memory decay mitigation.'
    };

    // Framework 3: Dependency Analysis
    const dependencyAnalysis: FrameworkResult = {
      id: 'f3-dependency-analysis',
      title: 'Framework 3: Dependency Graph & Cascade Analysis',
      summary: 'Maps structural prerequisite chains across curriculum nodes and institutional policies.',
      keyInsights: [
        `Knowledge Graph contains ${world.knowledgeGraph.nodes.length} nodes with explicit DAG edges.`,
        'STEM prerequisite bottlenecks identified in Calculus & Programming nodes.',
        `Teacher autonomy (${arch.teacherAutonomyPct}%) serves as a primary prerequisite for curriculum flexibility.`
      ],
      metrics: {
        'Total Knowledge Edges': world.knowledgeGraph.nodes.reduce((sum, n) => sum + n.prerequisiteIds.length, 0),
        'Prerequisite Depth': 4,
        'Teacher Bottleneck Severity': arch.classSize > 30 ? 'High' : 'Low'
      },
      details: 'Failure to master foundational arithmetic cascades directly into blocked software engineering and quantum physics nodes.'
    };

    // Framework 4: Context Survival Analysis
    const contextSurvival: FrameworkResult = {
      id: 'f4-context-survival',
      title: 'Framework 4: Context Survival Analysis',
      summary: 'Determines the environmental limits under which this architecture thrives vs collapses.',
      keyInsights: [
        arch.fundingPerStudentUSD < 6000 
          ? 'WARNING: Low funding environment risks systemic collapse under high class sizes.' 
          : 'STABLE: Financial resources adequately support teacher mentoring and physical infrastructure.',
        avgStress > 65 
          ? 'CRITICAL: High student stress creates context vulnerability to high dropout rates.' 
          : 'HEALTHY: Psychological strain remains within manageable stress thresholds.'
      ],
      metrics: {
        'Survival Capacity Score': `${Math.round(100 - avgBurnout * 0.5 - (arch.classSize > 30 ? 20 : 0))}/100`,
        'Resource Viability': arch.fundingPerStudentUSD >= 10000 ? 'Optimal' : 'Constrained',
        'Stress Boundary Margin': `${(75 - avgStress).toFixed(1)} pts`
      },
      details: 'Identifies whether this model relies on high parental support or external tutoring to mask internal institutional deficiencies.'
    };

    // Framework 5: Environment Analysis (PESTLE)
    const environmentAnalysis: FrameworkResult = {
      id: 'f5-environment-analysis',
      title: 'Framework 5: PESTLE Macro Environment Analysis',
      summary: 'Evaluates Political, Economic, Technological, Cultural, Educational, and Demographic alignment.',
      keyInsights: [
        `Political: Requires institutional backing for ${arch.teacherAutonomyPct}% teacher autonomy.`,
        `Economic: Generates $${world.economy.gdpProxy.toLocaleString()} GDP proxy with ${world.economy.entrepreneurshipRate}% entrepreneurship.`,
        `Technological: Integrates ${arch.aiIntegrationLevel}% AI tutoring systems into daily student workflows.`,
        `Cultural: Social cohesion index stands at ${world.society.socialCohesion}/100.`
      ],
      metrics: {
        'Economic GDP Proxy': `$${world.economy.gdpProxy.toLocaleString()}`,
        'Tech AI Index': `${arch.aiIntegrationLevel}%`,
        'Social Cohesion': `${world.society.socialCohesion}/100`,
        'Automation Resilience': `${world.economy.automationResilience}/100`
      },
      details: 'Macro environment analysis ensures the educational model remains aligned with future workforce demands and automation shifts.'
    };

    // Framework 6: Incentive Analysis
    const incentiveAnalysis: FrameworkResult = {
      id: 'f6-incentive-analysis',
      title: 'Framework 6: Multi-Stakeholder Incentive Analysis',
      summary: 'Analyzes game-theoretic alignment across Students, Teachers, Parents, Government, and Employers.',
      keyInsights: [
        `Students: Incentive to learn driven by ${arch.studentAutonomyPct}% autonomy vs ${arch.examWeightPct}% exam pressure.`,
        `Teachers: Mentoring motivation balanced against burnout (${world.teachers[0]?.burnout.toFixed(1) || 20}/100).`,
        `Employers: Skill demand alignment score at ${world.economy.hiringRate}% hiring placement.`,
        'Government: Return on investment evaluated through GDP growth and social mobility.'
      ],
      metrics: {
        'Student-System Alignment': `${(100 - avgStress * 0.5).toFixed(1)}%`,
        'Teacher Autonomy-Burnout Ratio': `${(arch.teacherAutonomyPct / Math.max(1, world.teachers[0]?.burnout || 20)).toFixed(2)}`,
        'Employer Skill Alignment': `${world.economy.hiringRate}%`
      },
      details: 'When exam weight exceeds 70%, student incentives shift from genuine mastery to test-gaming tactics.'
    };

    // Framework 7: Failure & Vulnerability Analysis
    const failureAnalysis: FrameworkResult = {
      id: 'f7-failure-analysis',
      title: 'Framework 7: Failure Propagation & Resilience Analysis',
      summary: 'Simulates institutional failure modes, stress cascades, and recovery dynamics.',
      keyInsights: [
        `Primary Vulnerability: ${avgBurnout > 40 ? 'Severe student & teacher burnout' : 'Rigid examination bottlenecks'}.`,
        `Failure Propagation Speed: Class size of ${arch.classSize} amplifies feedback delays in learning gap detection.`,
        `Recovery Resilience Score: ${Math.round(world.society.wellbeingIndex * 0.6 + arch.wellbeingFocusPct * 0.4)}/100.`
      ],
      metrics: {
        'Systemic Resilience Score': `${Math.round(world.society.wellbeingIndex * 0.6 + arch.wellbeingFocusPct * 0.4)}/100`,
        'Burnout Cascade Risk': avgBurnout > 35 ? 'Elevated' : 'Low',
        'Crime Risk Proxy': `${world.society.crimeProxy}/100`
      },
      details: 'Evaluates structural recovery time if a cohort experiences sudden economic or psychological shocks.'
    };

    // Framework 8: Emergence & Long-Term Dynamics
    const emergenceAnalysis: FrameworkResult = {
      id: 'f8-emergence-analysis',
      title: 'Framework 8: Emergence & 50-Year Trajectory Analysis',
      summary: 'Detects non-linear emergent behaviors, feedback loops, and multi-generational outcomes.',
      keyInsights: [
        `Emergent Outcome 1: Innovation index reaches ${world.economy.innovationIndex}/100 without explicit scripting.`,
        `Emergent Outcome 2: Social mobility index stabilizes at ${world.society.socialMobilityIndex}/100 over generational runs.`,
        `Long-Term Feedback Loop: High curiosity (${students[0]?.curiosity.toFixed(1) || 60}) drives voluntary self-directed node mastery.`
      ],
      metrics: {
        'Innovation Emergence': `${world.economy.innovationIndex}/100`,
        'Social Mobility Emergence': `${world.society.socialMobilityIndex}/100`,
        'Cumulative Research Breakthroughs': world.society.researchBreakthroughs
      },
      details: 'Emergence demonstrates that micro-level student-teacher interactions spontaneously yield macro-level economic innovation and social mobility.'
    };

    return {
      fiveQuestions,
      firstPrinciples,
      dependencyAnalysis,
      contextSurvival,
      environmentAnalysis,
      incentiveAnalysis,
      failureAnalysis,
      emergenceAnalysis
    };
  }
}
