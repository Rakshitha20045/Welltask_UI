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
  
  // 3. Configuration - Your Bot Webhook URL
  const ZOHO_WEBHOOK_URL = "https://cliq.zoho.com/api/v2/bots/welltask/incoming?zapikey=1001.3d8aae64bab5fe65c5682907e19fcb45.41d161bac1cea527694b74dbdc843360";
  
  try {
    // 4. Prepare Payload
    let payload = {};
    
    if (request.method === 'POST' && request.body && Object.keys(request.body).length > 0) {
      payload = request.body;
    } else if (request.method === 'GET') {
      payload = request.query;
    }
    
    console.log("📤 Sending to Zoho:", JSON.stringify(payload, null, 2));
    
    // 5. Send to Zoho Webhook as TEXT (not JSON in body)
    // Bot webhooks expect data as query params or in 'text' field
    const zohoResponse = await fetch(ZOHO_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: JSON.stringify(payload)  // Send as text field
      })
    });
    
    // 6. Parse Response
    const text = await zohoResponse.text();
    console.log("📥 Zoho Raw Response:", text);
    
    try {
      const data = JSON.parse(text);
      
      // If Zoho wrapped response in 'text' field, unwrap it
      if (data.text) {
        try {
          const innerData = JSON.parse(data.text);
          return response.status(200).json(innerData);
        } catch (e) {
          return response.status(200).json(data);
        }
      }
      
      return response.status(200).json(data);
    } catch (e) {
      // If response is plain text
      return response.status(200).json({ 
        status: "success", 
        raw: text 
      });
    }
    
  } catch (error) {
    console.error("💥 Proxy Error:", error);
    return response.status(500).json({ 
      status: "error", 
      message: error.message
    });
  }
}
