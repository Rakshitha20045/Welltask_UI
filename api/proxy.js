// File: api/proxy.js
export default async function handler(request, response) {
  // --- DEBUG LOG 1: Request Received ---
  console.log("1. Proxy received request with params:", JSON.stringify(request.query));

  // 1. Enable CORS
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  // 🔴 CRITICAL FIX: This must be the LONG Zoho URL, NOT "/api/proxy"
  const ZOHO_URL = "https://cliq.zoho.com/api/v2/bots/welltask/incoming?zapikey=1001.3d8aae64bab5fe65c5682907e19fcb45.41d161bac1cea527694b74dbdc843360";

  try {
    // 2. Prepare URL
    const incomingParams = request.query;
    const zohoUrlObj = new URL(ZOHO_URL);
    
    Object.keys(incomingParams).forEach(key => {
        zohoUrlObj.searchParams.append(key, incomingParams[key]);
    });

    const finalUrl = zohoUrlObj.toString();
    
    // --- DEBUG LOG 2: Sending to Zoho ---
    console.log("2. Forwarding to Zoho URL:", finalUrl);

    // 3. Fetch from Zoho
    const zohoResponse = await fetch(finalUrl);
    
    // --- DEBUG LOG 3: Zoho Response Status ---
    console.log("3. Zoho Response Status:", zohoResponse.status);

    const data = await zohoResponse.json();

    // --- DEBUG LOG 4: Zoho Response Data ---
    console.log("4. Zoho Data:", JSON.stringify(data));

    // 4. Return result
    response.status(200).json(data);
  } catch (error) {
    console.error("!!! PROXY ERROR !!!", error.message);
    response.status(500).json({ error: error.message, details: "Check Vercel Logs" });
  }
}
