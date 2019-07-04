import { spawn, ChildProcess } from 'child_process';
import { join } from 'path';
import { remote } from 'electron';

/**
 * Create AP specific terminal commands
 */
export default class APTerminal {
  static AP = join(remote.app.getAppPath(), 'ap', 'AnalysisPrograms.exe');

  /**
   * Creates and returns a ChildProcess terminal running AP specific commands.
   * @param func Function to call
   * @param args List of arguments to pass to the function
   * @returns ChildProces ready to run AP specific terminal commands
   */
  static spawn(func: string, args?: string[]): ChildProcess {
    console.debug('AP Terminal Spawned with the following parameters:');
    const inputs = [];
    inputs.push(this.AP);
    inputs.push(func);

    if (args) {
      args.map(arg => inputs.push(arg));
    }

    if (process.platform === 'win32') {
      console.debug(inputs);
      return spawn(inputs[0], inputs.slice(1, inputs.length));
    } else {
      // Add mono if linux
      inputs.unshift(this.AP);
      console.debug(inputs);
      return spawn('mono', inputs);
    }
  }
}
