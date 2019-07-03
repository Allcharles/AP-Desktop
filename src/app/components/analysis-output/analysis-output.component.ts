import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ChangeDetectorRef
} from '@angular/core';
import { remote } from 'electron';
import { join } from 'path';

@Component({
  selector: 'app-analysis-output',
  templateUrl: './analysis-output.component.html',
  styleUrls: ['./analysis-output.component.scss']
})
export class AnalysisOutputComponent implements OnInit {
  outputFolder: string;
  DEFAULT_FOLDER: string;

  @Output() messageEvent = new EventEmitter<string>();

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
    // Default output folder
    this.DEFAULT_FOLDER = join(remote.app.getPath('documents'), 'AP Desktop');
    this.outputFolder = this.DEFAULT_FOLDER;
  }

  selectFolder() {
    remote.dialog.showOpenDialog(
      {
        title: 'Select Output Folder',
        properties: ['openDirectory']
      },
      folders => {
        // If folder selection was cancelled
        if (folders === undefined || folders.length === 0) {
          return;
        }

        // Only one folder can be selected
        this.outputFolder = folders[0];
        this.ref.detectChanges();
      }
    );
  }

  /**
   * Submit empty array to parent to signify goBack condition
   */
  backOnClick() {
    this.messageEvent.emit('');
  }

  /**
   * Submit element to parent
   */
  nextOnClick() {
    this.messageEvent.emit(this.outputFolder);
  }
}
