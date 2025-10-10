# Update Vercel Environment Variable

## ✅ Local Environment Updated
Your `.env.local` file now has the new API key.
(Key value stored securely in `.env.local` - not committed to git)

## 🚀 Next Step: Update Vercel (Production)

### Option 1: Via Vercel Dashboard (Recommended)
1. Go to: https://vercel.com/solace1221/digital-twin-nextjs/settings/environment-variables
2. Find the `GROQ_API_KEY` row
3. Click the **⋮** (three dots) menu → **Edit**
4. Replace with your new Groq API key (starts with `gsk_`)
5. Click **Save**
6. Go to: https://vercel.com/solace1221/digital-twin-nextjs
7. Click **Redeploy** to trigger a new deployment with the updated key

### Option 2: Via Vercel CLI (Alternative)
```powershell
# Install Vercel CLI (if not already installed)
pnpm add -g vercel

# Login to Vercel
vercel login

# Update environment variable
vercel env add GROQ_API_KEY production
# When prompted, paste your new Groq API key

# Trigger redeploy
vercel --prod
```

### Option 3: Quick Git Push (Triggers Auto-Deploy)
```powershell
# Make a small change to trigger deployment
git commit --allow-empty -m "Trigger redeploy with new Groq API key"
git push origin main
```

## 🧪 Test Production After Update

Wait ~1-2 minutes for deployment to complete, then test:

```powershell
# Test the chatbot endpoint
Invoke-RestMethod -Uri "https://digital-twin-nextjs.vercel.app/api/rag" -Method POST -ContentType "application/json" -Body '{"query":"What are your technical skills?"}'
```

**Expected Response:**
```json
{
  "success": true,
  "query": "What are your technical skills?",
  "searchResults": [...],
  "response": "I have strong proficiency in several programming languages and technologies...",
  "usageStats": {...},
  "timestamp": "2025-10-10T..."
}
```

## 📝 About Local Dev Server Issue

The local dev server is experiencing a separate issue (silent crash when accessing `/api/rag`). This is likely a:
- Turbopack compatibility issue with Next.js 15.5.3
- Windows-specific Node.js issue
- Local development environment configuration

**Production should work fine** once you update the Vercel environment variable.

For now, use **production deployment** for testing: https://digital-twin-nextjs.vercel.app

---

**Status:**
- ✅ New API key verified and working
- ✅ Local `.env.local` updated
- ⏳ **ACTION REQUIRED**: Update Vercel environment variable
- ⚠️ Local dev server issue (separate from API key) - use production for testing
