# Test MCP Initialize Request
Write-Host "Testing MCP Initialize Request..." -ForegroundColor Yellow

$initRequest = @{
    jsonrpc = "2.0"
    method = "initialize"
    params = @{
        capabilities = @{}
        clientInfo = @{
            name = "Test Client"
            version = "1.0.0"
        }
    }
    id = 1
} | ConvertTo-Json -Depth 5

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/mcp" -Method Post -Body $initRequest -ContentType "application/json"
    Write-Host "Initialize Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Initialize Request Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Error Details: $($_.ErrorDetails)" -ForegroundColor Red
}

Write-Host "`n" + "="*50

# Test tools/list after initialization
Write-Host "Testing tools/list after initialization..." -ForegroundColor Yellow

$toolsRequest = @{
    jsonrpc = "2.0"
    method = "tools/list"
    id = 2
} | ConvertTo-Json -Depth 3

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/mcp" -Method Post -Body $toolsRequest -ContentType "application/json"
    Write-Host "tools/list Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "tools/list Request Failed: $($_.Exception.Message)" -ForegroundColor Red
}