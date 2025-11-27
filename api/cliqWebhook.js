// File: /api/cliqWebhook.js
import fetch from "node-fetch";

export default async function handler(req, res) {
    // 1. Set CORS headers so your frontend (on a different domain/port) can call this
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // 2. Handle preflight requests
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    try {
        // Your specific Zoho Cliq Webhook URL with the zapikey
        const cliqWebhookUrl = "https://cliq.zoho.com/api/v2/bots/welltask/incoming?zapikey=1001.3d8aae64bab5fe65c5682907e19fcb45.41d161bac1cea527694b74dbdc843360";

        // 3. Forward the frontend's body directly to Zoho
        const forward = await fetch(cliqWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body),
        });

        // 4. Get text response from Zoho (could be JSON or error text)
        const data = await forward.text();

        // --- DEBUG LOGGING ADDED HERE ---
        console.log("[proxy] forwarded to Zoho, status:", forward.status, "body:", data);
        // --------------------------------

        // 5. Return success to frontend, including Zoho's raw response
        return res.status(200).json({ status: "success", cliqResponse: data });

    } catch (error) {
        console.error("Proxy Error:", error);
        return res.status(500).json({ status: "error", message: error.toString() });
    }
}
