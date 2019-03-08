class Defaults {
  static staticConstructor() {
    const electron = require("electron")
    const { app } = electron.remote

    this.AP_DIRECTORY = "../../ap"
    this.CONFIG_DIRECTORY = this.AP_DIRECTORY + "/ConfigFiles"
    this.DEFAULT_OUTPUT_DIRECTORY = app.getPath("documents") + "/AP Desktop"
    this.DEFAULT_CONFIG_FILE = "Towsey.Acoustic"
  }

  static getAPDirectory() {
    console.log("AP Directory: " + this.AP_DIRECTORY)
    return this.AP_DIRECTORY
  }

  static getConfigDirectory() {
    console.log("Config Directory: " + this.CONFIG_DIRECTORY)
    return this.CONFIG_DIRECTORY
  }

  static getDefaultOutputDirectory() {
    console.log("Output Directory: " + this.DEFAULT_OUTPUT_DIRECTORY)
    return this.DEFAULT_OUTPUT_DIRECTORY
  }

  static getDefaultConfigFile() {

    console.log("Default Config File: " + this.DEFAULT_CONFIG_FILE)
    return this.DEFAULT_CONFIG_FILE
  }
}

Defaults.staticConstructor()