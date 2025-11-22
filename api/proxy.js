export default async function handler(request, response) {
  // 1. Enable CORS
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 🔴 NEW: Disable Caching (Fixes "Disappearing Tasks")
  response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.setHeader('Pragma', 'no-cache');
  response.setHeader('Expires', '0');

  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  const ZOHO_URL = "https://cliq.zoho.com/api/v2/bots/welltask/incoming?zapikey=1001.3d8aae64bab5fe65c5682907e19fcb45.41d161bac1cea527694b74dbdc843360";

  try {
    const incomingParams = request.query;
    const zohoUrlObj = new URL(ZOHO_URL);
    
    // Add a random number to the request to force Zoho to reply fresh
    zohoUrlObj.searchParams.append("_t", Date.now());

    Object.keys(incomingParams).forEach(key => {
        zohoUrlObj.searchParams.append(key, incomingParams[key]);
    });

    const zohoResponse = await fetch(zohoUrlObj.toString());
    const data = await zohoResponse.json();

    response.status(200).json(data);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
