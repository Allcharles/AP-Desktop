/**
 * Analysis object for abstracting the creation of AP commands.
 */
class Analysis {
  /**
   * Constructor for the analysis. This generates an AP command
   * @param {string} type Analysis type to run
   * @param {string} source Audio file path
   * @param {string} config Config file path
   * @param {string} output Output folder path
   * @param {[AnalysisOption]} options List of AP command options
   */
  constructor(type, source, config, output, options) {
    this.type = type;
    this.source = source;
    this.config = config;
    this.output = output;
    this.options = options;
  }

  /**
   * Creates and returns the command required to run the analysis from the terminal
   * @returns {string} Command to execute in terminal
   */
  getCommand() {
    let command = `${this.type} ${this.source} ${this.config} ${this.output}`;

    this.options.forEach(option => {
      command += option.toString();
    });

    return command;
  }
}

/**
 * Analysis Option object for abstracting the creation of AP options.
 */
class AnalysisOption {
  /**
   * Object class for analysis options including flags, values, and flag values.
   * @param {string} option Analysis option
   * @param {string} value Analysis option value
   */
  constructor(option, value = null) {
    this.option = option;
    this.value = value;

    this.toString = function() {
      getOption();
    };
  }

  /**
   * Generates the options details for the terminal command
   * @returns {string} Flag/Value/Flag Value for terminal command
   */
  getOption() {
    if ((this.value = null)) return ` ${this.option}`;
    else return ` ${this.option}=${this.value}`;
  }
}

class Audio2CSV {
  constructor(source, config, output, options = null) {
    this.source = source;
    this.config = config;
    this.output = output;

    //Get options
    if (options == null) this.findOptions();
    else this.options = options;
  }

  static findOptions() {
    const form = document.getElementById("AnalysisForm");
    const SWITCH = 0,
      INPUT = 1,
      SELECT = 2;
    const AUDIO2CSV_ADVANCED = (formElements = [
      ["analysis-identifier", SELECT],
      ["temp-dir", INPUT],
      ["start-offset", INPUT],
      ["end-offset", INPUT],
      ["align-to-minute", SELECT],
      ["channels", INPUT],
      ["mix-down-to-mono", SWITCH],
      ["parallel", SWITCH],
      ["when-exit-copy-log", SWITCH],
      ["when-exit-copy-config", SWITCH],
      ["log-level", SELECT]
    ]);

    //Find all attached audio2csv options
    AUDIO2CSV_ADVANCED.forEach(checkbox => {
      let item = form.getElementById(checkbox);
      if (item.checked) {
        console.log(item);
      }
    });
  }
}
