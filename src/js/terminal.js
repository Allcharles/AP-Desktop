var childProcess = require("child_process");

/**
 * Used to abstract terminal spawning, handles the division of terminal commands on Linux and Windows.
 * Defaults must be imported into the the html file before this script.
 */
class Terminal {
  /**
   * Creates and returns a terminal. This function does not account for differences between Windows and Linux.
   * @param {string} func Function to call
   * @param {[string]} args  List of arguments to pass to the terminal.
   * @returns {spawn} Returns childProcess.spawn of terminal running command
   */
  static createTerminal(func, args) {
    return childProcess.spawn(func, args);
  }

  /**
   * Creates and returns an terminal running AP. This function accounts for differences between Windows and Linux.
   * @param {[string]} args List of arguements to pass to the terminal
   * @returns {spawn} Returns childProcess.spawn of terminal running AP command
   */
  static createAPTerminal(args) {
    var AP = `${__rootFolder}ap/AnalysisPrograms.exe`;
    var terminal;

    //Check if windows
    if (process.platform === "win32") {
      terminal = childProcess.spawn(AP, args);
    } else {
      //Prepend AP to start of command
      args.unshift(AP);
      terminal = childProcess.spawn("mono", args);
    }

    return terminal;
  }
}

module.exports = Terminal;
