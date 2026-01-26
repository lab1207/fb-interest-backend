# fb-interest-backend
Backend for Meta interest search tool, vercel app

---------------------

## Step-by-Step Vercel Deployment (Token-Safe)

### 1. Deploy to Vercel
```
vercel.com → Import fb-interest-backend repo → Deploy
```

### 2. **Add Facebook Token to Vercel (SECRET!)**
```
After deployment → Project Settings → Environment Variables
```
**Add this variable:**
```
Name: FACEBOOK_TOKEN
Value: [paste your actual Facebook token here]
Scopes: Production ✅
```
**Click "Save" → "Redeploy"**

## Why This Works Perfectly
```
Frontend (index.html) → Calls /api/interests
Backend (server.js) → Gets FACEBOOK_TOKEN from Vercel
Backend → Facebook API → Returns data to frontend
```

```
Your Vercel URL: https://fb-interest-backend-XXXX.vercel.app
✅ Token stays hidden in Vercel dashboard
✅ GitHub has NO token (secure)
✅ Facebook data loads instantly
```

## Test It
1. Visit your Vercel URL
2. Search for interests 
3. **Facebook data should load** (token works!)

**Your token never touches GitHub. 100% secure.** 🚀

**Done in 5 minutes!**

---------------------






**YES!** ✅

**✅ Facebook Permissions You NEED for Your Interest Search App**

**Just these 4 permissions are PERFECT for your Facebook interest app:**

```
ads_read
business_management  
read_insights
pages_show_list
```
For your **fb-interest-backend** app (Meta/Facebook interest data fetching), checkmark these **essential permissions**

**This combo will:**
- ✅ Fetch Facebook interest/targeting data (`ads_read`)
- ✅ Access business/ad account audiences (`business_management`) 
- ✅ Get audience insights (`read_insights`)
- ✅ Link to verified business Pages (`pages_show_list`)

**Your Vercel app will work 100% with only these 4.**

**Meta App Dashboard → Products → Facebook Login → Permissions & Features → Paste exactly these 4 → Save → Generate token → Done!**

**No more, no less. Perfect minimal set.** 🚀
