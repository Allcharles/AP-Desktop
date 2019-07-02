import { Analysis, AnalysisType } from './analysis';

export const analysisTypes = [
  new Analysis(
    AnalysisType.audio2csv,
    'Basic Analysis',
    { template: 'Towsey.Acoustic.yml', changes: [] },
    'Outputs a file of acoustic indicies at one minute resolution. This is useful for analysis of large audio files.',
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
    'Automatic detection of crow "caw" sounds in the audio file. This combines with the EventDetection utility under the Utilities tab.',
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
    'Automatic detection of koala sounds in the audio file. This combines with the EventDetection utility under the Utilities tab.',
    []
  ),
  new Analysis(
    AnalysisType.audio2csv,
    'Human Event Detection',
    {
      template: 'Towsey.KoalaMale.yml',
      changes: [
        { SaveIntermediateWavFiles: 'WhenEventsDetected' },
        { SaveIntermediateCsvFiles: 'WhenEventsDetected' },
        { SaveSonogramImages: 'WhenEventsDetected' }
      ]
    },
    'Automatic detection of human (male/female) voices in the audio file. This combines with the EventDetection utility under the Utilities tab.',
    []
  )
];
