import { Routes } from "@angular/router";
import { AdvancedComponent } from "./advanced/advanced.component";
import { AnalysisComponent } from "./analysis.component";
import { AudioComponent } from "./audio/audio.component";
import { ConfirmationComponent } from "./confirmation/confirmation.component";
import { FolderComponent } from "./folder/folder.component";
import { OutputComponent } from "./output/output.component";
import { TypeComponent } from "./type/type.component";

export const analysisRoutes: Routes = [
  {
    path: "analysis",
    children: [
      {
        path: "",
        component: AnalysisComponent
      },
      {
        path: "type",
        component: TypeComponent
      },
      {
        path: "audio",
        component: AudioComponent
      },
      {
        path: "folder",
        component: FolderComponent
      },
      {
        path: "advanced",
        component: AdvancedComponent
      },
      {
        path: "options",
        component: AudioComponent
      },
      {
        path: "config",
        component: AudioComponent
      },
      {
        path: "confirm",
        component: ConfirmationComponent
      },
      {
        path: "output",
        component: OutputComponent
      }
    ]
  }
];
