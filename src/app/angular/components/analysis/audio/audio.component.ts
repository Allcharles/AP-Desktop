import { Location } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { APService } from "../../../../electron/services/AP/ap.service";
import { FileSystemService } from "../../../../electron/services/file-system/file-system.service";
import { WizardService } from "../../../../electron/services/wizard/wizard.service";

@Component({
  selector: "app-analysis-audio",
  templateUrl: "./audio.component.html",
  styleUrls: ["./audio.component.scss"]
})
export class AudioComponent implements OnInit {
  public audioFiles: string[];
  public columns = [{ prop: "no" }, { name: "Filename" }];
  public filesSelected: boolean;
  public loading: boolean;
  public rows: { no: number; filename: string }[];
  public isValid: boolean;

  constructor(
    private ap: APService,
    private wizard: WizardService,
    private fileSystem: FileSystemService,
    private router: Router,
    private location: Location,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.audioFiles = this.wizard.getAudioFiles();

    if (this.audioFiles.length !== 0) {
      this.updateTable(this.audioFiles);
    } else {
      this.noFiles();
    }
  }

  public nextButton(): void {
    this.wizard.setAudioFiles(this.audioFiles);
    this.router.navigateByUrl("/analysis/folder");
  }

  public backButton(): void {
    this.location.back();
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
    if (this.audioFiles.length === 0) {
      return;
    }

    this.audioFiles.splice(index, 1);

    // If all files removed, disable next button
    if (this.audioFiles.length === 0) {
      this.noFiles();
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
        this.ref.detectChanges();
      }
    );
  }

  /**
   * Update table with files
   * @param files Files
   */
  private updateTable(files: string[]): void {
    this.audioFiles = files;
    this.filesSelected = true;
    this.loading = false;
    this.isValid = true;

    this.rows = this.audioFiles.map((audioFile, index) => {
      return { no: index + 1, filename: audioFile };
    });
  }

  /**
   * Handle lack of files
   */
  private noFiles(): void {
    this.audioFiles = [];
    this.filesSelected = false;
    this.loading = false;
    this.isValid = false;
    this.rows = [];
  }
}
