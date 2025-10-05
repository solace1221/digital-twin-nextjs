# Claude Desktop MCP Configuration Guide

## ✅ MCP Server Status: WORKING
- **Endpoint**: http://localhost:3000/api/mcp  
- **Status**: Active and responding
- **Tools**: query_profile, search_profile, get_system_info
- **Last Tested**: 2025-09-18T02:18:59.933Z

## 📋 Configuration Steps

### Step 1: Locate Claude Desktop Config File
**Windows Path**: `%APPDATA%\Claude\claude_desktop_config.json`

### Step 2: Open/Create Configuration File
If the file doesn't exist, create it. If it exists, add to the `mcpServers` section.

### Step 3: Add MCP Server Configuration

#### Option A: Direct MCP-Remote Integration (Recommended)
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

#### Option B: Complete Configuration with Multiple Settings
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
  },
  "globalShortcut": "CommandOrControl+Shift+Space"
}
```

## 🚀 Setup Instructions

### Step 1: Open Configuration File
```bash
# Option 1: Use notepad
notepad %APPDATA%\Claude\claude_desktop_config.json

# Option 2: Use Windows Explorer
# Navigate to: %APPDATA%\Claude\
# Open: claude_desktop_config.json
```

### Step 2: Paste Configuration
Copy one of the JSON configurations above and paste into the file.

### Step 3: Restart Claude Desktop
Close and reopen Claude Desktop completely.

### Step 4: Verify Connection
In Claude Desktop, try these test queries:
- "Tell me about Lovely's background"
- "What are her technical skills?"
- "Query her professional profile"

## 🔧 Important Prerequisites

### Keep Servers Running
**CRITICAL**: Both these PowerShell windows must stay open:

1. **Next.js Server** (Terminal 1):
   ```bash
   cd C:\Users\lovel\Desktop\digital-twin-nextjs
   pnpm dev
   ```

2. **MCP-Remote Bridge** (Terminal 2):
   ```bash  
   cd C:\Users\lovel\Desktop\digital-twin-nextjs
   npx -y mcp-remote http://localhost:3000/api/mcp
   ```

## 🧪 Testing Commands

### Test MCP Server Direct
```bash
curl.exe http://localhost:3000/api/mcp
```

### Test MCP Tools
```powershell
$body = '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
Invoke-WebRequest -Uri "http://localhost:3000/api/mcp" -Method POST -ContentType "application/json" -Body $body
```

### Test Digital Twin Query
```powershell
$body = '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"query_profile","arguments":{"query":"tell me about yourself"}}}'
Invoke-WebRequest -Uri "http://localhost:3000/api/mcp" -Method POST -ContentType "application/json" -Body $body
```

## 📱 Claude Desktop Usage

Once configured, you can interact with your digital twin in Claude Desktop:

### Example Queries:
- **Background**: "Tell me about Lovely's educational background and achievements"
- **Skills**: "What programming languages and technical skills does she have?"
- **Projects**: "Describe her capstone project and its impact"
- **Leadership**: "What leadership roles has she held?"
- **Goals**: "What are her career aspirations?"

### Available Tools:
1. **query_profile** - Get detailed responses about professional background
2. **search_profile** - Search for specific information 
3. **get_system_info** - Check digital twin system status

## 🛠️ Troubleshooting

### If Claude Desktop Can't Connect:
1. **Check servers are running** in separate PowerShell windows
2. **Verify MCP endpoint**: `curl.exe http://localhost:3000/api/mcp`
3. **Restart Claude Desktop** after config changes
4. **Check config file syntax** - must be valid JSON

### If Tools Don't Work:
1. Test tools directly using PowerShell commands above
2. Check PowerShell windows for error messages
3. Restart both servers if needed

## ✅ Success Indicators

You'll know it's working when:
- ✅ Claude Desktop shows your MCP server in settings
- ✅ Digital twin queries return personal responses
- ✅ Tools execute without errors
- ✅ Responses are contextual and specific

## 🎯 Ready for Interview Practice!

Once Claude Desktop is configured, you can:
1. **Practice interviews naturally** with your digital twin
2. **Get consistent responses** based on your actual profile
3. **Refine your answers** through repeated practice
4. **Prepare for different interview scenarios**

**Your MCP-powered digital twin is ready to help you ace those interviews!** 🚀