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
  selector: "app-analysis-output",
  templateUrl: "./output.component.html",
  styleUrls: ["./output.component.scss"]
})
export class OutputComponent implements OnInit {
  @Output() outputFolderEvent = new EventEmitter<OutputFolderEvent>();

  public outputFolder: string;

  constructor(
    private ap: APService,
    private fileSystem: FileSystemService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.resetFolder();
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

        this.outputFolder = response.filePaths[0];
        this.outputFolderEvent.emit({
          output: this.outputFolder,
          isValid: true
        });
        this.ref.detectChanges();
      });
  }

  /**
   * Reset output folder to defaults
   */
  public resetFolder(): void {
    this.outputFolder = this.ap.defaultOutputFolder;
    this.outputFolderEvent.emit({
      output: this.outputFolder,
      isValid: true
    });
  }
}

interface OutputFolderEvent extends AnalysisEvent {
  output: string;
}
