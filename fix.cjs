const fs = require('fs');
let code = fs.readFileSync('src/components/Cart.tsx', 'utf8');
code = code.replace(
`    if (addonsList) {
      message += \`🛒 *Дополнительно:*\\n\${addonsList}\\n\\n\`;
    }`,
`    if (rituals) message += \`🍃 *Ритуалы и чан:*\\n\${rituals}\\n\\n\`;
    if (massages) message += \`💆 *Массажи:*\\n\${massages}\\n\\n\`;
    if (veniki) message += \`🌿 *Веники:*\\n\${veniki}\\n\\n\`;
    if (drinks) message += \`☕ *Напитки и еда:*\\n\${drinks}\\n\\n\`;
    if (other) message += \`➕ *Дополнения:*\\n\${other}\\n\\n\`;`
);
fs.writeFileSync('src/components/Cart.tsx', code);
