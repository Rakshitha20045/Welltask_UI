// api/proxy.js
export default async function handler(req, res) {
  // 1. Enable CORS for this Vercel function so your frontend can talk to it
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle the browser's "Preflight" check
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 2. Get the actual Zoho URL from the query string
  const { target_url } = req.query;

  if (!target_url) {
    return res.status(400).json({ error: 'Missing target_url parameter' });
  }

  try {
    // 3. Forward the request to Zoho (Server-to-Server)
    const zohoResponse = await fetch(target_url, {
      method: 'POST', // We always force POST for your webhook
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body), // Pass the data along
    });

    const data = await zohoResponse.json();

    // 4. Return Zoho's response back to your Frontend
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}