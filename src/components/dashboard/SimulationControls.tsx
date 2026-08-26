import React from 'react';
import { Play, Pause, FastForward, SkipForward, RefreshCw, Globe } from 'lucide-react';
import type { WorldState } from '../../engine/types';

interface SimulationControlsProps {
  world: WorldState;
  allWorlds: WorldState[];
  onSelectWorld: (worldId: string) => void;
  isRunning: boolean;
  onTogglePlay: () => void;
  onStepDay: () => void;
  onFastForward: (days: number) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  onResetWorld: () => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  world,
  allWorlds,
  onSelectWorld,
  isRunning,
  onTogglePlay,
  onStepDay,
  onFastForward,
  speed,
  setSpeed,
  onResetWorld
}) => {
  return (
    <div className="controls-container">
      <div className="world-selector-group">
        <Globe size={18} className="icon-cyan" />
        <span className="control-label">Active Target World:</span>
        <select
          value={world.id}
          onChange={(e) => onSelectWorld(e.target.value)}
          className="world-dropdown"
        >
          {allWorlds.map(w => (
            <option key={w.id} value={w.id}>
              {w.name} ({w.architecture.presetId.toUpperCase()})
            </option>
          ))}
        </select>
        <span className="pop-pill">{world.students.length} Agents</span>
      </div>

      <div className="playback-actions">
        <button
          onClick={onTogglePlay}
          className={`btn-play-pause ${isRunning ? 'running' : ''}`}
        >
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
          <span>{isRunning ? 'Pause' : 'Simulate'}</span>
        </button>

        <button onClick={onStepDay} disabled={isRunning} className="btn-control-secondary">
          <SkipForward size={16} />
          <span>Step 1D</span>
        </button>

        <button onClick={() => onFastForward(30)} disabled={isRunning} className="btn-control-secondary">
          <FastForward size={16} />
          <span>+30 Days</span>
        </button>

        <button onClick={() => onFastForward(365)} disabled={isRunning} className="btn-control-accent">
          <FastForward size={16} />
          <span>+1 Year</span>
        </button>

        <button onClick={() => onFastForward(1825)} disabled={isRunning} className="btn-control-purple">
          <FastForward size={16} />
          <span>+5 Years</span>
        </button>

        <button onClick={onResetWorld} title="Reset World to Day 1" className="btn-icon-reset">
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="speed-selector">
        <span className="control-label">Tick Rate:</span>
        {[1, 5, 20, 100].map(s => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`speed-chip ${speed === s ? 'active' : ''}`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
};
