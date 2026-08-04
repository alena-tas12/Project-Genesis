import React, { useState } from 'react';
import type { KnowledgeGraph, KnowledgeNode, StudentAgent } from '../../engine/types';
import { Share2, Info, ArrowRight } from 'lucide-react';

interface KnowledgeGraphViewProps {
  graph: KnowledgeGraph;
  students: StudentAgent[];
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({ graph, students }) => {
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(graph.nodes[0] || null);

  // Compute average student mastery per node
  const getNodeAvgMastery = (nodeId: string): number => {
    if (!students.length) return 0;
    const sum = students.reduce((acc, s) => acc + (s.knowledgeMastery[nodeId] || 0), 0);
    return Math.round((sum / students.length) * 100);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'STEM': return '#00F2FE';
      case 'Humanities': return '#8B5CF6';
      case 'Social': return '#F59E0B';
      case 'Arts': return '#EC4899';
      case 'Practical': return '#10B981';
      case 'Ethics': return '#3B82F6';
      default: return '#9CA3AF';
    }
  };

  return (
    <div className="graph-container">
      <div className="graph-header">
        <div className="title-group">
          <Share2 className="icon-cyan" size={24} />
          <div>
            <h2>Knowledge Graph Architecture (DAG)</h2>
            <p className="subtitle">
              Nodes replace traditional static courses with prerequisite-driven skill trees and memory retention decay.
            </p>
          </div>
        </div>
      </div>

      <div className="graph-content-layout">
        {/* Node Cards Canvas Grid */}
        <div className="nodes-grid">
          {graph.nodes.map(node => {
            const masteryPct = getNodeAvgMastery(node.id);
            const isSelected = selectedNode?.id === node.id;
            const catColor = getCategoryColor(node.category);

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`node-card ${isSelected ? 'selected' : ''}`}
                style={{ borderColor: isSelected ? catColor : 'rgba(255, 255, 255, 0.08)' }}
              >
                <div className="node-top">
                  <span className="node-category" style={{ backgroundColor: `${catColor}22`, color: catColor }}>
                    {node.category}
                  </span>
                  <span className="node-diff">Diff: {node.difficulty}/10</span>
                </div>

                <h4 className="node-title">{node.title}</h4>

                <div className="node-bottom">
                  <div className="mastery-bar-wrapper">
                    <div className="mastery-bar-fill" style={{ width: `${masteryPct}%`, backgroundColor: catColor }} />
                  </div>
                  <span className="mastery-text">{masteryPct}% Mastery</span>
                </div>

                {node.prerequisiteIds.length > 0 && (
                  <div className="node-prereqs">
                    <span>Prereqs: {node.prerequisiteIds.length}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Node Inspector Side Panel */}
        {selectedNode && (
          <div className="node-inspector">
            <div className="inspector-header">
              <Info size={18} className="icon-cyan" />
              <h3>Node Inspector</h3>
            </div>

            <div className="inspector-body">
              <div className="inspect-row">
                <span className="label">Title</span>
                <span className="val-highlight">{selectedNode.title}</span>
              </div>

              <div className="inspect-row">
                <span className="label">Category</span>
                <span className="val">{selectedNode.category}</span>
              </div>

              <div className="inspect-row">
                <span className="label">Difficulty</span>
                <span className="val">{selectedNode.difficulty} / 10</span>
              </div>

              <div className="inspect-row">
                <span className="label">Ebbinghaus Retention Half-Life</span>
                <span className="val">{selectedNode.retentionHalfLifeDays} Days</span>
              </div>

              <div className="inspect-row">
                <span className="label">Transfer Factor</span>
                <span className="val">{(selectedNode.transferFactor * 100).toFixed(0)}%</span>
              </div>

              <div className="inspect-row">
                <span className="label">Current Population Mastery</span>
                <span className="val-cyan">{getNodeAvgMastery(selectedNode.id)}%</span>
              </div>

              <div className="prereq-section">
                <h4>Prerequisite Chain</h4>
                {selectedNode.prerequisiteIds.length === 0 ? (
                  <p className="empty-text">Root Node (No prerequisites)</p>
                ) : (
                  <ul className="prereq-list">
                    {selectedNode.prerequisiteIds.map(reqId => {
                      const reqNode = graph.nodes.find(n => n.id === reqId);
                      return (
                        <li key={reqId} className="prereq-item">
                          <ArrowRight size={14} className="icon-cyan" />
                          <span>{reqNode ? reqNode.title : reqId}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
