# Set environment
[System.Environment]::SetEnvironmentVariable('LANG', 'en_US.UTF-8')

Write-Output "Downloading latest version of AP for Release. This could take up to 15 minutes."

# Delete old AP files
New-Item -Path ./src/assets/ap -ItemType Directory -Force

# Enable execute permission on linux or mac
if ([System.Environment]::OSVersion.Platform -ne "Win32NT") {
  Write-Output("Linux Detected")
  Invoke-WebRequest https://raw.githubusercontent.com/QutEcoacoustics/audio-analysis/master/build/download_ap.ps1 -o ./src/assets/ap/download_ap.ps1
  chmod +x ./src/assets/ap/download_ap.ps1
}
else {
  Write-Output("Windows Detected")
  curl.exe https://raw.githubusercontent.com/QutEcoacoustics/audio-analysis/master/build/download_ap.ps1 -o ./src/assets/ap/download_ap.ps1

}

# Extract AP to folder
./src/assets/ap/download_ap.ps1 -package Weekly -destination ./src/assets/ap

#Remove AP Downloader
Remove-Item -Path ./src/assets/ap/download_ap.ps1
