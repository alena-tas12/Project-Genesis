import { ContinuousSyncEngine } from './src/engine/research/continuousSyncEngine';

async function executeInitialSync() {
  console.log('==================================================');
  console.log('GENESIS DAILY RESEARCH SYNCHRONIZATION: INITIAL ACTIVE RUN');
  console.log('==================================================');

  const engine = new ContinuousSyncEngine();
  
  await engine.executeSync({
    maxGaps: 3,
    maxSources: 10,
    isDryRun: false
  });

  console.log('\n[SYNC COMPLETE] Knowledge state updated successfully.');
}

executeInitialSync();
