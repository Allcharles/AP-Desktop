import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { AnalysisComponent } from "./analysis.component";
import { analysisRoutes } from "./analysis.routes";
import { AudioComponent } from "./audio/audio.component";
import { ConfirmationComponent } from "./confirmation/confirmation.component";
import { TypeComponent } from "./type/type.component";
import { FolderComponent } from "./folder/folder.component";
import { OutputComponent } from "./output/output.component";
import { AdvancedModule } from "./advanced/advanced.module";

const analysisComponents = [
  AnalysisComponent,
  TypeComponent,
  AudioComponent,
  FolderComponent,
  ConfirmationComponent,
  OutputComponent
];

@NgModule({
  declarations: [...analysisComponents],
  imports: [
    SharedModule,
    AdvancedModule,
    RouterModule.forChild(analysisRoutes)
  ],
  exports: [RouterModule, ...analysisComponents],
  providers: []
})
export class AnalysisModule {}
