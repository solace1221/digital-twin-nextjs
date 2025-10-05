# MCP Server Testing Guide for GitHub Copilot with Claude Sonnet

## ✅ Completed Setup Steps

### 1. MCP Configuration File
- **Status**: ✅ COMPLETED
- **File**: `.vscode/mcp.json`
- **Configuration**: Digital Twin MCP Server at `http://localhost:3000/api/mcp`

### 2. Development Server
- **Status**: ✅ RUNNING
- **URL**: http://localhost:3000
- **MCP Endpoint**: http://localhost:3000/api/mcp
- **Response**: Server returns proper JSON with name, version, status, and capabilities

### 3. MCP Server Validation
- **Status**: ✅ VERIFIED
- **Tools Available**: `query_profile`, `get_system_info`, `search_profile`
- **Prompts Available**: `professional_summary`, `skills_expertise`, `experience_projects`
- **Resources Available**: `profile://personal-info`, `profile://professional-summary`, `profile://skills`, `profile://experience`

---

## 📋 Next Steps: GitHub Copilot Integration

### Step 1: Enable MCP in VS Code Insiders

**Method A - Command Palette:**
1. Open VS Code Insiders (not regular VS Code)
2. Press `Ctrl+Shift+P` (Windows) to open Command Palette
3. Type: "GitHub Copilot: Enable MCP Servers"
4. Select your project's `.vscode/mcp.json` configuration
5. Restart VS Code Insiders

**Method B - Settings:**
1. Open VS Code Settings (`Ctrl+,`)
2. Search for "copilot mcp"
3. Enable "GitHub Copilot: Use MCP Servers"
4. Point to your `.vscode/mcp.json` file path
5. Restart VS Code Insiders

**Method C - Manual Configuration:**
1. Open VS Code Settings JSON (`Ctrl+Shift+P` → "Preferences: Open User Settings (JSON)")
2. Add:
   ```json
   {
     "github.copilot.enable": {
       "mcp": true
     },
     "github.copilot.mcp.serverConfigPath": ".vscode/mcp.json"
   }
   ```

### Step 2: Verify MCP Connection Status

**Check VS Code Status Bar:**
- Look for MCP connection indicator (usually bottom-left)
- Should show "MCP: Connected" or similar
- If red/error, check server logs

**Check Output Panel:**
1. View → Output
2. Select "GitHub Copilot" from dropdown
3. Look for MCP connection messages

### Step 3: Test MCP Integration with Sample Prompts

**🧪 Basic Functionality Test:**
```
@workspace Can you tell me about my work experience using the digital twin MCP server?
```

**🧪 Skills Query Test:**
```
@workspace Using my digital twin data, what are my key technical skills?
```

**🧪 Professional Summary Test:**
```
@workspace Query my digital twin MCP server to get a professional summary of my background.
```

**🧪 Interview Preparation Test:**
```
@workspace Query my digital twin MCP server to help me prepare for a technical interview. What projects should I highlight?
```

**🧪 Advanced RAG Test:**
```
@workspace Use the digital twin MCP to find information about my experience with databases and data analysis.
```

### Step 4: Monitor MCP Activity

**Server Logs (Terminal where pnpm dev is running):**
```
✅ GET /api/mcp 200 - MCP endpoint responding
✅ POST /api/mcp - tools/list method called
✅ POST /api/mcp - tools/call method (query_profile)
✅ Initializing RAG system...
✅ RAG system initialized successfully
```

**Expected GitHub Copilot Behavior:**
- Should respond with first-person answers as Lovely Pearl B. Alan
- Should include specific details from the digital twin data
- Should mention technical skills, projects, and experience
- Should format responses professionally

---

## 🔧 Troubleshooting Guide

### MCP Server Not Responding
**Symptoms:**
- GitHub Copilot doesn't use MCP data
- Generic responses without personal details
- Error messages about MCP connection

