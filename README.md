<p align="center"><img src="./src/favicon.png" alt="AP Desktop Logo" width="64"/></p>

<h1 align="center">AP Desktop</h1>

[![Build Status](https://travis-ci.org/QutEcoacoustics/ap-desktop.svg?branch=master)](https://travis-ci.org/QutEcoacoustics/ap-desktop)
[![License](http://img.shields.io/badge/Licence-MIT-brightgreen.svg)](LICENSE.md)

## Introduction

AP Desktop is a Graphical User Interface (GUI) for the open source program AnalysisPrograms.exe provided by QUT/EcoAcoustics. This GUI is designed to help researchers use the software without learning complicated terminal commands.

Currently runs with:

- Angular v8.0.0
- Electron v5.0.2
- Electron Builder v20.41.0

Supported Platforms:

- Windows 10
- Linux Mint/Ubuntu

## Getting Started

Requirements:

- [Node](https://nodejs.org/en/download/) 10.13 or later
- NPM 6.9 or later
- [Git](https://git-scm.com/download/win)

Linux Requirements:

- [Mono-Complete](https://www.mono-project.com/download/stable/#download-lin) 5.20 or later

Clone this repository locally :

```bash
git clone https://github.com/QutEcoacoustics/ap-desktop.git
```

Install dependencies with npm :

```bash
npm install
```

On linux systems:

```bash
npm run dependencies
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

### Max (Unsupported)

```bash
npm run electron:mac
```

## Included Commands

| Command                    | Description                                                                                                 |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `npm run ap_download`      | Downloads AP files required for AP Desktop to run                                                           |
| `npm run dependencies`     | Automatically installs linux depedencies required to run AP                                                 |
| `npm run build`            | Build the app. Your built files are in the /dist folder.                                                    |
| `npm run build:prod`       | Build the app with Angular aot. Your built files are in the /dist folder.                                   |
| `npm run electron:local`   | Builds your application and start electron                                                                  |
| `npm run electron:linux`   | Builds your application and creates an app consumable on linux system                                       |
| `npm run electron:windows` | On a Windows OS, builds your application and creates an app consumable in windows 32/64 bit systems         |
| `npm run electron:mac`     | On a MAC OS, builds your application and generates a `.app` file of your application that can be run on Mac |

## Current Features

- Angular framework
- AP Installer
- Basic analysis
- Linux Support
- Loading bars for file analysis
- Pre-built analysis tools

## Features Coming Soon

- Advanced analysis options
- Analysis spectrogram display
- Config File Editor
- Event Detection Helper utility
- Multiple analysis

## History

Originally started as a VRES student project by Charles Alleman.
