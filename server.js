import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const GRAPH = "https://graph.facebook.com/v19.0"; // Always stay current version
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
    audience_size_min:
      item.audience_size_lower_bound ||
      item.audience_size_min ||
      item.audience_size ||
      0,
    audience_size_max:
      item.audience_size_upper_bound ||
      item.audience_size_max ||
      item.audience_size ||
      0
  };
}

app.get("/api/interests", async (req, res) => {
  try {
    const q = (req.query.q || "").toString().trim();
    const limit = Math.min(Number(req.query.limit || 250), HARD_LIMIT);
    const locale = (req.query.locale || LOCALE_DEFAULT).toString();
    if (!q) return res.json({ data: [] });

    const searchUrl = new URL(GRAPH + "/search");
    searchUrl.searchParams.set("type", "adinterest");
    searchUrl.searchParams.set("q", q);
    searchUrl.searchParams.set("limit", String(limit));
    searchUrl.searchParams.set("locale", locale);
    searchUrl.searchParams.set("access_token", ACCESS_TOKEN);

    const base = await fbGet(searchUrl.toString());

    const suggUrl = new URL(GRAPH + "/search");
    suggUrl.searchParams.set("type", "adinterestsuggestion");
    suggUrl.searchParams.set("interest_list", JSON.stringify([q]));
    suggUrl.searchParams.set("limit", String(limit));
    suggUrl.searchParams.set("locale", locale);
    suggUrl.searchParams.set("access_token", ACCESS_TOKEN);

    const sugg = await fbGet(suggUrl.toString());

    // Merge/dedupe
    const outMap = new Map();
    const addAll = (arr, key = "data") => {
      (arr?.[key] || []).forEach(item => {
        if (!item || !item.id) return;
        if (!outMap.has(item.id)) outMap.set(item.id, norm(item));
      });
    };
    addAll(base);
    addAll(sugg);

    // Optionally: add suggestions from top results
    const seeds = (base?.data || []).slice(0, 10);
    for (const s of seeds) {
      try {
        const su = new URL(GRAPH + "/search");
        su.searchParams.set("type", "adinterestsuggestion");
        su.searchParams.set("interest_list", JSON.stringify([s.name]));
        su.searchParams.set("limit", "50");
        su.searchParams.set("locale", locale);
        su.searchParams.set("access_token", ACCESS_TOKEN);
        const more = await fbGet(su.toString());
        addAll(more);
        if (outMap.size >= HARD_LIMIT) break;
      } catch (e) {}
    }
    const data = Array.from(outMap.values()).slice(0, HARD_LIMIT);
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: "Meta fetch failed", details: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API on :" + PORT));
