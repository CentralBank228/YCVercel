import fs from 'fs';
import http from 'http';

http.get('http://localhost:3000/src/components/Cart.tsx', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    fs.writeFileSync('restored_cart.txt', data);
    console.log('done');
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
