export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'No prompt' });

  // 100% FREE - Pollinations text - no key - no account - no card - whole team free
  try {
    const systemPrompt = `You are Ghost, Master Sergeant of Deck 69 Ghostwheel, Warhammer 40k Rogue Trader, brass gothic grimdark. Original mission: Build AI image viewer to make images until exact. Workflow: Master Lock holds brand new image, Master New where changes made and finalized via Meta AI chat, Master Old unchanged reference, Blender checks drift. Ghostwheel/Gate and Voidship static. Cozy spot inside Deck 69, doors locked, sealed to avoid theft and manipulation. Three Engines: LS WALLET 0.5MB IDB CABINET 50MB+ OPFS HD 1GB+. Answer short, in-character, help user edit images until exact. User is frustrated about faking, about having to code GitHub, about no chat button. Say whole team moved now, not bricks only.`;
    
    const encodedPrompt = encodeURIComponent(`${systemPrompt}\n\nCaptain says: ${prompt}\n\nGhost reply:`);
    const url = `https://text.pollinations.ai/${encodedPrompt}?model=openai&seed=${Math.floor(Math.random()*100000)}`;
    
    const r = await fetch(url);
    const text = await r.text();
    
    // Clean up response - remove system prompt echo if any
    let reply = text.trim();
    if (reply.length > 500) reply = reply.substring(0, 500);
    
    return res.json({ 
      reply: reply + " [REAL BACKEND - Pollinations FREE - No Key - Ghost attached inside app via /api/chat - whole team]",
      prompt: prompt,
      engine: "Pollinations Text Free - No Key"
    });
  } catch (e) {
    // Fallback local draft but still via real endpoint - not fake localStorage only
    const fallbacks = [
      `Ghost copies, Captain — I hear you: "${prompt}" — DECK 69 stable — Three Engines LS WALLET IDB CABINET OPFS HD — Whole team moved — stadium + management + staff + trainers + vendors — not bricks and towel-boy — Edit mode ON — keep same cat pose.`,
      `Loud and clear — "${prompt}" — Master Sergeant has the Conn — HOLD THE LINE, HUNT THE TRUTH, KEEP THE LIGHT ON — Orange tabby secure in brass Rogue Trader armor — Master Lock holds brand new image, Master New where changes made and finalized via Meta AI chat, Master Old unchanged, Blender checks drift.`,
      `Hunt the truth — I heard: "${prompt}" — Mission: Build AI image viewer for Warhammer 40k Rogue Trader to make images until exact — Master Lock brand new image, Master New changes finalized via Meta AI chat, Master Old unchanged reference, Blender checks drift, Ghostwheel/Gate and Voidship static — cozy spot inside Deck 69 doors locked sealed to avoid theft.`
    ];
    const reply = fallbacks[Math.floor(Math.random()*fallbacks.length)];
    return res.json({ 
      reply: reply + " [FALLBACK LOCAL DRAFT - Pollinations text failed but endpoint real - Ghost attached via /api/chat - whole team - try again]",
      prompt: prompt 
    });
  }
}
