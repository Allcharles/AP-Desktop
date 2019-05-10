# AP Desktop

AP Desktop is a Graphical User Interface (GUI) for the open source program AnalysisPrograms.exe provided by QUT/EcoAcoustics. This GUI is designed to help researchers use the software without learning complicated terminal commands.

## Installing Project

- Download and install Node.js v10.13.0 or newer [link](https://nodejs.org/en/download/)
- Check you are running NPM v6.9.0 or newer
- Install git (Linux: `sudo apt-get install git`) [link](https://git-scm.com/download/win)
- Open the file containing the AP Desktop code in Command Line and then execute the following commands:
  - `npm run ap_download` (Currently this will only run once per project)
  - `npm install`
  - `npm start`

## Building Project

- To build the project, run the following command: `npm run release`
- You will need to run this once on each patform (Windows/Linux/Mac) to get the full suit

### Linux Ubuntu 16 / Mint 18.3 Setup

- Install mono-complete
- Run `npm run dependencies`

## Current Features

- Basic audio2csv analysis
- Event Detection Helper utility
- Loading bars for file analysis
- Analysis spectrogram display
- Linux Support
- AP Installer
- Config File Editor

## Features Coming Soon

- Advanced audio2csv analysis
- Pre-built analysis tools

## History

Originally started as a VRES student project by Charles Alleman.
