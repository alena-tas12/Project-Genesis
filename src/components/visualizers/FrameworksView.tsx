import React, { useState } from 'react';
import type { ResearchFrameworkPackage } from '../../engine/types';
import { Sparkles, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FrameworksViewProps {
  frameworks: ResearchFrameworkPackage;
}

export const FrameworksView: React.FC<FrameworksViewProps> = ({ frameworks }) => {
  const [expandedId, setExpandedId] = useState<string | null>(frameworks.fiveQuestions.id);

  const frameworkList = [
    frameworks.fiveQuestions,
    frameworks.firstPrinciples,
    frameworks.dependencyAnalysis,
    frameworks.contextSurvival,
    frameworks.environmentAnalysis,
    frameworks.incentiveAnalysis,
    frameworks.failureAnalysis,
    frameworks.emergenceAnalysis
  ];

  return (
    <div className="frameworks-container">
      <div className="frameworks-header">
        <Sparkles className="icon-purple" size={24} />
        <div>
          <h2>The 8 Scientific Research Frameworks</h2>
          <p className="subtitle">
            Every simulation experiment automatically undergoes rigorous multi-framework evaluation before publication.
          </p>
        </div>
      </div>

      <div className="frameworks-grid">
        {frameworkList.map(fw => {
          const isExpanded = expandedId === fw.id;
          return (
            <div key={fw.id} className={`framework-card ${isExpanded ? 'expanded' : ''}`}>
              <div
                className="card-header-clickable"
                onClick={() => setExpandedId(isExpanded ? null : fw.id)}
              >
                <div className="title-area">
                  <CheckCircle2 size={18} className="icon-cyan" />
                  <h4>{fw.title}</h4>
                </div>

                <div className="header-right">
                  <span className="summary-pill">{Object.keys(fw.metrics).length} Metrics</span>
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              <p className="fw-summary">{fw.summary}</p>

              {isExpanded && (
                <div className="fw-body-expanded">
                  {/* Metrics Badge Row */}
                  <div className="fw-metrics-row">
                    {Object.entries(fw.metrics).map(([k, v]) => (
                      <div key={k} className="fw-metric-badge">
                        <span className="m-label">{k}:</span>
                        <span className="m-val">{String(v)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Key Insights List */}
                  <div className="insights-box">
                    <h5>Key Research Insights</h5>
                    <ul className="insights-list">
                      {fw.keyInsights.map((insight, idx) => (
                        <li key={idx} className="insight-item">
                          <AlertCircle size={14} className="icon-purple" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="fw-details-text">{fw.details}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
