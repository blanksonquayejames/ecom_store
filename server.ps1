# AURA LUXE - Robust Local Static HTTP Server
param(
    [int]$Port = 8080,
    [switch]$OpenBrowser
)

$baseDir = Get-Location

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff2"= "font/woff2"
}

$listener = $null

function Start-ServerOnPort ([int]$p) {
    try {
        $l = New-Object System.Net.HttpListener
        $l.Prefixes.Add("http://localhost:$p/")
        $l.Start()
        return $l
    }
    catch {
        if ($null -ne $l) {
            $l.Close()
        }
        return $null
    }
}

# Try requested port or scan next available ports
$activePort = $Port
$listener = Start-ServerOnPort $activePort

if ($null -eq $listener) {
    # If initial port is busy, find next available port
    for ($tryPort = $Port + 1; $tryPort -le $Port + 10; $tryPort++) {
        $listener = Start-ServerOnPort $tryPort
        if ($null -ne $listener) {
            $activePort = $tryPort
            break
        }
    }
}

if ($null -eq $listener) {
    Write-Error "Could not bind to ports $Port through $($Port + 10). Another service or server instance is using these ports."
    exit 1
}

$url = "http://localhost:$activePort/"
Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  AURA LUXE Server is ACTIVE at: $url" -ForegroundColor Green
Write-Host "  Press Ctrl+C in terminal to stop server safely." -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

if ($OpenBrowser) {
    Start-Process $url
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawUrl = $request.RawUrl.Split('?')[0]
        if ($rawUrl -eq "/" -or $rawUrl -eq "") {
            $rawUrl = "/index.html"
        }

        $filePath = Join-Path $baseDir ($rawUrl.TrimStart('/'))

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $response.ContentType = $mime
            $response.Headers.Add("Access-Control-Allow-Origin", "*")

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.StatusCode = 200
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }

        $response.OutputStream.Close()
    }
}
catch {
    Write-Warning "Server execution interrupted: $_"
}
finally {
    if ($null -ne $listener) {
        if ($listener.IsListening) {
            $listener.Stop()
        }
        $listener.Close()
    }
    Write-Host "Server stopped safely." -ForegroundColor Gray
}
