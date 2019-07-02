import { Analysis, AnalysisType } from './analysis';

export const analysisTypes = [
  new Analysis(
    AnalysisType.audio2csv,
    'Basic Analysis',
    { template: 'Towsey.Acoustic.yml', changes: [] },
    'Basic visual analysis of audio.',
    `Summary: Calculates summary and spectral acoustic indices

  The csv files of indices output by this analysis can be used to construct:
      1. long-duration, false-colour spectrograms
      2. a focused stack of zooming false-colour spectrograms
      3. the tiles for zooming false-colour spectrograms`,
    []
  ),
  new Analysis(
    AnalysisType.audio2csv,
    'Canetoad Event Detection',
    {
      template: 'Towsey.Canetoad.yml',
      changes: [
        { SaveIntermediateWavFiles: 'WhenEventsDetected' },
        { SaveIntermediateCsvFiles: 'WhenEventsDetected' },
        { SaveSonogramImages: 'WhenEventsDetected' }
      ]
    },
    'Automatic detection of canetoad sounds.',
    'Automatic detection of canetoad sounds in the audio file. This combines with the EventDetection utility under the Utilities tab.',
    []
  ),
  new Analysis(
    AnalysisType.audio2csv,
    'Crow Event Detection',
    {
      template: 'Towsey.Crow.yml',
      changes: [
        { SaveIntermediateWavFiles: 'WhenEventsDetected' },
        { SaveIntermediateCsvFiles: 'WhenEventsDetected' },
        { SaveSonogramImages: 'WhenEventsDetected' }
      ]
    },
    'Automatic detection of crow "caw" sounds.',
    'Automatic detection of crow "caw" sounds in the audio file. This combines with the EventDetection utility under the Utilities tab.',
    []
  ),
  new Analysis(
    AnalysisType.audio2csv,
    'Human Event Detection',
    {
      template: 'Towsey.Human.yml',
      changes: [
        { SaveIntermediateWavFiles: 'WhenEventsDetected' },
        { SaveIntermediateCsvFiles: 'WhenEventsDetected' },
        { SaveSonogramImages: 'WhenEventsDetected' }
      ]
    },
    'Automatic detection of human voices.',
    'Automatic detection of human (male/female) voices in the audio file. This combines with the EventDetection utility under the Utilities tab.',
    []
  ),
  new Analysis(
    AnalysisType.audio2csv,
    'Koala Event Detection',
    {
      template: 'Towsey.KoalaMale.yml',
      changes: [
        { SaveIntermediateWavFiles: 'WhenEventsDetected' },
        { SaveIntermediateCsvFiles: 'WhenEventsDetected' },
        { SaveSonogramImages: 'WhenEventsDetected' }
      ]
    },
    'Automatic detection of koala sounds.',
    'Automatic detection of koala sounds in the audio file. This combines with the EventDetection utility under the Utilities tab.',
    []
  )
];
