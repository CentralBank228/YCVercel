import http from 'http';
import https from 'https';
import fs from 'fs';

https.get('https://ais-pre-3mpwt6yvxi22jl7lzh7mtd-55458620426.europe-west2.run.app/src/components/Cart.tsx', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('old_cart.txt', data);
    console.log('done');
  });
}).on("error", (err) => console.log("Error: " + err.message));
