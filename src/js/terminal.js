/**
 * Used to abstract terminal spawning, handles the division of terminal commands on Linux and Windows.
 * Defaults must be imported into the the html file before this script.
 */
class Terminal {
  static staticConstructor() {
    this.isWindows = process.platform === "win32"
    this.childProcess = require("child_process")
    this.AP = Defaults.getAPDirectory + "/AnalysisPrograms.exe"
  }

  /**
   * Creates and returns a terminal. This function does not account for differences between Windows and Linux.
   * @param {string} func Function to call 
   * @param {[string]} args  List of arguments to pass to the terminal.
   */
  static createTerminal(func, args) {
    return this.childProcess.spawn(func, args)
  }

  /**
   * Creates and returns an terminal running AP. This function accounts for differences between Windows and Linux.
   * @param {[string]} args List of arguements to pass to the terminal
   */
  static createAPTerminal(args) {
    var terminal

    if (this.isWindows) {
      terminal = this.childProcess.spawn(this.AP, args)
    } else {
      //Prepend AP to start of command
      args.shift(this.AP)
      terminal = this.childProcess.spawn("mono", args)
    }

    return terminal
  }
}

Terminal.staticConstructor()