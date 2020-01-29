import {
  AnalysisConfigFile,
  AnalysisOption,
  AnalysisOptions,
  AnalysisProcessingType,
  Enabled
} from "./analysisHelper";

const defaultEventDetectorChanges = {
  SaveIntermediateWavFiles: "WhenEventsDetected",
  SaveSonogramImages: "WhenEventsDetected"
};
const defaultOptions: AnalysisOptions = {
  [AnalysisOption.mixDownToMono]: Enabled.True,
  [AnalysisOption.parallel]: true
};

export const defaultAnalyses: {
  type: AnalysisProcessingType;
  label: string;
  configFile: AnalysisConfigFile;
  shortDescription: string;
  description: string;
  options: AnalysisOptions;
}[] = [
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Basic Analysis",
    configFile: {
      template: "Towsey.Acoustic.yml",
      changes: {}
    },
    shortDescription: "Basic visual analysis of audio.",
    description:
      "[BETA] Generates all our default summary & spectral acoustic indices. Also generates false color spectrograms IFF IndexCalculationDuration==60.0.",
    options: defaultOptions
  }
];
