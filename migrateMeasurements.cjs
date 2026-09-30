const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = glob.sync('src/engine/research/*Corpus.ts');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/measurements:\s*\[([\s\S]*?)\]/g, (match, p1) => {
    if (p1.trim() === '') return 'measurements: []';
    if (p1.includes('{')) return match; // Already migrated or has objects
    
    // Naive split by comma for string literals
    const items = p1.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const objects = items.map(item => `{ construct: 'Unknown', operationalDefinition: 'Unknown', instrument: ${item} }`);
    return `measurements: [\n      ${objects.join(',\n      ')}\n    ]`;
  });
  fs.writeFileSync(file, content);
});
console.log('Migrated measurements in corpora.');
