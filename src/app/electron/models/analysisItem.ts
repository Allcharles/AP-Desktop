import { basename } from "path";
import { ChildProcess } from "child_process";
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

  getAudioBasename(): string {
    return basename(this.audio);
  }

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
