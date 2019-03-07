# Delete old AP files
Remove-Item ./ap -Recurse
New-Item -Path ./ap -ItemType Directory

# Get AP Downloader
curl.exe https://raw.githubusercontent.com/QutEcoacoustics/audio-analysis/master/build/download_ap.ps1 -o ./ap/download_ap.ps1

# Check if not linux
if ([System.Environment]::OSVersion.Platform -ne "Win32NT") {
  Write-Output("Linux Detected")
  chmod +x ./download_ap.ps1
}

# Extract AP to folder
./ap/download_ap.ps1 -package Weekly -destination ./ap

#Remove AP Downloader
Remove-Item -Path ./ap/download_ap.ps1