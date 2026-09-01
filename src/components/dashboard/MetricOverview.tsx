import React from 'react';
import { Brain, Flame, TrendingUp, Sparkles, Smile, ShieldAlert } from 'lucide-react';
import type { WorldState } from '../../engine/types';

interface MetricOverviewProps {
  world: WorldState;
}

export const MetricOverview: React.FC<MetricOverviewProps> = ({ world }) => {
  const studentCount = world.students.length || 1;
  
  const totalMasterySum = world.students.reduce((sum, s) => {
    const vals = Object.values(s.knowledgeMastery);
    return sum + (vals.reduce((a, b) => a + b, 0) / (vals.length || 1));
  }, 0);

  const avgMasteryPct = Math.round((totalMasterySum / studentCount) * 100);
  const avgStress = Math.round(world.students.reduce((sum, s) => sum + s.stress, 0) / studentCount);
  const avgBurnout = Math.round(world.students.reduce((sum, s) => sum + s.burnout, 0) / studentCount);
  const innovationVal = Number(world.economy.innovationIndex).toFixed(2);

  const cards = [
    {
      title: 'Knowledge Mastery',
      value: `${avgMasteryPct}%`,
      subtitle: `${world.knowledgeGraph.nodes.length} Prerequisite Nodes`,
      icon: Brain,
      colorClass: 'card-cyan',
      trend: '+2.4% / year'
    },
    {
      title: 'Psychological Stress',
      value: `${avgStress} / 100`,
      subtitle: `Burnout Risk: ${avgBurnout}/100`,
      icon: ShieldAlert,
      colorClass: avgStress > 65 ? 'card-red' : 'card-amber',
      trend: avgStress > 65 ? 'High Strain' : 'Nominal'
    },
    {
      title: 'GDP Proxy',
      value: `$${world.economy.gdpProxy.toLocaleString()}`,
      subtitle: `${Number(world.economy.entrepreneurshipRate).toFixed(1)}% Entrepreneurship`,
      icon: TrendingUp,
      colorClass: 'card-green',
      trend: 'Per Capita Output'
    },
    {
      title: 'Innovation Index',
      value: `${innovationVal} / 100`,
      subtitle: `${world.society.researchBreakthroughs} Research Papers`,
      icon: Sparkles,
      colorClass: 'card-purple',
      trend: `${Number(world.economy.automationResilience).toFixed(1)}% Auto Resilience`
    },
    {
      title: 'Societal Wellbeing',
      value: `${Math.round(world.society.happinessIndex)} / 100`,
      subtitle: `Cohesion: ${Math.round(world.society.socialCohesion)}/100`,
      icon: Smile,
      colorClass: 'card-emerald',
      trend: `Crime Proxy: ${Number(world.society.crimeProxy).toFixed(1)}/100`
    },
    {
      title: 'Social Mobility',
      value: `${Math.round(world.society.socialMobilityIndex)} / 100`,
      subtitle: `Funding: $${world.architecture.fundingPerStudentUSD.toLocaleString()}`,
      icon: Flame,
      colorClass: 'card-blue',
      trend: `${world.architecture.examWeightPct}% Exam Weight`
    }
  ];

  // SVG Chart rendering helper
  const history = world.history;
  const maxPts = 50;
  const recentHistory = history.slice(-maxPts);

  const renderSvgLine = (key: keyof typeof history[0], color: string, maxVal: number = 100) => {
    if (recentHistory.length < 2) return null;
    const width = 280;
    const height = 60;
    const points = recentHistory.map((pt, i) => {
      const x = (i / (recentHistory.length - 1)) * width;
      const y = height - (Number(pt[key]) / maxVal) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="sparkline-svg">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="metrics-section">
      <div className="metrics-grid">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className={`metric-card ${c.colorClass}`}>
              <div className="card-top">
                <span className="card-title">{c.title}</span>
                <div className="icon-wrapper">
                  <Icon size={20} />
                </div>
              </div>
              <div className="card-value">{c.value}</div>
              <div className="card-bottom">
                <span className="card-subtitle">{c.subtitle}</span>
                <span className="card-trend">{c.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-Time Longitudinal Trends Chart */}
      <div className="chart-panel">
        <div className="panel-header">
          <h3>Longitudinal Trajectory (Simulated History)</h3>
          <span className="panel-sub">50-Year Macro & Cognitive Dynamics</span>
        </div>

        <div className="sparklines-grid">
          <div className="sparkline-card">
            <span className="spark-title">Knowledge Mastery (%)</span>
            {renderSvgLine('avgKnowledgePct', '#00F2FE', 100)}
          </div>
          <div className="sparkline-card">
            <span className="spark-title">Student Stress Index</span>
            {renderSvgLine('avgStress', '#EF4444', 100)}
          </div>
          <div className="sparkline-card">
            <span className="spark-title">GDP Proxy ($)</span>
            {renderSvgLine('gdpProxy', '#10B981', 120000)}
          </div>
          <div className="sparkline-card">
            <span className="spark-title">Innovation Index</span>
            {renderSvgLine('innovationIndex', '#8B5CF6', 100)}
          </div>
        </div>
      </div>
    </div>
  );
};
