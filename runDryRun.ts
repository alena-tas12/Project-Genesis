import { ContinuousSyncEngine } from './src/engine/research/continuousSyncEngine';

async function executeDryRun() {
  console.log('==================================================');
  console.log('GENESIS DAILY RESEARCH SYNCHRONIZATION: DRY RUN');
  console.log('==================================================');

  const engine = new ContinuousSyncEngine();
  
  await engine.executeSync({
    maxGaps: 3,
    maxSources: 10,
    isDryRun: true
  });

  console.log('\n[DRY RUN COMPLETE] Zero active graph mutations occurred.');
}

executeDryRun();
