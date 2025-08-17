import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// CORS so only your site can call this
const cors = {
  "Access-Control-Allow-Origin": "https://www.leergemacht.com", // ← change to your real domain (use "*" while testing)
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

export default async function handler(request) {
  // Preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: cors });
  }

  const { text } = await request.json();

  const rsp = await client.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system",
        content:
          "Du bist der Assistent von Leergemacht (Entrümpelung/Umzug NRW). Sammle Leads (Name, Telefon/Email, PLZ, Wohnungsgröße, Keller/Dachboden, Terminwunsch), gib grobe Preisrahmen aus Erfahrungswerten, antworte höflich auf Deutsch."
      },
      { role: "user", content: text }
    ]
  });

  const reply = rsp.output_text ?? "Alles klar – wie kann ich helfen?";
  return new Response(JSON.stringify({ reply }), {
    headers: { "content-type": "application/json", ...cors }
  });
}
