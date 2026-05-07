const https = require('https');
const cheerio = require('cheerio');
https.get('https://yollaclub.ru/certificates', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const $ = cheerio.load(data);
    let text = [];
    $('*').each((i, el) => {
      let t = $(el).text().trim();
      if(t && (t.includes('₽') || t.includes('руб'))) text.push(t);
    });
    console.log(text.filter((v, i, a) => a.indexOf(v) === i).join('\n').substring(0, 5000));
  });
});
