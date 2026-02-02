# PowerShell script to test the n8n webhook

$pdfPath = "C:\Users\ikrig\Documents\מיישם AI\מערכת לבדיקת החזרי מס\קבצי 106\2024.pdf"
$webhookUrl = "https://ikrigel2.app.n8n.cloud/webhook/tax-refund"

if (-not (Test-Path $pdfPath)) {
    Write-Host "Error: PDF file not found at $pdfPath"
    exit 1
}

Write-Host "Uploading PDF to webhook..."
Write-Host "File: $pdfPath"
Write-Host "URL: $webhookUrl"

try {
    $response = Invoke-WebRequest -Uri $webhookUrl `
        -Method Post `
        -InFile $pdfPath `
        -ContentType "application/pdf"
    
    Write-Host "Response Status: $($response.StatusCode)"
    Write-Host "Response Body:"
    Write-Host $response.Content
}
catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
}
