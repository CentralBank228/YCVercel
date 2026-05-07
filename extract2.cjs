const fs = require('fs');
const restored = fs.readFileSync('restored_cart.txt', 'utf8');
const match = restored.match(/const error = (\{.*\})/);
if (match) {
  const errData = JSON.parse(match[1]);
  fs.writeFileSync('cart-from-plugin.tsx', errData.pluginCode);
  console.log('Done mapping pluginCode');
}
