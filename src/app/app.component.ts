import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  constructor(private translate: TranslateService) {
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

  ngOnInit() {
    // TODO Remove this once a solution is found to the ChildProcess bug
    const started = sessionStorage.getItem("started");
    if (!started) {
      sessionStorage.setItem("started", "true");
      window.location.reload();
    }
  }
}
