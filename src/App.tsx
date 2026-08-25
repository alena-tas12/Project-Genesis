import React, { useState, useEffect } from 'react';
import type { WorldState, EducationalArchitecture } from './engine/types';
import { Simulator } from './engine/simulation/simulator';
import { PRESET_ARCHITECTURES } from './engine/architecture/presetArchitectures';
import { ResearchFrameworkEngine } from './engine/research/frameworks';
import { FileExporter } from './utils/exporter';

// UI Components
import { Navbar } from './components/layout/Navbar';
import { SimulationControls } from './components/dashboard/SimulationControls';
import { MetricOverview } from './components/dashboard/MetricOverview';
import { WorldComparison } from './components/dashboard/WorldComparison';
import { KnowledgeGraphView } from './components/visualizers/KnowledgeGraphView';
import { PopulationAnalytics } from './components/visualizers/PopulationAnalytics';
import { MacroImpactView } from './components/visualizers/MacroImpactView';
import { Classroom3DView } from './components/visualizers/Classroom3DView';
import { FrameworksView } from './components/visualizers/FrameworksView';
import { ArchitectureDesigner } from './components/designer/ArchitectureDesigner';
import { ResearchPaperView } from './components/research/ResearchPaperView';
import { KarmayogiCompetencyView } from './components/capacity/KarmayogiCompetencyView';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Initialize 17 parallel comparative worlds for all global educational systems
  const [allWorlds, setAllWorlds] = useState<WorldState[]>(() => [
    Simulator.createWorld('Traditional System', PRESET_ARCHITECTURES.traditional, 40, 42),
    Simulator.createWorld('Montessori Model', PRESET_ARCHITECTURES.montessori, 40, 42),
    Simulator.createWorld('Finnish Equality Model', PRESET_ARCHITECTURES.finnish, 40, 42),
    Simulator.createWorld('Japanese Mastery Model', PRESET_ARCHITECTURES.japanese, 40, 42),
    Simulator.createWorld('AI-Assisted Adaptive Engine', PRESET_ARCHITECTURES.ai_assisted, 40, 42),
    Simulator.createWorld('Waldorf (Steiner) Education', PRESET_ARCHITECTURES.waldorf, 40, 42),
    Simulator.createWorld('Reggio Emilia Approach', PRESET_ARCHITECTURES.reggio_emilia, 40, 42),
    Simulator.createWorld('International Baccalaureate (IB)', PRESET_ARCHITECTURES.ib_diploma, 40, 42),
    Simulator.createWorld('Harkness Discussion Model', PRESET_ARCHITECTURES.harkness, 40, 42),
    Simulator.createWorld('Sudbury Democratic School', PRESET_ARCHITECTURES.sudbury, 40, 42),
    Simulator.createWorld('Singapore Math & Mastery', PRESET_ARCHITECTURES.singapore_mastery, 40, 42),
    Simulator.createWorld('Prussian Industrial Model', PRESET_ARCHITECTURES.prussian_industrial, 40, 42),
    Simulator.createWorld('South Korea Suneung System', PRESET_ARCHITECTURES.south_korea_suneung, 40, 42),
    Simulator.createWorld('Germany Dual VET System', PRESET_ARCHITECTURES.germany_dual_vet, 40, 42),
    Simulator.createWorld('France Baccalauréat System', PRESET_ARCHITECTURES.france_baccalaureat, 40, 42),
    Simulator.createWorld('China Gaokao Meritocracy', PRESET_ARCHITECTURES.china_gaokao, 40, 42),
    Simulator.createWorld('India NEP 2020 Model', PRESET_ARCHITECTURES.india_nep2020, 40, 42)
  ]);

  const [activeWorldId, setActiveWorldId] = useState<string>(allWorlds[0].id);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const activeWorld = allWorlds.find(w => w.id === activeWorldId) || allWorlds[0];

  // Simulation tick loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setAllWorlds(prevWorlds =>
        prevWorlds.map(w => {
          if (w.id === activeWorldId) {
            let updated = w;
            for (let i = 0; i < speed; i++) {
              updated = Simulator.tickDay(updated);
            }
            return updated;
          }
          return w;
        })
      );
    }, 150);

    return () => clearInterval(interval);
  }, [isRunning, activeWorldId, speed]);

  // Step 1 Day manually
  const handleStepDay = () => {
    setAllWorlds(prev =>
      prev.map(w => (w.id === activeWorldId ? Simulator.tickDay(w) : w))
    );
  };

  // Fast forward active world by N days
  const handleFastForward = (days: number) => {
    setAllWorlds(prev =>
      prev.map(w => (w.id === activeWorldId ? Simulator.fastForward(w, days) : w))
    );
  };

  // Fast forward ALL comparative worlds simultaneously
  const handleRunBatchExperiment = (days: number) => {
    setAllWorlds(prev => prev.map(w => Simulator.fastForward(w, days)));
  };

  // Reset active world
  const handleResetWorld = () => {
    setAllWorlds(prev =>
      prev.map(w =>
        w.id === activeWorldId
          ? Simulator.createWorld(w.name, w.architecture, w.students.length, w.seed)
          : w
      )
    );
  };

  // Apply custom architecture to active world
  const handleApplyArchitecture = (newArch: EducationalArchitecture) => {
    setAllWorlds(prev =>
      prev.map(w => {
        if (w.id === activeWorldId) {
          return {
            ...w,
            architecture: newArch,
            name: newArch.name
          };
        }
        return w;
      })
    );
  };

  // Generate 8 Frameworks analysis for active world
  const activeFrameworks = ResearchFrameworkEngine.analyzeWorld(activeWorld);

  return (
    <div className="genesis-app">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        seed={activeWorld.seed}
        currentDay={activeWorld.day}
        currentYear={activeWorld.year}
        onExportPackage={() => FileExporter.exportReproducibilityPackageJSON(activeWorld)}
      />

      <main className="main-content">
        {/* Global Controls bar visible across research views */}
        <SimulationControls
          world={activeWorld}
          allWorlds={allWorlds}
          onSelectWorld={setActiveWorldId}
          isRunning={isRunning}
          onTogglePlay={() => setIsRunning(!isRunning)}
          onStepDay={handleStepDay}
          onFastForward={handleFastForward}
          speed={speed}
          setSpeed={setSpeed}
          onResetWorld={handleResetWorld}
        />

        {/* Tab 1: Research Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="tab-view fade-in">
            <MetricOverview world={activeWorld} />
            <MacroImpactView world={activeWorld} />
          </div>
        )}

        {/* Tab 2: Architecture Designer */}
        {activeTab === 'designer' && (
          <div className="tab-view fade-in">
            <ArchitectureDesigner
              currentArchitecture={activeWorld.architecture}
              onApplyArchitecture={handleApplyArchitecture}
            />
          </div>
        )}

        {/* Tab 3: Experiment Runner */}
        {activeTab === 'experiments' && (
          <div className="tab-view fade-in">
            <WorldComparison
              worlds={allWorlds}
              onRunBatchExperiment={handleRunBatchExperiment}
            />
          </div>
        )}

        {/* Tab 4: 3D Spatial Visualizer */}
        {activeTab === 'classroom3d' && (
          <div className="tab-view fade-in">
            <Classroom3DView world={activeWorld} />
          </div>
        )}

        {/* Tab 5: Population & Faculty */}
        {activeTab === 'population' && (
          <div className="tab-view fade-in">
            <PopulationAnalytics students={activeWorld.students} teachers={activeWorld.teachers} />
          </div>
        )}

        {/* Tab 6: Knowledge Graph */}
        {activeTab === 'knowledge' && (
          <div className="tab-view fade-in">
            <KnowledgeGraphView
              graph={activeWorld.knowledgeGraph}
              students={activeWorld.students}
            />
          </div>
        )}

        {/* Tab 7: iGOT Karmayogi Competency & AI Quiz */}
        {activeTab === 'igot' && (
          <div className="tab-view fade-in">
            <KarmayogiCompetencyView />
          </div>
        )}

        {/* Tab 8: 8 Research Frameworks */}
        {activeTab === 'frameworks' && (
          <div className="tab-view fade-in">
            <FrameworksView frameworks={activeFrameworks} />
          </div>
        )}

        {/* Tab 9: Publication Package */}
        {activeTab === 'publication' && (
          <div className="tab-view fade-in">
            <ResearchPaperView
              world={activeWorld}
              frameworks={activeFrameworks}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
