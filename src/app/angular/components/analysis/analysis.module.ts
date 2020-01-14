import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { AnalysisComponent } from "./analysis.component";
import { analysisRoutes } from "./analysis.routes";
import { AudioComponent } from "./audio/audio.component";
import { ConfirmationComponent } from "./confirmation/confirmation.component";
import { TypeComponent } from "./type/type.component";
import { NavigationComponent } from "./navigation/navigation.component";
import { FolderComponent } from "./folder/folder.component";

@NgModule({
  declarations: [
    AnalysisComponent,
    TypeComponent,
    AudioComponent,
    FolderComponent,
    ConfirmationComponent,
    NavigationComponent
  ],
  imports: [SharedModule, RouterModule.forChild(analysisRoutes)],
  exports: [RouterModule],
  providers: []
})
export class AnalysisModule {}
