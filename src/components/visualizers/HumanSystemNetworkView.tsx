import React, { useState } from 'react';
import { Brain, Heart, Activity, Users, Zap, Eye, BookOpen, Scale, Moon, Network } from 'lucide-react';

interface NetworkNode {
  id: string;
  label: string;
  domain: 'cognitive' | 'psychological' | 'physiological' | 'emotional' | 'social';
  icon: React.ElementType;
  description: string;
}

const networkNodes: NetworkNode[] = [
  { id: 'cog_perc', label: 'Perception', domain: 'cognitive', icon: Eye, description: 'Sensory filtering and attention allocation.' },
  { id: 'cog_mem', label: 'Memory', domain: 'cognitive', icon: Brain, description: 'Ebbinghaus decay models and semantic retention.' },
  { id: 'cog_learn', label: 'Learning', domain: 'cognitive', icon: BookOpen, description: 'Knowledge DAG traversal and skill acquisition.' },
  { id: 'psy_mot', label: 'Motivation', domain: 'psychological', icon: Zap, description: 'Intrinsic vs extrinsic drive mechanisms.' },
  { id: 'psy_stress', label: 'Stress / Burnout', domain: 'psychological', icon: Activity, description: 'Cortisol proxy and allostatic load.' },
  { id: 'psy_adapt', label: 'Adaptation', domain: 'psychological', icon: Scale, description: 'Resilience and coping mechanisms.' },
  { id: 'phys_sleep', label: 'Sleep & Recovery', domain: 'physiological', icon: Moon, description: 'Circadian rhythms and stamina regeneration.' },
  { id: 'phys_bio', label: 'Biological State', domain: 'physiological', icon: Activity, description: 'Energy levels and baseline physical health.' },
  { id: 'emo_state', label: 'Affective State', domain: 'emotional', icon: Heart, description: 'Valence and arousal representations.' },
  { id: 'soc_rel', label: 'Relational Bonds', domain: 'social', icon: Users, description: 'Peer networks and mentor influence.' },
];

export const HumanSystemNetworkView: React.FC = () => {
  const [activeNode, setActiveNode] = useState<NetworkNode | null>(null);

  return (
    <div className="human-network-container fade-in">
      <div className="network-header">
        <div className="header-title">
          <Network className="icon-cyan" size={24} />
          <h2>Human Cognitive & Psychological Network Model</h2>
        </div>
        <p className="subtitle">
          Genesis computational proxies for Micro-Scale (Individual) developmental trajectories.
          Interactions between Experience, Perception, Interpretation, and Memory form behavioral outcomes.
        </p>
      </div>

      <div className="network-layout">
        <div className="network-grid">
          {['cognitive', 'psychological', 'physiological', 'emotional', 'social'].map(domain => (
            <div key={domain} className="domain-column">
              <h3 className="domain-title">{domain.toUpperCase()}</h3>
              <div className="node-list">
                {networkNodes.filter(n => n.domain === domain).map(node => {
                  const Icon = node.icon;
                  return (
                    <button
                      key={node.id}
                      className={`network-node ${activeNode?.id === node.id ? 'active' : ''}`}
                      onClick={() => setActiveNode(node)}
                    >
                      <Icon size={18} className={`icon-${domain}`} />
                      <span>{node.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="network-inspector">
          {activeNode ? (
            <div className="inspector-card fade-in">
              <div className="inspector-top">
                <activeNode.icon size={28} className={`icon-${activeNode.domain}`} />
                <h3>{activeNode.label}</h3>
                <span className={`domain-badge badge-${activeNode.domain}`}>{activeNode.domain}</span>
              </div>
              <p className="inspector-desc">{activeNode.description}</p>
              
              <div className="feedback-loop">
                <h4>Simulated Feedback Loop</h4>
                <div className="loop-track">
                  <span className="loop-step">Experience</span>
                  <span className="loop-arrow">→</span>
                  <span className="loop-step highlight">Interpretation</span>
                  <span className="loop-arrow">→</span>
                  <span className="loop-step">Behavior</span>
                </div>
                <p className="loop-note">
                  Computational representations only. Does not diagnose literal physiological states.
                </p>
              </div>
            </div>
          ) : (
            <div className="inspector-placeholder">
              <Network size={48} className="icon-muted" />
              <p>Select a neural or psychological node to inspect its computational proxy properties.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
