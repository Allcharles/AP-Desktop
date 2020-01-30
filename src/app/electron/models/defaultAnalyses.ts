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
    description:
      "[UNMAINTAINED] Uses event pattern recognition for ground-parrots.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Multi Recognizer",
    configFile: {
      template: "Ecosounds.MultiRecognizer.yml",
      changes: {}
    },
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
    description:
      "Performs a standardized feature extraction for ML tasks identifying faunal vocalizations.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Litoria Freycineti",
    configFile: {
      template: "Stark.LitoriaFreycineti.yml",
      changes: {}
    },
    description:
      "[ALPHA/EMBRYONIC] Detects acoustic events of Litoria Freycineti.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Litoria Olong",
    configFile: {
      template: "Stark.LitoriaOlong.yml",
      changes: {}
    },
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
    description:
      "[BETA] Generates all our default summary & spectral acoustic indices. Also generates false color spectrograms IFF IndexCalculationDuration==60.0.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Ardea Insignis",
    configFile: {
      template: "Towsey.ArdeaInsignis.yml",
      changes: {}
    },
    description: "[BETA/Experimental] White Heron - Bhutan.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Channel Integrity",
    configFile: {
      template: "Towsey.ChannelIntegrity.yml",
      changes: {}
    },
    description: "[ALPHA] Experimental code produced for Y.Phillip's thesis.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Crinia Remota",
    configFile: {
      template: "Towsey.CriniaRemota.yml",
      changes: {}
    },
    description:
      "[BETA/Experimental] Remote froglet. See class header for algorithm description.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Crinia Tinnula",
    configFile: {
      template: "Towsey.CriniaTinnula.yml",
      changes: {}
    },
    description: "[ALPHA/EMBRYONIC] Detects acoustic events of C.tinnula.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Cyclorana Novaehollandiae",
    configFile: {
      template: "Towsey.CycloranaNovaehollandiae.yml",
      changes: {}
    },
    description:
      "[ALPHA/In development] Cyclorana novaehollandiae. See class header for algorithm description.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Ictalurus Furcatus",
    configFile: {
      template: "Towsey.IctalurusFurcatus.yml",
      changes: {}
    },
    description: "[ALPHA/EMBRYONIC] Detects acoustic events of Blue Catfish",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Koala Male",
    configFile: {
      template: "Towsey.KoalaMale.yml",
      changes: {}
    },
    description:
      "[BETA/EXPERIMENTAL] Recogniser for male koalla bellow. Detects inhalation oscillations.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Lewinia Pectoralis",
    configFile: {
      template: "Towsey.LewiniaPectoralis.yml",
      changes: {}
    },
    description: "[BETA/EXPERIMENTAL] Detects acoustic events of Lewin's Rail",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Limnodynastes Convex",
    configFile: {
      template: "Towsey.LimnodynastesConvex.yml",
      changes: {}
    },
    description:
      "[ALPHA/EMBRYONIC] Detects acoustic events of Limnodynastes convex",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Litoria Bicolor",
    configFile: {
      template: "Towsey.LitoriaBicolor.yml",
      changes: {}
    },
    description: "[ALPHA/EMBRYONIC] Detects acoustic events of Litoria bicolor",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Litoria Caerulea",
    configFile: {
      template: "Towsey.LitoriaCaerulea.yml",
      changes: {}
    },
    description:
      "[ALPHA/EMBRYONIC] Detects acoustic events of Litoria caerulea",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Litoria Fallax",
    configFile: {
      template: "Towsey.LitoriaFallax.yml",
      changes: {}
    },
    description: "[ALPHA/EMBRYONIC] Detects acoustic events of Litoria fallax",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Litoria Nasuta",
    configFile: {
      template: "Towsey.LitoriaNasuta.yml",
      changes: {}
    },
    description: "[ALPHA/EMBRYONIC] Detects acoustic events of Litoria nasuta",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Litoria Pallida",
    configFile: {
      template: "Towsey.LitoriaPallida.yml",
      changes: {}
    },
    description:
      "[ALPHA/EMBRYONIC] Detects acoustic events of Litoria pallida.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Litoria Rothii",
    configFile: {
      template: "Towsey.LitoriaRothii.yml",
      changes: {}
    },
    description: "[ALPHA/EMBRYONIC] Detects acoustic events of Litoria rothii.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Litoria Rubella",
    configFile: {
      template: "Towsey.LitoriaRubella.yml",
      changes: {}
    },
    description:
      "[ALPHA/EMBRYONIC] Detects acoustic events of Litoria rubella.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Litoria Watjulumensis",
    configFile: {
      template: "Towsey.LitoriaWatjulumensis.yml",
      changes: {}
    },
    description:
      "[ALPHA/EMBRYONIC] Detects acoustic events of Litoria watchamacallit.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Platyplectrum Ornatum",
    configFile: {
      template: "Towsey.PlatyplectrumOrnatum.yml",
      changes: {}
    },
    description:
      "[ALPHA/EMBRYONIC] Detects acoustic events of Platyplectrum ornatum.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Preprocessor For Conv DNN",
    configFile: {
      template: "Towsey.PreprocessorForConvDNN.yml",
      changes: {}
    },
    description:
      "This analyzer preprocesses short audio segments a few seconds to maximum 1 minute long for processing by a convolutional Deep NN. It does not accumulate data or other indices over a long recording.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Pteropus Species",
    configFile: {
      template: "Towsey.PteropusSpecies.yml",
      changes: {}
    },
    description:
      "[ALPHA] Detects acoustic events for species of Flying Fox, Pteropus species",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Rhinella Marina",
    configFile: {
      template: "Towsey.RhinellaMarina.yml",
      changes: {}
    },
    description:
      "[BETA/Experimental] Cane Toad. Recogniser looks for 12 Hz oscillation around 600 Hz band.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Spectrogram Generator",
    configFile: {
      template: "Towsey.SpectrogramGenerator.yml",
      changes: {}
    },
    description:
      "This analyzer simply generates short (i.e. one minute) spectrograms and outputs them to CSV files. It does not accumulate data or other indices over a long recording.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Surf Analysis",
    configFile: {
      template: "Towsey.SurfAnalysis.yml",
      changes: {}
    },
    description:
      "[UNMAINTAINED] Uses SURF points of interest to classify recording segments of bird calls.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Uperoleia Inundata",
    configFile: {
      template: "Towsey.UperoleiaInundata.yml",
      changes: {}
    },
    description:
      "[ALPHA/EMBRYONIC] Detects acoustic events of Uperoleia inundata.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Uperoleia Lithomoda",
    configFile: {
      template: "Towsey.UperoleiaLithomoda.yml",
      changes: {}
    },
    description:
      "[ALPHA/EMBRYONIC] Detects acoustic events of Uperoleia lithomoda.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Uperoleia Mimula",
    configFile: {
      template: "Towsey.UperoleiaMimula.yml",
      changes: {}
    },
    description:
      "[ALPHA/EMBRYONIC] Detects acoustic events of Uperoleia mimula.",
    options: { ...defaultOptions }
  },
  {
    type: AnalysisProcessingType.audio2csv,
    label: "Exempli Gratia",
    configFile: {
      template: "Truskinger.ExempliGratia.yml",
      changes: {}
    },
    description:
      "[STATUS DESCRIPTION] Detects acoustic events for the _For example_species",
    options: { ...defaultOptions }
  }
];
