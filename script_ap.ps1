# Delete old AP files
Remove-Item ./ap -Recurse
New-Item -Path ./ap -ItemType Directory

# Stops system from downloading broken file
<# # Get AP Downloader
# Check if Linux
if ([System.Environment]::OSVersion.Platform -ne "Win32NT") {
  Write-Output("Linux Detected")
  curl https://raw.githubusercontent.com/QutEcoacoustics/audio-analysis/master/build/download_ap.ps1 -o ./download_ap.ps1
  chmod +x ./download_ap.ps1
} else {
  Write-Output("Windows Detected")
  curl.exe https://raw.githubusercontent.com/QutEcoacoustics/audio-analysis/master/build/download_ap.ps1 -o ./download_ap.ps1
} #>

# Extract AP to folder
./download_ap.ps1 -package Weekly -destination ./ap

#Remove AP Downloader
# Remove-Item -Path ./download_ap.ps1