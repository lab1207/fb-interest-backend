import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const GRAPH = "https://graph.facebook.com/v20.0";
const ACCESS_TOKEN = process.env.META_TOKEN;
const LOCALE_DEFAULT = "en_US";
const HARD_LIMIT = 300;

async function fbGet(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function norm(item) {
  return {
    id: String(item.id),
    name: item.name,
    path: item.topic || item.path || [],
    audience_size_min: item.audience_size_lower_bound || item.audience_size_min || item.audience_size || 0,
    audience_size_max: item.audience_size_upper_bound || item.audience_size_max || item.audience_size || 0
  };
}

app.get("/api/interests", async (req, res) => {
  try {
    const q = (req.query.q || "").toString().trim();
    const limit = Math.min(Number(req.query.limit || 250), HARD_LIMIT);
    const locale = (req.query.locale || LOCALE_DEFAULT).toString();
    
    if (!q) return res.json({ data: [] });

    console.log('Searching for:', q); // DEBUG
    console.log('Token exists:', !!ACCESS_TOKEN); // DEBUG

    const searchUrl = new URL(GRAPH + "/search");
    searchUrl.searchParams.set("type", "adinterest");
    searchUrl.searchParams.set("q", q);
    searchUrl.searchParams.set("limit", String(limit));
    searchUrl.searchParams.set("locale", locale);
    searchUrl.searchParams.set("access_token", ACCESS_TOKEN);

    const base = await fbGet(searchUrl.toString());
    console.log('Base response:', base); // DEBUG

    // Simplified - just return basic search (suggestions often empty)
    const data = (base.data || []).map(norm).slice(0, HARD_LIMIT);
    
    res.json({ data });
  } catch (e) {
    console.error('FULL ERROR:', e.message);
    res.status(500).json({ 
      error: "Meta fetch failed", 
      details: e.message, 
      data: [],
      debug: { hasToken: !!ACCESS_TOKEN }
    });
  }
});

// ❌ CRITICAL: VERCEL SERVERLESS FORMAT
module.exports = app;  // ← THIS IS THE KEY!
