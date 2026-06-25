export default async function handler(req, res) {
  const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQyMPkNAffCMfGz0F4vT_wpkAcd_I8rPcFwO58D6RNSWD-WVidPk4u-1fuBSNKhgOpAezxt4KtTN7p8/pub?gid=1633273034&single=true&output=csv';
  try {
    const response = await fetch(csvUrl);
    if (!response.ok) throw new Error('Fetch failed');
    const text = await response.text();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(text);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
