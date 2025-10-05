# Digital Twin MCP Server Startup Script
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Starting Digital Twin MCP Server" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📍 Project Directory: " -NoNewline
Write-Host "C:\Users\lovel\Desktop\digital-twin-nextjs" -ForegroundColor Yellow
Write-Host ""

Write-Host "🚀 Starting Next.js Development Server..." -ForegroundColor Green
Write-Host "   Port: 3002" -ForegroundColor Gray
Write-Host "   MCP Endpoint: http://localhost:3002/api/mcp" -ForegroundColor Gray
Write-Host ""

Write-Host "⚠️  IMPORTANT: Keep this window open!" -ForegroundColor Red
Write-Host "   The MCP server must stay running for Claude Desktop to connect." -ForegroundColor Yellow
Write-Host ""

Write-Host "📝 Next Steps After Server Starts:" -ForegroundColor Cyan
Write-Host "   1. Wait for 'Ready in X.Xs' message" -ForegroundColor Gray
Write-Host "   2. Add to Claude Desktop config:" -ForegroundColor Gray
Write-Host '      "digital-twin-lovely": {' -ForegroundColor Gray
Write-Host '        "command": "npx",' -ForegroundColor Gray
Write-Host '        "args": ["-y", "mcp-remote", "http://localhost:3000/api/mcp"]' -ForegroundColor Gray
Write-Host '      }' -ForegroundColor Gray
Write-Host "   3. Restart Claude Desktop" -ForegroundColor Gray
Write-Host "   4. Test with: 'Tell me about Lovely Pearl Alan'" -ForegroundColor Gray
Write-Host ""

Write-Host "Starting server in 3 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Start the development server
pnpm dev
