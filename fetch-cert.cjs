const https = require('https');
const cheerio = require('cheerio');
https.get('https://yollaclub.ru/certificates', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const $ = cheerio.load(data);
    let text = [];
    $('h1, h2, h3, h4, p, span, div.t-text, div.t-title').each((i, el) => {
      let t = $(el).text().trim();
      if(t && t.length > 10) text.push(t);
    });
    console.log(text.filter((v, i, a) => a.indexOf(v) === i).join('\n'));
  });
});
