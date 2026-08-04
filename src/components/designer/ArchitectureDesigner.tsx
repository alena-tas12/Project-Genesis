import React, { useState } from 'react';
import type { EducationalArchitecture, ArchitecturePresetId } from '../../engine/types';
import { PRESET_ARCHITECTURES } from '../../engine/architecture/presetArchitectures';
import { Sliders, Save, Check } from 'lucide-react';

interface ArchitectureDesignerProps {
  currentArchitecture: EducationalArchitecture;
  onApplyArchitecture: (arch: EducationalArchitecture) => void;
}

export const ArchitectureDesigner: React.FC<ArchitectureDesignerProps> = ({
  currentArchitecture,
  onApplyArchitecture
}) => {
  const [arch, setArch] = useState<EducationalArchitecture>({ ...currentArchitecture });
  const [isSaved, setIsSaved] = useState(false);

  const handleSelectPreset = (presetId: ArchitecturePresetId) => {
    if (presetId === 'custom') {
      setArch({
        ...arch,
        id: 'custom-arch',
        name: 'Custom Research Model',
        presetId: 'custom',
        description: 'User-designed custom educational system with modified rules and policy constraints.'
      });
    } else {
      const preset = PRESET_ARCHITECTURES[presetId];
      if (preset) setArch({ ...preset });
    }
  };

  const handleSliderChange = (key: keyof EducationalArchitecture, value: number) => {
    setArch({
      ...arch,
      presetId: 'custom',
      name: arch.presetId === 'custom' ? arch.name : `${arch.name} (Modified)`,
      [key]: value
    });
  };

  const handleSaveAndApply = () => {
    onApplyArchitecture(arch);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const presetsList: ArchitecturePresetId[] = [
    'traditional',
    'montessori',
    'finnish',
    'japanese',
    'ai_assisted',
    'waldorf',
    'reggio_emilia',
    'ib_diploma',
    'harkness',
    'sudbury',
    'singapore_mastery',
    'prussian_industrial',
    'south_korea_suneung',
    'germany_dual_vet',
    'france_baccalaureat',
    'china_gaokao',
    'india_nep2020',
    'custom'
  ];

  return (
    <div className="designer-container">
      <div className="designer-header">
        <div className="title-group">
          <Sliders className="icon-cyan" size={24} />
          <div>
            <h2>Module 1: Global Educational Architecture Designer</h2>
            <p className="subtitle">
              Configure and test 17 major global educational systems or construct custom pedagogical models.
            </p>
          </div>
        </div>

        <button onClick={handleSaveAndApply} className="btn-save-primary">
          {isSaved ? <Check size={16} /> : <Save size={16} />}
          <span>{isSaved ? 'Applied to World!' : 'Save & Deploy Architecture'}</span>
        </button>
      </div>

      {/* Preset Selector Chips for All 17 Systems */}
      <div className="preset-chips-row">
        <span className="chips-label">Global Systems:</span>
        {presetsList.map(pId => {
          const isActive = arch.presetId === pId;
          return (
            <button
              key={pId}
              onClick={() => handleSelectPreset(pId)}
              className={`preset-chip ${isActive ? 'active' : ''}`}
            >
              {pId.replace('_', ' ').toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Active Preset Description Card */}
      <div className="arch-description-box">
        <h4>{arch.name}</h4>
        <p>{arch.description}</p>
      </div>

      {/* Sliders Grid */}
      <div className="sliders-grid">
        <div className="slider-card">
          <div className="slider-label">
            <span>Exam Weight vs Continuous Eval</span>
            <span className="slider-val">{arch.examWeightPct}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={arch.examWeightPct}
            onChange={(e) => handleSliderChange('examWeightPct', Number(e.target.value))}
            className="slider-input cyan"
          />
          <span className="slider-hint">High exam weight increases stress and cramming retention decay.</span>
        </div>

        <div className="slider-card">
          <div className="slider-label">
            <span>Daily Homework Load</span>
            <span className="slider-val">{arch.homeworkHoursPerDay} hrs/day</span>
          </div>
          <input
            type="range"
            min="0"
            max="8"
            step="0.1"
            value={arch.homeworkHoursPerDay}
            onChange={(e) => handleSliderChange('homeworkHoursPerDay', Number(e.target.value))}
            className="slider-input amber"
          />
          <span className="slider-hint">Exceeding 3 hrs/day yields diminishing returns via burnout.</span>
        </div>

        <div className="slider-card">
          <div className="slider-label">
            <span>AI Integration & Tutoring</span>
            <span className="slider-val">{arch.aiIntegrationLevel}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={arch.aiIntegrationLevel}
            onChange={(e) => handleSliderChange('aiIntegrationLevel', Number(e.target.value))}
            className="slider-input purple"
          />
          <span className="slider-hint">1-on-1 AI tutors eliminate prerequisite learning bottlenecks.</span>
        </div>

        <div className="slider-card">
          <div className="slider-label">
            <span>Student Learning Autonomy</span>
            <span className="slider-val">{arch.studentAutonomyPct}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={arch.studentAutonomyPct}
            onChange={(e) => handleSliderChange('studentAutonomyPct', Number(e.target.value))}
            className="slider-input emerald"
          />
          <span className="slider-hint">Self-directed pacing boosts intrinsic curiosity and motivation.</span>
        </div>

        <div className="slider-card">
          <div className="slider-label">
            <span>Teacher Syllabus Autonomy</span>
            <span className="slider-val">{arch.teacherAutonomyPct}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={arch.teacherAutonomyPct}
            onChange={(e) => handleSliderChange('teacherAutonomyPct', Number(e.target.value))}
            className="slider-input blue"
          />
          <span className="slider-hint">High autonomy reduces teacher burnout and fosters research output.</span>
        </div>

        <div className="slider-card">
          <div className="slider-label">
            <span>Class Size (Student:Teacher Ratio)</span>
            <span className="slider-val">{arch.classSize} Students</span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            value={arch.classSize}
            onChange={(e) => handleSliderChange('classSize', Number(e.target.value))}
            className="slider-input red"
          />
          <span className="slider-hint">Smaller class sizes enhance individual mentoring quality.</span>
        </div>

        <div className="slider-card">
          <div className="slider-label">
            <span>Node Mastery Threshold</span>
            <span className="slider-val">{arch.masteryThresholdPct}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="95"
            value={arch.masteryThresholdPct}
            onChange={(e) => handleSliderChange('masteryThresholdPct', Number(e.target.value))}
            className="slider-input cyan"
          />
          <span className="slider-hint">Minimum score required before unlocking downstream nodes.</span>
        </div>

        <div className="slider-card">
          <div className="slider-label">
            <span>Funding Per Student</span>
            <span className="slider-val">${arch.fundingPerStudentUSD.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="2000"
            max="25000"
            step="500"
            value={arch.fundingPerStudentUSD}
            onChange={(e) => handleSliderChange('fundingPerStudentUSD', Number(e.target.value))}
            className="slider-input green"
          />
          <span className="slider-hint">Annual investment per student into resources and infrastructure.</span>
        </div>
      </div>
    </div>
  );
};
