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
    label: "Acoustic Event Detection",
    configFile: {
      template: "Ecosounds.AED.yml",
      changes: {}
    },
    shortDescription: "Acoustic Event Detection.",
    description: "[BETA] Acoustic event detection, for short files (~1 min).",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Event Statistics",
    configFile: {
      template: "Ecosounds.EventStatistics.yml",
      changes: {}
    },
    shortDescription: "Calculates useful statistics.",
    description:
      "[BETA] Calculates useful statistics (features) from an acoustic event.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Ground Parrot",
    configFile: {
      template: "Ecosounds.GroundParrot.yml",
      changes: {}
    },
    shortDescription: "Ground Parrot event recognition.",
    description:
      "[UNMAINTAINED] Uses event pattern recognition for ground-parrots.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Multi Recognizer",
    configFile: {
      template: "RecognizerConfigFiles/Ecosounds.MultiRecognizer.yml",
      changes: {}
    },
    shortDescription: "Run multiple event/species recognizers.",
    description:
      "[BETA] A method to run multiple event/species recognizers, depending on entries in config files.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Standardized Features",
    configFile: {
      template: "Ecosounds.StandardizedFeatures.yml",
      changes: {}
    },
    shortDescription: "Standardized feature extraction.",
    description:
      "Performs a standardized feature extraction for ML tasks identifying faunal vocalizations.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Litoria Freycineti",
    configFile: {
      template: "RecognizerConfigFiles/Stark.LitoriaFreycineti.yml",
      changes: {}
    },
    shortDescription: "Detect Litoria Freycineti events.",
    description:
      "[ALPHA/EMBRYONIC] Detects acoustic events of Litoria Freycineti.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Litoria Olong",
    configFile: {
      template: "RecognizerConfigFiles/Stark.LitoriaOlong.yml",
      changes: {}
    },
    shortDescription: "Detect Litoria Olong events.",
    description: "[ALPHA/EMBRYONIC] Detects acoustic events of Litoria Olong.",
    options: { ...defaultOptions }
  },
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
    options: { ...defaultOptions }
  }
];
