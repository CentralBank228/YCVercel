const fs = require('fs');
let code = fs.readFileSync('src/components/Cart.tsx', 'utf8');
code = code.replace(
  /const addonsList = items\.filter\(i => i\.type !== 'house'\)\.map\(i => `- \$\{i\.title\} \(\$\{i\.price\}\)`\)\.join\('\\n'\);/,
  `const nonHouseItems = items.filter(i => i.type !== 'house');
    const rituals = nonHouseItems.filter(i => i.type === 'ritual').map(i => \`- \${i.quantity}x \${i.title}\`).join('\\n');
    const massages = nonHouseItems.filter(i => i.type === 'massage').map(i => \`- \${i.quantity}x \${i.title}\`).join('\\n');
    const veniki = nonHouseItems.filter(i => i.type === 'addon' && i.title.toLowerCase().includes('веник')).map(i => \`- \${i.quantity}x \${i.title}\`).join('\\n');
    const drinks = nonHouseItems.filter(i => i.type === 'addon' && (i.title.toLowerCase().includes('чай') || i.title.toLowerCase().includes('квас') || i.title.toLowerCase().includes('вода') || i.title.toLowerCase().includes('еда') || i.title.toLowerCase().includes('орех') || i.title.toLowerCase().includes('мёд') || i.title.toLowerCase().includes('сок'))).map(i => \`- \${i.quantity}x \${i.title}\`).join('\\n');
    const other = nonHouseItems.filter(i => i.type === 'addon' && !i.title.toLowerCase().includes('веник') && !i.title.toLowerCase().includes('чай') && !i.title.toLowerCase().includes('квас') && !i.title.toLowerCase().includes('вода') && !i.title.toLowerCase().includes('еда') && !i.title.toLowerCase().includes('орех') && !i.title.toLowerCase().includes('мёд') && !i.title.toLowerCase().includes('сок')).map(i => \`- \${i.quantity}x \${i.title}\`).join('\\n');`
);
code = code.replace(
  /if \(addonsList\) \{\n\s*message \+= `🛒 \\\*Дополнительно:\\\*\\n\$\{addonsList\}\\n\\n`;\n\s*\}/,
  `if (rituals) message += \`🍃 *Ритуалы и чан:*\\n\${rituals}\\n\\n\`;
    if (massages) message += \`💆 *Массажи:*\\n\${massages}\\n\\n\`;
    if (veniki) message += \`🌿 *Веники:*\\n\${veniki}\\n\\n\`;
    if (drinks) message += \`☕ *Напитки и еда:*\\n\${drinks}\\n\\n\`;
    if (other) message += \`➕ *Дополнения:*\\n\${other}\\n\\n\`;`
);
fs.writeFileSync('src/components/Cart.tsx', code);
console.log('Fixed message grouping');
