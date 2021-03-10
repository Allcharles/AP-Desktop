<p align="center"><img src="./src/favicon.png" alt="AP Desktop Logo" width="64"/></p>

<h1 align="center">AP Desktop</h1>

[![Build Status](https://dev.azure.com/QutEcoacoustics/ap-desktop/_apis/build/status/QutEcoacoustics.ap-desktop?branchName=master)](https://dev.azure.com/QutEcoacoustics/ap-desktop/_build/latest?definitionId=2&branchName=master)
[![License](https://img.shields.io/badge/Licence-Apache%202-brightgreen.svg)](LICENSE.md)

## Introduction

AP Desktop is a Graphical User Interface (GUI) for the open source program AnalysisPrograms.exe provided by QUT/EcoAcoustics. This GUI is designed to help researchers use the software without learning complicated terminal commands.

Currently runs with:

- Angular v8.3.21
- Electron v7.1.7
- Electron Builder v21.2.0
- Typescript: 3.5.3

Supported Platforms:

- Windows 10
- Linux Ubuntu 18 (deb, rpm)
- Linux Ubuntu 16 (deb, rpm)

## Getting Started

### Requirements:

- [Node](https://nodejs.org/en/download/) 10.13 or later
- NPM 6.9 or later
- [Git](https://git-scm.com/download/win)
- [Audio Analysis Prerequisites](https://github.com/QutEcoacoustics/audio-analysis/blob/master/docs/installing.md#prerequisites)

#### Windows Requirements:

- [Powershell 6](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-core-on-windows?view=powershell-6)

#### Linux Requirements:

- [Mono-Complete](https://www.mono-project.com/download/stable/#download-lin) 5.20 or later

Clone this repository locally :

### Running Project

```bash
git clone https://github.com/QutEcoacoustics/ap-desktop.git
```

Install dependencies with npm :

```bash
npm install
```

#### Windows:

```bash
npm run ap_download:windows
```

#### Linux:

```bash
npm run dependencies
npm run ap_download:linux
```

**There is an issue with `yarn` and `node_modules` that are only used in electron on the backend when the application is built by the packager. Please use `npm` as dependencies manager.**

## To Build for Development

```bash
npm start
```

## To Build for Production

Built programs can be found inside the `./release` folder.

### Windows

```bash
npm run electron:windows
```

### Linux

```bash
npm run electron:linux
```

### Mac (Unsupported)

```bash
npm run electron:mac
```

## Included Commands

| Command                       | Description                                                                                                 |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `npm run ap_download:linux`   | Downloads AP files required for AP Desktop to run                                                           |
| `npm run ap_download:windows` | Downloads AP files required for AP Desktop to run                                                           |
| `npm run build`               | Build the app. Your built files are in the /dist folder.                                                    |
| `npm run build:prod`          | Build the app with Angular aot. Your built files are in the /dist folder.                                   |
| `npm run electron:local`      | Builds your application and start electron                                                                  |
| `npm run electron:linux`      | Builds your application and creates an app consumable on linux system                                       |
| `npm run electron:windows`    | On a Windows OS, builds your application and creates an app consumable in windows 32/64 bit systems         |
| `npm run electron:mac`        | On a MAC OS, builds your application and generates a `.app` file of your application that can be run on Mac |
| `npm run dependencies`        | Automatically installs linux depedencies required to run AP                                                 |

## Current Features

- Angular Framework
- AP Installer
- Pre-Built Analysis Tools
- Support for running multiple analyses in one command
- Advanced Analysis Options (UNTESTED)
  - Config File Editor
  - AP Options Editor

## Features Coming Soon

- Analysis spectrogram display
- Link to Analysis Output
- Event Detection Helper utility

## History

Originally started as a VRES student project by Charles Alleman.
