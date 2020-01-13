import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { AnalysisComponent } from "./analysis.component";
import { analysisRoutes } from "./analysis.routes";
import { AudioComponent } from "./audio/audio.component";
import { OutputComponent } from "./output/output.component";
import { TypeComponent } from "./type/type.component";

@NgModule({
  declarations: [
    AnalysisComponent,
    TypeComponent,
    AudioComponent,
    OutputComponent
  ],
  imports: [SharedModule, RouterModule.forChild(analysisRoutes)],
  exports: [RouterModule, AnalysisComponent],
  providers: []
})
export class AnalysisModule {}
