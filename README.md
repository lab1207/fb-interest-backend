# fb-interest-backend
Backend for Meta interest search tool, vercel app

---------------------

1. **Deploy to Vercel**
text
vercel.com → Import fb-interest-backend repo → Deploy
3. Add Facebook Token to Vercel (SECRET!)
text
After deployment → Project Settings → Environment Variables
Add this variable:

text
Name: FACEBOOK_TOKEN
Value: [paste your actual Facebook token here]
Scopes: Production ✅
Click "Save" → "Redeploy"

Why This Works Perfectly
text
Frontend (index.html) → Calls /api/interests
Backend (server.js) → Gets FACEBOOK_TOKEN from Vercel
Backend → Facebook API → Returns data to frontend
text
Your Vercel URL: https://fb-interest-backend-XXXX.vercel.app
✅ Token stays hidden in Vercel dashboard
✅ GitHub has NO token (secure)
✅ Facebook data loads instantly
Test It
Visit your Vercel URL

Search for interests

Facebook data should load (token works!)

Your token never touches GitHub. 100% secure. 🚀

Done in 5 minutes!
