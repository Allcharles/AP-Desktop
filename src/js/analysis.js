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
		if (options !== null) {
			//Add source, config, and output to options for APCommand
			options.unshift(new AnalysisOption(output));
			options.unshift(new AnalysisOption(config));
			options.unshift(new AnalysisOption(source));
		} else {
			options = [
				new AnalysisOption(source),
				new AnalysisOption(config),
				new AnalysisOption(output)
			];
		}

		super(type, options);
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
	 * @param {[AnalysisOption]} options List of AP command options (If undefined, this will search the document for the latest values)
	 */
	constructor(source, config, output, options = null) {
		let finalOptions = options;

		//Get options
		if (finalOptions === undefined) {
			finalOptions = this.getOptions();
		}

		super("audio2csv", source, config, output, finalOptions);
	}

	getOptions(finalOptions) {
		finalOptions = [];
		const form = document.getElementById("AnalysisForm");
		const SWITCH = 0,
			INPUT = 1,
			SELECT = 2;
		const AUDIO2CSV_ADVANCED = [
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
		];

		//Find all attached audio2csv options
		AUDIO2CSV_ADVANCED.forEach(checkbox => {
			let item = form.querySelector(`#${checkbox[0]}`);
			if (checkbox[1] === SWITCH) {
				finalOptions.push(new AnalysisOption(item.value, item.checked));
			} else if (item.checked) {
				if (checkbox[1] === INPUT) {
					let input = form.querySelector(`#{item.id}-input`);
					if (checkbox[1] === INPUT) {
						finalOptions.push(
							new AnalysisOption(form.querySelector(`#{item.id}-input`).value)
						);
					}
				} else if (checkbox[1] === SWITCH) {
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
