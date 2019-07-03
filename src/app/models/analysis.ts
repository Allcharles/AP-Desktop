/*
{
  type: 'audio2csv',
  config: {
    file: 'Towsey.Acoustic.yml',
    changes: []
  },
  label: 'Basic Analysis',
  options: [],
  description:
    'Creates a series of spectrograms for the analysed audio file. This is useful for analysis of large audio files.'
}
*/
import { readFileSync } from 'fs';
import { safeLoad } from 'js-yaml';
import { dirname, join } from 'path';

/**
 * Config details for Analysis Class.
 * @param template File path after ConfigFiles directory
 * @param changes Changes to config file options (optional)
 */
interface AnalysisConfig {
  template: string;
  changes?: {}[];
}

export enum AnalysisType {
  audio2csv = 'audio2csv',
  audio2sonogram = 'Audio2Sonogram',
  indiciesCsv2image = 'IndiciesCsv2Image'
}

/**
 * This class manages all the details required to perform an analysis using AP.
 */
export class Analysis {
  static readonly CONFIG_DIRECTORY = join(
    dirname(__dirname),
    'ap',
    'ConfigFiles'
  );

  private audio: string[];
  private configDetails: any;
  private config: AnalysisConfig;
  private shortDescription: string;
  private description: string;
  private label: string;
  private output: string;
  private options: string[];
  private type: AnalysisType;

  /**
   * Manages analysis object to interface with the clients terminal
   * @param type Type of analysis
   * @param label Display label for analysis
   * @param config Configuration for analysis
   * @param shortDescription Short description of analysis
   * @param description Description of analysis
   * @param options Advanced options for analysis
   */
  constructor(
    type: AnalysisType,
    label: string,
    config: AnalysisConfig,
    shortDescription: string,
    description: string,
    options: string[]
  ) {
    this.config = config;
    this.shortDescription = shortDescription;
    this.description = description;
    this.label = label;
    this.type = type;

    // Options
    this.options = options;
  }

  /**
   * Creates a config file and returns the path
   * TODO Finish this function
   */
  getConfig() {
    this.readConfig();

    return this.configDetails;
  }

  /**
   * Read config file from ConfigFiles directory
   * TODO Check functionality
   */
  readConfig() {
    const configPath = join(Analysis.CONFIG_DIRECTORY, this.config.template);
    try {
      this.configDetails = safeLoad(readFileSync(configPath), 'utf8');
    } catch (e) {
      console.error('Failed to read config file: ' + configPath);
      console.error(e);
    }
  }

  setOutputFolder(outputFolder: string) {
    this.output = outputFolder;
  }

  /**
   * Set the list of audio files for analysis
   * @param audioFiles List of audio files
   */
  setAudioFiles(audioFiles: string[]) {
    this.audio = audioFiles;
  }

  /**
   * Updates or appends changes to config options loaded by readConfig()
   * TODO Finish this function
   */
  appendConfig() {}

  /**
   * Returns the label of the analysis
   * @returns Analysis label
   */
  getLabel(): string {
    return this.label;
  }

  /**
   * Get the short description of the analysis
   * @returns Short description
   */
  getShortDescription(): string {
    return this.shortDescription;
  }

  /**
   * Get the description of the analysis
   * @returns Description
   */
  getDescription(): string {
    return this.description;
  }
}
