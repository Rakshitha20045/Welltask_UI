export default async function handler(req, res) {
  try {
    // YOUR ZOHO WEBHOOK TOKEN
    const url = "https://cliq.zoho.com/api/v2/webhooks/token/1001.3d8aae64bab5fe65c5682907e19fcb45.41d161bac1cea527694b74dbdc843360?";

    const response = await fetch(url);

    const text = await response.text();

    console.log("FOCUS CRON TRIGGERED:", text);

    return res.status(200).json({ ok: true, message: "Focus cron executed", data: text });
  } catch (error) {
    console.error("FOCUS CRON ERROR:", error);
    return res.status(500).json({ ok: false, error: error.toString() });
  }
}
