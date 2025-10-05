# Digital Twin MCP Server - Complete Setup Guide

## Current Status
✅ MCP API endpoint created at `/app/api/mcp/route.ts`
✅ TypeScript compilation successful
✅ Build passes with no errors
⚠️ Need to keep dev server running for Claude Desktop

## Quick Start Guide

### Step 1: Start the MCP Server

**Option A: Using the startup script (Recommended)**
```powershell
cd C:\Users\lovel\Desktop\digital-twin-nextjs
.\start-mcp-server.ps1
```

**Option B: Manual start**
```powershell
cd C:\Users\lovel\Desktop\digital-twin-nextjs
pnpm dev
```

**Important:** Keep this terminal window open! The server must stay running.

### Step 2: Wait for Server Ready

You should see:
```
✓ Ready in 3.8s
- Local:        http://localhost:3000
```

### Step 3: Configure Claude Desktop

Open Claude Desktop configuration file and add your server:

**Windows Location:** `%APPDATA%\Claude\claude_desktop_config.json`

Add this to your `mcpServers` section:

```json
{
  "mcpServers": {
    "digital-twin-lovely": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "http://localhost:3000/api/mcp"
      ]
    },
    "bootcamp-rag": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://ai-assist.ausbizconsulting.com.au/api/mcp"]
    },
    "tech-bootcamp-consultations": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://booking-cal.ausbizconsulting.com.au/api/mcp"]
    },
    "rolldice": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://rolldice.ausbizconsulting.com.au/api/mcp"]
    }
  }
}
```

### Step 4: Restart Claude Desktop

1. Close Claude Desktop completely
2. Reopen Claude Desktop
3. Wait for MCP servers to connect (check bottom status bar)

### Step 5: Test Your Digital Twin

Try these prompts in Claude Desktop:

```
Can you tell me about Lovely Pearl Alan's work experience?
```

```
What are Lovely Pearl Alan's technical skills?
```

```
Help me prepare for an interview using Lovely Pearl Alan's background.
```

## Troubleshooting

### Issue: Claude Desktop shows "Connection Failed"

**Check 1: Is the dev server running?**
```powershell
Test-NetConnection -ComputerName localhost -Port 3000
```
Should show: `TcpTestSucceeded : True`

**Check 2: Can you access the endpoint?**
Open browser: http://localhost:3000/api/mcp
Should return JSON with server info.

**Check 3: Check Claude Desktop logs**
Location: `%APPDATA%\Claude\logs\mcp.log`
Look for connection errors related to "digital-twin-lovely"

### Issue: Server Exits Immediately

If `pnpm dev` exits right after "Ready":
1. Check for runtime errors in the terminal
2. Look for TypeScript compilation errors
3. Verify environment variables in `.env.local`

### Issue: "Method not found" Errors

The MCP server supports these methods:
- `initialize` - Initial handshake
- `tools/list` - List available tools
- `tools/call` - Execute a tool
- `resources/list` - List available resources
- `resources/read` - Read profile data

## Production Deployment (Optional)

For 24/7 access without running local server:

### Deploy to Vercel

1. **Build test**
   ```powershell
   pnpm build
   ```

2. **Push to GitHub**
   ```powershell
   git add .
   git commit -m "Digital Twin MCP Server ready for deployment"
   git push origin main
   ```

3. **Deploy on Vercel**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Add environment variables:
     - `UPSTASH_VECTOR_REST_URL`
     - `UPSTASH_VECTOR_REST_TOKEN`
     - `GROQ_API_KEY`
   - Deploy!

4. **Update Claude Desktop Config**
   ```json
   "digital-twin-lovely": {
     "command": "npx",
     "args": [
       "-y",
       "mcp-remote",
       "https://your-app-name.vercel.app/api/mcp"
     ]
   }
   ```

## MCP Server Tools Available

Once connected, Claude Desktop can use these tools:

### 1. query_profile
Search Lovely Pearl Alan's professional profile
```json
{
  "name": "query_profile",
  "arguments": {
    "query": "What are her technical skills?",
    "topK": 5
  }
}
```

### 2. chat_with_digital_twin
Have a conversation with the AI digital twin
```json
{
  "name": "chat_with_digital_twin",
  "arguments": {
    "message": "Tell me about your leadership experience"
  }
}
```

### 3. get_system_info
Get information about the digital twin system
```json
{
  "name": "get_system_info",
  "arguments": {}
}
```

## Environment Variables Required

Make sure your `.env.local` has:

```env
UPSTASH_VECTOR_REST_URL=https://humble-mongrel-53760-us1-vector.upstash.io
UPSTASH_VECTOR_REST_TOKEN=your_token_here
GROQ_API_KEY=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
```

## Testing Checklist

- [ ] Dev server starts without errors
- [ ] Port 3000 is listening
- [ ] Browser can access http://localhost:3000/api/mcp
- [ ] Endpoint returns valid JSON
- [ ] Claude Desktop config updated
- [ ] Claude Desktop restarted
- [ ] MCP server shows as connected in Claude
- [ ] Test queries return profile information

## Additional Resources

- MCP Protocol Docs: https://modelcontextprotocol.io/
- Workshop Guide: https://aiagents.ausbizconsulting.com.au/digital-twin-workshop
- Vercel Deployment: https://nextjs.org/docs/deployment

## Need Help?

If you're still having issues:
1. Check the server logs in the terminal
2. Review Claude Desktop logs at `%APPDATA%\Claude\logs\`
3. Verify all environment variables are set
4. Make sure no other process is using port 3000

---

**Remember:** For local testing, the dev server must stay running in a terminal window. For production use, deploy to Vercel for 24/7 availability!
