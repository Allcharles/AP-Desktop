import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { WizardService } from "../../../../electron/services/wizard/wizard.service";
import { FileSystemService } from "../../../../electron/services/file-system/file-system.service";

@Component({
  selector: "app-analysis-folder",
  templateUrl: "./folder.component.html"
})
export class FolderComponent implements OnInit {
  public outputFolder: string;

  constructor(
    private wizard: WizardService,
    private fileSystem: FileSystemService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.outputFolder = this.wizard.getAnalysis().output;

    if (this.outputFolder) {
      this.setFolder(this.outputFolder);
    } else {
      this.resetFolder();
    }
  }

  public nextButton(): void {
    this.wizard.setOutputFolder(this.outputFolder);
    this.router.navigateByUrl("/analysis/advanced");
  }

  public backButton(): void {
    this.location.back();
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
    this.setFolder(this.wizard.defaultOutputFolder);
  }

  /**
   * Set the output folder
   * @param folder Folder
   */
  private setFolder(folder: string): void {
    this.outputFolder = folder;
  }
}
