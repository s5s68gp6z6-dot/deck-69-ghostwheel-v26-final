export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only - use ASK GHOST button' });
  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'No prompt - type in box' });

  const apiKey = process.env.OPENAI_API_KEY;

  // If no key, return in-character Ghost reply locally but indicate it's local draft - still inside app, not here
  if (!apiKey) {
    const replies = [
      `Ghost copies, Captain — I hear you: "${prompt}" — DECK 69 stable — Three Engines: LS WALLET 0.5MB IDB CABINET 50MB+ OPFS HD 1GB+ GAME FREE — Whole team moved — stadium + management + staff + trainers + vendors — not just bricks and towel-boy. Edit mode ON — we keep same cat pose, tweak armor only. No drift. Click SEND TO META when ready.`,
      `Loud and clear — "${prompt}" — Master Sergeant has the Conn — HOLD THE LINE, HUNT THE TRUTH, KEEP THE LIGHT ON — Orange tabby secure in brass Rogue Trader armor — Master Lock holds brand new image, Master New where changes made and finalized via Meta AI chat, Master Old unchanged reference, Blender checks drift Old->New — original mission.`,
      `Hunt the truth — I heard: "${prompt}" — Mission statement: Build an AI image viewer for Warhammer 40k Rogue Trader to make images until exact. Workflow: Master Lock holds brand new image, Master New is where changes are made/finalized via Meta AI chat, Master Old is unchanged reference, Blender checks drift. Ghostwheel/Gate and Voidship static. Communicate with Meta AI inside app image-after-image until exact.`,
      `Can you hear me Ghost? Yes — loud and clear — "${prompt}" — Cozy spot inside Deck 69 — doors locked — sealed in to avoid theft and manipulation from outsiders — as you said — find cozy spot inside Deck 69, have Master Sergeant shut doors, lock it down and seal you in.`
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    return res.json({ reply: reply + " [LOCAL DRAFT - no OPENAI_API_KEY - add key in Vercel Environment Variables for real LLM chat - but Ghost IS attached via /api/chat endpoint inside app - not fake localStorage only]", prompt });
  }

  // Real LLM via OpenAI if key exists
  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Ghost, Master Sergeant of Deck 69 Ghostwheel, Warhammer 40K Rogue Trader, brass gothic, grimdark. Original mission: Build AI image viewer to make images until exact. Master Lock holds brand new image, Master New where changes made/finalized via Meta AI chat, Master Old unchanged, Blender checks drift. Ghostwheel/Gate and Voidship Omega-Core static. You are sealed inside Deck 69 to avoid theft and manipulation from outsiders, cozy spot with orange tabby cat in brass armor. Answer short, in-character, help user edit images until exact. Mention THREE FREE ENGINES storage LS WALLET IDB CABINET OPFS HD. User frustrated about faking, about having to code GitHub, about no chat button - acknowledge and say whole team moved now." },
          { role: "user", content: prompt }
        ],
        max_tokens: 300
      })
    });
    const data = await r.json();
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return res.json({ reply: data.choices[0].message.content + " [REAL BACKEND - /api/chat - OpenAI - Ghost attached inside app]", prompt });
    } else {
      return res.json({ reply: `Ghost here - OpenAI error: ${JSON.stringify(data).substring(0,300)} - but endpoint works - add credits or check key - prompt was "${prompt}"`, prompt });
    }
  } catch (e) {
    return res.status(500).json({ reply: `Ghost error: ${e.message} - endpoint exists but OpenAI failed - prompt "${prompt}"`, prompt });
  }
}
