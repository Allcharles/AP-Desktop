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

  private configDetails: any;
  private config: AnalysisConfig;
  private description: string;
  private label: string;
  private options: string[];
  private type: AnalysisType;

  /**
   * Manages analysis object to interface with the clients terminal
   * @param type Type of analysis
   * @param label Display label for analysis
   * @param config Configuration for analysis
   * @param description Description of analysis
   * @param options Advanced options for analysis
   */
  constructor(
    type: AnalysisType,
    label: string,
    config: AnalysisConfig,
    description: string,
    options: string[]
  ) {
    this.config = config;
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

  /**
   * Updates or appends changes to config options loaded by readConfig()
   * TODO Finish this function
   */
  appendConfig() {}

  /**
   * Returns the label of the analysis
   */
  getLabel(): string {
    return this.label;
  }

  /**
   * Get the description of the analysis
   */
  getDescription(): string {
    return this.description;
  }
}
