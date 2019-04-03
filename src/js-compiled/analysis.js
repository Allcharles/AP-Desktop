"use strict";

var _terminal = _interopRequireDefault(require("../js-compiled/terminal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Command object for abstracting the creation of terminal commands using AP.
 */
var APCommand =
/*#__PURE__*/
function () {
  /**
   * Constructor for the command. This generates a terminal command using AP
   * @param {string} type Command type to run
   * @param {AnalysisOption[]} options List of AP command options (Optional)
   */
  function APCommand(type) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, APCommand);

    this.type = type;
    this.options = options;

    this.toString = function () {
      return "".concat(this.type, " ").concat(this.options);
    };
  }
  /**
   * Returns a terminal from the Terminal class runniig the AP command
   * @returns {object} Returns childProcess.spawn of terminal running AP command
   */


  _createClass(APCommand, [{
    key: "getTerminal",
    value: function getTerminal() {
      //Create args and append command
      var args = [];
      args.push(this.type); //Append option names and values

      if (this.options != null) {
        this.options.forEach(function (option) {
          args.push(option.toString());
        });
      }

      return _terminal["default"].createAPTerminal(args);
    }
  }]);

  return APCommand;
}();
/**
 * Analysis Option object for abstracting the creation of AP options.
 */


var AnalysisOption =
/**
 * Object class for analysis options including flags, values, and flag values.
 * @param {string} option Analysis option
 * @param {string} value Analysis option value (Optional)
 */
function AnalysisOption(option) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  _classCallCheck(this, AnalysisOption);

  this.option = option;
  this.value = value;

  this.toString = function () {
    if (this.value !== null) return "".concat(this.option, "=").concat(this.value);else return "".concat(this.option);
  };
};
/**
 * Analysis object for abstracting the creation of AP analyses.
 */


var APAnalysis =
/*#__PURE__*/
function (_APCommand) {
  _inherits(APAnalysis, _APCommand);

  /**
   * Constructor for the analysis. This generates an AP command
   * @param {string} type Analysis type to run
   * @param {string} source Audio file path
   * @param {string} config Config file path
   * @param {string} output Output folder path
   * @param {AnalysisOption[]} options List of AP command options (Optional)
   */
  function APAnalysis(type, source, config, output) {
    var _this;

    var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

    _classCallCheck(this, APAnalysis);

    //Append options to new array
    var combinedOptions = [];
    combinedOptions.push(new AnalysisOption(source));
    combinedOptions.push(new AnalysisOption(config));
    combinedOptions.push(new AnalysisOption(output)); //If options given

    if (options !== null) {
      //Push options to array
      combinedOptions.push.apply(combinedOptions, options);
    }

    _this = _possibleConstructorReturn(this, _getPrototypeOf(APAnalysis).call(this, type, combinedOptions));
    _this.type = type;
    _this.source = source;
    _this.config = config;
    _this.output = output;
    _this.terminalOutput = output;
    return _this;
  }
  /**
   * Determines whether an input is a FlagWithValue based on its classList
   * @param {DOMTokenList} flagList List of classNames
   * @returns {boolean} True if input is a FlagWithValue
   */


  _createClass(APAnalysis, [{
    key: "getType",

    /**
     * Returns the analysis type to run
     * @returns {string} Analysis type to run
     */
    value: function getType() {
      return this.type;
    }
    /**
     * Returns the audio file to be processed
     * @returns {string} Full filepath of audio file to process
     */

  }, {
    key: "getSource",
    value: function getSource() {
      return this.source;
    }
    /**
     * Returns the config file to be processed
     * @returns {string} Full filepath of config file to process
     */

  }, {
    key: "getConfig",
    value: function getConfig() {
      return this.config;
    }
    /**
     * Returns the output folder to be processed
     * @returns {string} Full filepath of output folder
     */

  }, {
    key: "getOutput",
    value: function getOutput() {
      return this.output;
    }
    /**
     * Set final output which is determined at runtime by AP
     * @param {string} terminalOutput Output for analysis files
     */

  }, {
    key: "setTerminalOutput",
    value: function setTerminalOutput(terminalOutput) {
      this.terminalOutput = terminalOutput;
    }
    /**
     * Returns the output folder determined at runtime by AP
     * @returns {string} Output location of analysis files
     */

  }, {
    key: "getTerminalOutput",
    value: function getTerminalOutput() {
      return this.terminalOutput;
    }
  }], [{
    key: "isFlagsWithValues",
    value: function isFlagsWithValues(flagList) {
      for (var i = 0; i < flagList.length; i++) {
        if (flagList[i] === "flagsWithValues") {
          return true;
        }
      }

      return false;
    }
  }]);

  return APAnalysis;
}(APCommand);
/**
 * Creates a CheckEnvironment analysis object
 */


