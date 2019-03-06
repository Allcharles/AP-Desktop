param(
    [Parameter(Mandatory=$true)][string]$destination,
    [Parameter(Mandatory=$true)][bool]$windows
)

if ($windows) {
    # Windows
    curl.exe https://raw.githubusercontent.com/QutEcoacoustics/audio-analysis/master/build/download_ap.ps1 -o $destination\download_ap.ps1
    & $destination/download_ap.ps1 -package Weekly -destination $destination
} else {
    # Linux

    curl https://raw.githubusercontent.com/QutEcoacoustics/audio-analysis/master/build/download_ap.ps1 -o $destination\download_ap.ps1
    chmod +x ./download_ap.ps1
    & $destination/download_ap.ps1 -package Weekly -destination $destination
}