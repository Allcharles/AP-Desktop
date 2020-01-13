import { SharedModule } from "../shared/shared.module";
import { NgModule } from "@angular/core";
import { AnalysisComponent } from "./analysis.component";
import { RouterModule } from "@angular/router";
import { analysisRoutes } from "./analysis.routes";

@NgModule({
  declarations: [AnalysisComponent],
  imports: [SharedModule, RouterModule.forChild(analysisRoutes)],
  exports: [RouterModule, AnalysisComponent]
})
export class AnalysisModule {}
