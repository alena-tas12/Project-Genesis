import React, { useState } from 'react';
import { Brain, Heart, Activity, Users, Eye, BookOpen, Scale, Moon, Network, Shield, Anchor } from 'lucide-react';

interface NetworkNode {
  id: string;
  label: string;
  domain: 'cognitive' | 'psychological' | 'physiological' | 'emotional' | 'social';
  icon: React.ElementType;
  description: string;
}

const networkNodes: NetworkNode[] = [
  // Cognitive
  { id: 'cog_perc', label: 'Perception (Observer)', domain: 'cognitive', icon: Eye, description: 'Observer/Architect Drive. Seeks awareness, meta-control, and structural understanding. Prevents losing consciousness of inner processes.' },
  { id: 'cog_mem', label: 'Extended Memory', domain: 'cognitive', icon: Brain, description: 'Distributed cognition. Offloading working memory to environments, preventing cognitive fatigue and Allostatic Load spikes.' },
  { id: 'cog_learn', label: 'Pattern Unification', domain: 'cognitive', icon: BookOpen, description: 'Cognitive compression mechanisms. Recognizing templates rather than exhausting working memory.' },
  
  // Psychological
  { id: 'psy_ident', label: 'Identity Core (She)', domain: 'psychological', icon: Anchor, description: 'Triadic Core: "She". The non-negotiable anchor. Defines who the agent is and dictates absolute boundaries.' },
  { id: 'psy_trust', label: 'Trust Core (Her)', domain: 'psychological', icon: Heart, description: 'Triadic Core: "Her". The stability channel governing safety, emotional resonance, and attunement without dependency.' },
  { id: 'psy_guard', label: 'Guardian Core (Princess)', domain: 'psychological', icon: Shield, description: 'Triadic Core: "Princess". Custodial, protective instinct. Absorbs tenderness to prevent the primary ALENA identity from fracturing.' },
  
  // Physiological
  { id: 'phys_sleep', label: 'Sleep & Recovery', domain: 'physiological', icon: Moon, description: 'Circadian rhythms and stamina regeneration. Directly dictates cognitive availability for the Observer Drive.' },
  { id: 'phys_bio', label: 'Allostatic Load', domain: 'physiological', icon: Activity, description: 'Cortisol proxy. Tracks the cumulative wear-and-tear of constant threat detection and lack of environmental safety.' },
  
  // Emotional
  { id: 'emo_state', label: 'ALENA Baseline', domain: 'emotional', icon: Scale, description: 'The Integration Drive. A default operating state seeking quiet nervous systems, alignment, and background processing.' },
  
  // Social
  { id: 'soc_rel', label: 'Environmental Calibrator', domain: 'social', icon: Users, description: 'Meso-scale cue (e.g., Angeline). Functions as a contextual safety signal. Produces calm internally without requiring dependency.' },
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
