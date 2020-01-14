import { Component, EventEmitter, OnInit, Output, Input } from "@angular/core";
import { APService } from "../../../../electron/services/AP/ap.service";
import { FileSystemService } from "../../../../electron/services/file-system/file-system.service";
import { AnalysisEvent } from "../analysis.component";

@Component({
  selector: "app-analysis-folder",
  templateUrl: "./folder.component.html",
  styleUrls: ["./folder.component.scss"]
})
export class FolderComponent implements OnInit {
  @Input() outputFolder: string;
  @Output() outputFolderEvent = new EventEmitter<OutputFolderEvent>();

  public currentOutputFolder: string;

  constructor(private ap: APService, private fileSystem: FileSystemService) {}

  ngOnInit(): void {
    if (this.outputFolder) {
      this.setFolder(this.outputFolder);
    } else {
      this.resetFolder();
    }
  }

  /**
   * Ask user to select the output folder
   */
  public selectFolder(): void {
    this.fileSystem
      .createFileDialog({
        title: "Select Output Folder",
        properties: ["openDirectory"]
      })
      .then(response => {
        if (response.canceled || response.filePaths.length === 0) {
          return;
        }
        this.setFolder(response.filePaths[0]);
      });
  }

  /**
   * Reset output folder to defaults
   */
  public resetFolder(): void {
    this.setFolder(this.ap.defaultOutputFolder);
  }

  /**
   * Set the output folder
   * @param folder Folder
   */
  private setFolder(folder: string): void {
    this.currentOutputFolder = folder;
    this.outputFolderEvent.emit({
      output: this.currentOutputFolder,
      isValid: true
    });
  }
}

interface OutputFolderEvent extends AnalysisEvent {
  output: string;
}
