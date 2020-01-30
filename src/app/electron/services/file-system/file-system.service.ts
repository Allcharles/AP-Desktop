import { Injectable } from "@angular/core";
import { OpenDialogOptions, OpenDialogReturnValue } from "electron";
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync
} from "fs";
import { basename, join, resolve } from "path";
import { ElectronService } from "../electron/electron.service";

/**
 * File System Service
 * Handles direct access to the file system
 */
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
    return this.remote.dialog.showOpenDialog(windowSettings);
  }

  /**
   * Recursively search directories
   * @param dirs Directories
   * @param filter File filter
   * @param done Output
   */
  public searchDirectoriesRecursively(
    dirs: string[],
    filter: (f: string) => boolean,
    done: (err: Error | null, results?: string[]) => void
  ): void {
    let results: string[] = [];
    let pending = dirs.length;

    if (!pending) {
      return done(null, results);
    }

    dirs.forEach((dir: string) => {
      this.searchDirectoryRecursively(dir, filter, (err, res) => {
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
  public searchDirectoryRecursively(
    dir: string,
    filter: (f: string) => boolean,
    done: (err?: Error, results?: string[]) => void
  ): void {
    let results: string[] = [];
    this.fs.readdir(dir, (err: Error, list: string[]) => {
      if (err) {
        return done(err);
      }
      let pending = list.length;
      if (!pending) {
        return done(null, results);
      }
      list.forEach((file: string) => {
        file = resolve(dir, file);
        this.fs.stat(file, (_, fileStats) => {
          if (fileStats && fileStats.isDirectory()) {
            this.searchDirectoryRecursively(file, filter, (_, res) => {
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

  /**
   * Copy folder and its files recursively
   * @param source Source folder path
   * @param target Output folder path
   */
  public copyFolderRecursiveSync(source: string, target: string): void {
    let files = [];

    //check if folder needs to be created or integrated
    const targetFolder = join(target, basename(source));
    if (!existsSync(targetFolder)) {
      mkdirSync(targetFolder);
    }

    //copy
    if (lstatSync(source).isDirectory()) {
      files = readdirSync(source);

      for (const file of files) {
        const curSource = join(source, file);
        if (lstatSync(curSource).isDirectory()) {
          this.copyFolderRecursiveSync(curSource, targetFolder);
        } else {
          let targetFile = targetFolder;

          //if target is a directory a new file with the same name will be created
          if (existsSync(targetFolder)) {
            if (lstatSync(targetFolder).isDirectory()) {
              targetFile = join(targetFolder, basename(curSource));
            }
          }

          copyFileSync(curSource, targetFile);
        }
      }
    }
  }

  /**
   * Locate a file inside a directory
   * @param dir Directory to search
   * @param match File to find(eg. Towsey.Acoustic.yml)
   * @param done Output
   */
  public locateFile(
    dir: string,
    match: string,
    done: (err?: Error, file?: string[]) => void
  ) {
    this.searchDirectoryRecursively(
      dir,
      file => basename(file) === match,
      done
    );
  }
}
