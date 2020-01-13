import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
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
  @Output() audioFileEvent: EventEmitter<AudioFileEvent> = new EventEmitter();

  public rows: { no: number; filename: string }[];
  public columns = [{ prop: "no" }, { name: "Filename" }];
  public filesSelected: boolean;
  public loading: boolean;
  private audioFiles: string[];

  constructor(
    private ap: APService,
    private fileSystem: FileSystemService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.audioFiles = [];
    this.loading = false;
    this.filesSelected = false;
  }

  /**
   * Select folder action
   */
  protected selectFolder() {
    this.loading = true;

    this.fileSystem
      .createFileDialog({
        title: "Select Audio Recording Folders",
        properties: ["openDirectory", "multiSelections"]
      })
      .then(response => {
        if (
          response.canceled ||
          !response.filePaths ||
          response.filePaths.length === 0
        ) {
          this.invalidFiles();
          return;
        }

        return response.filePaths;
      })
      .then(folders => {
        this.retrieveFiles(folders);
      });
  }

  /**
   * Select file action
   */
  protected selectFiles() {
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
          this.invalidFiles();
          return;
        }

        return response.filePaths;
      })
      .then(files => {
        this.updateTable(files);
      });
  }

  /**
   * Update table with files
   * @param files Files
   */
  updateTable(files: string[]) {
    this.audioFiles = files;
    this.loading = false;
    this.filesSelected = true;
    this.audioFileEvent.emit({
      output: this.audioFiles,
      isValid: true
    });

    this.rows = this.audioFiles.map((audioFile, index) => {
      return { no: index + 1, filename: audioFile };
    });

    this.ref.detectChanges();
  }

  /**
   * Remove audio file from list
   * @param id Index of audio file
   */
  removeFile(index: number): void {
    if (this.audioFiles.length === 0) {
      return;
    }

    this.audioFiles.splice(index, 1);

    // If all files removed, disable next button
    if (this.audioFiles.length === 0) {
      this.invalidFiles();
    }

    this.ref.detectChanges();
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
        console.log(files);

        if (err || !files || files.length === 0) {
          this.invalidFiles();
          return;
        }

        this.updateTable(files);
      }
    );
  }

  /**
   * Handle logic for invalid files
   */
  private invalidFiles() {
    this.audioFiles = [];
    this.loading = false;
    this.filesSelected = false;
    this.audioFileEvent.emit({
      output: null,
      isValid: false
    });
    this.ref.detectChanges();
  }
}

interface AudioFileEvent extends AnalysisEvent {
  output: string[];
}
