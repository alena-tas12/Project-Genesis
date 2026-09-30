import fs from "fs";
import path from "path";

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  type: "UI_CLICK" | "TAB_SWITCH" | "SIMULATION_STEP" | "ERROR";
  component: string;
  action: string;
  metadata?: any;
}

export class TelemetryEngine {
  private logPath: string;

  constructor(logPath: string = path.join(process.cwd(), "genesis_telemetry.json")) {
    this.logPath = logPath;
    this.ensureLogExists();
  }

  private ensureLogExists() {
    if (!fs.existsSync(this.logPath)) {
      fs.writeFileSync(this.logPath, JSON.stringify({ events: [] }, null, 2));
    }
  }

  public recordEvent(event: Omit<TelemetryEvent, "id" | "timestamp">) {
    try {
      const data = JSON.parse(fs.readFileSync(this.logPath, "utf8"));
      data.events.push({
        id: "evt-" + Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        ...event
      });
      // Keep only last 1000 events to prevent massive files
      if (data.events.length > 1000) data.events = data.events.slice(-1000);
      fs.writeFileSync(this.logPath, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error("Failed to record telemetry", e);
    }
  }

  public getEvents(): TelemetryEvent[] {
    try {
      const data = JSON.parse(fs.readFileSync(this.logPath, "utf8"));
      return data.events;
    } catch (e) {
      return [];
    }
  }
}
