#!/usr/bin/env pwsh
# fetchit installer for Windows
#   powershell -c "irm https://fetchit.vercel.app/install.ps1 | iex"

$Repo = "Vedant1521/fetchit"
$BinaryDir = "$env:USERPROFILE\.fetchit\bin"
$YtdlpDir = "$env:USERPROFILE\.fetchit\bin"

function Has-Command($cmd) {
    return [bool](Get-Command $cmd -ErrorAction SilentlyContinue)
}

function Install-ViaNpm {
    Write-Host "✓ Node.js $($node --version) found" -ForegroundColor Green
    npm install -g "@$Repo"
    Write-Host "✓ fetchit installed via npm" -ForegroundColor Green
}

function Install-StandaloneBinary {
    try {
        $asset = "fetchit-win-x64.exe"
        $url = "https://github.com/$Repo/releases/latest/download/$asset"

        $null = New-Item -ItemType Directory -Path $BinaryDir -Force
        $out = Join-Path $BinaryDir "fetchit.exe"

        Write-Host "↓ Downloading fetchit for Windows/x64..." -ForegroundColor Yellow
        Invoke-WebRequest -Uri $url -OutFile $out -UseBasicParsing -ErrorAction Stop

        Write-Host "✓ fetchit installed to $out" -ForegroundColor Green
        return $true
    }
    catch {
        return $false
    }
}

function Add-ToPath {
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($currentPath -notlike "*$BinaryDir*") {
        [Environment]::SetEnvironmentVariable("Path", "$currentPath;$BinaryDir", "User")
        Write-Host "  Added $BinaryDir to your PATH (user-level)" -ForegroundColor Gray
        Write-Host "  Restart your terminal for the change to take effect." -ForegroundColor Gray
    }
}

# --- main ---

Write-Host "  fetchit installer" -ForegroundColor Cyan
Write-Host "  Windows/amd64"
Write-Host ""

# Prefer npm if Node.js is available
$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) {
    $ver = [int]($node.Version.Major)
    if ($ver -ge 18) {
        Install-ViaNpm
        Write-Host ""
        Write-Host "✓ Setup complete. Run 'fetchit' to start." -ForegroundColor Green
        exit 0
    }
}

# Try standalone binary
Write-Host "  Node.js 18+ not found. Trying standalone binary..." -ForegroundColor Gray
Write-Host ""

if (Install-StandaloneBinary) {
    Add-ToPath
    Write-Host ""
    Write-Host "✓ Setup complete. Restart your terminal and run 'fetchit'." -ForegroundColor Green
    exit 0
}

Write-Host "! Could not install fetchit automatically." -ForegroundColor Red
Write-Host ""
Write-Host "  Option 1 — Install Node.js 18+ and rerun this script:"
Write-Host "    winget install OpenJS.NodeJS.LTS"
Write-Host "    https://nodejs.org"
Write-Host ""
Write-Host "  Option 2 — Download the latest release manually:"
Write-Host "    https://github.com/$Repo/releases"
Write-Host ""
exit 1
