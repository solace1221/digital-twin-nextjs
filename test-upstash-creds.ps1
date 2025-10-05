# Test Upstash Vector Credentials

Write-Host "Testing Upstash Vector credentials..." -ForegroundColor Yellow

# Load environment variables from .env.local
if (Test-Path ".env.local") {
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match "^([^#=]+)=(.+)$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            Set-Variable -Name $name -Value $value
        }
    }
    Write-Host "✅ Loaded .env.local file" -ForegroundColor Green
} else {
    Write-Host "❌ .env.local file not found!" -ForegroundColor Red
    exit 1
}

Write-Host "`nEnvironment Variables:" -ForegroundColor Cyan
Write-Host "UPSTASH_VECTOR_REST_URL: $UPSTASH_VECTOR_REST_URL"
Write-Host "UPSTASH_VECTOR_REST_TOKEN: $($UPSTASH_VECTOR_REST_TOKEN.Substring(0, 20))..."
Write-Host "GROQ_API_KEY: $($GROQ_API_KEY.Substring(0, 20))..."

# Test Upstash connection with curl
Write-Host "`nTesting Upstash Vector connection..." -ForegroundColor Yellow

$headers = @{
    'Authorization' = "Bearer $UPSTASH_VECTOR_REST_TOKEN"
    'Content-Type' = 'application/json'
}

$infoUrl = "$UPSTASH_VECTOR_REST_URL/info"

try {
    $response = Invoke-RestMethod -Uri $infoUrl -Method Get -Headers $headers
    Write-Host "✅ Upstash connection successful!" -ForegroundColor Green
    Write-Host "Vector database info:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Upstash connection failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "`n💡 The credentials appear to be invalid. Please check:" -ForegroundColor Yellow
        Write-Host "1. Go to https://console.upstash.com/vector" -ForegroundColor White
        Write-Host "2. Select your vector database" -ForegroundColor White
        Write-Host "3. Copy the REST URL and REST TOKEN" -ForegroundColor White
        Write-Host "4. Update your .env.local file" -ForegroundColor White
    }
}