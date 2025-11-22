export default async function handler(request, response) {
  // 1. Setup CORS (Allows your HTML to talk to this)
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 2. Handle Preflight Checks
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  // 3. THE HARDCODED ZOHO URL (No 'target_url' needed!)
  const ZOHO_URL = "https://cliq.zoho.com/api/v2/bots/welltask/incoming?zapikey=1001.3d8aae64bab5fe65c5682907e19fcb45.41d161bac1cea527694b74dbdc843360";

  try {
    // 4. Prepare the URL
    const zohoUrlObj = new URL(ZOHO_URL);
    
    // Take params from your HTML (like ?action=create) and add them to Zoho URL
    const incomingParams = request.query;
    Object.keys(incomingParams).forEach(key => {
        zohoUrlObj.searchParams.append(key, incomingParams[key]);
    });

    // 5. Send to Zoho
    const zohoResponse = await fetch(zohoUrlObj.toString());
    const data = await zohoResponse.json();

    // 6. Return result
    response.status(200).json(data);
  } catch (error) {
    // If this fails, we see the REAL error
    response.status(500).json({ error: error.message });
  }
}
