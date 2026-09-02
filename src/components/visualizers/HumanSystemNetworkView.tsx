import React, { useState } from 'react';
import { Brain, Heart, Activity, Users, Eye, BookOpen, Scale, Moon, Network, Shield, Anchor } from 'lucide-react';
import type { EpistemicCategory, ValidationState } from '../../engine/core/ontology';

interface NetworkNode {
  id: string;
  label: string;
  domain: 'cognitive' | 'psychological' | 'physiological' | 'emotional' | 'social_relational';
  icon: React.ElementType;
  description: string;
  epistemicCategory: EpistemicCategory;
  validationState: ValidationState;
  confidence: number;
}

const networkNodes: NetworkNode[] = [
  // Cognitive
  { id: 'cog_perc', label: 'Perception (Observer)', domain: 'cognitive', icon: Eye, description: 'Observer/Architect Drive. Seeks awareness, meta-control, and structural understanding.', epistemicCategory: 'PERSONAL_OBSERVATION', validationState: 'Hypothesized', confidence: 0.9 },
  { id: 'cog_mem', label: 'Extended Memory', domain: 'cognitive', icon: Brain, description: 'Distributed cognition. Offloading working memory to environments.', epistemicCategory: 'THEORETICAL', validationState: 'Supported', confidence: 0.8 },
  { id: 'cog_learn', label: 'Pattern Unification', domain: 'cognitive', icon: BookOpen, description: 'Cognitive compression mechanisms. Recognizing templates.', epistemicCategory: 'PERSONAL_OBSERVATION', validationState: 'Hypothesized', confidence: 0.95 },
  
  // Psychological
  { id: 'psy_ident', label: 'Identity Core (Trisha)', domain: 'psychological', icon: Anchor, description: 'Triadic Core: "She" (Trisha). The non-negotiable anchor.', epistemicCategory: 'PERSONAL_OBSERVATION', validationState: 'Hypothesized', confidence: 0.99 },
  { id: 'psy_trust', label: 'Trust Core (Anwesha)', domain: 'psychological', icon: Heart, description: 'Triadic Core: "Her" (Anwesha). The stability channel.', epistemicCategory: 'PERSONAL_OBSERVATION', validationState: 'Hypothesized', confidence: 0.95 },
  { id: 'psy_guard', label: 'Guardian Core (Princess)', domain: 'psychological', icon: Shield, description: 'Triadic Core: "Princess". Custodial, protective instinct.', epistemicCategory: 'PERSONAL_OBSERVATION', validationState: 'Hypothesized', confidence: 0.95 },
  
  // Physiological
  { id: 'phys_sleep', label: 'Sleep & Recovery', domain: 'physiological', icon: Moon, description: 'Circadian rhythms and stamina regeneration.', epistemicCategory: 'EMPIRICAL', validationState: 'Established', confidence: 0.9 },
  { id: 'phys_bio', label: 'Allostatic Load', domain: 'physiological', icon: Activity, description: 'Cortisol proxy. Tracks the cumulative wear-and-tear of constant threat detection.', epistemicCategory: 'THEORETICAL', validationState: 'Supported', confidence: 0.6 },
  
  // Emotional
  { id: 'emo_state', label: 'ALENA Baseline', domain: 'emotional', icon: Scale, description: 'The Integration Drive. A default operating state seeking quiet nervous systems.', epistemicCategory: 'PERSONAL_OBSERVATION', validationState: 'Hypothesized', confidence: 0.9 },
  
  // Social
  { id: 'soc_rel', label: 'Environmental Calibrator', domain: 'social_relational', icon: Users, description: 'Meso-scale cue (e.g., Angeline). Functions as a contextual safety signal.', epistemicCategory: 'PERSONAL_OBSERVATION', validationState: 'Hypothesized', confidence: 0.85 },
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
              
              <div className="ontology-meta">
                <div className="meta-row">
                  <span className="meta-label">Provenance:</span>
                  <span className={`meta-value type-${activeNode.epistemicCategory}`}>{activeNode.epistemicCategory.replace('_', ' ')}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Validation:</span>
                  <span className={`meta-value state-${activeNode.validationState}`}>{activeNode.validationState}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Confidence:</span>
                  <div className="confidence-bar">
                    <div className="confidence-fill" style={{ width: `${activeNode.confidence * 100}%` }}></div>
                  </div>
                  <span className="confidence-text">{(activeNode.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>

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
