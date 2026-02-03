$filePath = "c:\Users\ikrig\Documents\ai-implementor\tax-refund\106\2024.pdf"
$webhookUrl = "https://ikrigel2.app.n8n.cloud/webhook/tax-refund"

Write-Host "Sending test request to: $webhookUrl"
Write-Host "File: $(Split-Path -Leaf $filePath) ($([System.Math]::Round((Get-Item $filePath).Length / 1MB, 2)) MB)`n"

try {
    $response = Invoke-WebRequest -Uri $webhookUrl `
        -Method POST `
        -InFile $filePath `
        -ContentType "application/pdf" `
        -Headers @{"X-File-Name" = (Split-Path -Leaf $filePath)}

    Write-Host "Success! Response:" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)"
    Write-Host "Response Length: $($response.Content.Length) bytes`n"

    try {
        $jsonResponse = $response.Content | ConvertFrom-Json
        $jsonResponse | ConvertTo-Json -Depth 10
    }
    catch {
        Write-Host "Raw Response: $($response.Content)"
    }
}
catch {
    $errorMsg = $_.Exception.Message
    Write-Host "Error: $errorMsg" -ForegroundColor Red
    if ($_.Response) {
        Write-Host "Response Status: $($_.Response.StatusCode)"
        $respContent = $_.Response.Content
        Write-Host "Response Body: $respContent"
    }
}
