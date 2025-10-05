# 🧪 GitHub Copilot MCP Testing Instructions

## ✅ Ready to Test - Your MCP Server is Running!

Your digital twin MCP server is now configured and ready for testing with GitHub Copilot. Here's what you need to do:

### 🔧 Pre-Test Checklist

**✅ Server Status:**
- ✅ Development server running at http://localhost:3000
- ✅ MCP endpoint active at http://localhost:3000/api/mcp
- ✅ MCP configuration file exists at `.vscode/mcp.json`
- ✅ Server responding with proper JSON-RPC format

**⚠️ Environment Variables Required:**
```bash
# You need to create .env.local with these values:
UPSTASH_VECTOR_REST_URL=your_actual_url
UPSTASH_VECTOR_REST_TOKEN=your_actual_token  
GROQ_API_KEY=your_actual_api_key
```

---

## 🎯 Step-by-Step Testing Process

### Step 1: Enable MCP in VS Code Insiders

**Method 1 - Command Palette (Recommended):**
1. Open VS Code Insiders (must be Insiders version, not regular VS Code)
2. Press `Ctrl+Shift+P` 
3. Type: "GitHub Copilot: Enable MCP Servers"
4. Select your `.vscode/mcp.json` configuration
5. Restart VS Code Insiders

**Method 2 - Settings UI:**
1. Open Settings (`Ctrl+,`)
2. Search: "copilot mcp"
3. Enable "GitHub Copilot: Use MCP Servers"
4. Point to your `.vscode/mcp.json` file

### Step 2: Verify MCP Connection

**Check VS Code Status Bar:**
- Look for MCP connection indicator (bottom-left)
- Should show "MCP: Connected" or similar status

**Check Output Panel:**
1. View → Output (or `Ctrl+Shift+U`)
2. Select "GitHub Copilot" from dropdown
3. Look for MCP connection messages

### Step 3: Test MCP Integration

**🧪 Test 1 - Basic Digital Twin Query:**
```
@workspace Can you tell me about my work experience using the digital twin MCP server?
```

**Expected Response Pattern:**
- Should respond in first person as "I am Lovely Pearl B. Alan"
- Should include specific details from the digital twin data
- Should mention BSIT student, Web & App Development major
- Should reference President's Lister status, leadership roles

**🧪 Test 2 - Technical Skills Query:**
```
@workspace Using my digital twin data, what are my key technical skills?
```

**Expected Response Pattern:**
- Should mention C++ and JavaScript certifications from Cisco
- Should reference Laravel framework expertise
- Should include database management experience
- Should mention specific projects like Good Moral Application

**🧪 Test 3 - Professional Summary:**
```
@workspace Query my digital twin MCP server to get a comprehensive professional summary of my background.
```

**Expected Response Pattern:**
- Should provide complete professional overview
- Should mention St. Paul University Philippines
- Should include academic achievements and leadership roles
- Should reference career goals (Data Analyst/Software Engineer)

**🧪 Test 4 - Interview Preparation:**
```
@workspace Query my digital twin MCP server to help me prepare for a technical interview. What projects should I highlight?
```

**Expected Response Pattern:**
- Should suggest specific projects to highlight
- Should mention Good Moral Application and Monitoring System
- Should reference technical skills and certifications
- Should provide interview-focused advice

**🧪 Test 5 - Advanced RAG Query:**
```
@workspace Use the digital twin MCP to find information about my experience with databases and data analysis, and explain how it relates to my career goals.
```

**Expected Response Pattern:**
- Should connect database experience to Data Analyst career goal
- Should mention SQL experience and database management
- Should provide context about how skills align with objectives

---

## 📊 Monitoring and Debugging

### Monitor Server Logs

**Watch your terminal where `pnpm dev` is running for:**

```bash
✅ Good Signs:
GET /api/mcp 200 in XXXms
POST /api/mcp - MCP method: tools/list
POST /api/mcp - MCP method: tools/call
Initializing RAG system...
RAG system initialized successfully
Connected to Upstash Vector successfully!
Groq client initialized successfully!

❌ Error Signs:
UPSTASH_VECTOR_REST_URL is undefined
Connection refused
Module not found
Type error
```

### GitHub Copilot Behavior Indicators

**🎯 MCP Working Correctly:**
- Responses include specific personal details
- Mentions exact names, places, and achievements
- Uses first-person perspective ("I am...")
- References specific technical skills and projects
- Provides contextual, relevant information

**❌ MCP Not Working:**
- Generic AI responses without personal details
- No mention of specific achievements or background
- Third-person or generic responses
- No connection to digital twin data

---

## 🔧 Troubleshooting Common Issues

### Issue 1: "GitHub Copilot doesn't use MCP data"

**Solutions:**
1. Ensure VS Code Insiders (not regular VS Code)
2. Update GitHub Copilot extension to latest version
3. Restart VS Code after configuring MCP
4. Use `@workspace` prefix in all test prompts
5. Check MCP connection indicator in status bar

### Issue 2: "MCP server returns errors"

**Check:**
1. Environment variables in `.env.local` are set correctly
2. Upstash Vector database is accessible
3. Groq API key is valid and has credits
4. `data/digitaltwin.json` exists and has profile data

**Debug Commands:**
```bash
# Test server endpoint directly
curl http://localhost:3000/api/mcp

# Check if data file exists
ls data/digitaltwin.json

# Restart development server
pnpm dev
```

### Issue 3: "Connection timeouts or network errors"

**Solutions:**
1. Check Windows Firewall settings for localhost:3000
2. Verify no other service is using port 3000
3. Try restarting the development server
4. Check antivirus software isn't blocking connections

---

## 📝 Test Results Template

**Use this to document your testing:**

```markdown
## MCP Testing Results - [Date]

### Environment Setup:
- [ ] VS Code Insiders version: ______
- [ ] GitHub Copilot extension version: ______
- [ ] Environment variables configured: [ ]
- [ ] MCP server running: [ ]

### Test Results:

**Test 1 - Basic Digital Twin Query:**
- Prompt: @workspace Can you tell me about my work experience using the digital twin MCP server?
- Response: [Paste response here]
- MCP Working: [ ] Yes [ ] No
- Notes: [Any observations]

**Test 2 - Technical Skills:**
- Prompt: @workspace Using my digital twin data, what are my key technical skills?
- Response: [Paste response here]
- MCP Working: [ ] Yes [ ] No
- Notes: [Any observations]

[Continue for other tests...]

### Overall Assessment:
- MCP Integration Status: [ ] Working [ ] Partially [ ] Not Working
- Response Quality: [ ] Excellent [ ] Good [ ] Poor
- Next Steps: [What to do next]
```

---

## 🚀 Next Steps After Successful Testing

1. **Document Successful Patterns**: Save prompts that work well
2. **Optimize Performance**: Monitor response times and adjust if needed  
3. **Enhance Data**: Add more detailed information to digital twin
4. **Create Specialized Tools**: Build custom MCP tools for specific use cases
5. **Production Deployment**: Consider deploying for broader access

---

**Remember**: This is a powerful system that gives GitHub Copilot direct access to your digital twin data. The responses should feel personal and specific to your background, skills, and experiences as defined in your `digitaltwin.json` file.