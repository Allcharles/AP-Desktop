"use strict";

var electron = require("electron");

var app = electron.remote.app;
var dialog = electron.remote.dialog;

var fs = require("fs");

var lastIndex = __dirname.lastIndexOf("src/");

if (lastIndex == -1) {
  lastIndex = __dirname.lastIndexOf("src\\");
}

var __rootFolder = __dirname.substr(0, lastIndex);
/**
 * Default variables used throughout the system
 */


var Defaults = {
  AP_DIRECTORY: "".concat(__rootFolder, "ap"),
  CONFIG_DIRECTORY: "".concat(__rootFolder, "/ap/ConfigFiles"),
  DEFAULT_OUTPUT_DIRECTORY: app.getPath("documents") + "/AP Desktop",
  DEFAULT_CONFIG_FILE: "Towsey.Acoustic",
  WINDOWS: process.platform === "win32"
};
Object.freeze(Defaults);
module.exports = Defaults;