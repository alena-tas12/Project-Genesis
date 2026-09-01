import React, { useState } from 'react';
import type { WorldState } from '../../engine/types';
import { TrendingUp, Smile, ShieldCheck, Activity, BarChart3, Layers } from 'lucide-react';

interface MacroImpactViewProps {
  world: WorldState;
}

export const MacroImpactView: React.FC<MacroImpactViewProps> = ({ world }) => {
  const [activeGraphTab, setActiveGraphTab] = useState<'economic' | 'societal' | 'policy'>('economic');

  const history = world.history;
  const recent = history.slice(-50);

  const renderSparkline = (key: keyof typeof history[0], color: string, maxVal: number = 100) => {
    if (recent.length < 2) return null;
    const width = 500;
    const height = 120;
    const points = recent.map((pt, i) => {
      const x = (i / (recent.length - 1)) * width;
      const y = height - (Number(pt[key]) / maxVal) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    return (
      <svg width="100%" height="120" viewBox={`0 0 ${width} ${height}`} className="macro-graph-svg">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  const arch = world.architecture;

  return (
    <div className="macro-view-container">
      <div className="macro-header">
        <div className="title-group">
          <Activity className="icon-cyan" size={24} />
          <div>
            <h2>Macro Economic, Societal & Policy Graphs</h2>
            <p className="subtitle">
              Longitudinal trajectory tracking for economic output, societal wellbeing, and policy alignment.
            </p>
          </div>
        </div>

        <div className="graph-tab-selector">
          <button
            onClick={() => setActiveGraphTab('economic')}
            className={`graph-tab-btn ${activeGraphTab === 'economic' ? 'active' : ''}`}
          >
            <TrendingUp size={15} />
            <span>Economic Graph</span>
          </button>

          <button
            onClick={() => setActiveGraphTab('societal')}
            className={`graph-tab-btn ${activeGraphTab === 'societal' ? 'active' : ''}`}
          >
            <Smile size={15} />
            <span>Societal Graph</span>
          </button>

          <button
            onClick={() => setActiveGraphTab('policy')}
            className={`graph-tab-btn ${activeGraphTab === 'policy' ? 'active' : ''}`}
          >
            <Layers size={15} />
            <span>Policy Graph</span>
          </button>
        </div>
      </div>

      {activeGraphTab === 'economic' && (
        <div className="graph-content-card">
          <div className="graph-card-header">
            <BarChart3 className="icon-green" size={20} />
            <h3>Economic Graph ÔÇö Innovation & GDP Trajectory</h3>
          </div>

          <div className="charts-dual-grid">
            <div className="big-chart-card">
              <h4>Nominal GDP Per Capita Proxy ($)</h4>
              <div className="chart-wrapper">
                {renderSparkline('gdpProxy', '#10B981', 120000)}
              </div>
              <div className="chart-footer">
                <span>Current GDP: <strong>${world.economy.gdpProxy.toLocaleString()}</strong></span>
                <span>Placement Rate: <strong>{world.economy.hiringRate}%</strong></span>
              </div>
            </div>

            <div className="big-chart-card">
              <h4>Innovation Index (0-100)</h4>
              <div className="chart-wrapper">
                {renderSparkline('innovationIndex', '#8B5CF6', 100)}
              </div>
              <div className="chart-footer">
                <span>Entrepreneurship: <strong>{world.economy.entrepreneurshipRate}%</strong></span>
                <span>Automation Resilience: <strong>{world.economy.automationResilience}%</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeGraphTab === 'societal' && (
        <div className="graph-content-card">
          <div className="graph-card-header">
            <Smile className="icon-cyan" size={20} />
            <h3>Societal Graph ÔÇö Happiness & Social Mobility Trajectory</h3>
          </div>

          <div className="charts-dual-grid">
            <div className="big-chart-card">
              <h4>Societal Happiness Index (0-100)</h4>
              <div className="chart-wrapper">
                {renderSparkline('happinessIndex', '#00F2FE', 100)}
              </div>
              <div className="chart-footer">
                <span>Happiness: <strong>{world.society.happinessIndex} / 100</strong></span>
                <span>Crime Proxy: <strong>{world.society.crimeProxy} / 100</strong></span>
              </div>
            </div>

            <div className="big-chart-card">
              <h4>Social Mobility Index (0-100)</h4>
              <div className="chart-wrapper">
                {renderSparkline('socialMobilityIndex', '#F59E0B', 100)}
              </div>
              <div className="chart-footer">
                <span>Social Cohesion: <strong>{world.society.socialCohesion} / 100</strong></span>
                <span>Research Breakthroughs: <strong>{world.society.researchBreakthroughs}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeGraphTab === 'policy' && (
        <div className="graph-content-card">
          <div className="graph-card-header">
            <ShieldCheck className="icon-purple" size={20} />
            <h3>Policy Graph ÔÇö Active Educational System Constraints</h3>
          </div>

          <div className="policy-matrix-grid">
            <div className="policy-node-card">
              <span className="p-title">Exam Weight Policy</span>
              <span className="p-val">{arch.examWeightPct}%</span>
              <span className="p-desc">High-stakes testing emphasis vs continuous project evaluation</span>
            </div>

            <div className="policy-node-card">
              <span className="p-title">Daily Homework Load</span>
              <span className="p-val">{arch.homeworkHoursPerDay} hrs</span>
              <span className="p-desc">Prescribed daily study hours outside classroom</span>
            </div>

            <div className="policy-node-card">
              <span className="p-title">AI Integration Level</span>
              <span className="p-val">{arch.aiIntegrationLevel}%</span>
              <span className="p-desc">Extent of 1-on-1 AI agent tutoring in knowledge graph navigation</span>
            </div>

            <div className="policy-node-card">
              <span className="p-title">Student Learning Autonomy</span>
              <span className="p-val">{arch.studentAutonomyPct}%</span>
              <span className="p-desc">Self-directed pacing and subject node selection freedom</span>
            </div>

            <div className="policy-node-card">
              <span className="p-title">Teacher Syllabus Autonomy</span>
              <span className="p-val">{arch.teacherAutonomyPct}%</span>
              <span className="p-desc">Pedagogical freedom and curriculum customization rights</span>
            </div>

            <div className="policy-node-card">
              <span className="p-title">Institutional Funding</span>
              <span className="p-val">${arch.fundingPerStudentUSD.toLocaleString()}</span>
              <span className="p-desc">Annual investment per student into resources and infrastructure</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
