import { ContinuousSyncEngine } from './continuousSyncEngine';
import * as fs from 'fs';
import * as path from 'path';

export class MidnightScheduler {
  private engine = new ContinuousSyncEngine();
  private timer: NodeJS.Timeout | null = null;
  private isRunning = false;
  private readonly configPath = path.join(process.cwd(), 'genesis_scheduler_config.json');
  
  constructor() {
    this.ensureConfig();
  }

  private ensureConfig() {
    if (!fs.existsSync(this.configPath)) {
      const defaultConfig = {
        GENESIS_RESEARCH_SYNC_ENABLED: true,
        GENESIS_RESEARCH_SYNC_TIME: "00:00",
        LAST_SUCCESSFUL_SYNC: null
      };
      fs.writeFileSync(this.configPath, JSON.stringify(defaultConfig, null, 2));
    }
  }

  public getConfig() {
    return JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));
  }

  public updateLastSync(timestamp: string) {
    const config = this.getConfig();
    config.LAST_SUCCESSFUL_SYNC = timestamp;
    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
  }

  public start() {
    const config = this.getConfig();
    if (!config.GENESIS_RESEARCH_SYNC_ENABLED) {
      console.log('[SCHEDULER] Auto-sync is disabled in configuration.');
      return;
    }

    console.log(`[SCHEDULER] Genesis Persistent Scheduler Activated. Target time: ${config.GENESIS_RESEARCH_SYNC_TIME} Local.`);
    
    // Recovery Check: Did we miss midnight? 
    // (A full implementation checks timestamps. For now, we establish the loop).
    
    this.scheduleNextRun();
  }

  private scheduleNextRun() {
    const config = this.getConfig();
    const [targetHour, targetMin] = config.GENESIS_RESEARCH_SYNC_TIME.split(':').map(Number);
    
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetHour, targetMin, 0, 0);
    
    if (now.getTime() >= target.getTime()) {
      // If time has passed for today, schedule for tomorrow
      target.setDate(target.getDate() + 1);
    }
    
    const msUntilTarget = target.getTime() - now.getTime();
    console.log(`[SCHEDULER] Next synchronization scheduled in ${(msUntilTarget / 1000 / 60 / 60).toFixed(2)} hours.`);
    
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.executeScheduledRun(), msUntilTarget);
  }

  private async executeScheduledRun() {
    if (this.isRunning) {
      console.warn('[SCHEDULER] Sync is already running. Skipping duplicate execution.');
      return;
    }

    this.isRunning = true;
    try {
      console.log(`[SCHEDULER] Initiating scheduled midnight synchronization...`);
      const newVersion = await this.engine.executeSync({ maxGaps: 10, maxSources: 50, isDryRun: false });
      this.updateLastSync(newVersion.timestamp);
    } catch (error) {
      console.error('[SCHEDULER] Critical failure during synchronization:', error);
      // Persist checkpoint state here in a real implementation
    } finally {
      this.isRunning = false;
      this.scheduleNextRun(); // Reschedule for next day
    }
  }

  public async runSyncNow() {
    console.log('[SCHEDULER] Manual override: RUN_SYNC_NOW triggered.');
    if (this.isRunning) {
      console.warn('[SCHEDULER] Sync is already running.');
      return;
    }
    this.isRunning = true;
    try {
      const newVersion = await this.engine.executeSync({ maxGaps: 10, maxSources: 50, isDryRun: false });
      this.updateLastSync(newVersion.timestamp);
    } finally {
      this.isRunning = false;
    }
  }

  public stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    console.log('[SCHEDULER] Graceful shutdown completed.');
  }
}
