import { ChildProcess, spawn } from "child_process";
import { remote } from "electron";
import { join } from "path";

/**
 * Create AP specific terminal commands
 */
export default class APTerminal {
  public static apLocation = remote.app.getPath("home");
  public static apFolder = join(APTerminal.apLocation, "ap");
  private static AP = join(APTerminal.apFolder, "AnalysisPrograms.exe");

  /**
   * AP Error Codes
   */
  static ErrorCodes = {
    0: "OK",
    2: "ValidationException",
    3: "CommandLineArgumentException",
    4: "CommandParsingException",
    10: "NoData",
    51: "DirectoryNotFoundException",
    52: "FileNotFoundException",
    66: "AnalysisOptionDevilException",
    100: "InvalidDurationException",
    101: "InvalidStartOrEndException",
    102: "InvalidFileDateException",
    103: "ConfigFileException",
    104: "AudioRecordingTooShortException",
    105: "InvalidAudioChannelException",
    106: "InvalidDataSetException",
    107: "MissingDataException",
    199: "NoDeveloperMethodException",
    200: "UnhandledExceptionErrorCode"
  };
  static OK_CODE = 0;

  /**
   * Creates and returns a ChildProcess terminal running AP specific commands.
   * @param func Function to call
   * @param args List of arguments to pass to the function
   * @returns ChildProcess ready to run AP specific terminal commands
   */
  static spawn(func: string, args?: string[]): ChildProcess {
    console.debug("AP Terminal Spawned with the following parameters:");
    const inputs = [];
    inputs.push(this.AP);
    inputs.push(func);

    if (args) {
      args.map(arg => inputs.push(arg));
    }

    if (process.platform === "win32") {
      console.debug(inputs);
      return spawn(inputs[0], inputs.slice(1, inputs.length));
    } else {
      console.debug(inputs);
      return spawn("mono", inputs);
    }
  }
}
