// /api/cliqWebhook.js
export default async function handler(req, res) {
  // 1. Enable CORS for your Vercel App
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or set to 'https://welltask-ui-88uy.vercel.app'
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 2. Handle the "Preflight" OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 3. Define your Zoho Cliq Webhook URL (KEEP THIS SECRET IN PRODUCTION)
  // Use the URL from your error log that includes the zapikey
  const ZOHO_WEBHOOK_URL = "https://cliq.zoho.com/api/v2/bots/welltask/incoming?zapikey=1001.3d8aae64bab5fe65c5682907e19fcb45.41d161bac1cea527694b74dbdc843360";

  try {
    // 4. Forward the request to Zoho server-side
    const zohoResponse = await fetch(ZOHO_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body), // Pass the data from your frontend
    });

    const data = await zohoResponse.text();

    // 5. Send Zoho's response back to your Frontend
    res.status(zohoResponse.status).send(data);
  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({ error: "Failed to connect to Zoho Cliq", details: error.message });
  }
}
