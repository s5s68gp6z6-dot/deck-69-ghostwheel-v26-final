export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only - use SEND TO META button' });
  const { prompt, editMode, currentImage } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'No prompt - type in MASTER - NEW box' });

  const apiKey = process.env.OPENAI_API_KEY;
  
  // If OPENAI_API_KEY exists and prompt contains edit hint, try OpenAI for real edit (optional)
  if (apiKey && prompt.toLowerCase().includes('openai')) {
    try {
      const r = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: `Warhammer 40k Rogue Trader cat brass gothic armor, ${prompt}`,
          n: 1, size: "1024x1024"
        })
      });
      const d = await r.json();
      if (d.data && d.data[0] && d.data[0].url) {
        return res.json({ imageUrl: d.data[0].url, prompt, engine: 'OpenAI DALL-E 3 - REAL' });
      }
    } catch (e) {
      // fall through to free engine
    }
  }

  // FREE ENGINE - Pollinations - no key needed - whole team - works for millions without special circumstances
  // Add random seed + editMode handling
  const seed = Math.floor(Math.random() * 1000000);
  const basePrompt = editMode 
    ? `same orange tabby cat, same pose, same brass armor, edit: ${prompt}, Warhammer 40k Rogue Trader, keep same cat pose, oil painting, grimdark`
    : `Warhammer 40k Rogue Trader cat, brass gothic armor Imperial Aquila chestplate, ${prompt}, ultra detailed grimdark photorealistic, orange tabby`;
  
  const encodedPrompt = encodeURIComponent(basePrompt);
  // Pollinations sometimes at limit - provide direct URL that browser loads
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true&enhance=false`;
  
  return res.json({ 
    imageUrl: imageUrl,
    prompt: prompt,
    engine: 'DECK 69 GHOSTWHEEL FREE ENGINE - Pollinations - No Key - Whole Team - editMode:' + editMode,
    note: 'If you see At its limit right now beige page, wait 5 sec and click SEND TO META again - free service full - or add OPENAI_API_KEY with credits for DALL-E 3 no limit - images stick via LS WALLET IDB CABINET OPFS HD'
  });
}
