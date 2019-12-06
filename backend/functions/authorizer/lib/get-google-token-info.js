const https = require('https');
const Url = require('url');

module.exports = (token) => new Promise((resolve, reject) => {
  https.request(new Url.URL(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${encodeURIComponent(token)}`), (res) => {
    const chunks = [];
    res.on('data', (chunk) => chunks.push(chunk));
    res.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf-8');
      if (res.statusCode !== 200) reject(new Error(`${res.statusCode}: ${raw}`));
      resolve(raw ? JSON.parse(raw) : {});
    });
  }).on('error', (err) => reject(err)).end();
});
