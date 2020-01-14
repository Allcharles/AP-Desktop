import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { APService } from "./electron/services/AP/ap.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor(private ap: APService, private translate: TranslateService) {
    this.translate.setDefaultLang("en");
    // console.log("AppConfig", AppConfig);

    // if (electronService.isElectron) {
    //   console.log(process.env);
    //   console.log("Mode electron");
    //   console.log("Electron ipcRenderer", electronService.ipcRenderer);
    //   console.log("NodeJS childProcess", electronService.childProcess);
    // } else {
    //   console.log("Mode web");
    // }
  }
}
