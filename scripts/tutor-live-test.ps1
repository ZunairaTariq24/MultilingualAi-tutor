# Live tests for the interactive tutor (spec section 18) - photosynthesis
$ErrorActionPreference = "Stop"
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
    return $resp
  } catch {
    Write-Host ("FAILED: " + $_.Exception.Message)
    return $null
  }
}

$base = @{ language = "english"; subjectId = "science"; topicId = "photosynthesis" }

# START - lesson intro
$r0 = Invoke-Tutor "START (intro)" ($base + @{ stage = "INTRODUCTION"; message = ""; history = @(); intent = "START"; boardLevel = 0 })

$hist = @(
  @{ role = "tutor"; content = "Think of a leaf as a tiny food factory. It needs sunlight, water and carbon dioxide. Which one comes from the air?" }
)

# TEST 1 - correct full explanation (spoken, SELF_EXPLANATION)
Invoke-Tutor "TEST 1: correct explanation" ($base + @{ stage = "EXPLANATION"; message = "Plants use sunlight, water and carbon dioxide to make glucose and release oxygen. The chlorophyll in leaves catches sunlight energy and uses it to turn water from roots and CO2 from air into food."; history = $hist; intent = "SELF_EXPLANATION"; boardLevel = 2 }) | Out-Null

# TEST 2 - misconception (should get a counter-question, NOT direct correction)
Invoke-Tutor "TEST 2: misconception" ($base + @{ stage = "EXPLANATION"; message = "Plants take oxygen from the air during photosynthesis and use it to make their food."; history = $hist; intent = "SELF_EXPLANATION"; boardLevel = 2 }) | Out-Null

# TEST 3 - confused student (should simplify + easier question + simpler visual)
Invoke-Tutor "TEST 3: confused student" ($base + @{ stage = "PRACTICE"; message = "I don't understand how plants can make oxygen. This makes no sense to me."; history = $hist; intent = "CHAT"; boardLevel = 3 }) | Out-Null

# TEST 4 - incomplete explanation (should target the missing CO2/outputs, not repeat)
Invoke-Tutor "TEST 4: incomplete explanation" ($base + @{ stage = "EXPLANATION"; message = "Plants need sunlight and water."; history = $hist; intent = "SELF_EXPLANATION"; boardLevel = 2 }) | Out-Null

Write-Host "`nAll scenario calls done."
