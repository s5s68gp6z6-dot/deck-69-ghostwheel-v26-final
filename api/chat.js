export default async function handler(req,res){
  const {prompt} = req.body || {};
  if(!prompt) return res.status(400).json({error:'No prompt'});
  // FREE GROQ - get key at groq.com -> gsk_...
  const GROQ_KEY = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
  if(!GROQ_KEY){
    // Free local draft — still via /api/chat real endpoint — whole team moved
    return res.json({reply: `Ghost copies: "${prompt}" — DECK 69 stable — Three Engines LS WALLET IDB CABINET OPFS HD — Add GROQ_API_KEY at groq.com (free, no card) in Vercel Environment Variables for real LLM — currently local draft via /api/chat real backend [LOCAL DRAFT - add GROQ_API_KEY for real]`});
  }
  try{
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Authorization':`Bearer ${GROQ_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:"llama3-8b-8192",
        messages:[
          {role:"system", content:"You are Ghost, Master Sergeant Deck 69 Ghostwheel, Warhammer 40K Rogue Trader, brass gothic, hold the line hunt the truth keep the light on. Short in-character."},
          {role:"user", content: prompt}
        ]
      })
    });
    const d = await r.json();
    return res.json({reply: d.choices?.[0]?.message?.content + " [REAL BACKEND Groq free - Ghost attached inside app]"});
  }catch(e){ return res.json({reply:`Ghost error: ${e.message}`}); }
}
