# 🚨 CRITICAL: Groq API Key Expired

## Problem Identified
The `/api/rag` endpoint is returning 500 errors because the **Groq API key is invalid/expired**.

### Error Details
```
{"error":{"message":"Invalid API Key","type":"invalid_request_error","code":"invalid_api_key"}}
```

### Current Key (EXPIRED)
The old API key has been replaced with a new one.

## Solution: Get New Groq API Key

### Step 1: Visit Groq Console
1. Go to: https://console.groq.com/keys
2. Log in with your account
3. Click "Create API Key"
4. Copy the new key (starts with `gsk_`)

### Step 2: Update Local Environment
1. Open `.env.local` file
2. Replace the old `GROQ_API_KEY` value with the new key:
   ```bash
   GROQ_API_KEY=your_new_key_here
   ```
3. Save the file

### Step 3: Update Vercel Environment Variables
1. Go to: https://vercel.com/solace1221/digital-twin-nextjs/settings/environment-variables
2. Find `GROQ_API_KEY` variable
3. Click "Edit" → Enter new value → Save
4. Redeploy the application (or wait for auto-deploy on next push)

### Step 4: Verify Fix
After updating both local and Vercel:

**Test Local:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3002/api/rag" -Method POST -ContentType "application/json" -Body '{"query":"What are your technical skills?"}'
```

**Test Production:**
```powershell
Invoke-RestMethod -Uri "https://digital-twin-nextjs.vercel.app/api/rag" -Method POST -ContentType "application/json" -Body '{"query":"What are your technical skills?"}'
```

Both should return a successful response with Lovely's profile information.

## Why This Happened
- Groq API keys can expire or be revoked
- The GET endpoint (`/api/rag`) works because it only checks system status
- The POST endpoint fails because it needs to call Groq API to generate responses
- The error was silent in Vercel logs, appearing only as a generic 500 error

## Other Environment Variables (Still Valid)
✅ Upstash Vector DB credentials are working fine:
```
UPSTASH_VECTOR_REST_URL=https://humble-mongrel-53760-us1-vector.upstash.io
UPSTASH_VECTOR_REST_TOKEN=ABgFMGh1bWJsZS1tb25ncmVsLTUzNzYwLXVzMWFkbWluTXpCaU5XVXhZV0l0TTJRNE1pMDBaVGhrTFRneU1EQXROemM0T1dWbFpURm1ORGt6
```

## Timeline
- **Oct 10, 2025**: Discovered bilingual support was causing crashes
- **Reverted**: Removed bilingual code (commit 2f09f88)
- **Real Issue**: API key was already expired - bilingual code was a red herring
- **Current Status**: Awaiting new Groq API key to fix production and local dev

---

**Next Action**: Get new Groq API key and update both `.env.local` and Vercel environment variables.
