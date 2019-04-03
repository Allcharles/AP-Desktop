"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var childProcess = require("child_process");

var lastIndex = __dirname.lastIndexOf("src/");

if (lastIndex == -1) {
  lastIndex = __dirname.lastIndexOf("src\\");
}

var __rootFolder = __dirname.substr(0, lastIndex);

var AP = "".concat(__rootFolder, "ap/AnalysisPrograms.exe");
/**
 * Used to abstract terminal spawning, handles the division of terminal commands on Linux and Windows.
 * Defaults must be imported into the the html file before this script.
 */

var Terminal =
/*#__PURE__*/
function () {
  function Terminal() {
    _classCallCheck(this, Terminal);
  }

  _createClass(Terminal, null, [{
    key: "createTerminal",

    /**
     * Creates and returns a terminal. This function does not account for differences between Windows and Linux.
     * @param {string} func Function to call
     * @param {string[]} args  List of arguments to pass to the terminal.
     * @returns {object} Returns childProcess.spawn of terminal running command
     */
    value: function createTerminal(func, args) {
      return childProcess.spawn(func, args);
    }
    /**
     * Creates and returns an terminal running AP. This function accounts for differences between Windows and Linux.
     * @param {string[]} args List of arguements to pass to the terminal
     * @returns {object} Returns childProcess.spawn of terminal running AP command
     */

  }, {
    key: "createAPTerminal",
    value: function createAPTerminal(args) {
      var terminal; //Check if windows

      if (process.platform === "win32") {
        terminal = childProcess.spawn(AP, args);
      } else {
        //Prepend AP to start of command
        args.unshift(AP);
        terminal = childProcess.spawn("mono", args);
      }

      return terminal;
    }
  }]);

  return Terminal;
}();

exports["default"] = Terminal;