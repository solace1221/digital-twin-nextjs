# ✅ MCP Server Configuration - WORKING SOLUTION

## 🎉 Problem Solved!
**Root Cause**: PowerShell signal handling was sending SIGINT to child processes when making HTTP requests from the same session.

**Solution**: Run servers in separate PowerShell windows to avoid signal interference.

## 🚀 Current Setup (Running)

### 1. MCP Server ✅
- **Status**: Running in separate PowerShell window
- **URL**: http://localhost:3000/api/mcp
- **Test**: `curl.exe http://localhost:3000/api/mcp` returns server info

### 2. MCP Remote Bridge ✅  
- **Status**: Running in separate PowerShell window
- **Command**: `npx -y mcp-remote http://localhost:3000/api/mcp`
- **Tunnel URL**: Will be displayed in the mcp-remote window

## 📋 Next Steps

### Step 1: Get the Tunnel URL
1. Check the PowerShell window running `mcp-remote`
2. Look for output like: `Tunnel URL: https://xxxxx.ngrok.io` or similar
3. Copy this URL for Claude Desktop configuration

### Step 2: Configure Claude Desktop
1. Open Claude Desktop
2. Go to Settings > Developer > MCP Servers
3. Add this configuration:

```json
{
  "mcpServers": {
    "digital-twin": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "http://localhost:3000/api/mcp"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

**OR** if using the tunnel URL:

```json
{
  "mcpServers": {
    "digital-twin-tunnel": {
      "command": "npx", 
      "args": ["-y", "mcp-remote", "PASTE_TUNNEL_URL_HERE"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### Step 3: Test Claude Desktop Integration
1. Restart Claude Desktop
2. Test with queries like:
   - "Tell me about Lovely's background"
   - "What are her technical skills?"
   - "Describe her leadership experience"

## 🔧 Important Notes

### Keeping Servers Running
- **DO NOT CLOSE** the PowerShell windows running:
  1. `pnpm dev` (Next.js server)
  2. `npx -y mcp-remote` (bridge)
- Both must remain running for Claude Desktop to work

### If Servers Stop
To restart:
```bash
# Terminal 1: Start Next.js server
cd C:\Users\lovel\Desktop\digital-twin-nextjs
pnpm dev

# Terminal 2: Start mcp-remote bridge  
cd C:\Users\lovel\Desktop\digital-twin-nextjs
npx -y mcp-remote http://localhost:3000/api/mcp
```

### Testing Commands
```bash
# Test MCP server
curl.exe http://localhost:3000/api/mcp

# Test specific tool
curl.exe -X POST -H "Content-Type: application/json" -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/list\"}" http://localhost:3000/api/mcp
```

## 🎯 Ready for Interview Practice!

With the MCP server working, you now have two options:

### Option A: Use Claude Desktop (Advanced)
- Configure Claude Desktop with MCP server
- Natural conversation with digital twin
- Full tool integration

### Option B: Use GitHub Copilot Chat (Immediate)
- Open fresh GitHub Copilot chat
- Use HR interviewer persona prompt
- Start practicing immediately

**Both approaches will help you prepare effectively for your interviews!** 🚀