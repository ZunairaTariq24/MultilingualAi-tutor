# Re-run tests 1, 3, 4 with spacing for the 8000 TPM free-tier limit
$api = "http://localhost:3000/api/tutor"

function Invoke-Tutor($label, $body) {
  Write-Host "`n=== $label ==="
  try {
    $resp = Invoke-RestMethod -Uri $api -Method Post -ContentType "application/json" -Body ($body | ConvertTo-Json -Depth 6)
    [pscustomobject]@{
      stage         = $resp.stage
      teachingState = $resp.teachingState
      understanding = $resp.understandingLevel
      whiteboard    = $resp.whiteboardAction
      strategy      = $resp.nextStrategy
      understood    = ($resp.conceptsUnderstood -join ", ")
      misconceptions= ($resp.misconceptions -join ", ")
      missing       = ($resp.missingConcepts -join ", ")
    } | Format-List | Out-String | Write-Host
    Write-Host ("message: " + $resp.message)
  } catch {
    Write-Host ("FAILED: " + $_.Exception.Message)
  }
}

$base = @{ language = "english"; subjectId = "science"; topicId = "photosynthesis" }
$hist = @(
  @{ role = "tutor"; content = "Think of a leaf as a tiny food factory. It needs sunlight, water and carbon dioxide. Which one comes from the air?" }
)

Invoke-Tutor "TEST 1: correct explanation" ($base + @{ stage = "EXPLANATION"; message = "Plants use sunlight, water and carbon dioxide to make glucose and release oxygen. The chlorophyll in leaves catches sunlight energy and uses it to turn water from roots and CO2 from air into food."; history = $hist; intent = "SELF_EXPLANATION"; boardLevel = 2 })

Start-Sleep -Seconds 35

Invoke-Tutor "TEST 3: confused student" ($base + @{ stage = "PRACTICE"; message = "I don't understand how plants can make oxygen. This makes no sense to me."; history = $hist; intent = "CHAT"; boardLevel = 3 })

Start-Sleep -Seconds 35

Invoke-Tutor "TEST 4: incomplete explanation" ($base + @{ stage = "EXPLANATION"; message = "Plants need sunlight and water."; history = $hist; intent = "SELF_EXPLANATION"; boardLevel = 2 })

Write-Host "`nDone."
