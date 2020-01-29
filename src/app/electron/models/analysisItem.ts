import { ChildProcess } from "child_process";
import { basename } from "path";
import APTerminal from "./terminal";

/**
 * This class manages all the details required to perform a single analysis using AP.
 */
export class AnalysisItem {
  /**
   * Create singular analysis item
   * @param type Analysis Type
   * @param label Analysis label
   * @param audio Audio file
   * @param config Config file
   * @param output Output folder
   * @param options Terminal arguments
   */
  constructor(
    public readonly type: string,
    public readonly label: string,
    public readonly audio: string,
    public readonly config: string,
    public readonly output: string,
    public readonly options: string[]
  ) {}

  /**
   * Get basename of audio file (eg. C:/folder/audiofile.wav => audiofile.wav)
   */
  getAudioBasename(): string {
    return basename(this.audio);
  }

  /**
   * Create child process for analysis item
   */
  spawn(): ChildProcess {
    const args: string[] = [];
    args.push(this.audio);
    args.push(this.config);
    args.push(this.output);

    this.options.map(option => {
      args.push(option);
    });

    return APTerminal.spawn(this.type, args);
  }
}
