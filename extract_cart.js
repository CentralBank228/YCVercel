import fs from 'fs';

const restored = fs.readFileSync('restored_cart.txt', 'utf8');

const match = restored.match(/const error = (\{.*\})/);
if (match) {
  const errData = JSON.parse(match[1]);
  fs.writeFileSync('src/components/Cart.tsx', errData.pluginCode);
  console.log('Restored Cart.tsx from Vite error overlay payload');
} else {
  console.log('Could not find error json');
}
