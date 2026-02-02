$pdfPath = "C:\Users\ikrig\Documents\מיישם AI\מערכת לבדיקת החזרי מס\קבצי 106\2024.pdf"
$webhookUrl = "https://ikrigel2.app.n8n.cloud/webhook/tax-refund"

Write-Host "Testing webhook..."
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri $webhookUrl `
        -Method Post `
        -InFile $pdfPath `
        -ContentType "application/pdf" `
        -UseBasicParsing
    
    Write-Host "Status Code: $($response.StatusCode)"
    Write-Host "Status Description: $($response.StatusDescription)"
    Write-Host "Content Length: $($response.Content.Length)"
    Write-Host "Headers: $(($response.Headers | ConvertTo-Json))"
    Write-Host ""
    Write-Host "Response Content:"
    Write-Host $response.Content
    Write-Host ""
    Write-Host "Response as Text:"
    Write-Host ([System.Text.Encoding]::UTF8.GetString($response.Content))
}
catch {
    Write-Host "Error occurred!"
    Write-Host "Exception: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
        Write-Host "Status Description: $($_.Exception.Response.StatusDescription)"
    }
}
