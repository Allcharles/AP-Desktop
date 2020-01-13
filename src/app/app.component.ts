import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { AppConfig } from "../environments/environment";
import { ElectronService } from "./electron/services/electron/electron.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor(
    public electronService: ElectronService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang("en");
    console.log("AppConfig", AppConfig);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log("Mode electron");
      console.log("Electron ipcRenderer", electronService.ipcRenderer);
      console.log("NodeJS childProcess", electronService.childProcess);
    } else {
      console.log("Mode web");
    }
  }
}
