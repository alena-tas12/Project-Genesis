import type { FC } from 'react';
import { ShieldCheck, Cpu, Sliders, GitBranch, Share2, Users, Sparkles, BookOpen, Download, Box } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  seed: number;
  currentDay: number;
  currentYear: number;
  onExportPackage: () => void;
}

export const Navbar: FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  seed,
  currentDay,
  currentYear,
  onExportPackage
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Research Dashboard', icon: Cpu },
    { id: 'designer', label: 'Architecture Designer', icon: Sliders },
    { id: 'experiments', label: 'Experiment Runner', icon: GitBranch },
    { id: 'classroom3d', label: '3D Spatial Visualizer', icon: Box },
    { id: 'population', label: 'Population & Faculty', icon: Users },
    { id: 'knowledge', label: 'Knowledge Graph', icon: Share2 },
    { id: 'frameworks', label: 'Research Frameworks', icon: Sparkles },
    { id: 'publication', label: 'Publication Package', icon: BookOpen }
  ];

  return (
    <header className="header-bar">
      <div className="brand-section">
        <div className="brand-logo">
          <div className="logo-icon-glow" />
          <span className="logo-text">PROJECT GENESIS</span>
        </div>
        <span className="version-badge">
          v1.0 Research Architecture
        </span>
      </div>

      <nav className="nav-tabs">
        {tabs.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`nav-button ${isActive ? 'active' : ''}`}
            >
              <Icon className="nav-icon" size={15} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="header-actions">
        <div className="seed-indicator">
          <ShieldCheck size={14} className="seed-icon" />
          <span>Seed: <strong>{seed}</strong></span>
          <span className="divider">|</span>
          <span>Day {currentDay}, Yr {currentYear}</span>
        </div>

        <button onClick={onExportPackage} className="btn-export-quick">
          <Download size={14} />
          <span>Toolkit</span>
        </button>
      </div>
    </header>
  );
};
