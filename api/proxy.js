export default async function handler(request, response) {
  // 1. Enable CORS and Caching Fixes (No change needed here)
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.setHeader('Pragma', 'no-cache');
  response.setHeader('Expires', '0');

  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  // Define the Zoho Webhook URL
  const ZOHO_URL = "https://cliq.zoho.com/api/v2/bots/welltask/incoming?zapikey=1001.3d8aae64bab5fe65c5682907e19fcb45.41d161bac1cea527694b74dbdc843360";

  try {
    const incomingParams = request.query;
    const zohoUrlObj = new URL(ZOHO_URL);

    // 1. Forward all query parameters (user_email, action, request_method, etc.)
    // These are always needed, even for POST/PUT, as Deluge reads them from the URL.
    zohoUrlObj.searchParams.append("_t", Date.now()); // Add cache buster
    Object.keys(incomingParams).forEach(key => {
      zohoUrlObj.searchParams.append(key, incomingParams[key]);
    });
    
    // 2. Prepare Fetch options, including method and headers
    const fetchOptions = {
        method: request.method, // CRITICAL: Forward the original method (GET, POST, etc.)
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // 3. CRITICAL FIX: If the request has a body (POST, PUT, DELETE), forward it.
    if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
        // Assuming your frontend sends a JSON body for data operations
        fetchOptions.body = JSON.stringify(request.body);
    }
    
    // 4. Send the request to Zoho Cliq
    const zohoResponse = await fetch(zohoUrlObj.toString(), fetchOptions);
    const data = await zohoResponse.json();

    response.status(200).json(data);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
