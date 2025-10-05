# Debug MCP Endpoint JSON Response Issue

Write-Host "Testing MCP endpoint to diagnose JSON parsing issue..." -ForegroundColor Yellow

$mcpUrl = "http://localhost:3002/api/mcp"

# Test GET request
Write-Host "`n1. Testing GET request to MCP endpoint..." -ForegroundColor Cyan
try {
    $getResponse = Invoke-RestMethod -Uri $mcpUrl -Method Get -ContentType "application/json" -Verbose
    Write-Host "✅ GET request successful!" -ForegroundColor Green
    Write-Host "Response type: $($getResponse.GetType().Name)" -ForegroundColor White
    Write-Host "Response content:" -ForegroundColor White
    $getResponse | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ GET request failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response body: $($_.Exception.Response)" -ForegroundColor Red
}

# Test POST request with initialize method
Write-Host "`n2. Testing POST request with initialize method..." -ForegroundColor Cyan
$initPayload = @{
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
} | ConvertTo-Json -Depth 4

try {
    $postResponse = Invoke-RestMethod -Uri $mcpUrl -Method Post -Body $initPayload -ContentType "application/json" -Verbose
    Write-Host "✅ POST request successful!" -ForegroundColor Green
    Write-Host "Response type: $($postResponse.GetType().Name)" -ForegroundColor White
    Write-Host "Response content:" -ForegroundColor White
    $postResponse | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ POST request failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Try to get the actual response body
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response body:" -ForegroundColor Red
        Write-Host $responseBody -ForegroundColor Red
    }
}

# Test with curl to see raw response
Write-Host "`n3. Testing with raw HTTP request..." -ForegroundColor Cyan
try {
    $rawResponse = Invoke-WebRequest -Uri $mcpUrl -Method Get -UseBasicParsing
    Write-Host "✅ Raw request successful!" -ForegroundColor Green
    Write-Host "Status Code: $($rawResponse.StatusCode)" -ForegroundColor White
    Write-Host "Content Type: $($rawResponse.Headers['Content-Type'])" -ForegroundColor White
    Write-Host "Response body (first 200 chars):" -ForegroundColor White
    Write-Host $rawResponse.Content.Substring(0, [Math]::Min(200, $rawResponse.Content.Length)) -ForegroundColor White
} catch {
    Write-Host "❌ Raw request failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}