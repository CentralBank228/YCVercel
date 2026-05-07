import fs from 'fs';

const files = [
  'src/components/Programs.tsx',
  'src/components/OffersSection.tsx',
  'src/components/Atmosphere.tsx',
  'src/components/BathHouses.tsx',
  'src/components/Cart.tsx',
  'src/components/Massages.tsx',
  'src/components/Certificates.tsx'
];

files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  // Avoid duplicating if already present, simplistic approach: replace all <img with <img loading="lazy" then replace <img loading="lazy" loading="lazy" with <img loading="lazy"
  const updated = c.replace(/<img/g, '<img loading="lazy"').replace(/<img loading="lazy" loading="lazy"/g, '<img loading="lazy"');
  fs.writeFileSync(f, updated);
});
console.log('Done');
