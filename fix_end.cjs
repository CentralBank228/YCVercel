const fs = require('fs');
let content = fs.readFileSync('src/components/Cart.tsx', 'utf8');
const lines = content.split('\n');

console.log("Deleted lines:");
for (let i = 488; i <= 502; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}

const newLines = [...lines.slice(0, 488), ...lines.slice(503)];
fs.writeFileSync('src/components/Cart.tsx', newLines.join('\n'));
console.log('Done!');
