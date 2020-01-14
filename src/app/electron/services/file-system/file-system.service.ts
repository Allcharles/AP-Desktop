import { Injectable } from "@angular/core";
import { OpenDialogOptions, OpenDialogReturnValue } from "electron";
import { readdir, stat } from "fs";
import { resolve } from "path";
import { ElectronService } from "../electron/electron.service";

@Injectable({
  providedIn: "root"
})
export class FileSystemService extends ElectronService {
  /**
   * Create file dialog
   * @param windowSettings Dialog settings
   */
  public async createFileDialog(
    windowSettings: OpenDialogOptions
  ): Promise<OpenDialogReturnValue> {
    if (!this.isElectron) {
      return;
    }

    return this.remote.dialog.showOpenDialog(windowSettings);
  }

  /**
   * Recursively search directories
   * @param dirs Directories
   * @param filter File filter
   * @param done Output
   */
  public searchDirectories(
    dirs: string[],
    filter: (f: string) => boolean,
    done: (err: Error | null, results?: string[]) => void
  ): void {
    if (!this.isElectron) {
      return;
    }

    let results: string[] = [];
    let pending = dirs.length;

    if (!pending) {
      return done(null, results);
    }

    dirs.forEach((dir: string) => {
      this.searchDirectory(dir, filter, (err, res) => {
        if (res) {
          results = results.concat(res);
        }

        if (!--pending) {
          done(null, results);
        }
      });
    });
  }

  /**
   * Recursively search directory
   * @param dir Directory
   * @param filter File filter
   * @param done Output
   */
  public searchDirectory(
    dir: string,
    filter: (f: string) => boolean,
    done: (err: Error | null, results?: string[]) => void
  ): void {
    if (!this.isElectron) {
      return;
    }

    let results: string[] = [];
    readdir(dir, (err: Error, list: string[]) => {
      if (err) {
        return done(err);
      }
      let pending = list.length;
      if (!pending) {
        return done(null, results);
      }
      list.forEach((file: string) => {
        file = resolve(dir, file);
        stat(file, (err2, fileStats) => {
          if (fileStats && fileStats.isDirectory()) {
            this.searchDirectory(file, filter, (err3, res) => {
              if (res) {
                results = results.concat(res);
              }
              if (!--pending) {
                done(null, results);
              }
            });
          } else {
            if (typeof filter === "undefined" || (filter && filter(file))) {
              results.push(file);
            }
            if (!--pending) {
              done(null, results);
            }
          }
        });
      });
    });
  }
}
