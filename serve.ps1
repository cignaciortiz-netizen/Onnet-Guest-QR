# Sirve el validador en http://localhost:8080 (la cámara exige localhost o https)
Set-Location $PSScriptRoot
python -m http.server 8080
