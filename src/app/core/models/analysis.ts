import { remote } from "electron";
import { readFileSync, writeFileSync } from "fs";
import { fromJS, List } from "immutable";
import { JSON_SCHEMA, safeDump, safeLoad } from "js-yaml";
import { basename, dirname, extname, join } from "path";
import { mkdir, rm } from "shelljs";
import {
  AnalysisConfig,
  AnalysisConfigFile,
  AnalysisOptions,
  AnalysisProcessingType,
  isAnalysisConfig,
} from "../helpers/analysisTypes";
import { AnalysisItem } from "./analysisItem";
import { APTerminal } from "./terminal";

/**
 * This class manages all the details required to perform a group of analyses using AP.
 */
export class APAnalysis {
  public static readonly defaultOutputFolder = join(
    remote.app.getPath("documents"),
    "AP Desktop"
  );
  public static readonly supportedAudioFormats = [
    "wav",
    "mp3",
    "pcm",
    "aiff",
    "aac",
    "ogg",
    "wma",
    "flac",
    "alac",
    "wma",
  ];
  public static readonly apConfigDirectory = join(
    APTerminal.apFolder,
    "ConfigFiles"
  );

  public outputFolder = "";
  private _audioFiles: string[];
  private _config: AnalysisConfig;

  /**
   * Manages analysis object to interface with the clients terminal
   * @param type Type of analysis
   * @param label Display label for analysis
   * @param description Description of analysis
   * @param configFile Configuration for analysis
   * @param options Advanced options for analysis
   */
  constructor(
    public readonly type: AnalysisProcessingType,
    public readonly label: string,
    public readonly description: string,
    private readonly configFile: AnalysisConfigFile,
    private _options: AnalysisOptions
  ) {
    this._audioFiles = [];
    this._config = this.generateConfig();

    if (!this._config) {
      throw Error("Failed to create analysis.");
    }
  }

  /**
   * Cleans up all temporary files generated by generateBatch
   */
  public static cleanupTemporaryFiles(): void {
    rm("-r", APAnalysis.apConfigDirectory + "/**/*AP_DESKTOP_TEMP*");
  }

  // Getters and Setters

  public get audioFiles(): string[] {
    return List<string>(this._audioFiles).toArray();
  }

  public set audioFiles(audioFiles: string[]) {
    this._audioFiles = audioFiles;
  }

  public get options(): AnalysisOptions {
    return fromJS(this._options).toJS();
  }

  public set options(options: AnalysisOptions) {
    this._options = options;
  }

  public get config(): AnalysisConfig {
    return fromJS(this._config).toJS();
  }

  public set config(config: AnalysisConfig) {
    this._config = config;
  }

  // End of Getters and Setters

  public generateBatch(): AnalysisItem[] {
    // Read config file
    this._config = this._config ? this._config : this.generateConfig();
    if (!this._config) {
      return [];
    }

    // Generate inputs for analysis
    const timestamp: number = Date.now();
    const temporaryConfig = this.createTemporaryConfigFile(timestamp);
    const optionList = this.generateOptionList();

    // Create array of AnalysisItems
    const analysisBatch: AnalysisItem[] = [];
    this._audioFiles.map((audioFile) => {
      analysisBatch.push(
        new AnalysisItem(
          this.type,
          this.label,
          audioFile,
          temporaryConfig,
          this.createOutputFolder(timestamp, audioFile),
          optionList
        )
      );
    });

    return analysisBatch;
  }

  /**
   * Generate config from config file
   */
  private generateConfig(): AnalysisConfig {
    try {
      const file = readFileSync(this.configFile.template);
      const configObject = safeLoad(file.toString(), { schema: JSON_SCHEMA });

      // Apply changes
      if (this.configFile.changes) {
        this.updateConfigValues(configObject, this.configFile.changes);
      }

      return this.convertYamlToAnalysisConfig(configObject) as AnalysisConfig;
    } catch (err) {
      console.error("Failed to read config file: " + this.configFile.template);
      console.error(err);
      return undefined;
    }
  }

  /**
   * Generate options list from options
   */
  private generateOptionList(): string[] {
    const output: string[] = [];

    for (const option in this._options) {
      switch (typeof this._options[option]) {
        case "boolean":
          output.push(option);
          break;

        default:
          // Check if option contains a space
          if (this._options[option].indexOf(" ") > -1) {
            output.push(`${option}="${this._options[option]}"`);
          } else {
            output.push(`${option}=${this._options[option]}`);
          }
          break;
      }
    }

    return output;
  }

  /**
   * Create the output folder specific to the analysis and return the folder path
   * @param audioFile Audio file path
   * @returns Output folder path
   */
  private createOutputFolder(timestamp: number, audioFile: string): string {
    const outputFolder: string = join(
      this.outputFolder,
      this.label + "(" + timestamp + ")",
      basename(audioFile, extname(audioFile))
    );

    mkdir("-p", outputFolder);

    return outputFolder;
  }

  /**
   * Create a temporary config file for use by AnalyseItem
   * TODO Handle error if temporary file not created
   */
  private createTemporaryConfigFile(timestamp: number): string {
    // Place the temp file inside the same folder as the template config file
    const tempFilename = `${basename(
      this.configFile.template,
      ".yml"
    )}.AP_DESKTOP_TEMP.${timestamp}.yml`;
    const tempDirectory = dirname(this.configFile.template);
    const tempFilePath = join(tempDirectory, tempFilename);

    try {
      writeFileSync(
        tempFilePath,
        safeDump(this.convertAnalysisConfigToYaml(this._config)),
        {
          mode: 0o755,
        }
      );
    } catch (err) {
      console.error("Failed to write temporary config file: " + tempFilePath);
      console.error(err);
      throw Error(err);
    }
    return tempFilePath;
  }

  /**
   * Update the config values with the custom changes
   * @param config Config values
   * @param changes Changes to config
   */
  private updateConfigValues(config: any, configChanges: any): void {
    for (const value of Object.keys(configChanges)) {
      if (typeof configChanges[value] === "object") {
        this.updateConfigValues(config[value], configChanges[value]);
      } else {
        config[value] = configChanges[value];
      }
    }
  }

  /**
   * Convert yaml object to array
   * @param yml Yaml Object
   */
  private convertYamlToAnalysisConfig(yml: any): any[] {
    const output = [];

    for (const key of Object.keys(yml)) {
      const value = yml[key];

      if (!value) {
        continue;
      } else if (typeof value === "object") {
        output.push({ key, value: this.convertYamlToAnalysisConfig(value) });
      } else {
        output.push({ key, value });
      }
    }

    return output;
  }

  /**
   * Convert analysis config to yaml object
   * @param config Analysis Config
   */
  private convertAnalysisConfigToYaml(config: AnalysisConfig): any {
    const output = {};

    for (const option of config) {
      if (isAnalysisConfig(option.value)) {
        output[option.key] = this.convertAnalysisConfigToYaml(option.value);
      } else {
        output[option.key] = option.value;
      }
    }

    return output;
  }
}
