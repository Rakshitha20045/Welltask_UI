export default async function handler(req, res) {
  try {
    // SAME OR ANOTHER WEBHOOK TOKEN CONNECTED TO break reminders
    const url = "https://cliq.zoho.com/api/v2/webhooks/token/1001.3d8aae64bab5fe65c5682907e19fcb45.41d161bac1cea527694b74dbdc843360?";

    const response = await fetch(url);

    const text = await response.text();

    console.log("BREAK CRON TRIGGERED:", text);

    return res.status(200).json({ ok: true, message: "Break cron executed", data: text });
  } catch (error) {
    console.error("BREAK CRON ERROR:", error);
    return res.status(500).json({ ok: false, error: error.toString() });
  }
}
