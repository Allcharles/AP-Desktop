import { join, basename, extname, dirname } from "path";
import APTerminal from "./terminal";
import {
  AnalysisProcessingType,
  AnalysisOptions,
  AnalysisConfigDetails,
  AnalysisConfig
} from "./analysisHelper";
import { AnalysisItem } from "./analysisItem";
import { readFileSync, writeFileSync } from "fs";
import { safeLoad, safeDump } from "js-yaml";
import { mkdir, rm } from "shelljs";

/**
 * This class manages all the details required to perform a group of analyses using AP.
 */
export class APAnalysis {
  private static readonly CONFIG_DIRECTORY = join(
    APTerminal.apFolder,
    "ConfigFiles"
  );

  public config: AnalysisConfig;
  public audioFiles: string[] = [];
  public output = "";

  /**
   * Manages analysis object to interface with the clients terminal
   * @param type Type of analysis
   * @param label Display label for analysis
   * @param configFile Configuration for analysis
   * @param shortDescription Short description of analysis
   * @param description Description of analysis
   * @param options Advanced options for analysis
   */
  constructor(
    public readonly type: AnalysisProcessingType,
    public readonly label: string,
    public readonly configFile: AnalysisConfigDetails,
    public readonly shortDescription: string,
    public readonly description: string,
    public options: AnalysisOptions
  ) {
    // TODO Find the configFile path from ap/ConfigFiles. Eg. /RecognizerConfigFiles/Ecosounds.MultiRecognizer.yml
    // This is required as the config file assumes the location is from the /ConfigFiles directory

    this.config = this.getConfig();
  }

  /**
   * Cleans up all temporary files generated by generateBatch
   */
  public static cleanupTemporaryFiles(): void {
    rm("-r", APAnalysis.CONFIG_DIRECTORY + "/*AP_DESKTOP_TEMP*");
  }

  public generateBatch(): AnalysisItem[] {
    // Read config file
    if (!this.config) {
      this.config = this.getConfig();
    }

    // Generate inputs for analysis
    const timestamp: number = Date.now();
    const temporaryConfig = this.createTemporaryConfigFile(timestamp);
    const generatedOptions = this.generateOptions();

    // Create array of AnalysisItems
    const analysisBatch: AnalysisItem[] = [];
    this.audioFiles.map(audioFile => {
      analysisBatch.push(
        new AnalysisItem(
          this.type,
          this.label,
          audioFile,
          temporaryConfig,
          this.createOutputFolder(timestamp, audioFile),
          generatedOptions
        )
      );
    });

    return analysisBatch;
  }

  /**
   * Get JSON schema of file
   */
  private getConfig(): AnalysisConfig {
    const configFilePath = join(
      APAnalysis.CONFIG_DIRECTORY,
      this.configFile.template
    );
    try {
      const file = readFileSync(configFilePath);
      const config = safeLoad(file.toString());

      if (this.configFile.changes) {
        this.updateConfigValues(config, this.configFile.changes);
      }

      return config;
    } catch (err) {
      console.error("Failed to read config file: " + configFilePath);
      console.error(err);
      throw Error(err);
    }
  }

  /**
   * Generate options from option list
   */
  private generateOptions(): string[] {
    const output: string[] = [];
    for (const option in this.options) {
      switch (typeof this.options[option]) {
        case "boolean":
          output.push(option);
          break;

        default:
          // Check if option contains a space
          if (this.options[option].indexOf(" ") > -1) {
            output.push(`${option}="${this.options[option]}"`);
          } else {
            output.push(`${option}=${this.options[option]}`);
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
      this.output,
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
    const tempDirectory = dirname(
      join(APAnalysis.CONFIG_DIRECTORY, this.configFile.template)
    );
    const tempFilePath = join(tempDirectory, tempFilename);

    try {
      writeFileSync(tempFilePath, safeDump(this.config), {
        mode: 0o755
      });
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
   * @param configChanges Changes to config
   */
  private updateConfigValues(config: {}, configChanges: {}): void {
    for (const value in configChanges) {
      if (typeof configChanges[value] === "object") {
        this.updateConfigValues(config[value], configChanges[value]);
      } else {
        config[value] = configChanges[value];
      }
    }
  }
}
