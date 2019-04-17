var childProcess = require("child_process");
var path = require("path");
var AP = `${path.join(__dirname, "../..")}/ap/AnalysisPrograms.exe`;

/**
 * Used to abstract terminal spawning, handles the division of terminal commands on Linux and Windows.
 * Defaults must be imported into the the html file before this script.
 */
export default class Terminal {
  /**
   * Creates and returns a terminal. This function does not account for differences between Windows and Linux.
   * @param {string} func Function to call
   * @param {string[]} args  List of arguments to pass to the terminal.
   * @returns {childProcess} Returns childProcess.spawn of terminal running command
   */
  static createTerminal(func, args, DEBUG) {
    return childProcess.spawn(func, args);
  }

  /**
   * Creates and returns an terminal running AP. This function accounts for differences between Windows and Linux.
   * @param {string[]} args List of arguements to pass to the terminal
   * @returns {childProcess} Returns childProcess.spawn of terminal running AP command
   */
  static createAPTerminal(args) {
    let terminal;
    let windows = process.platform === "win32";

    //Check if windows
    if (windows) {
      terminal = this.createTerminal(AP, args);
    } else {
      //Prepend AP to start of command
      args.unshift(AP);
      terminal = this.createTerminal("mono", args);
    }

    return terminal;
  }

  /**
   * Returns the string value of a terminal
   * @param {childProcess} terminal Terminal to return the string of
   */
  static toString(terminal) {
    let output = "";

    terminal.spawnargs.forEach(arg => {
      output += " " + arg;
    });

    output = output.substr(1);
    return output;
  }
}
