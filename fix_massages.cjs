const fs = require('fs');
let code = fs.readFileSync('src/components/Cart.tsx', 'utf8');
code = code.replace(/items: massages\.map\(r => \(\{ \.\.\.r, price: r\.prices && r\.prices\.length > 0 \? r\.prices\[0\]\.price : r\.price, duration: r\.prices && r\.prices\.length > 0 \? r\.prices\[0\]\.duration : r\.duration, type: 'massage' \}\)\)/g, "items: massages.map(r => ({ ...r, type: 'massage' }))");
code = code.replace(/housePriceBreakdown\[0\]\.subtotal/g, "housePriceBreakdown[0].hours * housePriceBreakdown[0].pricePerUnit");
fs.writeFileSync('src/components/Cart.tsx', code);
console.log('Fixed Cart.tsx replacements');
