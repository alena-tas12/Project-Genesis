import { MidnightScheduler } from './src/engine/research/midnightScheduler';

console.log('==================================================');
console.log('GENESIS CONTINUOUS RESEARCH DAEMON');
console.log('==================================================');

const scheduler = new MidnightScheduler();
scheduler.start();

console.log('[SYSTEM] Genesis is now persistently monitoring the internet for relevant scientific changes.');
console.log('[SYSTEM] Press Ctrl+C to terminate the daemon.');

// Keep process alive
process.stdin.resume();
