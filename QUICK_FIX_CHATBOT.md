# 🚨 CHATBOT QUICK FIX REFERENCE

## 🔥 If Chatbot is Down - Do This First

### 1️⃣ CHECK HEALTH STATUS
```bash
https://digital-twin-nextjs-rdii.vercel.app/api/health
```

**Look for:**
- ✅ `"status": "ok"` - Everything working
- ❌ `"status": "degraded"` - Something broken

### 2️⃣ COMMON FIXES

| Error Message | Quick Fix |
|--------------|-----------|
| "Knowledge database unavailable" | Check Upstash credentials in Vercel |
| "Groq API authentication failed" | Update GROQ_API_KEY in Vercel |
| "Rate limit exceeded" | Wait 5 minutes, then try again |
| Generic "technical difficulties" | Check `/api/health` for details |

### 3️⃣ VERCEL ENVIRONMENT VARIABLES

**Required Variables:**
```bash
GROQ_API_KEY=gsk_...
UPSTASH_VECTOR_REST_URL=https://...
UPSTASH_VECTOR_REST_TOKEN=ABg...
```

**Where to Update:**
1. Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Edit/Add variables
4. Redeploy project

### 4️⃣ DEBUG WITH BROWSER CONSOLE

**How:**
1. Open website
2. Press `F12` (opens DevTools)
3. Go to "Console" tab
4. Click chatbot button
5. Ask a question
6. Look for errors

**What to Look For:**
```
❌ [RAG API] RAG system initialization failed
   → Missing environment variables

❌ [Groq Client] Error details: { status: 401 }
   → Invalid API key

✅ [RAG API] Query executed successfully
   → Everything working!
```

---

## 📞 Emergency Contacts

**Groq API Issues:**
- Dashboard: https://console.groq.com/
- Get new API key: https://console.groq.com/keys

**Upstash Issues:**
- Dashboard: https://console.upstash.com/
- Vector Database: https://console.upstash.com/vector

**Vercel Deployment:**
- Dashboard: https://vercel.com/dashboard
- Logs: Project → Logs tab

---

## 🎯 Testing Workflow

### Before Deploying:
```bash
✅ Test locally: pnpm dev
✅ Check browser console for errors
✅ Verify /api/health returns "ok"
✅ Test chatbot responses
```

### After Deploying:
```bash
✅ Wait for Vercel deployment (2-3 min)
✅ Check production /api/health
✅ Test chatbot on live site
✅ Verify no errors in browser console
```

---

## 🔍 Quick Diagnostics

### Health Check Response - What It Means

**✅ GOOD:**
```json
{
  "status": "ok",
  "services": {
    "groq": "connected",
    "upstash": "connected (594 vectors)"
  }
}
```

**❌ BAD (Groq Issue):**
```json
{
  "status": "degraded",
  "environment": {
    "hasGroqKey": false
  },
  "services": {
    "groq": "error: API key required"
  }
}
```

**❌ BAD (Upstash Issue):**
```json
{
  "status": "degraded",
  "services": {
    "upstash": "error: connection failed"
  }
}
```

---

## 📚 Full Documentation

- **Detailed Guide:** `CHATBOT_FIX_GUIDE.md`
- **Resolution Summary:** `CHATBOT_ISSUES_RESOLVED.md`

---

**Last Updated:** October 10, 2025
