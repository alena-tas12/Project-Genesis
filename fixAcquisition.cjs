const fs = require('fs');

let code = fs.readFileSync('src/engine/research/researchAcquisition.ts', 'utf-8');

code = code.replace(/domains,\n    subDomains,\n    era,\n    keywords: raw.keywords \?\? \[\],\n  \};\n\}/, 
`domains,
    subDomains,
    era,
    keywords: raw.keywords ?? [],
    moderators: [],
    mediators: [],
  };
}`);

code = code.replace(/domains: s.domains \?\? \['Complex_Systems'\],\n      subDomains: s.subDomains \?\? \[\],\n      era: classifyEra\(year\),\n      keywords: s.keywords \?\? \[\],\n    \};\n  \}\);\n\}/,
`domains: s.domains ?? ['Complex_Systems'],
      subDomains: s.subDomains ?? [],
      era: classifyEra(year),
      keywords: s.keywords ?? [],
      moderators: s.moderators ?? [],
      mediators: s.mediators ?? [],
      evidenceStatus: s.evidenceStatus,
      epistemicCategory: s.epistemicCategory,
    };
  });
}`);

fs.writeFileSync('src/engine/research/researchAcquisition.ts', code);
console.log('Fixed researchAcquisition');
