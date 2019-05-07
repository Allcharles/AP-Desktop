# Set environment
[System.Environment]::SetEnvironmentVariable('LANG', 'en_US.UTF-8')
echo "Downloading latest version of AP for Release. This could take up to 15 minutes."

# Delete old AP files
New-Item -Path ./ap -ItemType Directory -Force

# Get AP Downloader
# Check if Linux
if ([System.Environment]::OSVersion.Platform -ne "Win32NT") {
  Write-Output("Linux Detected")
  curl https://raw.githubusercontent.com/QutEcoacoustics/audio-analysis/master/build/download_ap.ps1 -o ./ap/download_ap.ps1
  chmod +x ./ap/download_ap.ps1
}
else {
  Write-Output("Windows Detected")
  curl.exe https://raw.githubusercontent.com/QutEcoacoustics/audio-analysis/master/build/download_ap.ps1 -o ./ap/download_ap.ps1
}

# Extract AP to folder
./ap/download_ap.ps1 -package Weekly -destination ./ap -github_api_token 2dbc70b0e422fcba4af344182de8cb95635dfac0

#Remove AP Downloader
Remove-Item -Path ./ap/download_ap.ps1