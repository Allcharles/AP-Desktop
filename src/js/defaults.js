const electron = require("electron");
const { app } = electron.remote;
const dialog = electron.remote.dialog;
const fs = require("fs");
const childProcess = require("child_process");

var lastIndex = __dirname.lastIndexOf("src/");
if (lastIndex == -1) {
  lastIndex = __dirname.lastIndexOf("src\\");
}
var __rootFolder = __dirname.substr(0, lastIndex);

/**
 * Default variables used throughout the system
 */
var Defaults = {
  AP_DIRECTORY: `${__rootFolder}ap`,
  CONFIG_DIRECTORY: `${__rootFolder}/ap/ConfigFiles`,
  DEFAULT_OUTPUT_DIRECTORY: app.getPath("documents") + "/AP Desktop",
  DEFAULT_CONFIG_FILE: "Towsey.Acoustic",
  WINDOWS: process.platform === "win32"
};

Object.freeze(Defaults);
