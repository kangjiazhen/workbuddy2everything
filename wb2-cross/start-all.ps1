# Start everything: wb2api gateway (if not running) + wb2-cross bridge.
# Usage: powershell -ExecutionPolicy Bypass -File .\start-all.ps1
#
# ASCII-only on purpose: Windows PowerShell 5.1 reads BOM-less .ps1 as ANSI
# (GBK on zh-CN), so non-ASCII bytes can corrupt parsing. Keep it ASCII.
$ErrorActionPreference = 'Continue'

$Root      = Split-Path -Parent $MyInvocation.MyCommand.Path
$Workspace = Split-Path -Parent $Root
$Panel     = Join-Path $Workspace 'workbuddy2api-panel'
$PanelStart = Join-Path $Panel 'start.ps1'

function Test-Port([int]$Port) {
    $c = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    return [bool]$c
}

# 1) gateway
if (Test-Port 7863) {
    Write-Host '[start-all] gateway already listening on 7863'
} elseif (Test-Path -LiteralPath $PanelStart) {
    Write-Host '[start-all] starting gateway via workbuddy2api-panel/start.ps1'
    & powershell -ExecutionPolicy Bypass -File $PanelStart
} else {
    Write-Host "[start-all] gateway start script not found: $PanelStart"
}

# 2) bridge (installs/refreshes config + launches if needed, then self-checks)
Push-Location $Root
try {
    node .\src\cli.mjs install
    node .\src\cli.mjs doctor
    $code = $LASTEXITCODE
} finally {
    Pop-Location
}
if ($code -ne 0) { Write-Host '[start-all] doctor reported problems (see above)' }
