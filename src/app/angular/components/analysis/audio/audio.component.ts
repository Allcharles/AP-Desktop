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

  ngOnInit(): void {
    this.rows = [];
    this.audioFiles = [];
    this.loading = false;
    this.filesSelected = false;
    this.audioFileEvent.emit({ isValid: false, output: [] });
  }

  /**
   * Select folder action
   */
  protected selectFolder(): void {
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
  protected selectFiles(): void {
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
   * Update table with files
   * @param files Files
   */
  updateTable(files: string[]): void {
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
      this.audioFiles = [];
      this.rows = [];
      this.loading = false;
      this.filesSelected = false;
      this.audioFileEvent.emit({
        output: this.audioFiles,
        isValid: false
      });
      this.ref.detectChanges();
    } else {
      this.updateTable(this.audioFiles);
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
      }
    );
  }
}

interface AudioFileEvent extends AnalysisEvent {
  output: string[];
}
