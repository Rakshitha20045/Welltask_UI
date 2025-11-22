export default async function handler(request, response) {
  // 1. Set CORS Headers
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2. Handle Pre-flight checks
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  // 3. Configuration (Your Key is hardcoded here)
  const ZOHO_URL = "https://cliq.zoho.com/api/v2/bots/welltask/incoming?zapikey=1001.3d8aae64bab5fe65c5682907e19fcb45.41d161bac1cea527694b74dbdc843360";

  try {
    // 4. Prepare the Request for Zoho
    // We convert all requests (GET or POST) into a POST for the Zoho Webhook
    const fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };

    // 5. Prepare Payload
    // If it's a Save (POST), send the body. If it's a Load (GET), send the URL params as a body.
    if (request.body && Object.keys(request.body).length > 0) {
        fetchOptions.body = JSON.stringify(request.body);
    } else {
        fetchOptions.body = JSON.stringify(request.query);
    }

    // 6. Send to Zoho
    const zohoResponse = await fetch(ZOHO_URL, fetchOptions);
    
    // 7. Check if Zoho responded with text (error) or JSON (success)
    const contentType = zohoResponse.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        const data = await zohoResponse.json();
        response.status(200).json(data);
    } else {
        const text = await zohoResponse.text();
        response.status(500).json({ status: "error", message: "Zoho returned text instead of JSON", raw: text });
    }

  } catch (error) {
    console.error("Proxy Crash:", error);
    response.status(500).json({ status: "error", message: error.message });
  }
}
