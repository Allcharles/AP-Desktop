Write-Output("Test")
# Delete old AP files
New-Item -Path ./ap -ItemType Directory -Force

# Get AP Downloader
# Check if Linux
<# if ([System.Environment]::OSVersion.Platform -ne "Win32NT") {
  Write-Output("Linux Detected")
  curl https://raw.githubusercontent.com/QutEcoacoustics/audio-analysis/master/build/download_ap.ps1 -o ./ap/download_ap.ps1
  chmod +x ./ap/download_ap.ps1
}
else {
  Write-Output("Windows Detected")
  curl.exe https://raw.githubusercontent.com/QutEcoacoustics/audio-analysis/master/build/download_ap.ps1 -o ./ap/download_ap.ps1
} #>

# Extract AP to folder
./ap/download_ap.ps1 -package Weekly -destination ./ap

#Remove AP Downloader
#Remove-Item -Path ./ap/download_ap.ps1