var CheckEnvironment =
/*#__PURE__*/
function (_APCommand2) {
  _inherits(CheckEnvironment, _APCommand2);

  /**
   * Constructor for the analysis. This generates a CheckEnvironment AP Command.
   */
  function CheckEnvironment() {
    _classCallCheck(this, CheckEnvironment);

    return _possibleConstructorReturn(this, _getPrototypeOf(CheckEnvironment).call(this, "CheckEnvironment"));
  }

  return CheckEnvironment;
}(APCommand);
/**
 * Creates an audio2csv analysis object.
 */


var Audio2CSVAnalysis =
/*#__PURE__*/
function (_APAnalysis) {
  _inherits(Audio2CSVAnalysis, _APAnalysis);

  /**
   * Constructor for the Audio2csv object. This generates an audio2csv AP command.
   * @param {string} source Audio file path
   * @param {string} config Config file path
   * @param {string} output Output file path
   * @param {AnalysisOption[]} options List of AP command options
   */
  function Audio2CSVAnalysis(source, config, output) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    _classCallCheck(this, Audio2CSVAnalysis);

    return _possibleConstructorReturn(this, _getPrototypeOf(Audio2CSVAnalysis).call(this, "audio2csv", source, config, output, options));
  }
  /**
   * Takes in an empty list of analysis options, searches the form for selected advanced options, and adds the options to the list.
   * @param {AnalysisOption[]} finalOptions Empty list of analysis options
   */


  _createClass(Audio2CSVAnalysis, null, [{
    key: "getOptions",
    value: function getOptions() {
      var _this2 = this;

      var form = document.getElementById("AnalysisForm");
      var SWITCH = 0,
          INPUT = 1,
          SELECT = 2,
          MULTI = 3;
      var AUDIO2CSV_ADVANCED = [["temp-dir", INPUT], ["offset", MULTI], ["align-to-minute", SELECT], ["channels", INPUT], ["mix-down-to-mono", SWITCH], ["parallel", SWITCH], ["when-exit-copy-log", SWITCH], ["when-exit-copy-config", SWITCH], ["log-level", SELECT]]; //Reset variable

      var finalOptions = []; //Find all attached audio2csv options

      AUDIO2CSV_ADVANCED.forEach(function (checkbox) {
        var item = form.querySelector("#".concat(checkbox[0])); //If item is a true/false input

        if (checkbox[1] === SWITCH) {
          if (_this2.isFlagsWithValues(item.classList)) {
            //FlagWithValue item
            finalOptions.push(new AnalysisOption("".concat(item.value, "=").concat(item.checked ? "True" : "False")));
          } else if (item.checked) {
            finalOptions.push(new AnalysisOption(item.value));
          }
        } else if (item.checked) {
          //Check if value has multiple inputs
          if (checkbox[1] === MULTI) {
            //For each input, add AnalysisOption
            item.value.split(":").map(function (option) {
              var input = form.querySelector("#".concat(checkbox[0], "-input").concat(option));
              finalOptions.push(new AnalysisOption(option, input.value));
            });
          } else {
            var input = form.querySelector("#".concat(checkbox[0], "-input"));
            finalOptions.push(new AnalysisOption(item.value, input.value));
          }
        }
      }); //If no options were selected, reset to null

      if (finalOptions.length === 0) {
        finalOptions = null;
      }

      return finalOptions;
    }
  }]);

  return Audio2CSVAnalysis;
}(APAnalysis);