**Solutions:**
1. Verify server is running: http://localhost:3000/api/mcp
2. Check `.vscode/mcp.json` file exists and is valid
3. Restart VS Code Insiders after creating MCP config
4. Ensure no firewall blocking localhost:3000

### GitHub Copilot Not Using MCP
**Symptoms:**
- Copilot responds but without digital twin data
- No MCP connection indicator in VS Code
- Generic AI responses instead of personalized ones

**Solutions:**
1. Ensure you're using VS Code Insiders (not regular VS Code)
2. Update GitHub Copilot extension to latest version
3. Enable MCP features in Copilot settings
4. Use `@workspace` prefix in prompts
5. Try restarting GitHub Copilot extension

### No Digital Twin Responses
**Symptoms:**
- MCP connects but returns empty/error responses
- Server logs show connection errors
- RAG system not initializing

**Solutions:**
1. Check environment variables in `.env.local`:
   - `UPSTASH_VECTOR_REST_URL`
   - `UPSTASH_VECTOR_REST_TOKEN`
   - `GROQ_API_KEY`
2. Verify `data/digitaltwin.json` exists and has profile data
3. Check Upstash Vector database connection
4. Verify Groq API key is valid

### Debugging Commands

**Test MCP Endpoint Manually:**
```bash
# PowerShell (run in separate terminal)
$body = '{"jsonrpc":"2.0","method":"tools/list","id":1}' | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/mcp" -Method Post -Body $body -ContentType "application/json"
```

**Check Server Status:**
```bash
# Visit in browser
http://localhost:3000/api/mcp
```

**Monitor Server Logs:**
```bash
# Terminal where pnpm dev is running - watch for:
# - RAG system initialization messages
# - MCP method calls (tools/list, tools/call)
# - Any error messages
```

---

## 🎯 Success Indicators

### MCP Integration Working Correctly:
✅ **Connection Status**: VS Code shows MCP connected  
✅ **Server Logs**: Show MCP method calls when using @workspace  
✅ **Copilot Responses**: Include specific personal details from digital twin  
✅ **RAG System**: Successfully searches and returns relevant profile data  
✅ **First-Person Responses**: Copilot answers as "I am Lovely Pearl B. Alan"  

### Example Successful Response:
```
@workspace Can you tell me about my work experience using the digital twin MCP server?

Expected Response:
"I am Lovely Pearl B. Alan, currently a BSIT student at St. Paul University Philippines 
with a major in Web & App Development. I maintain President's Lister academic status 
and serve as President of the Junior Philippine Computer Society and Executive Secretary 
of Student Government. My technical experience includes C++ and JavaScript certifications 
from Cisco, expertise in Laravel framework, and database management. I've developed 
projects like the Good Moral Application and Monitoring System using Laravel and SQL. 
I'm actively seeking internship opportunities as I work toward my career goal of 
becoming a Data Analyst or Software Engineer."
```

---

## 📝 Test Results Log

**Use this section to document your testing results:**

| Test Prompt | Expected Result | Actual Result | Status |
|------------|-----------------|---------------|--------|
| @workspace tell me about work experience | Personal details as Lovely | [Your Result] | [ ] |
| @workspace what are my technical skills | C++, JS, Laravel, DB | [Your Result] | [ ] |
| @workspace help with interview prep | Projects + achievements | [Your Result] | [ ] |
| @workspace professional summary | Full background summary | [Your Result] | [ ] |

---

## 🚀 Next Steps After Successful Testing

1. **Optimize Prompts**: Fine-tune system prompts for better responses
2. **Add More Tools**: Implement additional MCP tools for specific queries
3. **Enhance RAG**: Improve vector search with better chunking strategies
4. **Performance**: Monitor response times and optimize if needed
5. **Documentation**: Document successful prompt patterns for future use

---

**Note**: This guide assumes you're using VS Code Insiders with the latest GitHub Copilot extension that supports MCP integration. If MCP features aren't available, ensure you have the preview/insider version of both VS Code and the Copilot extension.