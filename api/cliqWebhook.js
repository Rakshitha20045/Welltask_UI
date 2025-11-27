// File: /api/cliqWebhook.js
import fetch from "node-fetch";

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    try {
        const cliqWebhookUrl =
            "https://cliq.zoho.com/api/v2/bots/welltask/incoming?zapikey=1001.3d8aae64bab5fe65c5682907e19fcb45.41d161bac1cea527694b74dbdc843360";

        const forward = await fetch(cliqWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body),
        });

        const data = await forward.text();
        return res.status(200).json({ status: "success", cliqResponse: data });

    } catch (error) {
        console.error("Proxy Error:", error);
        return res.status(500).json({ status: "error", message: error.toString() });
    }
}
