import fs from "fs";
import path from "path";

export interface MutationRecord {
  id: string;
  timestamp: string;
  what: string;
  why: string;
  how: string;
  result: string;
  testsPerformed: string;
  risks: string;
  rollbackOption: string;
  status: "PROPOSED" | "APPLIED" | "REVERTED" | "FAILED";
}

export class ChangeIntelligenceEngine {
  private logPath: string;

  constructor(logPath: string = path.join(process.cwd(), "genesis_self_growth_log.json")) {
    this.logPath = logPath;
    this.ensureLogExists();
  }

  private ensureLogExists() {
    if (!fs.existsSync(this.logPath)) {
      fs.writeFileSync(this.logPath, JSON.stringify({ mutations: [] }, null, 2));
    }
  }

  public getLog(): { mutations: MutationRecord[] } {
    try {
      const data = fs.readFileSync(this.logPath, "utf8");
      return JSON.parse(data);
    } catch (e) {
      console.error("Failed to read growth log:", e);
      return { mutations: [] };
    }
  }

  public recordMutation(mutation: Omit<MutationRecord, "id" | "timestamp" | "status">, status: "PROPOSED" | "APPLIED" | "REVERTED" | "FAILED" = "APPLIED"): MutationRecord {
    const log = this.getLog();
    const newRecord: MutationRecord = {
      id: "mut-" + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      ...mutation,
      status
    };

    log.mutations.push(newRecord);
    fs.writeFileSync(this.logPath, JSON.stringify(log, null, 2));
    return newRecord;
  }
}
