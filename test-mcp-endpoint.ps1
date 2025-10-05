# PowerShell script to test MCP endpoint
# Test GET request
Write-Host "Testing MCP endpoint GET request..."
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/mcp" -Method Get -ContentType "application/json"
    Write-Host "GET Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "GET Request Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n" + "="*50

# Test tools/list MCP method
Write-Host "Testing MCP tools/list method..."
$mcpRequest = @{
    jsonrpc = "2.0"
    method = "tools/list"
    id = 1
} | ConvertTo-Json -Depth 3

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/mcp" -Method Post -Body $mcpRequest -ContentType "application/json"
    Write-Host "tools/list Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "tools/list Request Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n" + "="*50

# Test a tool call - get_system_info
Write-Host "Testing MCP get_system_info tool call..."
$toolCallRequest = @{
    jsonrpc = "2.0"
    method = "tools/call"
    params = @{
        name = "get_system_info"
        arguments = @{}
    }
    id = 2
} | ConvertTo-Json -Depth 3

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/mcp" -Method Post -Body $toolCallRequest -ContentType "application/json"
    Write-Host "get_system_info Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "get_system_info Request Failed: $($_.Exception.Message)" -ForegroundColor Red
}