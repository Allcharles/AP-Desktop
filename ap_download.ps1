echo "Downloading latest version of AP for Release. This could take up to 15 minutes."

if ([System.Environment]::OSVersion.Platform -eq "Win32NT") {
    powershell [System.Environment]::SetEnvironmentVariable('LANG', 'en_US.UTF-8')
    powershell -ExecutionPolicy ByPass -File ./script_ap.ps1
} else {
    export LANG=en_US.UTF-8
    pwsh -ExecutionPolicy ByPass -File ./script_ap.ps1
}