# Claude Desktop MCP Configuration Guide

## Current Status
- ❌ Localhost connectivity issues prevent direct connection
- ❌ mcp-remote bridge fails due to ECONNREFUSED errors
- ✅ Digital twin data and interview guides are ready
- ✅ Alternative interview simulation approach available

## Configuration Options

### Option 1: Direct MCP Remote (Currently Not Working)
Due to Windows networking issues preventing localhost:3000 connections:

```json
{
  "mcpServers": {
    "digital-twin-remote": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "http://localhost:3000/api/mcp"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

**Status**: ❌ Fails with ECONNREFUSED error

### Option 2: Using Different Port (Alternative Attempt)
```json
{
  "mcpServers": {
    "digital-twin-simple": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "http://localhost:8080"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

**Status**: ❌ Same networking issues persist

### Option 3: Cloud Deployment (Recommended Solution)
If we deploy to Vercel or another cloud provider:

```json
{
  "mcpServers": {
    "digital-twin-cloud": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://your-app.vercel.app/api/mcp"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

**Status**: ⏳ Requires deployment completion

### Option 4: Standalone MCP Server (Direct stdio)
```json
{
  "mcpServers": {
    "digital-twin-stdio": {
      "command": "node",
      "args": ["C:/Users/lovel/Desktop/digital-twin-nextjs/mcp/dist/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

**Status**: ⏳ Requires MCP directory build

## Current Networking Issues

### Symptoms
- `curl: (7) Failed to connect to localhost port 3000`
- `ECONNREFUSED` errors from mcp-remote
- Servers report "Ready" but no actual network binding
- Both Next.js and simple HTTP servers affected

### Potential Causes
1. **Windows Firewall**: Blocking localhost connections
2. **Antivirus Software**: Blocking Node.js network access
3. **Network Adapter Issues**: localhost/127.0.0.1 resolution problems
4. **WSL/Hyper-V**: Network virtualization conflicts
5. **Port Conflicts**: Other services using the ports

### Diagnostic Commands Run
```bash
netstat -ano | findstr :3000  # No listeners found
Test-NetConnection -ComputerName localhost -Port 3000  # TCP failed
ipconfig | findstr "IPv4"  # Shows 192.168.56.1, 192.168.100.7
```

## Recommended Next Steps

### Immediate Solution: Interview Practice
Since the primary goal is interview practice, proceed with GitHub Copilot chat approach:

1. **Open fresh GitHub Copilot chat**
2. **Use the HR interviewer persona prompt**
3. **Conduct interview simulation**
4. **Return for results analysis**

### Long-term Solution: Cloud Deployment
1. **Deploy to Vercel**: `npx vercel --prod`
2. **Get live URL**: e.g., `https://digital-twin-nextjs.vercel.app`
3. **Update Claude Desktop config** with cloud URL
4. **Test mcp-remote with cloud endpoint**

## Claude Desktop Settings Location

### Windows
```
%APPDATA%\Claude\claude_desktop_config.json
```

### Example Full Config
```json
{
  "mcpServers": {
    "digital-twin": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://your-deployed-app.vercel.app/api/mcp"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  },
  "globalShortcut": "CommandOrControl+Shift+Space"
}
```

## Testing Commands
```bash
# Test local server (currently failing)
curl http://localhost:3000/api/mcp

# Test deployed server (once available)
curl https://your-app.vercel.app/api/mcp

# Test mcp-remote connection (once server works)
npx -y mcp-remote https://your-app.vercel.app/api/mcp
```

## Status Summary
- 🔴 **Local MCP Server**: Not accessible due to networking issues
- 🟡 **Cloud Deployment**: Available but not yet deployed  
- 🟢 **Interview Simulation**: Ready via GitHub Copilot chat
- 🟢 **Digital Twin Data**: Validated and available

## Next Action
Proceed with interview practice using GitHub Copilot chat while networking issues are resolved.