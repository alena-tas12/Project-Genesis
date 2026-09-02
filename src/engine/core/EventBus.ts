export type CoreEventType = 
  | 'EVIDENCE_ACQUIRED'
  | 'SOURCE_RETRACTED'
  | 'GRAPH_MUTATED'
  | 'MODEL_CALIBRATED'
  | 'SIMULATION_COMPLETED'
  | 'VALIDATION_FAILED'
  | 'RESEARCH_GAP_QUEUED';

export interface CoreEvent {
  id: string;
  type: CoreEventType;
  timestamp: string;
  payload: any;
}

export type EventHandler = (event: CoreEvent) => Promise<void> | void;

export class EventBus {
  private listeners: Map<CoreEventType, EventHandler[]> = new Map();

  public subscribe(type: CoreEventType, handler: EventHandler) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)!.push(handler);
  }

  public async publish(event: CoreEvent) {
    // console.log(`[EventBus] Publishing ${event.type}: ${event.id}`);
    const handlers = this.listeners.get(event.type) || [];
    for (const handler of handlers) {
      await handler(event);
    }
  }
}
