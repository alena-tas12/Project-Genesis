import * as fs from 'fs';
import * as path from 'path';

export interface LearningStrategy {
    originalQuery: string;
    lastFailureReason: string | null;
    adaptedQuery: string;
    success: boolean;
}

export class ResearchMemory {
    private memoryPath = path.resolve(process.cwd(), 'genesis_learning_memory.json');
    private memory: Record<string, LearningStrategy[]> = {};

    constructor() {
        if (fs.existsSync(this.memoryPath)) {
            try {
                this.memory = JSON.parse(fs.readFileSync(this.memoryPath, 'utf-8'));
            } catch (e) {
                this.memory = {};
            }
        }
    }

    public getBestStrategy(targetConcept: string, defaultQuery: string): string {
        const pastAttempts = this.memory[targetConcept];
        if (!pastAttempts || pastAttempts.length === 0) return defaultQuery;

        const successful = pastAttempts.find(a => a.success);
        if (successful) {
            console.log(`[MEMORY] Applying previously successful strategy for ${targetConcept}: "${successful.adaptedQuery}"`);
            return successful.adaptedQuery;
        }

        const last = pastAttempts[pastAttempts.length - 1];
        return last.adaptedQuery;
    }

    public recordAttempt(targetConcept: string, originalQuery: string, adaptedQuery: string, reason: string | null, success: boolean) {
        if (!this.memory[targetConcept]) this.memory[targetConcept] = [];
        this.memory[targetConcept].push({
            originalQuery,
            adaptedQuery,
            lastFailureReason: reason,
            success
        });
        fs.writeFileSync(this.memoryPath, JSON.stringify(this.memory, null, 2));
    }
}
