const fs = require('fs');

let content = fs.readFileSync('src/components/Cart.tsx', 'utf-8');

content = content.replace(/\$\{isInCart \? 'grayscale opacity-30 scale-105' : 'grayscale-\[0\\\.5\] hover:grayscale-0'\}/g, 'transition-transform duration-700 hover:scale-105');

fs.writeFileSync('src/components/Cart.tsx', content);
