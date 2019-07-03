import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ChangeDetectorRef
} from '@angular/core';
import { remote } from 'electron';
import { readdir, stat, read } from 'fs';
import { resolve, extname, join } from 'path';

@Component({
  selector: 'app-analysis-audio',
  templateUrl: './analysis-audio.component.html',
  styleUrls: ['./analysis-audio.component.scss']
})
export class AnalysisAudioComponent implements OnInit {
  SUPPORTED_AUDIO_FORMATS = [
    'wav',
    'mp3',
    'pcm',
    'aiff',
    'aac',
    'ogg',
    'wma',
    'flac',
    'alac',
    'wma'
  ];
  audioFiles: string[];
  audioFilesLoading: boolean;
  audioFilesSelected: boolean;
  nextEnabled: boolean;

  rows: { no: number; filename: string }[];
  columns = [{ prop: 'no' }, { name: 'Filename' }];

  @Output() messageEvent = new EventEmitter<string[]>();

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.nextEnabled = false;
    this.audioFilesLoading = false;
    this.audioFilesSelected = false;
    this.audioFiles = [];
  }

  /**
   * Open file dialog and ask user to select folders
   */
  selectFolder() {
    this.audioFilesLoading = true;

    remote.dialog.showOpenDialog(
      {
        title: 'Select Audio Recording Folders',
        properties: ['openDirectory', 'multiSelections']
      },
      folders => {
        // If folder selection was cancelled
        if (folders === undefined) {
          this.audioFilesLoading = false;
          this.ref.detectChanges();
          return;
        }

        // If folders were selected
        if (folders.length > 0) {
          let foldersCompleted = 0;
          this.audioFiles = [];

          // For each folder, find all files which match the SUPPORTED_AUDIO_FORMATS
          folders.map(folder => {
            this.searchDirectory(
              folder,
              (err, results) => {
                if (err) {
                  this.nextEnabled = false;
                  this.audioFilesLoading = false;
                  this.audioFilesSelected = false;
                  return;
                }

                // Copy files to audioFiles
                results.map(res => {
                  this.audioFiles.push(res);
                });

                // Update table values
                this.rows = this.audioFiles.map((audioFile, index) => {
                  return { no: index, filename: audioFile };
                });

                // Update UI if this is the last folder to returns its containing files
                foldersCompleted++;
                if (foldersCompleted === folders.length) {
                  // If no files selected
                  if (this.audioFiles.length === 0) {
                    this.nextEnabled = false;
                    this.audioFilesLoading = false;
                    this.audioFilesSelected = false;
                  } else {
                    this.nextEnabled = true;
                    this.audioFilesLoading = false;
                    this.audioFilesSelected = true;
                  }
                }

                this.ref.detectChanges();
              },
              (f: string) => {
                // Only select supported audio formats
                return this.SUPPORTED_AUDIO_FORMATS.some(ext => {
                  return extname(f) === `.${ext}`;
                });
              }
            );
          });
        } else {
          this.audioFiles = [];
          this.nextEnabled = false;
          this.audioFilesLoading = false;
          this.audioFilesSelected = false;
          this.ref.detectChanges();
        }
      }
    );
  }

  /**
   * Open file dialog and ask user to select files
   */
  selectFiles() {
    this.audioFilesLoading = true;

    remote.dialog.showOpenDialog(
      {
        title: 'Select Audio Recording Files',
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Audio', extensions: this.SUPPORTED_AUDIO_FORMATS }]
      },
      files => {
        // If file selection was cancelled
        if (files === undefined) {
          this.audioFilesLoading = false;
          this.ref.detectChanges();
          return;
        }

        // If files were selected
        if (files.length > 0) {
          this.audioFiles = files;
          this.rows = this.audioFiles.map((audioFile, index) => {
            return { no: index, filename: audioFile };
          });

          this.nextEnabled = true;
          this.audioFilesLoading = false;
          this.audioFilesSelected = true;
        } else {
          this.audioFiles = [];
          this.nextEnabled = false;
          this.audioFilesLoading = false;
          this.audioFilesSelected = false;
        }

        this.ref.detectChanges();
      }
    );
  }

  /**
   * Remove audio file from list
   * @param id Index of audio file
   */
  removeFile(index: number) {
    this.audioFiles.splice(index, 1);

    // If all files removed, disable next button
    if (this.audioFiles.length === 0) {
      this.nextEnabled = false;
      this.audioFilesSelected = false;
    }

    this.ref.detectChanges();
  }

  /**
   * Recursively walk a directory asynchronously and obtain all file names (with full path).
   *
   * @param dir Folder name you want to recursively process
   * @param done Callback function, returns all files with full path.
   * @param filter Optional filter to specify which files to include,
   *   e.g. for json files: (f: string) => /.json$/.test(f)
   * @see https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search/50345475#50345475
   */
  searchDirectory = (
    dir: string,
    done: (err: Error | null, results?: string[]) => void,
    filter?: (f: string) => boolean
  ) => {
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
        stat(file, (err2, stat) => {
          if (stat && stat.isDirectory()) {
            this.searchDirectory(
              file,
              (err3, res) => {
                if (res) {
                  results = results.concat(res);
                }
                if (!--pending) {
                  done(null, results);
                }
              },
              filter
            );
          } else {
            if (typeof filter === 'undefined' || (filter && filter(file))) {
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
   * Submit empty array to parent to signify goBack condition
   */
  backOnClick() {
    this.messageEvent.emit([]);
  }

  /**
   * Submit element to parent
   */
  nextOnClick() {
    this.messageEvent.emit(this.audioFiles);
  }
}
