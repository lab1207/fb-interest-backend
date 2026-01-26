import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const GRAPH = "https://graph.facebook.com/v20.0";
const ACCESS_TOKEN = process.env.META_TOKEN;

app.get("/api/interests", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json({ data: [] });

    console.log(`Searching interests for: ${q}`);
    
    const url = `${GRAPH}/search?type=adinterest&q=${encodeURIComponent(q)}&limit=25&access_token=${ACCESS_TOKEN}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('Facebook response:', data);
    
    const interests = (data.data || []).map(item => ({
      id: item.id,
      name: item.name,
      path: item.path || [],
      audience_size_min: item.audience_size_lower_bound || 0,
      audience_size_max: item.audience_size_upper_bound || 0
    }));
    
    res.json({ data: interests });
  } catch (error) {
    console.error('ERROR:', error);
    res.json({ data: [], error: error.message });
  }
});

// VERCEL SERVERLESS - CRITICAL!
export default app;
