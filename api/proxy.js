export default async function handler(request, response) {
  // CORS Headers
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  // 🔴 REPLACE WITH YOUR ACTUAL ZOHO WEBHOOK URL
  const ZOHO_URL = "https://cliq.zoho.com/api/v2/bots/welltask/incoming?zapikey=YOUR_KEY_HERE";

  try {
    const url = new URL(ZOHO_URL);
    
    // Config for fetch
    const options = {
      method: 'POST', // Zoho Webhooks usually expect POST
      headers: { 'Content-Type': 'application/json' }
    };

    // If the Frontend sent a body (for Saving), forward it wrapped properly
    if (request.body && Object.keys(request.body).length > 0) {
        options.body = JSON.stringify(request.body);
    } 
    // If it's a GET request from frontend, pass query params in the body for Zoho
    else {
        options.body = JSON.stringify(request.query);
    }

    const zohoRes = await fetch(url.toString(), options);
    const data = await zohoRes.json();

    response.status(200).json(data);

  } catch (error) {
    console.error("Proxy Error:", error);
    response.status(500).json({ error: error.message });
  }
}
