import { Routes } from "@angular/router";
import { AnalysisComponent } from "./analysis.component";
import { TypeComponent } from "./type/type.component";
import { AudioComponent } from "./audio/audio.component";
import { OutputComponent } from "./output/output.component";
import { AdvancedComponent } from "./advanced/advanced.component";
import { ConfirmationComponent } from "./confirmation/confirmation.component";

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
        path: "output",
        component: OutputComponent
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
