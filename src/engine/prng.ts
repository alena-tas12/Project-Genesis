// Mulberry32 Seeded PRNG for 100% Scientific Reproducibility
export class PRNG {
  private state: number;

  constructor(seed: number = 42) {
    this.state = seed;
  }

  // Returns pseudo-random float in range [0, 1)
  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // Float between [min, max]
  range(min: number, max: number): number {
    return min + (max - min) * this.next();
  }

  // Integer between [min, max] inclusive
  intRange(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  // Normal distribution via Box-Muller transform
  gaussian(mean: number = 0, stdDev: number = 1): number {
    const u1 = Math.max(1e-15, this.next());
    const u2 = this.next();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z0 * stdDev;
  }

  // Clamp helper
  clamp(val: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, val));
  }
}
