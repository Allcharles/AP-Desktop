param(
  [Parameter(Mandatory = $true)][bool]$windows
)

if ($windows) {
  # Windows
  Remove-Item ./ap -Recurse
  New-Item -Path ./ap -ItemType Directory
  curl.exe https://raw.githubusercontent.com/QutEcoacoustics/audio-analysis/master/build/download_ap.ps1 -o ./ap/download_ap.ps1
  ./ap/download_ap.ps1 -package Weekly -destination ./ap
  Remove-Item -Path ./ap/download_ap.ps1
}
else {
  # Linux
  Remove-Item ./ap -Recurse
  New-Item -Path ./ap -ItemType Directory
  curl https://raw.githubusercontent.com/QutEcoacoustics/audio-analysis/master/build/download_ap.ps1 -o ./ap/download_ap.ps1
  chmod +x ./download_ap.ps1
  ./ap/download_ap.ps1 -package Weekly -destination ./ap
  Remove-Item -Path ./ap/download_ap.ps1
}