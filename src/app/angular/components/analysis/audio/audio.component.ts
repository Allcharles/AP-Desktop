import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from "@angular/core";
import { APService } from "../../../../electron/services/AP/ap.service";
import { FileSystemService } from "../../../../electron/services/file-system/file-system.service";
import { AnalysisEvent } from "../analysis.component";

@Component({
  selector: "app-analysis-audio",
  templateUrl: "./audio.component.html",
  styleUrls: ["./audio.component.scss"]
})
export class AudioComponent implements OnInit {
  @Input() audioFiles?: string[];
  @Output() audioFileEvent: EventEmitter<AudioFileEvent> = new EventEmitter();

  public rows: { no: number; filename: string }[];
  public columns = [{ prop: "no" }, { name: "Filename" }];
  public filesSelected: boolean;
  public loading: boolean;
  private currentAudioFiles: string[];

  constructor(
    private ap: APService,
    private fileSystem: FileSystemService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.audioFiles && this.audioFiles.length !== 0) {
      this.updateTable(this.audioFiles);
    } else {
      this.noFiles();
    }
  }

  /**
   * Select folder action
   */
  public selectFolder(): void {
    this.loading = true;

    this.fileSystem
      .createFileDialog({
        title: "Select Audio Recording Folders",
        properties: ["openDirectory", "multiSelections"]
      })
      .then(response => {
        if (response.canceled || response.filePaths.length === 0) {
          this.loading = false;
          return;
        }

        this.retrieveFiles(response.filePaths);
      });
  }

  /**
   * Select file action
   */
  public selectFiles(): void {
    this.loading = true;

    this.fileSystem
      .createFileDialog({
        title: "Select Audio Recording Files",
        properties: ["openFile", "multiSelections"],
        filters: [{ name: "Audio", extensions: this.ap.supportedAudioFormats }]
      })
      .then(response => {
        if (
          response.canceled ||
          !response.filePaths ||
          response.filePaths.length === 0
        ) {
          this.loading = false;
          return;
        }

        this.updateTable(response.filePaths);
      });
  }

  /**
   * Remove audio file from list
   * @param index Index of audio file
   */
  public removeFile(index: number): void {
    if (this.currentAudioFiles.length === 0) {
      return;
    }

    this.currentAudioFiles.splice(index, 1);

    // If all files removed, disable next button
    if (this.currentAudioFiles.length === 0) {
      this.noFiles();
    } else {
      this.updateTable(this.currentAudioFiles);
    }
  }

  /**
   * Retrieve all files from the folders
   * @param folders Folders to search
   */
  private retrieveFiles(folders: string[]): void {
    this.fileSystem.searchDirectories(
      folders,
      file => this.ap.isSupportedAudioFormat(file),
      (err, files) => {
        if (err || !files || files.length === 0) {
          return;
        }

        this.updateTable(files);
        this.ref.detectChanges();
      }
    );
  }

  /**
   * Update table with files
   * @param files Files
   */
  private updateTable(files: string[]): void {
    this.currentAudioFiles = files;
    this.filesSelected = true;
    this.loading = false;
    this.audioFileEvent.emit({
      output: this.currentAudioFiles,
      isValid: true
    });

    this.rows = this.currentAudioFiles.map((audioFile, index) => {
      return { no: index + 1, filename: audioFile };
    });
  }

  /**
   * Handle lack of files
   */
  private noFiles(): void {
    this.audioFileEvent.emit({ isValid: false, output: [] });
    this.currentAudioFiles = [];
    this.filesSelected = false;
    this.loading = false;
    this.rows = [];
  }
}

interface AudioFileEvent extends AnalysisEvent {
  output: string[];
}
