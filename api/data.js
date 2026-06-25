const https = require('https');

function fetchWithRedirects(url, redirects) {
  redirects = redirects || 5;
  return new Promise(function(resolve, reject) {
    https.get(url, function(res) {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects > 0) {
        resolve(fetchWithRedirects(res.headers.location, redirects - 1));
        return;
      }
      var data = '';
      res.on('data', function(chunk) { data += chunk; });
      res.on('end', function() { resolve(data); });
      res.on('error', reject);
    }).on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  try {
    var csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQyMPkNAffCMfGz0F4vT_wpkAcd_I8rPcFwO58D6RNSWD-WVidPk4u-1fuBSNKhgOpAezxt4KtTN7p8/pub?gid=1633273034&single=true&output=csv';
    var data = await fetchWithRedirects(csvUrl);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
