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
				args.push(option.getOption());
				if (option.containsValue()) args.push(option.getValue());
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
	}

	/**
	 * Returns true if option has a value for its key
	 */
	containsValue() {
		return this.value != null;
	}

	/**
	 * Returns the option string
	 */
	getOption() {
		return this.option;
	}

	/**
	 * Returns the value of the option
	 */
	getValue() {
		return this.value;
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
		//Add source, config, and output to options for APCommand
		options.unshift.apply(
			[
				new AnalysisOption(source),
				new AnalysisOption(config),
				new AnalysisOption(output)
			],
			options
		);

		console.log("APAnalysis: " + `${type} ${options}`);

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
		if (finalOptions == undefined) finalOptions = findOptions();
		else finalOptions = options;

		console.log(
			"Audio2CSVAnalysis: " + `${source} ${config} ${output} ${finalOptions}`
		);

		super("audio2csv", source, config, output, finalOptions);
	}

	/**
	 * Finds the most up-to-date audio2csv advanced options from the document.
	 */
	findOptions() {
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

		return null;
	}
}
