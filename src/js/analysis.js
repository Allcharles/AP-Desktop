var Terminal = require("./terminal.js");

/**
 * Command object for abstracting the creation of terminal commands using AP.
 */
class APCommand {
  /**
   * Constructor for the command. This generates a terminal command using AP
   * @param {string} type Command type to run
   * @param {[AnalysisOption]} options List of AP command options (Optional)
   */
  constructor(type, options = null) {
    this.type = type;
    this.options = options;

    this.toString = function() {
      return `${this.type} ${this.options}`;
    };
  }

  /**
   * Returns a terminal from the Terminal class runniig the AP command
   * @returns Spawn
   */
  getTerminal() {
    //Create args and append command
    let args = [];
    args.push(this.type);

    //Append option names and values
    if (this.options != null) {
      this.options.forEach(option => {
        args.push(option.toString());
      });
    }

    return Terminal.createAPTerminal(args);
  }
}

/**
 * Analysis Option object for abstracting the creation of AP options.
 */
class AnalysisOption {
  /**
   * Object class for analysis options including flags, values, and flag values.
   * @param {string} option Analysis option
   * @param {string} value Analysis option value (Optional)
   */
  constructor(option, value = null) {
    this.option = option;
    this.value = value;

    this.toString = function() {
      if (this.value !== null) return `${this.option}=${this.value}`;
      else return `${this.option}`;
    };
  }
}
Terminal.
/**
 * Analysis object for abstracting the creation of AP analyses.
 */
class APAnalysis extends APCommand {
  /**
   * Constructor for the analysis. This generates an AP command
   * @param {string} type Analysis type to run
   * @param {string} source Audio file path
   * @param {string} config Config file path
   * @param {string} output Output folder path
   * @param {[AnalysisOption]} options List of AP command options (Optional)
   */
  constructor(type, source, config, output, options = null) {
    //Append options to new array
    let combinedOptions = [];
    combinedOptions.push(new AnalysisOption(source));
    combinedOptions.push(new AnalysisOption(config));
    combinedOptions.push(new AnalysisOption(output));

    //If options given
    if (options !== null) {
      //Push options to array
      combinedOptions.push.apply(combinedOptions, options);
    }

    super(type, combinedOptions);
    this.type = type;
    this.source = source;
    this.config = config;
    this.output = output;
    this.terminalOutput = output;
  }

  /**
   * Determines whether an input is a FlagWithValue based on its classList
   * @param {DOMTokenList} flagList List of classNames
   * @returns {boolean} True if input is a FlagWithValue
   */
  static isFlagsWithValues(flagList) {
    for (let i = 0; i < flagList.length; i++) {
      if (flagList[i] === "flagsWithValues") {
        return true;
      }
    }

    return false;
  }

  /**
   * Returns the analysis type to run
   * @returns {String} Analysis type to run
   */
  getType() {
    return this.type;
  }

  /**
   * Returns the audio file to be processed
   * @returns {string} Full filepath of audio file to process
   */
  getSource() {
    return this.source;
  }

  /**
   * Returns the config file to be processed
   * @returns {string} Full filepath of config file to process
   */
  getConfig() {
    return this.config;
  }

  /**
   * Returns the output folder to be processed
   * @returns {string} Full filepath of output folder
   */
  getOutput() {
    return this.output;
  }

  /**
   * Set final output which is determined at runtime by AP
   * @param {string} terminalOutput Output for analysis files
   */
  setTerminalOutput(terminalOutput) {
    this.terminalOutput = terminalOutput;
  }

  /**
   * Returns the output folder determined at runtime by AP
   * @returns {string} Output location of analysis files
   */
  getTerminalOutput() {
    return this.terminalOutput;
  }
}

/**
 * Creates a CheckEnvironment analysis object
 */
class CheckEnvironment extends APCommand {
  /**
   * Constructor for the analysis. This generates a CheckEnvironment AP Command.
   */
  constructor() {
    super("CheckEnvironment");
  }
}

/**
 * Creates an audio2csv analysis object.
 */
class Audio2CSVAnalysis extends APAnalysis {
  /**
   * Constructor for the Audio2csv object. This generates an audio2csv AP command.
   * @param {string} source Audio file path
   * @param {string} config Config file path
   * @param {string} output Output file path
   * @param {[AnalysisOption]} options List of AP command options
   */
  constructor(source, config, output, options = null) {
    super("audio2csv", source, config, output, options);
  }

  /**
   * Takes in an empty list of analysis options, searches the form for selected advanced options, and adds the options to the list.
   * @param {[AnalysisOption]} finalOptions Empty list of analysis options
   */
  static getOptions() {
    const form = document.getElementById("AnalysisForm");
    const SWITCH = 0,
      INPUT = 1,
      SELECT = 2,
      MULTI = 3;
    const AUDIO2CSV_ADVANCED = [
      ["temp-dir", INPUT],
      ["offset", MULTI],
      ["align-to-minute", SELECT],
      ["channels", INPUT],
      ["mix-down-to-mono", SWITCH],
      ["parallel", SWITCH],
      ["when-exit-copy-log", SWITCH],
      ["when-exit-copy-config", SWITCH],
      ["log-level", SELECT]
    ];

    //Reset variable
    let finalOptions = [];

    //Find all attached audio2csv options
    AUDIO2CSV_ADVANCED.forEach(checkbox => {
      let item = form.querySelector(`#${checkbox[0]}`);

      //If item is a true/false input
      if (checkbox[1] === SWITCH) {
        if (this.isFlagsWithValues(item.classList)) {
          //FlagWithValue item
          finalOptions.push(
            new AnalysisOption(
              `${item.value}=${item.checked ? "True" : "False"}`
            )
          );
        } else if (item.checked) {
          finalOptions.push(new AnalysisOption(item.value));
        }
      } else if (item.checked) {
        //Check if value has multiple inputs
        if (checkbox[1] === MULTI) {
          //For each input, add AnalysisOption
          item.value.split(":").map(option => {
            let input = form.querySelector(`#${checkbox[0]}-input${option}`);
            finalOptions.push(new AnalysisOption(option, input.value));
          });
        } else {
          let input = form.querySelector(`#${checkbox[0]}-input`);
          finalOptions.push(new AnalysisOption(item.value, input.value));
        }
      }
    });

    //If no options were selected, reset to null
    if (finalOptions.length === 0) {
      finalOptions = null;
    }

    return finalOptions;
  }
}
